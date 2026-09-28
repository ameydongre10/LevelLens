import {
  Teacher,
  Classroom,
  Student,
  StudentSkillSnapshot,
  AssessmentTemplate,
  AssessmentResult,
  LiveTagEvent,
  LowResourceActivity,
  ActivityLog,
  Subject,
  SkillTier,
  SourceType
} from '../types';
import {
  SEED_TEACHER,
  SEED_CLASSROOMS,
  SEED_STUDENTS_GRADE_3A,
  SEED_STUDENTS_MULTI,
  SEED_SKILL_SNAPSHOTS,
  SEED_ASSESSMENT_TEMPLATES,
  SEED_ACTIVITIES
} from '../data/seedData';

const DB_KEY = 'level_lens_offline_db_v1';
const NETWORK_STATE_KEY = 'level_lens_network_mode';

interface LevelLensDatabase {
  version: number;
  teacher: Teacher;
  classrooms: Classroom[];
  students: Student[];
  snapshots: StudentSkillSnapshot[];
  assessmentResults: AssessmentResult[];
  liveTags: LiveTagEvent[];
  activityLogs: ActivityLog[];
  assessmentTemplates: AssessmentTemplate[];
  activities: LowResourceActivity[];
  lastSyncedAt: string | null;
}

class StorageService {
  private db: LevelLensDatabase;
  private listeners: Set<() => void> = new Set();
  private isOnlineSimulated: boolean = true;

