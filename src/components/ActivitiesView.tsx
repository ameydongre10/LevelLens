import React, { useState } from 'react';
import {
  LowResourceActivity,
  Subject,
  SkillTier,
  ActivityLog,
  Classroom
} from '../types';
import { SKILL_TIER_INFO } from '../data/seedData';
import {
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  Layers,
  BookOpen,
  Calculator,
  HelpCircle
} from 'lucide-react';

interface ActivitiesViewProps {
  classroom: Classroom;
  activities: LowResourceActivity[];
  activityLogs: ActivityLog[];
  activeSubject: Subject;
  onLogActivityDone: (activityId: string, rating?: 'THUMBS_UP' | 'THUMBS_DOWN') => void;
  onToggleFavorite: (activityId: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  classroom,
  activities,
  activityLogs,
  activeSubject,
  onLogActivityDone,
  onToggleFavorite
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<SkillTier | 'ALL'>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];

  // Activities filtered by subject and tier
  const subjectActivities = activities.filter((a) => a.subject === activeSubject);
  const filteredActivities = subjectActivities.filter(
    (a) => selectedTierFilter === 'ALL' || a.targetTier === selectedTierFilter
  );

  // Today's logged activities
  const todayLogs = activityLogs.filter(
    (l) => l.classroomId === classroom.id && l.subject === activeSubject && l.date === todayStr
  );
  const doneTodayIds = new Set(todayLogs.map((l) => l.activityId));

  const favoritesSet = new Set(
    activityLogs.filter((l) => l.classroomId === classroom.id && l.favorite).map((l) => l.activityId)
  );

  const ratingsMap = new Map<string, 'THUMBS_UP' | 'THUMBS_DOWN'>();
  activityLogs.forEach((l) => {
    if (l.rating) ratingsMap.set(l.activityId, l.rating);
  });

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* Header Info & Coverage Summary */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Low-Resource Chalk &amp; Slate Lesson Plans
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                No preparation required • Designed for 10–15 min group rotations
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {doneTodayIds.size} done today
            </span>
          </div>
        </div>

        {/* Tier filter pill buttons */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Filter Group:</span>
          {(['ALL', 'RED', 'YELLOW', 'GREEN'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTierFilter(t)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedTierFilter === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' && 'All Tiers'}
              {t === 'RED' && '🔴 Intensive Support'}
              {t === 'YELLOW' && '🟡 Emerging'}
              {t === 'GREEN' && '🟢 On Track'}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3.5">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            No activities found for this filter.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isDoneToday = doneTodayIds.has(act.id);
            const isFavorite = favoritesSet.has(act.id);
            const currentRating = ratingsMap.get(act.id);
            const tierInfo = SKILL_TIER_INFO[activeSubject][act.targetTier];

            return (
              <div
                key={act.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isDoneToday ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
                }`}
              >
                {/* Card Top: Target Tier & Duration */}
                <div className={`px-4 py-2.5 border-b flex items-center justify-between ${tierInfo.bgClass}`}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        act.targetTier === 'RED'
                          ? 'bg-rose-200 text-rose-900'
                          : act.targetTier === 'YELLOW'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      For {tierInfo.badgeLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{tierInfo.name.split('(')[0]}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-700" />
                    <span>{act.timeMinutes} mins</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{act.title}</h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{act.objective}</p>
                  </div>

                  {/* Materials Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-700" />
                      Materials:
                    </span>
                    {act.materials.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                      Classroom Steps:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-800 font-medium">
                      {act.steps.map((step, idx) => (
                        <li key={idx} className="leading-snug">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Chalk & Talk Teacher Tip */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg px-3 py-2 text-[11px] text-amber-900 font-medium leading-tight">
                    <span className="font-extrabold text-amber-950">Chalk &amp; Talk Tip:</span>{' '}
                    {act.chalkAndTalkTip}
                  </div>
                </div>

                {/* Card Footer: Mark as Done & Quick Feedback */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Favorite toggle button */}
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(act.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFavorite
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                      }`}
                      title="Mark as Favorite"
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>

                    {/* Thumbs up / down */}
                    <button
                      type="button"
                      onClick={() => onLogActivityDone(act.id, 'THUMBS_UP')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        currentRating === 'THUMBS_UP'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600'
                      }`}
                      title="Worked well with class"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onLogActivityDone(act.id, 'THUMBS_DOWN')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        currentRating === 'THUMBS_DOWN'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-white text-slate-400 border-slate-200 hover:text-rose-600'
                      }`}
                      title="Too difficult or noisy"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mark as Done Today Button */}
                  <button
                    type="button"
                    onClick={() => onLogActivityDone(act.id, currentRating)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      isDoneToday
                        ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isDoneToday ? 'text-white' : 'text-slate-400'}`} />
                    <span>{isDoneToday ? 'Done Today ✓' : 'Mark as Done'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
