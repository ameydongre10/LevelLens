import React, { useState } from 'react';
import {
  Student,
  Subject,
  SkillTier,
  StudentSkillSnapshot,
  Classroom
} from '../types';
import { SKILL_TIER_INFO } from '../data/seedData';
import { calculateClassGaps } from '../services/groupingEngine';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronRight, UserPlus, Zap, ClipboardCheck, History } from 'lucide-react';

interface GroupsViewProps {
  classroom: Classroom;
  students: Student[];
  snapshots: StudentSkillSnapshot[];
  activeSubject: Subject;
  onSelectStudentForAssessment: (studentId: string) => void;
  onSelectStudentForHistory: (studentId: string) => void;
  onNavigateToLiveTag: () => void;
  onOpenAddStudent: () => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  classroom,
  students,
  snapshots,
  activeSubject,
  onSelectStudentForAssessment,
  onSelectStudentForHistory,
  onNavigateToLiveTag,
  onOpenAddStudent
}) => {
  const [expandedTier, setExpandedTier] = useState<SkillTier | 'ALL'>('ALL');

  const gapsInfo = calculateClassGaps(activeSubject, snapshots, students);

  // Group students by their latest snapshot tier in this subject
  const studentTiers: Record<string, { tier: SkillTier; snapshot: StudentSkillSnapshot | null }> = {};
  students.forEach((student) => {
    const studentSnaps = snapshots
      .filter((s) => s.studentId === student.id && s.subject === activeSubject)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const latest = studentSnaps[0] ?? null;
    studentTiers[student.id] = {
      tier: latest ? latest.tier : 'RED',
      snapshot: latest
    };
  });

  const redStudents = students.filter((s) => studentTiers[s.id]?.tier === 'RED');
  const yellowStudents = students.filter((s) => studentTiers[s.id]?.tier === 'YELLOW');
  const greenStudents = students.filter((s) => studentTiers[s.id]?.tier === 'GREEN');

  const total = students.length || 1;
  const redPct = Math.round((redStudents.length / total) * 100);
  const yellowPct = Math.round((yellowStudents.length / total) * 100);
  const greenPct = Math.round((greenStudents.length / total) * 100);

  const tiers: Array<{
    tier: SkillTier;
    list: Student[];
    info: typeof SKILL_TIER_INFO['READING']['RED'];
    border: string;
    bgHeader: string;
    badgeBg: string;
    badgeText: string;
    textColor: string;
  }> = [
    {
      tier: 'RED',
      list: redStudents,
      info: SKILL_TIER_INFO[activeSubject].RED,
      border: 'border-rose-300',
      bgHeader: 'bg-rose-50',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      textColor: 'text-rose-700'
    },
    {
      tier: 'YELLOW',
      list: yellowStudents,
      info: SKILL_TIER_INFO[activeSubject].YELLOW,
      border: 'border-amber-300',
      bgHeader: 'bg-amber-50',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      textColor: 'text-amber-700'
    },
    {
      tier: 'GREEN',
      list: greenStudents,
      info: SKILL_TIER_INFO[activeSubject].GREEN,
      border: 'border-emerald-300',
      bgHeader: 'bg-emerald-50',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      textColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* Overview & Distribution Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {classroom.name} • {activeSubject === 'READING' ? 'Foundational Reading' : 'Foundational Math'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {students.length} students classified by diagnostic level
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddStudent}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-600" />
            <span>Add</span>
          </button>
        </div>

        {/* Visual Multi-Segment Distribution Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div
              style={{ width: `${redPct}%` }}
              className="h-full bg-rose-500 transition-all duration-500 relative group"
              title={`Intensive Support: ${redStudents.length} (${redPct}%)`}
            />
            <div
              style={{ width: `${yellowPct}%` }}
              className="h-full bg-amber-500 transition-all duration-500 relative group"
              title={`Emerging: ${yellowStudents.length} (${yellowPct}%)`}
            />
            <div
              style={{ width: `${greenPct}%` }}
              className="h-full bg-emerald-500 transition-all duration-500 relative group"
              title={`On Track: ${greenStudents.length} (${greenPct}%)`}
            />
          </div>

          {/* Legend Counts */}
          <div className="grid grid-cols-3 gap-1 pt-1 text-center">
            <button
              type="button"
              onClick={() => setExpandedTier(expandedTier === 'RED' ? 'ALL' : 'RED')}
              className={`p-1.5 rounded-lg border text-left transition-all ${
                expandedTier === 'RED'
                  ? 'border-rose-400 bg-rose-50/80 ring-1 ring-rose-300'
                  : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-[11px] font-bold text-rose-900 truncate">Intensive</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {redStudents.length}{' '}
                <span className="text-[10px] font-semibold text-slate-700">({redPct}%)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setExpandedTier(expandedTier === 'YELLOW' ? 'ALL' : 'YELLOW')}
              className={`p-1.5 rounded-lg border text-left transition-all ${
                expandedTier === 'YELLOW'
                  ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-300'
                  : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[11px] font-bold text-amber-900 truncate">Emerging</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {yellowStudents.length}{' '}
                <span className="text-[10px] font-semibold text-slate-700">({yellowPct}%)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setExpandedTier(expandedTier === 'GREEN' ? 'ALL' : 'GREEN')}
              className={`p-1.5 rounded-lg border text-left transition-all ${
                expandedTier === 'GREEN'
                  ? 'border-emerald-400 bg-emerald-50/80 ring-1 ring-emerald-300'
                  : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-900 truncate">On Track</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {greenStudents.length}{' '}
                <span className="text-[10px] font-semibold text-slate-700">({greenPct}%)</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Identified Primary Skill Gap Card */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded-md bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-amber-900 tracking-tight">Class Foundational Gap Identified</h3>
            <p className="text-xs text-amber-900 font-semibold mt-0.5">{gapsInfo.primaryGapText}</p>
            <p className="text-[11px] text-amber-800/90 mt-1 font-medium leading-tight">
              <span className="font-bold">Next Action:</span> {gapsInfo.recommendedAction}
            </p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-amber-200/80 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-amber-800">Ready to adjust live in class?</span>
          <button
            type="button"
            onClick={onNavigateToLiveTag}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-amber-200 shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Open Live Tagging</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Tier Group Accordions / Roster Lists */}
      <div className="space-y-3">
        {tiers
          .filter((t) => expandedTier === 'ALL' || expandedTier === t.tier)
          .map(({ tier, list, info, border, bgHeader, badgeBg, badgeText, textColor }) => (
            <div key={tier} className={`bg-white rounded-xl border ${border} overflow-hidden shadow-xs`}>
              {/* Tier Header */}
              <div className={`p-3 ${bgHeader} border-b ${border} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${badgeBg} ${badgeText}`}>
                    {info.badgeLabel}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{info.name}</h3>
                    <p className="text-[11px] text-slate-700 font-medium">{list.length} student{list.length === 1 ? '' : 's'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                  <span>{Math.round((list.length / total) * 100)}% of class</span>
                </div>
              </div>

              {/* Focus Banner */}
              <div className="px-3 py-1.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-medium truncate">
                  <strong className="text-slate-900">Focus:</strong> {info.recommendedFocus}
                </span>
              </div>

              {/* Student Cards in this Tier */}
              <div className="p-2 divide-y divide-slate-100">
                {list.length === 0 ? (
                  <p className="text-xs text-slate-700 italic py-3 text-center">
                    No students currently in this tier.
                  </p>
                ) : (
                  list.map((student) => {
                    const snap = studentTiers[student.id]?.snapshot;
                    return (
                      <div
                        key={student.id}
                        className="py-2 px-1.5 flex items-center justify-between gap-2 hover:bg-slate-50/80 rounded-lg transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{student.firstName}</span>
                            <span className="font-mono text-[11px] text-slate-700 px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                              {student.rollNumberOrAlias}
                            </span>
                          </div>
                          {snap?.notes && (
                            <p className="text-[11px] text-slate-700 truncate mt-0.5">{snap.notes}</p>
                          )}
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onSelectStudentForAssessment(student.id)}
                            title="Run 5-Min Diagnostic Check"
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                          >
                            <ClipboardCheck className="w-3 h-3 text-emerald-600" />
                            <span>Assess</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectStudentForHistory(student.id)}
                            title="View Skill Timeline History"
                            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