  constructor() {
    this.db = this.loadDatabase();
    // Load simulated network toggle preference, default to true
    try {
      const savedMode = localStorage.getItem(NETWORK_STATE_KEY);
      this.isOnlineSimulated = savedMode !== null ? JSON.parse(savedMode) : navigator.onLine;
    } catch {
      this.isOnlineSimulated = true;
    }

    // Listen to real window network changes if in default mode
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        // Only update if not manually overridden or when actual signal recovers
        this.notify();
      });
      window.addEventListener('offline', () => {
        this.notify();
      });
    }
  }

  private getDefaultData(): LevelLensDatabase {
    return {
      version: 1,
      teacher: SEED_TEACHER,
      classrooms: SEED_CLASSROOMS,
      students: [...SEED_STUDENTS_GRADE_3A, ...SEED_STUDENTS_MULTI],
      snapshots: [...SEED_SKILL_SNAPSHOTS],
      assessmentResults: [],
      liveTags: [],
      activityLogs: [
        {
          id: 'log-seed-1',
          classroomId: 'class-3a',
          subject: 'READING',
          activityId: 'act-r-red-1',
          date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
          status: 'DONE',
          favorite: true,
          rating: 'THUMBS_UP',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          syncStatus: 'SYNCED'
        }
      ],
      assessmentTemplates: SEED_ASSESSMENT_TEMPLATES,
      activities: SEED_ACTIVITIES,
      lastSyncedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    };
  }

  private loadDatabase(): LevelLensDatabase {
    try {
      const serialized = localStorage.getItem(DB_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (parsed && parsed.version === 1) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from local storage, fallback to seed data', e);
    }
    const initial = this.getDefaultData();
    this.persist(initial);
    return initial;
  }

  private persist(data: LevelLensDatabase): void {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Local persistence quota or access error:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.persist(this.db);
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error notifying storage listener:', e);
      }
    });
  }

  // --- Network Online / Offline Simulation ---
  public isOnline(): boolean {
    return this.isOnlineSimulated && (typeof navigator !== 'undefined' ? navigator.onLine : true);
  }

  public setNetworkMode(online: boolean): void {
    this.isOnlineSimulated = online;
    try {
      localStorage.setItem(NETWORK_STATE_KEY, JSON.stringify(online));
    } catch {
      // ignore
    }
    this.notify();
  }

  // --- Teacher & Classrooms ---
  public getTeacher(): Teacher {
    return this.db.teacher;
  }

  public getClassrooms(): Classroom[] {
    return this.db.classrooms;
  }

  public addClassroom(name: string, gradeInfo: string): Classroom {
    const newClass: Classroom = {
      id: `class-${Date.now()}`,
      teacherId: this.db.teacher.id,
      name,
      gradeInfo
    };
    this.db.classrooms.push(newClass);
    this.notify();
    return newClass;
  }

  // --- Students (Strictly firstName and rollNumberOrAlias) ---
  public getStudents(classroomId?: string): Student[] {
    if (classroomId) {
      return this.db.students.filter((s) => s.classroomId === classroomId);
    }
    return this.db.students;
  }

  public addStudent(classroomId: string, firstName: string, rollNumberOrAlias: string): Student {
    const newStudent: Student = {
      id: `st-${Date.now()}`,
      classroomId,
      firstName: firstName.trim(),
      rollNumberOrAlias: rollNumberOrAlias.trim(),
      createdAt: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    this.db.students.push(newStudent);

    // Initial default snapshot (Red/Beginner pending initial assessment)
    const initialSnapshotReading: StudentSkillSnapshot = {
      id: `snap-${Date.now()}-r`,
      studentId: newStudent.id,
      subject: 'READING',
      tier: 'RED',
      sourceType: 'ASSESSMENT',
      notes: 'Initial enrollment (Pending Diagnostic)',
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    const initialSnapshotMath: StudentSkillSnapshot = {
      id: `snap-${Date.now()}-m`,
      studentId: newStudent.id,
      subject: 'MATH',
      tier: 'RED',
      sourceType: 'ASSESSMENT',
      notes: 'Initial enrollment (Pending Diagnostic)',
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    this.db.snapshots.push(initialSnapshotReading, initialSnapshotMath);

    this.notify();
    return newStudent;
  }

  // --- Skill Snapshots & History ---
  public getSnapshots(studentId?: string, subject?: Subject): StudentSkillSnapshot[] {
    let snaps = this.db.snapshots;
    if (studentId) snaps = snaps.filter((s) => s.studentId === studentId);
    if (subject) snaps = snaps.filter((s) => s.subject === subject);
    return snaps;
  }

  public getLatestSnapshot(studentId: string, subject: Subject): StudentSkillSnapshot | null {
    const snaps = this.db.snapshots
      .filter((s) => s.studentId === studentId && s.subject === subject)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return snaps[0] ?? null;
  }

  public updateStudentTier(
    studentId: string,
    subject: Subject,
    newTier: SkillTier,
    sourceType: SourceType,
    notes?: string
  ): StudentSkillSnapshot {
    const snapshot: StudentSkillSnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      subject,
      tier: newTier,
      sourceType,
      notes: notes || `Updated via ${sourceType.toLowerCase()}`,
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    this.db.snapshots.push(snapshot);
    this.notify();
    return snapshot;
  }

  // --- Assessments ---
  public getAssessmentTemplates(subject?: Subject): AssessmentTemplate[] {
    if (subject) {
      return this.db.assessmentTemplates.filter((t) => t.subject === subject);
    }
    return this.db.assessmentTemplates;
  }

  public recordAssessmentResult(
    studentId: string,
    assessmentTemplateId: string,
    subject: Subject,
    stepScores: Record<string, number>,
    derivedTier: SkillTier,
    notes?: string
  ): { result: AssessmentResult; snapshot: StudentSkillSnapshot } {
    const now = new Date().toISOString();
    const result: AssessmentResult = {
      id: `res-${Date.now()}`,
      studentId,
      assessmentTemplateId,
      subject,
      stepScores,
      derivedTier,
      notes,
      timestamp: now,
      syncStatus: 'PENDING'
    };
    this.db.assessmentResults.push(result);

    const snapshot: StudentSkillSnapshot = {
      id: `snap-${Date.now()}`,
      studentId,
      subject,
      tier: derivedTier,
      sourceType: 'ASSESSMENT',
      notes: notes || `Diagnostic score: ${Object.values(stepScores).join('/')}`,
      timestamp: now,
      syncStatus: 'PENDING'
    };
    this.db.snapshots.push(snapshot);

    this.notify();
    return { result, snapshot };
  }

  public getAssessmentResults(studentId?: string): AssessmentResult[] {
    if (studentId) {
      return this.db.assessmentResults.filter((r) => r.studentId === studentId);
    }
    return this.db.assessmentResults;
  }

  // --- Live Tagging ---
  public recordLiveTag(
    studentId: string,
    subject: Subject,
    tagType: 'PERFORMED_WELL' | 'STRUGGLING' | 'PROMOTED' | 'DEMOTED',
    conceptName?: string
  ): LiveTagEvent {
    const tag: LiveTagEvent = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      subject,
      tagType,
      conceptName,
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    this.db.liveTags.push(tag);
    this.notify();
    return tag;
  }

  public getLiveTags(studentId?: string, subject?: Subject): LiveTagEvent[] {
    let tags = this.db.liveTags;
    if (studentId) tags = tags.filter((t) => t.studentId === studentId);
    if (subject) tags = tags.filter((t) => t.subject === subject);
    return tags;
  }

  // --- Low-Resource Activities ---
  public getActivities(subject?: Subject, tier?: SkillTier): LowResourceActivity[] {
    let acts = this.db.activities;
    if (subject) acts = acts.filter((a) => a.subject === subject);
    if (tier) acts = acts.filter((a) => a.targetTier === tier);
    return acts;
  }

  public getActivityLogs(classroomId?: string, subject?: Subject): ActivityLog[] {
    let logs = this.db.activityLogs;
    if (classroomId) logs = logs.filter((l) => l.classroomId === classroomId);
    if (subject) logs = logs.filter((l) => l.subject === subject);
    return logs;
  }

  public logActivityDone(
    classroomId: string,
    subject: Subject,
    activityId: string,
    favorite: boolean = false,
    rating?: 'THUMBS_UP' | 'THUMBS_DOWN'
  ): ActivityLog {
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = this.db.activityLogs.find(
      (l) => l.classroomId === classroomId && l.activityId === activityId && l.date === todayStr
    );

    if (existing) {
      existing.status = 'DONE';
      existing.favorite = favorite ?? existing.favorite;
      if (rating) existing.rating = rating;
      existing.syncStatus = 'PENDING';
      this.notify();
      return existing;
    }

    const newLog: ActivityLog = {
      id: `actlog-${Date.now()}`,
      classroomId,
      subject,
      activityId,
      date: todayStr,
      status: 'DONE',
      favorite,
      rating,
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    this.db.activityLogs.push(newLog);
    this.notify();
    return newLog;
  }

  public toggleActivityFavorite(activityId: string, classroomId: string, subject: Subject): boolean {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = this.db.activityLogs.find(
      (l) => l.activityId === activityId && l.classroomId === classroomId
    );
    if (log) {
      log.favorite = !log.favorite;
      log.syncStatus = 'PENDING';
      this.notify();
      return log.favorite;
    }
    const newLog: ActivityLog = {
      id: `actlog-${Date.now()}`,
      classroomId,
      subject,
      activityId,
      date: todayStr,
      status: 'DONE',
      favorite: true,
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    };
    this.db.activityLogs.push(newLog);
    this.notify();
    return true;
  }

  // --- Offline Sync Engine & Pending Item Management ---
  public getPendingSyncCount(): number {
    const pStudents = this.db.students.filter((s) => s.syncStatus === 'PENDING').length;
    const pSnaps = this.db.snapshots.filter((s) => s.syncStatus === 'PENDING').length;
    const pResults = this.db.assessmentResults.filter((r) => r.syncStatus === 'PENDING').length;
    const pTags = this.db.liveTags.filter((t) => t.syncStatus === 'PENDING').length;
    const pLogs = this.db.activityLogs.filter((l) => l.syncStatus === 'PENDING').length;
    return pStudents + pSnaps + pResults + pTags + pLogs;
  }

  public getPendingSummary(): {
    students: number;
    snapshots: number;
    assessments: number;
    liveTags: number;
    activityLogs: number;
    total: number;
    items: Array<{ type: string; description: string; timestamp: string }>;
  } {
    const items: Array<{ type: string; description: string; timestamp: string }> = [];

    this.db.students
      .filter((s) => s.syncStatus === 'PENDING')
      .forEach((s) => {
        items.push({
          type: 'Student Created',
          description: `${s.firstName} (${s.rollNumberOrAlias})`,
          timestamp: s.createdAt
        });
      });

    this.db.snapshots
      .filter((sn) => sn.syncStatus === 'PENDING')
      .forEach((sn) => {
        const student = this.db.students.find((s) => s.id === sn.studentId);
        items.push({
          type: 'Skill Tier Update',
          description: `${student?.firstName ?? 'Student'} -> ${sn.tier} (${sn.subject})`,
          timestamp: sn.timestamp
        });
      });

    this.db.liveTags
      .filter((t) => t.syncStatus === 'PENDING')
      .forEach((t) => {
        const student = this.db.students.find((s) => s.id === t.studentId);
        items.push({
          type: 'Live Tag',
          description: `${student?.firstName ?? 'Student'}: ${t.tagType} (${t.subject})`,
          timestamp: t.timestamp
        });
      });

    this.db.assessmentResults
      .filter((r) => r.syncStatus === 'PENDING')
      .forEach((r) => {
        const student = this.db.students.find((s) => s.id === r.studentId);
        items.push({
          type: 'Assessment Result',
          description: `${student?.firstName ?? 'Student'}: Diagnostic -> ${r.derivedTier}`,
          timestamp: r.timestamp
        });
      });

    this.db.activityLogs
      .filter((l) => l.syncStatus === 'PENDING')
      .forEach((l) => {
        const act = this.db.activities.find((a) => a.id === l.activityId);
        items.push({
          type: 'Activity Logged',
          description: act ? act.title : 'Low-resource activity completed',
          timestamp: l.timestamp
        });
      });

    return {
      students: this.db.students.filter((s) => s.syncStatus === 'PENDING').length,
      snapshots: this.db.snapshots.filter((s) => s.syncStatus === 'PENDING').length,
      assessments: this.db.assessmentResults.filter((r) => r.syncStatus === 'PENDING').length,
      liveTags: this.db.liveTags.filter((t) => t.syncStatus === 'PENDING').length,
      activityLogs: this.db.activityLogs.filter((l) => l.syncStatus === 'PENDING').length,
      total: items.length,
      items: items.slice(0, 15) // top 15 most recent
    };
  }

  public async reconcileAndSync(): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!this.isOnline()) {
      return { success: false, syncedCount: 0, error: 'Device is offline. Connect to network to sync.' };
    }

    const pendingCount = this.getPendingSyncCount();
    if (pendingCount === 0) {
      return { success: true, syncedCount: 0 };
    }

    // Simulate real network request payload serialization and REST POST to Spring Boot backend
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Batch mark all pending entities as SYNCED (Simulating 200 OK from server)
    this.db.students.forEach((s) => (s.syncStatus = 'SYNCED'));
    this.db.snapshots.forEach((s) => (s.syncStatus = 'SYNCED'));
    this.db.assessmentResults.forEach((r) => (r.syncStatus = 'SYNCED'));
    this.db.liveTags.forEach((t) => (t.syncStatus = 'SYNCED'));
    this.db.activityLogs.forEach((l) => (l.syncStatus = 'SYNCED'));
    this.db.lastSyncedAt = new Date().toISOString();

    this.notify();
    return { success: true, syncedCount: pendingCount };
  }

  public getLastSyncedAt(): string | null {
    return this.db.lastSyncedAt;
  }

  // --- Backup & Data Management ---
  public exportBackupJson(): string {
    return JSON.stringify(this.db, null, 2);
  }

  public resetToSampleSeed(): void {
    this.db = this.getDefaultData();
    this.notify();
  }
}

export const storageService = new StorageService();
