export type Subject = 'READING' | 'MATH';

export type SkillTier = 'RED' | 'YELLOW' | 'GREEN';

export type SyncStatus = 'PENDING' | 'SYNCED';

export type TagType = 'PERFORMED_WELL' | 'STRUGGLING' | 'PROMOTED' | 'DEMOTED';

export type SourceType = 'ASSESSMENT' | 'LIVE_TAG' | 'MANUAL_OVERRIDE';

export interface Teacher {
  id: string;
  name: string;
  phoneOrEmail: string;
  schoolName: string;
}

export interface Classroom {
  id: string;
  teacherId: string;
  name: string;
  gradeInfo: string;
}

/**
 * Strictly minimized PII: Only first name and roll number or alias.
 * Never includes birthdate, phone, address, or photos.
 */
export interface Student {
  id: string;
  classroomId: string;
  firstName: string;
  rollNumberOrAlias: string;
  createdAt: string;
  syncStatus: SyncStatus;
}

export interface SkillLevelInfo {
  tier: SkillTier;
  subject: Subject;
  name: string;
  badgeLabel: string;
  description: string;
  primaryDeficitTitle: string;
  recommendedFocus: string;
  colorHex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export interface StudentSkillSnapshot {
  id: string;
  studentId: string;
  subject: Subject;
  tier: SkillTier;
  sourceType: SourceType;
  notes?: string;
  timestamp: string; // ISO date string
  syncStatus: SyncStatus;
}

export interface AssessmentStep {
  id: string;
  title: string;
  instructionPrompt: string; // Scripted teacher prompt
  items: string[];
  thresholdPass: number; // e.g., 4 out of 5
  maxScore: number;
}

export interface AssessmentTemplate {
  id: string;
  subject: Subject;
  title: string;
  durationMinutes: number;
  description: string;
  steps: AssessmentStep[];
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  assessmentTemplateId: string;
  subject: Subject;
  stepScores: Record<string, number>; // stepId -> score
  derivedTier: SkillTier;
  notes?: string;
  timestamp: string;
  syncStatus: SyncStatus;
}

export interface LiveTagEvent {
  id: string;
  studentId: string;
  subject: Subject;
  tagType: TagType;
  conceptName?: string;
  timestamp: string;
  syncStatus: SyncStatus;
}

export interface LowResourceActivity {
  id: string;
  subject: Subject;
  targetTier: SkillTier;
  title: string;
  timeMinutes: number;
  materials: string[];
  objective: string;
  steps: string[];
  chalkAndTalkTip: string;
}

export interface ActivityLog {
  id: string;
  classroomId: string;
  subject: Subject;
  activityId: string;
  date: string; // YYYY-MM-DD
  status: 'DONE' | 'SKIPPED';
  favorite: boolean;
  rating?: 'THUMBS_UP' | 'THUMBS_DOWN';
  timestamp: string;
  syncStatus: SyncStatus;
}

export interface PromotionSuggestion {
  studentId: string;
  studentName: string;
  subject: Subject;
  currentTier: SkillTier;
  suggestedTier: SkillTier;
  reason: string;
  consecutiveTagsCount: number;
}
