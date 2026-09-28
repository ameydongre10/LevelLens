import React, { useState } from 'react';
import {
  Student,
  Subject,
  SkillTier,
  StudentSkillSnapshot,
  LiveTagEvent,
  PromotionSuggestion
} from '../types';
import { checkPromotionEligibility } from '../services/groupingEngine';
import {
  Check,
  AlertTriangle,
  Search,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  X,
  Zap,
  Info
} from 'lucide-react';

interface LiveTaggingViewProps {
  students: Student[];
  snapshots: StudentSkillSnapshot[];
  liveTags: LiveTagEvent[];
  activeSubject: Subject;
  onRecordLiveTag: (studentId: string, tagType: 'PERFORMED_WELL' | 'STRUGGLING', conceptNotes?: string) => void;
  onPromoteStudent: (studentId: string, newTier: SkillTier, reason: string) => void;
  onManualTierChange: (studentId: string, newTier: SkillTier) => void;
}

export const LiveTaggingView: React.FC<LiveTaggingViewProps> = ({
  students,
  snapshots,
  liveTags,
  activeSubject,
  onRecordLiveTag,
  onPromoteStudent,
  onManualTierChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<SkillTier | 'ALL'>('ALL');
  const [activeConceptNote, setActiveConceptNote] = useState('Chalkboard lesson practice');
  const [recentlyTappedId, setRecentlyTappedId] = useState<{ id: string; type: 'WELL' | 'STRUGGLE' } | null>(null);
  const [manualOverrideStudent, setManualOverrideStudent] = useState<Student | null>(null);

  // Map latest snapshot tier per student
  const studentTiers: Record<string, SkillTier> = {};
  students.forEach((student) => {
    const studentSnaps = snapshots
      .filter((s) => s.studentId === student.id && s.subject === activeSubject)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    studentTiers[student.id] = studentSnaps[0]?.tier ?? 'RED';
  });

  // Calculate live tag counts per student today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTagsByStudent: Record<string, { well: number; struggle: number }> = {};
  liveTags
    .filter((t) => t.subject === activeSubject && t.timestamp.startsWith(todayStr))
    .forEach((t) => {
      if (!todayTagsByStudent[t.studentId]) {
        todayTagsByStudent[t.studentId] = { well: 0, struggle: 0 };
      }
      if (t.tagType === 'PERFORMED_WELL') todayTagsByStudent[t.studentId].well++;
      if (t.tagType === 'STRUGGLING') todayTagsByStudent[t.studentId].struggle++;
    });

  // Find promotion or support suggestions across students
  const activeSuggestions: PromotionSuggestion[] = [];
  students.forEach((student) => {
    const currentTier = studentTiers[student.id] || 'RED';
    const suggestion = checkPromotionEligibility(student, activeSubject, currentTier, liveTags);
    if (suggestion) {
      activeSuggestions.push(suggestion);
    }
  });

  // Filter students based on search and tier
  const filteredStudents = students.filter((student) => {
    const matchesTier = filterTier === 'ALL' || studentTiers[student.id] === filterTier;
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumberOrAlias.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  // Sort: Red first (need most attention), then Yellow, then Green, then by Roll No
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const tierOrder: Record<SkillTier, number> = { RED: 0, YELLOW: 1, GREEN: 2 };
    const tierDiff = tierOrder[studentTiers[a.id]] - tierOrder[studentTiers[b.id]];
    if (tierDiff !== 0) return tierDiff;
    return a.rollNumberOrAlias.localeCompare(b.rollNumberOrAlias);
  });

  const handleTap = (studentId: string, type: 'WELL' | 'STRUGGLE') => {
    const tagType = type === 'WELL' ? 'PERFORMED_WELL' : 'STRUGGLING';
    onRecordLiveTag(studentId, tagType, activeConceptNote);
    setRecentlyTappedId({ id: studentId, type });
    setTimeout(() => {
      setRecentlyTappedId((prev) => (prev?.id === studentId ? null : prev));
    }, 450);
  };

  return (
    <div className="space-y-3 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* Sub-5-second interaction header info */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Live Classroom Tagging ({activeSubject === 'READING' ? 'Reading' : 'Math'})
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Tap <span className="text-emerald-600 font-bold">✓</span> for mastery or <span className="text-rose-600 font-bold">!</span> for struggle
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
            {filteredStudents.length} shown
          </span>
        </div>

        {/* Concept note quick-select */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-600 font-bold shrink-0">Focus:</span>
          {activeSubject === 'READING' ? (
            <>
              {['Phonics Sounds', 'CVC Blending', 'Sentence Reading', 'Story Fluency'].map((concept) => (
                <button
                  key={concept}
                  type="button"
                  onClick={() => setActiveConceptNote(concept)}
                  className={`px-2 py-0.5 rounded-full border whitespace-nowrap font-medium transition-colors ${
                    activeConceptNote === concept
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </>
          ) : (
            <>
              {['Number 1-99', '1-Digit Minus', 'Borrowing / Regrouping', 'Word Problems'].map((concept) => (
                <button
                  key={concept}
                  type="button"
                  onClick={() => setActiveConceptNote(concept)}
                  className={`px-2 py-0.5 rounded-full border whitespace-nowrap font-medium transition-colors ${
                    activeConceptNote === concept
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Actionable Group Promotion Suggestions Banner (if any student hits 3 consecutive tags) */}
      {activeSuggestions.length > 0 && (
        <div className="space-y-2">
          {activeSuggestions.map((sug) => {
            const isPromotion =
              (sug.currentTier === 'RED' && sug.suggestedTier === 'YELLOW') ||
              (sug.currentTier === 'YELLOW' && sug.suggestedTier === 'GREEN');
            return (
              <div
                key={sug.studentId}
                className={`p-3 rounded-xl border shadow-xs animate-in fade-in duration-300 ${
                  isPromotion
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div
                      className={`p-1 rounded-md shrink-0 mt-0.5 ${
                        isPromotion ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                      }`}
                    >
                      {isPromotion ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{sug.studentName}</span>
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-white/80 border border-slate-200">
                          {sug.reason}
                        </span>
                      </div>
                      <p className="text-xs font-semibold mt-0.5">
                        Suggested move: {sug.currentTier} → <strong className="underline">{sug.suggestedTier}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Accept / dismiss buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onPromoteStudent(sug.studentId, sug.suggestedTier, sug.reason)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                    >
                      Approve Move
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Search & Tier Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tier filter pill buttons */}
        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
          {(['ALL', 'RED', 'YELLOW', 'GREEN'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterTier(t)}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-all ${
                filterTier === t
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'ALL' && 'All'}
              {t === 'RED' && <span className="text-rose-600">● Red</span>}
              {t === 'YELLOW' && <span className="text-amber-600">● Ylw</span>}
              {t === 'GREEN' && <span className="text-emerald-600">● Grn</span>}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Roster Grid (Sub-5-second touch targets) */}
      <div className="space-y-2">
        {sortedStudents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            No students match your filter.
          </div>
        ) : (
          sortedStudents.map((student) => {
            const tier = studentTiers[student.id] || 'RED';
            const todayStats = todayTagsByStudent[student.id];
            const isJustTappedWell = recentlyTappedId?.id === student.id && recentlyTappedId?.type === 'WELL';
            const isJustTappedStruggle = recentlyTappedId?.id === student.id && recentlyTappedId?.type === 'STRUGGLE';

            const tierBadge =
              tier === 'RED'
                ? { label: 'Intensive', bg: 'bg-rose-100 text-rose-800 border-rose-200' }
                : tier === 'YELLOW'
                ? { label: 'Emerging', bg: 'bg-amber-100 text-amber-800 border-amber-200' }
                : { label: 'On Track', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };

            return (
              <div
                key={student.id}
                className={`bg-white rounded-xl p-2.5 border transition-all duration-200 shadow-xs flex items-center justify-between gap-2 ${
                  isJustTappedWell
                    ? 'ring-2 ring-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : isJustTappedStruggle
                    ? 'ring-2 ring-rose-500 bg-rose-50/50 scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left: Student Identity & Tier Badge */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">{student.firstName}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-700 px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                      {student.rollNumberOrAlias}
                    </span>
                    <button
                      type="button"
                      onClick={() => setManualOverrideStudent(student)}
                      title="Adjust student skill tier manually"
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${tierBadge.bg}`}
                    >
                      {tierBadge.label} ✎
                    </button>
                  </div>

                  {/* Today's live tag activity summary */}
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-700">
                    {todayStats ? (
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="text-emerald-700 font-bold">✓ {todayStats.well}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-rose-700 font-bold">! {todayStats.struggle}</span>
                        <span className="text-slate-600 text-[10px] font-semibold">today</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-semibold italic">No tags yet today</span>
                    )}
                  </div>
                </div>

                {/* Right: Instant Touch-Optimized Large Tap Controls (min 44px) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Mastered Button */}
                  <button
                    type="button"
                    onClick={() => handleTap(student.id, 'WELL')}
                    className={`h-11 px-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition-all active:scale-95 shadow-xs border ${
                      isJustTappedWell
                        ? 'bg-emerald-600 text-white border-emerald-700 scale-105'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span className="hidden sm:inline font-bold">Mastered</span>
                  </button>

                  {/* Struggling Button */}
                  <button
                    type="button"
                    onClick={() => handleTap(student.id, 'STRUGGLE')}
                    className={`h-11 px-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition-all active:scale-95 shadow-xs border ${
                      isJustTappedStruggle
                        ? 'bg-rose-600 text-white border-rose-700 scale-105'
                        : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                    <span className="hidden sm:inline font-bold">Struggling</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Skill Tier Adjustment Modal */}
      {manualOverrideStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full border border-slate-200 shadow-xl space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Adjust Group: {manualOverrideStudent.firstName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {manualOverrideStudent.rollNumberOrAlias} • {activeSubject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManualOverrideStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select foundational group placement based on teacher judgment:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onManualTierChange(manualOverrideStudent.id, 'RED');
                  setManualOverrideStudent(null);
                }}
                className={`w-full p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-colors ${
                  studentTiers[manualOverrideStudent.id] === 'RED'
                    ? 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <span className="font-bold text-rose-700">🔴 Red: Intensive Support</span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {activeSubject === 'READING' ? 'Letter sounds / Phonics' : 'Number recognition 1-99'}
                  </p>
                </div>
                {studentTiers[manualOverrideStudent.id] === 'RED' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">Current</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onManualTierChange(manualOverrideStudent.id, 'YELLOW');
                  setManualOverrideStudent(null);
                }}
                className={`w-full p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-colors ${
                  studentTiers[manualOverrideStudent.id] === 'YELLOW'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <span className="font-bold text-amber-700">🟡 Yellow: Emerging</span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {activeSubject === 'READING' ? 'Simple words & sentences' : '1-Digit subtraction'}
                  </p>
                </div>
                {studentTiers[manualOverrideStudent.id] === 'YELLOW' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">Current</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onManualTierChange(manualOverrideStudent.id, 'GREEN');
                  setManualOverrideStudent(null);
                }}
                className={`w-full p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-colors ${
                  studentTiers[manualOverrideStudent.id] === 'GREEN'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <span className="font-bold text-emerald-700">🟢 Green: On Track</span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {activeSubject === 'READING' ? 'Paragraph / Story reader' : '2-Digit with regrouping'}
                  </p>
                </div>
                {studentTiers[manualOverrideStudent.id] === 'GREEN' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800">Current</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
