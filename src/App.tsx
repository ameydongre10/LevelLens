import React, { useState, useEffect } from 'react';
import { Subject, SkillTier } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { GroupsView } from './components/GroupsView';
import { LiveTaggingView } from './components/LiveTaggingView';
import { ActivitiesView } from './components/ActivitiesView';
import { ProgressView } from './components/ProgressView';
import { AssessmentFlowModal } from './components/AssessmentFlowModal';
import { SyncDrawerModal } from './components/SyncDrawerModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ClassroomModal } from './components/ClassroomModal';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('groups');
  const [activeSubject, setActiveSubject] = useState<Subject>('READING');
  const [activeClassroomId, setActiveClassroomId] = useState<string>('class-3a');

  // Modals state
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentTargetStudentId, setAssessmentTargetStudentId] = useState<string | undefined>(undefined);
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedStudentHistoryId, setSelectedStudentHistoryId] = useState<string | null>(null);

  // Desktop mobile-frame toggle
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);

  // Storage state synced reactively
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsubscribe();
  }, []);

  const classrooms = storageService.getClassrooms();
  const allStudents = storageService.getStudents();
  const classStudents = storageService.getStudents(activeClassroomId);
  const snapshots = storageService.getSnapshots();
  const liveTags = storageService.getLiveTags();
  const assessmentResults = storageService.getAssessmentResults();
  const assessmentTemplates = storageService.getAssessmentTemplates();
  const activities = storageService.getActivities();
  const activityLogs = storageService.getActivityLogs(activeClassroomId, activeSubject);
  const isOnline = storageService.isOnline();
  const pendingSyncCount = storageService.getPendingSyncCount();

  const activeClassroom =
    classrooms.find((c) => c.id === activeClassroomId) || classrooms[0] || {
      id: 'default',
      teacherId: 'teacher-001',
      name: 'Classroom',
      gradeInfo: 'Primary'
    };

  // Live tag handler
  const handleRecordLiveTag = (
    studentId: string,
    tagType: 'PERFORMED_WELL' | 'STRUGGLING',
    conceptNotes?: string
  ) => {
    storageService.recordLiveTag(studentId, activeSubject, tagType, conceptNotes);
  };

  // Promotion handler
  const handlePromoteStudent = (studentId: string, newTier: SkillTier, reason: string) => {
    storageService.updateStudentTier(studentId, activeSubject, newTier, 'LIVE_TAG', reason);
    storageService.recordLiveTag(studentId, activeSubject, 'PROMOTED', `Leveled to ${newTier}: ${reason}`);
  };

  // Manual tier change handler
  const handleManualTierChange = (studentId: string, newTier: SkillTier) => {
    storageService.updateStudentTier(
      studentId,
      activeSubject,
      newTier,
      'MANUAL_OVERRIDE',
      `Teacher adjusted group placement to ${newTier}`
    );
  };

  // Diagnostic assessment save
  const handleSaveAssessment = (
    studentId: string,
    templateId: string,
    stepScores: Record<string, number>,
    derivedTier: SkillTier,
    notes?: string
  ) => {
    storageService.recordAssessmentResult(
      studentId,
      templateId,
      activeSubject,
      stepScores,
      derivedTier,
      notes
    );
  };

  // Open diagnostic for specific student
  const handleOpenAssessmentForStudent = (studentId: string) => {
    setAssessmentTargetStudentId(studentId);
    setIsAssessmentModalOpen(true);
  };

  // Activity logged
  const handleLogActivityDone = (activityId: string, rating?: 'THUMBS_UP' | 'THUMBS_DOWN') => {
    storageService.logActivityDone(activeClassroomId, activeSubject, activityId, false, rating);
  };

  // Favorite toggle
  const handleToggleFavorite = (activityId: string) => {
    storageService.toggleActivityFavorite(activityId, activeClassroomId, activeSubject);
  };

  // Add student
  const handleAddStudent = (firstName: string, rollNumberOrAlias: string) => {
    storageService.addStudent(activeClassroomId, firstName, rollNumberOrAlias);
  };

  // Add classroom
  const handleAddClassroom = (name: string, gradeInfo: string) => {
    const newClass = storageService.addClassroom(name, gradeInfo);
    setActiveClassroomId(newClass.id);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col items-center justify-start antialiased font-sans">
      {/* Top Device Viewport Switcher (Convenient for evaluators on desktop screens) */}
      <div className="w-full bg-slate-950/80 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">LevelLens Prototype</span>
          <span className="hidden sm:inline text-slate-500">• Budget Android UX (360–412px target)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPhoneFrameMode(true)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              isPhoneFrameMode ? 'bg-emerald-700/60 text-white font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Mobile Frame</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPhoneFrameMode(false)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              !isPhoneFrameMode ? 'bg-emerald-700/60 text-white font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Full Width</span>
          </button>
        </div>
      </div>

      {/* Main Container: Mobile phone viewport emulation or fluid width */}
      <div
        className={`w-full bg-slate-100 flex-1 flex flex-col relative transition-all duration-300 ${
          isPhoneFrameMode
            ? 'max-w-[420px] my-0 sm:my-4 sm:rounded-3xl sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden min-h-[750px] sm:max-h-[92vh] sm:overflow-y-auto'
            : 'max-w-3xl min-h-screen'
        }`}
      >
        {/* Persistent App Header */}
        <Header
          classrooms={classrooms}
          activeClassroomId={activeClassroomId}
          onSelectClassroom={(id) => setActiveClassroomId(id)}
          activeSubject={activeSubject}
          onSelectSubject={(sub) => setActiveSubject(sub)}
          isOnline={isOnline}
          onToggleNetwork={(online) => storageService.setNetworkMode(online)}
          pendingSyncCount={pendingSyncCount}
          onOpenSyncDrawer={() => setIsSyncDrawerOpen(true)}
          onOpenClassModal={() => setIsClassModalOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'groups' && (
            <GroupsView
              classroom={activeClassroom}
              students={classStudents}
              snapshots={snapshots}
              activeSubject={activeSubject}
              onSelectStudentForAssessment={(id) => handleOpenAssessmentForStudent(id)}
              onSelectStudentForHistory={(id) => {
                setSelectedStudentHistoryId(id);
                setActiveTab('progress');
              }}
              onNavigateToLiveTag={() => setActiveTab('tagging')}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
            />
          )}

          {activeTab === 'tagging' && (
            <LiveTaggingView
              students={classStudents}
              snapshots={snapshots}
              liveTags={liveTags}
              activeSubject={activeSubject}
              onRecordLiveTag={handleRecordLiveTag}
              onPromoteStudent={handlePromoteStudent}
              onManualTierChange={handleManualTierChange}
            />
          )}

          {activeTab === 'assess' && (
            <div className="p-4 space-y-3 max-w-2xl mx-auto pb-24">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Quick 5-Minute Foundational Diagnostic
                </h2>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Evaluate one student at a time with standard oral/slate checklists. The diagnostic automatically computes their foundational skill tier and updates their group.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAssessmentTargetStudentId(classStudents[0]?.id);
                    setIsAssessmentModalOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>Start Guided Diagnostic for {classStudents[0]?.firstName ?? 'Class'}</span>
                </button>
              </div>

              {/* Roster list to select student directly */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-700">Select Student to Assess:</span>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {classStudents.map((s) => (
                    <div
                      key={s.id}
                      className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 px-1 rounded-lg"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900">{s.firstName}</span>
                        <span className="font-mono text-[11px] text-slate-500 ml-1.5">
                          {s.rollNumberOrAlias}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAssessmentForStudent(s.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                      >
                        Assess 5-Min Check
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <ActivitiesView
              classroom={activeClassroom}
              activities={activities}
              activityLogs={activityLogs}
              activeSubject={activeSubject}
              onLogActivityDone={handleLogActivityDone}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              classroom={activeClassroom}
              students={classStudents}
              snapshots={snapshots}
              liveTags={liveTags}
              assessments={assessmentResults}
              activeSubject={activeSubject}
              onOpenAssessmentForStudent={(id) => handleOpenAssessmentForStudent(id)}
              selectedStudentHistoryId={selectedStudentHistoryId}
              onCloseHistoryModal={() => setSelectedStudentHistoryId(null)}
              onSelectStudentForHistory={(id) => setSelectedStudentHistoryId(id)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'assess') {
              setAssessmentTargetStudentId(classStudents[0]?.id);
              setIsAssessmentModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {/* Diagnostic Assessment Modal */}
        <AssessmentFlowModal
          students={classStudents}
          initialStudentId={assessmentTargetStudentId}
          activeSubject={activeSubject}
          templates={assessmentTemplates}
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
          onSaveAssessment={handleSaveAssessment}
        />

        {/* Sync Drawer Modal */}
        <SyncDrawerModal
          isOpen={isSyncDrawerOpen}
          onClose={() => setIsSyncDrawerOpen(false)}
          isOnline={isOnline}
          onToggleNetwork={(online) => storageService.setNetworkMode(online)}
          onSyncComplete={() => setVersion((v) => v + 1)}
        />

        {/* Add Student Modal (Minimal PII) */}
        <AddStudentModal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          classroom={activeClassroom}
          onAddStudent={handleAddStudent}
        />

        {/* Classroom Modal */}
        <ClassroomModal
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
          classrooms={classrooms}
          activeClassroomId={activeClassroomId}
          onSelectClassroom={(id) => setActiveClassroomId(id)}
          onAddClassroom={handleAddClassroom}
          students={allStudents}
        />
      </div>
    </div>
  );
}
