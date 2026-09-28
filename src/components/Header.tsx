import React from 'react';
import { Wifi, WifiOff, RefreshCw, Sparkles, BookOpen, Calculator, School } from 'lucide-react';
import { Classroom, Subject } from '../types';

interface HeaderProps {
  classrooms: Classroom[];
  activeClassroomId: string;
  onSelectClassroom: (id: string) => void;
  activeSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  isOnline: boolean;
  onToggleNetwork: (online: boolean) => void;
  pendingSyncCount: number;
  onOpenSyncDrawer: () => void;
  onOpenClassModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classrooms,
  activeClassroomId,
  onSelectClassroom,
  activeSubject,
  onSelectSubject,
  isOnline,
  onToggleNetwork,
  pendingSyncCount,
  onOpenSyncDrawer,
  onOpenClassModal
}) => {
  const activeClass = classrooms.find((c) => c.id === activeClassroomId);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top row: Brand + Network Sync Status */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">LevelLens</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Teacher
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Foundational Skill Assistant</p>
          </div>
        </div>

        {/* Network & Sync Status Pill */}
        <div className="flex items-center gap-1.5">
          {/* Quick Offline toggle button */}
          <button
            type="button"
            onClick={() => onToggleNetwork(!isOnline)}
            title={isOnline ? 'Switch to Offline Simulation' : 'Switch to Online'}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xs:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold">Offline</span>
              </>
            )}
          </button>

          {/* Sync Trigger button with pending count */}
          <button
            type="button"
            onClick={onOpenSyncDrawer}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${pendingSyncCount > 0 ? 'text-amber-600' : ''}`} />
            {pendingSyncCount > 0 ? (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                {pendingSyncCount}
              </span>
            ) : (
              <span className="text-[11px] text-slate-600 hidden xs:inline">Synced</span>
            )}
          </button>
        </div>
      </div>

      {/* Second row: Classroom selector + Subject Tabs */}
      <div className="px-4 pb-2.5 pt-0.5 flex flex-col xs:flex-row xs:items-center justify-between gap-2 max-w-2xl mx-auto">
        {/* Classroom selector */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="relative flex-1 max-w-[200px] xs:max-w-[240px]">
            <select
              value={activeClassroomId}
              onChange={(e) => onSelectClassroom(e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-lg px-2.5 py-1.5 pr-6 truncate focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onOpenClassModal}
            title="Classroom Management"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <School className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subject Segmented Control */}
        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start xs:self-auto">
          <button
            type="button"
            onClick={() => onSelectSubject('READING')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeSubject === 'READING'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Reading
          </button>
          <button
            type="button"
            onClick={() => onSelectSubject('MATH')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeSubject === 'MATH'
                ? 'bg-white text-indigo-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            Math
          </button>
        </div>
      </div>
    </header>
  );
};
