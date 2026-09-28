import React, { useState } from 'react';
import {
  Student,
  Subject,
  SkillTier,
  StudentSkillSnapshot,
  LiveTagEvent,
  AssessmentResult,
  Classroom
} from '../types';
import { SKILL_TIER_INFO } from '../data/seedData';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Minus,
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
  ClipboardCheck,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

interface ProgressViewProps {
  classroom: Classroom;
  students: Student[];
  snapshots: StudentSkillSnapshot[];
  liveTags: LiveTagEvent[];
  assessments: AssessmentResult[];
  activeSubject: Subject;
  onOpenAssessmentForStudent: (studentId: string) => void;
  selectedStudentHistoryId: string | null;
  onCloseHistoryModal: () => void;
  onSelectStudentForHistory: (studentId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  classroom,
  students,
  snapshots,
  liveTags,
  assessments,
  activeSubject,
  onOpenAssessmentForStudent,
  selectedStudentHistoryId,
  onCloseHistoryModal,
  onSelectStudentForHistory
}) => {
  const [filterMovement, setFilterMovement] = useState<'ALL' | 'UP' | 'STEADY' | 'DOWN'>('ALL');

  const tierWeight: Record<SkillTier, number> = { RED: 1, YELLOW: 2, GREEN: 3 };

  // Calculate baseline (earliest snapshot) and current (latest snapshot) for each student in this subject
  const studentTrajectories = students.map((student) => {
    const studentSnaps = snapshots
      .filter((s) => s.studentId === student.id && s.subject === activeSubject)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const baselineSnap = studentSnaps[0] ?? null;
    const currentSnap = studentSnaps[studentSnaps.length - 1] ?? null;

    const baselineTier: SkillTier = baselineSnap ? baselineSnap.tier : 'RED';
    const currentTier: SkillTier = currentSnap ? currentSnap.tier : 'RED';

    const diff = tierWeight[currentTier] - tierWeight[baselineTier];
    const status: 'UP' | 'STEADY' | 'DOWN' = diff > 0 ? 'UP' : diff < 0 ? 'DOWN' : 'STEADY';

    return {
      student,
      baselineTier,
      currentTier,
      baselineDate: baselineSnap ? new Date(baselineSnap.timestamp).toLocaleDateString() : 'N/A',
      currentDate: currentSnap ? new Date(currentSnap.timestamp).toLocaleDateString() : 'Today',
      status,
      diff,
      snapshotCount: studentSnaps.length
    };
  });

  // Summary counts
  const total = students.length || 1;
  const movedUp = studentTrajectories.filter((t) => t.status === 'UP');
  const steady = studentTrajectories.filter((t) => t.status === 'STEADY');
  const movedDown = studentTrajectories.filter((t) => t.status === 'DOWN');

  // Baseline distribution
  const baselineRed = studentTrajectories.filter((t) => t.baselineTier === 'RED').length;
  const baselineYellow = studentTrajectories.filter((t) => t.baselineTier === 'YELLOW').length;
  const baselineGreen = studentTrajectories.filter((t) => t.baselineTier === 'GREEN').length;

  // Current distribution
  const currentRed = studentTrajectories.filter((t) => t.currentTier === 'RED').length;
  const currentYellow = studentTrajectories.filter((t) => t.currentTier === 'YELLOW').length;
  const currentGreen = studentTrajectories.filter((t) => t.currentTier === 'GREEN').length;

  const filteredTrajectories = studentTrajectories.filter((t) => {
    if (filterMovement === 'ALL') return true;
    return t.status === filterMovement;
  });

  // History timeline details for currently inspected student
  const inspectedStudent = selectedStudentHistoryId
    ? students.find((s) => s.id === selectedStudentHistoryId)
    : null;

  const inspectedTimeline = inspectedStudent
    ? [
        ...snapshots
          .filter((s) => s.studentId === inspectedStudent.id && s.subject === activeSubject)
          .map((s) => ({
            id: s.id,
            type: 'SNAPSHOT' as const,
            title: `Skill Level: ${s.tier}`,
            tier: s.tier,
            description: s.notes || `Source: ${s.sourceType}`,
            timestamp: s.timestamp
          })),
        ...liveTags
          .filter((t) => t.studentId === inspectedStudent.id && t.subject === activeSubject)
          .map((t) => ({
            id: t.id,
            type: 'LIVE_TAG' as const,
            title: t.tagType === 'PERFORMED_WELL' ? 'Mastered Live Concept ✓' : 'Struggled Live Concept !',
            tagType: t.tagType,
            description: t.conceptName || 'Live Whole-Class Activity',
            timestamp: t.timestamp
          })),
        ...assessments
          .filter((a) => a.studentId === inspectedStudent.id && a.subject === activeSubject)
          .map((a) => ({
            id: a.id,
            type: 'ASSESSMENT' as const,
            title: `5-Min Diagnostic Check`,
            tier: a.derivedTier,
            description: a.notes || `Scored: ${Object.values(a.stepScores).join('/')}`,
            timestamp: a.timestamp
          }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Cohort Foundational Growth ({activeSubject === 'READING' ? 'Reading' : 'Math'})
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Tracking group transitions from baseline diagnostic to today
            </p>
          </div>
        </div>

        {/* Motivational Metric Summary Card */}
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Monthly Net Movement:
              </span>
              <p className="text-lg font-black text-emerald-950 mt-0.5">
                {movedUp.length} student{movedUp.length === 1 ? '' : 's'} moved up a tier!
              </p>
              <p className="text-[11px] text-emerald-800 font-medium">
                Red Intensive group reduced by {Math.max(0, baselineRed - currentRed)} students.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex flex-col items-center justify-center shadow-xs">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[10px] font-black">+{movedUp.length}</span>
            </div>
          </div>
        </div>

        {/* Comparative Distribution Visualizer: Baseline vs. Current */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
          <span className="text-xs font-extrabold text-slate-800">Distribution Comparison:</span>

          {/* Baseline Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
              <span className="font-bold text-slate-900">Baseline (Month Start):</span>
              <span>
                🔴 {baselineRed} • 🟡 {baselineYellow} • 🟢 {baselineGreen}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
              <div style={{ width: `${Math.round((baselineRed / total) * 100)}%` }} className="h-full bg-rose-400" />
              <div style={{ width: `${Math.round((baselineYellow / total) * 100)}%` }} className="h-full bg-amber-400" />
              <div style={{ width: `${Math.round((baselineGreen / total) * 100)}%` }} className="h-full bg-emerald-400" />
            </div>
          </div>

          {/* Current Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
              <span className="font-bold text-slate-900">Current (Today):</span>
              <span className="font-semibold text-emerald-800">
                🔴 {currentRed} • 🟡 {currentYellow} • 🟢 {currentGreen}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
              <div style={{ width: `${Math.round((currentRed / total) * 100)}%` }} className="h-full bg-rose-500 transition-all duration-500" />
              <div style={{ width: `${Math.round((currentYellow / total) * 100)}%` }} className="h-full bg-amber-500 transition-all duration-500" />
              <div style={{ width: `${Math.round((currentGreen / total) * 100)}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Movement Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilterMovement('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterMovement === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({studentTrajectories.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterMovement('UP')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            filterMovement === 'UP'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Leveled Up ({movedUp.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMovement('STEADY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            filterMovement === 'STEADY'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
          <span>Steady ({steady.length})</span>
        </button>

        {movedDown.length > 0 && (
          <button
            type="button"
            onClick={() => setFilterMovement('DOWN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              filterMovement === 'DOWN'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Watch List ({movedDown.length})</span>
          </button>
        )}
      </div>

      {/* Trajectory Roster Cards */}
      <div className="space-y-2">
        {filteredTrajectories.map(({ student, baselineTier, currentTier, status, diff }) => {
          const isUp = status === 'UP';
          const isDown = status === 'DOWN';

          const tierColorBadge = (tier: SkillTier) => {
            if (tier === 'RED') return 'bg-rose-100 text-rose-800 border-rose-200';
            if (tier === 'YELLOW') return 'bg-amber-100 text-amber-800 border-amber-200';
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
          };

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudentForHistory(student.id)}
              className="bg-white rounded-xl p-3 border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex items-center justify-between gap-2 cursor-pointer"
            >
              {/* Left Identity */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-slate-900">{student.firstName}</span>
                  <span className="font-mono text-[11px] text-slate-700 px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                    {student.rollNumberOrAlias}
                  </span>
                  {isUp && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> Leveled Up
                    </span>
                  )}
                  {isDown && (
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Support Check
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 mt-1">Tap to inspect full diagnostic timeline</p>
              </div>

              {/* Center/Right: Trajectory Path Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${tierColorBadge(baselineTier)}`}>
                  {baselineTier}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${tierColorBadge(currentTier)}`}>
                  {currentTier}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Student Skill History Timeline Modal */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">{inspectedStudent.firstName}</h3>
                  <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {inspectedStudent.rollNumberOrAlias}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Skill History Timeline • {activeSubject === 'READING' ? 'Reading' : 'Math'}
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseHistoryModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {inspectedTimeline.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-6">
                  No recorded events yet for this student.
                </p>
              ) : (
                <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 my-1">
                  {inspectedTimeline.map((item, idx) => {
                    const isSnapshot = item.type === 'SNAPSHOT';
                    const isTag = item.type === 'LIVE_TAG';
                    const isAssess = item.type === 'ASSESSMENT';

                    return (
                      <div key={item.id || idx} className="relative">
                        {/* Timeline Bullet Dot */}
                        <div
                          className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white ${
                            isSnapshot
                              ? 'bg-indigo-600'
                              : isTag
                              ? (item as any).tagType === 'PERFORMED_WELL'
                                ? 'bg-emerald-600'
                                : 'bg-rose-600'
                              : 'bg-amber-600'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900">{item.title}</span>
                            <span className="text-[10px] text-slate-700 font-mono">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-0.5 leading-snug">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onCloseHistoryModal();
                  onOpenAssessmentForStudent(inspectedStudent.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Run Quick 5-Min Diagnostic Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
