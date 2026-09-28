import {
  Teacher,
  Classroom,
  Student,
  StudentSkillSnapshot,
  AssessmentTemplate,
  LowResourceActivity,
  SkillLevelInfo,
  Subject,
  SkillTier
} from '../types';

export const SEED_TEACHER: Teacher = {
  id: 'teacher-001',
  name: 'Sunita Sharma',
  phoneOrEmail: 'sunita.sharma@gpskhedi.edu',
  schoolName: 'GPS Khedi Block 2 (Govt. Primary)'
};

export const SEED_CLASSROOMS: Classroom[] = [
  {
    id: 'class-3a',
    teacherId: 'teacher-001',
    name: 'Grade 3A',
    gradeInfo: 'Grade 3 (Foundational Cohort)'
  },
  {
    id: 'class-multi',
    teacherId: 'teacher-001',
    name: 'Grades 2–4 Multi-Grade',
    gradeInfo: 'Multi-grade Combined Room'
  }
];

// Strictly minimized PII: only firstName and rollNumberOrAlias
export const SEED_STUDENTS_GRADE_3A: Student[] = [
  { id: 'st-01', classroomId: 'class-3a', firstName: 'Aarav', rollNumberOrAlias: 'Roll 01', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-02', classroomId: 'class-3a', firstName: 'Pooja', rollNumberOrAlias: 'Roll 02', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-03', classroomId: 'class-3a', firstName: 'Rohit', rollNumberOrAlias: 'Roll 03', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-04', classroomId: 'class-3a', firstName: 'Ananya', rollNumberOrAlias: 'Roll 04', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-05', classroomId: 'class-3a', firstName: 'Kavita', rollNumberOrAlias: 'Roll 05', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-06', classroomId: 'class-3a', firstName: 'Deepak', rollNumberOrAlias: 'Roll 06', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-07', classroomId: 'class-3a', firstName: 'Meera', rollNumberOrAlias: 'Roll 07', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-08', classroomId: 'class-3a', firstName: 'Suraj', rollNumberOrAlias: 'Roll 08', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-09', classroomId: 'class-3a', firstName: 'Priya', rollNumberOrAlias: 'Roll 09', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-10', classroomId: 'class-3a', firstName: 'Vikram', rollNumberOrAlias: 'Roll 10', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-11', classroomId: 'class-3a', firstName: 'Neha', rollNumberOrAlias: 'Roll 11', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-12', classroomId: 'class-3a', firstName: 'Raju', rollNumberOrAlias: 'Roll 12', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-13', classroomId: 'class-3a', firstName: 'Gita', rollNumberOrAlias: 'Roll 13', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-14', classroomId: 'class-3a', firstName: 'Amit', rollNumberOrAlias: 'Roll 14', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-15', classroomId: 'class-3a', firstName: 'Sunil', rollNumberOrAlias: 'Roll 15', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-16', classroomId: 'class-3a', firstName: 'Rani', rollNumberOrAlias: 'Roll 16', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-17', classroomId: 'class-3a', firstName: 'Kiran', rollNumberOrAlias: 'Roll 17', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-18', classroomId: 'class-3a', firstName: 'Manoj', rollNumberOrAlias: 'Roll 18', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-19', classroomId: 'class-3a', firstName: 'Divya', rollNumberOrAlias: 'Roll 19', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-20', classroomId: 'class-3a', firstName: 'Sachin', rollNumberOrAlias: 'Roll 20', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-21', classroomId: 'class-3a', firstName: 'Sonia', rollNumberOrAlias: 'Roll 21', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-22', classroomId: 'class-3a', firstName: 'Imran', rollNumberOrAlias: 'Roll 22', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-23', classroomId: 'class-3a', firstName: 'Lakshmi', rollNumberOrAlias: 'Roll 23', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-24', classroomId: 'class-3a', firstName: 'Arjun', rollNumberOrAlias: 'Roll 24', createdAt: '2026-08-10', syncStatus: 'SYNCED' },
  { id: 'st-25', classroomId: 'class-3a', firstName: 'Fatima', rollNumberOrAlias: 'Roll 25', createdAt: '2026-08-10', syncStatus: 'SYNCED' }
];

export const SEED_STUDENTS_MULTI: Student[] = [
  { id: 'stm-01', classroomId: 'class-multi', firstName: 'Babu', rollNumberOrAlias: 'M-01', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-02', classroomId: 'class-multi', firstName: 'Chandni', rollNumberOrAlias: 'M-02', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-03', classroomId: 'class-multi', firstName: 'Dinesh', rollNumberOrAlias: 'M-03', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-04', classroomId: 'class-multi', firstName: 'Geeta', rollNumberOrAlias: 'M-04', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-05', classroomId: 'class-multi', firstName: 'Hari', rollNumberOrAlias: 'M-05', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-06', classroomId: 'class-multi', firstName: 'Jyoti', rollNumberOrAlias: 'M-06', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-07', classroomId: 'class-multi', firstName: 'Kamal', rollNumberOrAlias: 'M-07', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-08', classroomId: 'class-multi', firstName: 'Lata', rollNumberOrAlias: 'M-08', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-09', classroomId: 'class-multi', firstName: 'Mohan', rollNumberOrAlias: 'M-09', createdAt: '2026-08-12', syncStatus: 'SYNCED' },
  { id: 'stm-10', classroomId: 'class-multi', firstName: 'Nirmala', rollNumberOrAlias: 'M-10', createdAt: '2026-08-12', syncStatus: 'SYNCED' }
];

export const SKILL_TIER_INFO: Record<Subject, Record<SkillTier, SkillLevelInfo>> = {
  READING: {
    RED: {
      tier: 'RED',
      subject: 'READING',
      name: 'Letter & Sounds (Beginner)',
      badgeLabel: 'Intensive Support',
      description: 'Struggling with letter sound identification and phonics basics.',
      primaryDeficitTitle: 'Letter Sound & Blending Gap',
      recommendedFocus: 'Phonics drills with chalk floor hops and slate sound-matching.',
      colorHex: '#DC2626',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-300'
    },
    YELLOW: {
      tier: 'YELLOW',
      subject: 'READING',
      name: 'Words & Sentences (Emerging)',
      badgeLabel: 'Emerging',
      description: 'Can identify letters but stumbles decoding 3-letter CVC words and short sentences.',
      primaryDeficitTitle: 'CVC Word Blending & Fluency',
      recommendedFocus: 'Pebble word-building, speed flashcards, and paired sentence reading.',
      colorHex: '#D97706',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-300'
    },
    GREEN: {
      tier: 'GREEN',
      subject: 'READING',
      name: 'Paragraph & Story (On Track)',
      badgeLabel: 'On Track',
      description: 'Reads connected stories with comprehension at Grade 2/3 level.',
      primaryDeficitTitle: 'Vocabulary & Reading Fluency',
      recommendedFocus: 'Peer story reading, slate story generation, question-answer pairs.',
      colorHex: '#16A34A',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300'
    }
  },
  MATH: {
    RED: {
      tier: 'RED',
      subject: 'MATH',
      name: 'Number Recognition (Beginner)',
      badgeLabel: 'Intensive Support',
      description: 'Struggling with number identification 1-99 and basic counting quantities.',
      primaryDeficitTitle: 'Quantities & Place Value Base',
      recommendedFocus: 'Pebble counters, bundles of 10 sticks, slate finger-dot jumps.',
      colorHex: '#DC2626',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-300'
    },
    YELLOW: {
      tier: 'YELLOW',
      subject: 'MATH',
      name: '1-Digit Operations (Emerging)',
      badgeLabel: 'Emerging',
      description: 'Understands digits, but needs concrete support for subtraction and simple borrowing.',
      primaryDeficitTitle: '1-Digit Subtraction & Mental Math',
      recommendedFocus: 'Chalk number line countdowns, slate dice subtraction, paired games.',
      colorHex: '#D97706',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-300'
    },
    GREEN: {
      tier: 'GREEN',
      subject: 'MATH',
      name: '2-Digit Regrouping (On Track)',
      badgeLabel: 'On Track',
      description: 'Accurately completes 2-digit subtraction with borrowing and word problems.',
      primaryDeficitTitle: 'Word Problems & Real-World Application',
      recommendedFocus: 'Chalkboard village store roleplay, peer problem solving, timed slate relays.',
      colorHex: '#16A34A',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300'
    }
  }
};

// Seed baseline and progression snapshots to demonstrate movement over time
export const SEED_SKILL_SNAPSHOTS: StudentSkillSnapshot[] = [
  // --- Baseline 30 days ago for Grade 3A Reading ---
  // Many in Red originally
  { id: 'snap-b-01', studentId: 'st-01', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-02', studentId: 'st-02', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-03', studentId: 'st-03', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-04', studentId: 'st-04', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-05', studentId: 'st-05', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-06', studentId: 'st-06', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-07', studentId: 'st-07', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-08', studentId: 'st-08', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-09', studentId: 'st-09', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-10', studentId: 'st-10', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-11', studentId: 'st-11', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-12', studentId: 'st-12', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-13', studentId: 'st-13', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-14', studentId: 'st-14', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-15', studentId: 'st-15', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-16', studentId: 'st-16', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-17', studentId: 'st-17', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-18', studentId: 'st-18', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-19', studentId: 'st-19', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-20', studentId: 'st-20', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-21', studentId: 'st-21', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-22', studentId: 'st-22', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-23', studentId: 'st-23', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-24', studentId: 'st-24', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-b-25', studentId: 'st-25', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-08-15T09:00:00Z', syncStatus: 'SYNCED' },

  // --- Current Snapshots for Grade 3A Reading (showing positive progress: 5 moved Red->Yellow, 2 moved Yellow->Green) ---
  { id: 'snap-c-01', studentId: 'st-01', subject: 'READING', tier: 'YELLOW', sourceType: 'LIVE_TAG', notes: 'Mastered CVC words via floor hops', timestamp: '2026-09-12T10:00:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-02', studentId: 'st-02', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', notes: 'Still identifying m, s, t sounds', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-03', studentId: 'st-03', subject: 'READING', tier: 'YELLOW', sourceType: 'LIVE_TAG', notes: 'Sound blending reached 4/5', timestamp: '2026-09-14T11:00:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-04', studentId: 'st-04', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', notes: 'Fluent sentence reader now', timestamp: '2026-09-08T10:30:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-05', studentId: 'st-05', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', notes: 'Needs focus on vowels', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-06', studentId: 'st-06', subject: 'READING', tier: 'YELLOW', sourceType: 'LIVE_TAG', notes: 'Passed simple word check', timestamp: '2026-09-15T08:30:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-07', studentId: 'st-07', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'st-c-08', studentId: 'st-08', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-09', studentId: 'st-09', subject: 'READING', tier: 'GREEN', sourceType: 'LIVE_TAG', notes: 'Fluently read paragraph', timestamp: '2026-09-13T10:15:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-10', studentId: 'st-10', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-11', studentId: 'st-11', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:45:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-12', studentId: 'st-12', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-13', studentId: 'st-13', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-14', studentId: 'st-14', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-15', studentId: 'st-15', subject: 'READING', tier: 'YELLOW', sourceType: 'LIVE_TAG', notes: 'Recognized 5 CVC cards', timestamp: '2026-09-15T09:00:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-16', studentId: 'st-16', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-17', studentId: 'st-17', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-18', studentId: 'st-18', subject: 'READING', tier: 'GREEN', sourceType: 'LIVE_TAG', notes: 'Connected 3 sentences without pause', timestamp: '2026-09-14T11:00:00Z', syncStatus: 'SYNCED' }, // Moved UP!
  { id: 'snap-c-19', studentId: 'st-19', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-20', studentId: 'st-20', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-21', studentId: 'st-21', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-22', studentId: 'st-22', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-23', studentId: 'st-23', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-24', studentId: 'st-24', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'snap-c-25', studentId: 'st-25', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-10T09:00:00Z', syncStatus: 'SYNCED' },

  // --- Math Current Snapshots for Grade 3A ---
  { id: 'm-snap-01', studentId: 'st-01', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-02', studentId: 'st-02', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-03', studentId: 'st-03', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-04', studentId: 'st-04', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-05', studentId: 'st-05', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-06', studentId: 'st-06', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-07', studentId: 'st-07', subject: 'MATH', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-08', studentId: 'st-08', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-09', studentId: 'st-09', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-10', studentId: 'st-10', subject: 'MATH', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-11', studentId: 'st-11', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-12', studentId: 'st-12', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-13', studentId: 'st-13', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-14', studentId: 'st-14', subject: 'MATH', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-15', studentId: 'st-15', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-16', studentId: 'st-16', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-17', studentId: 'st-17', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-18', studentId: 'st-18', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-19', studentId: 'st-19', subject: 'MATH', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-20', studentId: 'st-20', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-21', studentId: 'st-21', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-22', studentId: 'st-22', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-23', studentId: 'st-23', subject: 'MATH', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-24', studentId: 'st-24', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'm-snap-25', studentId: 'st-25', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-11T09:00:00Z', syncStatus: 'SYNCED' },

  // --- Multi-grade baseline & current ---
  { id: 'mg-r-01', studentId: 'stm-01', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-r-02', studentId: 'stm-02', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-r-03', studentId: 'stm-03', subject: 'READING', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-r-04', studentId: 'stm-04', subject: 'READING', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-r-05', studentId: 'stm-05', subject: 'READING', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-m-01', studentId: 'stm-01', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-m-02', studentId: 'stm-02', subject: 'MATH', tier: 'RED', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-m-03', studentId: 'stm-03', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-m-04', studentId: 'stm-04', subject: 'MATH', tier: 'GREEN', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' },
  { id: 'mg-m-05', studentId: 'stm-05', subject: 'MATH', tier: 'YELLOW', sourceType: 'ASSESSMENT', timestamp: '2026-09-01T09:00:00Z', syncStatus: 'SYNCED' }
];

// 5-Minute Guided Diagnostic Assessment Templates
export const SEED_ASSESSMENT_TEMPLATES: AssessmentTemplate[] = [
  {
    id: 'assess-read-5min',
    subject: 'READING',
    title: '5-Minute Foundational Reading Diagnostic',
    durationMinutes: 5,
    description: 'Quick oral check measuring letter sound recognition, simple word decoding, and connected story comprehension.',
    steps: [
      {
        id: 'step-r1',
        title: 'Step 1: Letter Sound Recognition',
        instructionPrompt: 'Point to each letter card. Ask student: "Make the sound of this letter (not the name)."',
        items: ['m (/m/)', 's (/s/)', 'a (/æ/)', 't (/t/)', 'p (/p/)'],
        thresholdPass: 4,
        maxScore: 5
      },
      {
        id: 'step-r2',
        title: 'Step 2: Simple CVC Word Decoding',
        instructionPrompt: 'Point to word list. Ask student: "Blend the sounds to read each word aloud."',
        items: ['mat', 'sit', 'cup', 'red', 'pin'],
        thresholdPass: 4,
        maxScore: 5
      },
      {
        id: 'step-r3',
        title: 'Step 3: Short Story Fluency & Comprehension',
        instructionPrompt: 'Show the 4-line story card: "Ravi has a red ball. The ball bounced fast. Ravi ran to get it. He smiled at his friend." Ask student to read aloud.',
        items: ['Reads with <3 errors', 'Reads smoothly without pausing', 'Answers: What color is Ravi’s ball?', 'Answers: What did Ravi do?'],
        thresholdPass: 3,
        maxScore: 4
      }
    ]
  },
  {
    id: 'assess-math-5min',
    subject: 'MATH',
    title: '5-Minute Foundational Math Diagnostic',
    durationMinutes: 5,
    description: 'Targeted slate/oral diagnostic for 2-digit number identification, 1-digit subtraction, and 2-digit borrowing subtraction.',
    steps: [
      {
        id: 'step-m1',
        title: 'Step 1: Number Recognition (1–99)',
        instructionPrompt: 'Point to the 5 numbers written on slate: 8, 19, 43, 67, 95. Ask: "Read each number aloud."',
        items: ['8 (single digit)', '19 (teen)', '43 (two digit)', '67 (two digit)', '95 (high two digit)'],
        thresholdPass: 4,
        maxScore: 5
      },
      {
        id: 'step-m2',
        title: 'Step 2: 1-Digit Subtraction',
        instructionPrompt: 'Have student solve on slate or with fingers: 7 - 3, 9 - 4, 8 - 6, 6 - 5.',
        items: ['7 - 3 = 4', '9 - 4 = 5', '8 - 6 = 2', '6 - 5 = 1'],
        thresholdPass: 3,
        maxScore: 4
      },
      {
        id: 'step-m3',
        title: 'Step 3: 2-Digit Subtraction with Regrouping',
        instructionPrompt: 'Write 2 problems on slate: 43 - 17 and 52 - 28. Ask student to solve with pencil or chalk.',
        items: ['43 - 17 = 26 (correct borrowing)', '52 - 28 = 24 (correct borrowing)'],
        thresholdPass: 2,
        maxScore: 2
      }
    ]
  }
];

// Pre-loaded low-resource chalk/slate activities designed for 10-15 minute focused instruction
export const SEED_ACTIVITIES: LowResourceActivity[] = [
  // --- READING ACTIVITIES ---
  {
    id: 'act-r-red-1',
    subject: 'READING',
    targetTier: 'RED',
    title: 'Chalk Floor Letter-Hop',
    timeMinutes: 12,
    materials: ['Chalk on floor/verandah'],
    objective: 'Reinforce letter-sound recognition through physical movement.',
    steps: [
      'Draw 5 large chalk circles on the verandah floor with letters (m, s, t, a, p).',
      'Call out a letter sound (e.g. "/t/ as in tap!").',
      'Students in Red group take turns hopping into the matching circle and shouting the sound aloud.'
    ],
    chalkAndTalkTip: 'Ask other students to clap twice if their peer hops onto the correct letter.'
  },
  {
    id: 'act-r-red-2',
    subject: 'READING',
    targetTier: 'RED',
    title: 'Slate Sound-Pebble Match',
    timeMinutes: 10,
    materials: ['Slates, chalk, 5 smooth pebbles per child'],
    objective: 'Associate isolated phonemes with tactile counters.',
    steps: [
      'Teacher writes 3 target letters on blackboard: /k/, /m/, /s/.',
      'Each student copies them onto their personal slate.',
      'Teacher speaks a word (e.g. "Sun!"). Students place a pebble on the matching starting letter.'
    ],
    chalkAndTalkTip: 'Ideal for quiet desk work while teacher spends 5 minutes with another group.'
  },
  {
    id: 'act-r-yel-1',
    subject: 'READING',
    targetTier: 'YELLOW',
    title: 'Stone CVC Word Builder',
    timeMinutes: 15,
    materials: ['Stones with chalk letters, personal slate'],
    objective: 'Blend consonant-vowel-consonant (CVC) sounds into fluent words.',
    steps: [
      'Give students chalk-labeled stones: consonants in left pile, vowels in center pile.',
      'Call out a target word: "MAT". Students assemble "M" + "A" + "T" stones.',
      'They sound out each letter slowly, then swipe their finger to blend: "m-a-t -> MAT!"'
    ],
    chalkAndTalkTip: 'Pair students in twos: one arranges the stones, the other reads aloud.'
  },
  {
    id: 'act-r-yel-2',
    subject: 'READING',
    targetTier: 'YELLOW',
    title: 'Chalkboard Sentence Relay',
    timeMinutes: 12,
    materials: ['Blackboard & chalk split into 2 columns'],
    objective: 'Promote rapid visual word recognition in short sentences.',
    steps: [
      'Write 4 short 3-word sentences on blackboard (e.g., "The cat sat.", "A red bus.").',
      'Call two students up. Say a word from the sentence (e.g. "bus!").',
      'The students race to circle that specific word on the board and read the full line.'
    ],
    chalkAndTalkTip: 'Keeps high excitement without requiring paper or printed textbooks.'
  },
  {
    id: 'act-r-grn-1',
    subject: 'READING',
    targetTier: 'GREEN',
    title: 'Peer Slate Story Buddies',
    timeMinutes: 15,
    materials: ['Slates, chalk, Grade 2 reader'],
    objective: 'Read connected text aloud and formulate 2 question-prompts for peers.',
    steps: [
      'Pair 2 On-Track students together with a single story page.',
      'Student A reads paragraph 1 aloud while Student B follows along with their finger.',
      'Student B writes one "Who" or "What" question on their slate for Student A to answer.',
      'Switch roles for paragraph 2.'
    ],
    chalkAndTalkTip: 'Completely autonomous activity that frees teacher to focus on Intensive Support group.'
  },

  // --- MATH ACTIVITIES ---
  {
    id: 'act-m-red-1',
    subject: 'MATH',
    targetTier: 'RED',
    title: 'Pebble Subtraction Pile',
    timeMinutes: 12,
    materials: ['10 pebbles or bottle caps per child, chalk circle'],
    objective: 'Concrete physical representation of "taking away" from quantities <= 10.',
    steps: [
      'Student counts out 8 pebbles into their chalk circle.',
      'Teacher or peer calls: "Give 3 pebbles away to your friend."',
      'Student pushes 3 pebbles outside the circle, counts remaining: "8 take away 3 is 5!"'
    ],
    chalkAndTalkTip: 'Reinforce the vocabulary: "Total count", "Take away", "How many are left?"'
  },
  {
    id: 'act-m-red-2',
    subject: 'MATH',
    targetTier: 'RED',
    title: 'Sticks & Bundles of Ten',
    timeMinutes: 15,
    materials: ['Neem/broom sticks, string/rubber bands'],
    objective: 'Establish firm understanding of Tens and Ones place value.',
    steps: [
      'Students count 10 loose sticks and tie them with grass or rubber band to make "1 Ten".',
      'Teacher calls a number: "24!".',
      'Students hold up 2 bundles (20) and 4 loose sticks (4).'
    ],
    chalkAndTalkTip: 'Essential foundational skill before introducing 2-digit borrowing.'
  },
  {
    id: 'act-m-yel-1',
    subject: 'MATH',
    targetTier: 'YELLOW',
    title: 'Chalk Number Line Countdown',
    timeMinutes: 12,
    materials: ['Chalk line on floor numbered 0 to 20'],
    objective: 'Mental arithmetic for single-digit subtraction via backward jumps.',
    steps: [
      'Draw a chalk line 0 to 20 on classroom floor with chalk.',
      'Give student a subtraction problem: "14 - 6 = ?"',
      'Student stands on 14, hops backward 6 steps while counting aloud: "13, 12, 11, 10, 9, 8!"'
    ],
    chalkAndTalkTip: 'Kinesthetic movement helps visual learners solidify backward counting.'
  },
  {
    id: 'act-m-yel-2',
    subject: 'MATH',
    targetTier: 'YELLOW',
    title: 'Slate Subtraction Duel',
    timeMinutes: 10,
    materials: ['Slates, 2 pairs of students'],
    objective: 'Speed and accuracy in single-digit differences.',
    steps: [
      'Students sit knee-to-knee with slates hidden.',
      'Teacher rings bell and shouts: "9 minus 4!"',
      'Both write answer on slate and reveal simultaneously. First correct earns a chalk star.'
    ],
    chalkAndTalkTip: 'High energy, zero preparation, instant error correction.'
  },
  {
    id: 'act-m-grn-1',
    subject: 'MATH',
    targetTier: 'GREEN',
    title: 'Borrowing Bank with Stick Bundles',
    timeMinutes: 15,
    materials: ['Bundles of 10 and loose sticks, slates'],
    objective: 'Master regrouping in 2-digit subtraction (e.g. 52 - 28).',
    steps: [
      'Write 52 - 28 on slate. In the Ones column: 2 minus 8 is impossible without regrouping.',
      'Student acts as the "Banker": un-ties 1 bundle of 10 into 10 loose sticks.',
      'Add 10 to 2 sticks = 12 sticks. 12 - 8 = 4. Tens column: 4 bundles - 2 bundles = 2 bundles (24).'
    ],
    chalkAndTalkTip: 'Demystifies the abstract "carry-over" cross mark by showing the bundle opening.'
  }
];
