import {
  Subject,
  SkillTier,
  AssessmentStep,
  PromotionSuggestion,
  StudentSkillSnapshot,
  LiveTagEvent,
  Student
} from '../types';

/**
 * Deterministic assessment scoring engine.
 * Takes raw scores across steps and calculates the exact foundational skill tier.
 */
export function calculateDerivedTier(
  subject: Subject,
  stepScores: Record<string, number>,
  steps: AssessmentStep[]
): {
  tier: SkillTier;
  summaryReason: string;
} {
  if (subject === 'READING') {
    const s1 = stepScores['step-r1'] ?? 0;
    const s2 = stepScores['step-r2'] ?? 0;
    const s3 = stepScores['step-r3'] ?? 0;

    // Step 1: Letter Sounds (pass >= 4)
    if (s1 < 4) {
      return {
        tier: 'RED',
        summaryReason: `Needs Intensive Support: Missed ${5 - s1} letter sound(s). Cannot yet reliably decode isolated phonemes.`
      };
    }
    // Step 2: CVC Words (pass >= 4)
    if (s2 < 4) {
      if (s2 <= 1) {
        return {
          tier: 'RED',
          summaryReason: 'Needs Intensive Support: Knows sounds but cannot blend into CVC words (scored 0-1/5).'
        };
      }
      return {
        tier: 'YELLOW',
        summaryReason: 'Emerging: Letter sounds known, but requires guided practice blending CVC words (scored 2-3/5).'
      };
    }
    // Step 3: Connected Story Reading & Comprehension (pass >= 3)
    if (s3 < 3) {
      return {
        tier: 'YELLOW',
        summaryReason: 'Emerging: Reads individual words accurately, but lacks fluency and comprehension on connected sentences.'
      };
    }
    return {
      tier: 'GREEN',
      summaryReason: 'On Track: Fluent reading of connected story with strong comprehension.'
    };
  }

  // MATH SUBJECT
  const m1 = stepScores['step-m1'] ?? 0;
  const m2 = stepScores['step-m2'] ?? 0;
  const m3 = stepScores['step-m3'] ?? 0;

  // Step 1: Number Recognition 1-99 (pass >= 4)
  if (m1 < 4) {
    return {
      tier: 'RED',
      summaryReason: `Needs Intensive Support: Stumbled on number identification (scored ${m1}/5). Needs concrete quantity grounding.`
    };
  }
  // Step 2: 1-Digit Subtraction (pass >= 3)
  if (m2 < 3) {
    if (m2 <= 1) {
      return {
        tier: 'RED',
        summaryReason: 'Needs Intensive Support: Recognizes numbers but unable to execute single-digit subtraction (0-1/4).'
      };
    }
    return {
      tier: 'YELLOW',
      summaryReason: 'Emerging: Grasps basic subtraction concepts but needs finger-counting/number line support (scored 2/4).'
    };
  }
  // Step 3: 2-Digit Subtraction with Regrouping (pass == 2)
  if (m3 < 2) {
    return {
      tier: 'YELLOW',
      summaryReason: 'Emerging: Strong on 1-digit math, but struggles with 10-bundle borrowing/regrouping in 2-digit subtraction.'
    };
  }
  return {
    tier: 'GREEN',
    summaryReason: 'On Track: Confident and accurate 2-digit subtraction with regrouping.'
  };
}

/**
 * Calculates primary class-level skill gaps deterministically.
 */
export function calculateClassGaps(
  subject: Subject,
  snapshots: StudentSkillSnapshot[],
  students: Student[]
): {
  totalCount: number;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  primaryGapText: string;
  recommendedAction: string;
} {
  const classStudentIds = new Set(students.map((s) => s.id));
  const classSnapshots = snapshots.filter((sn) => classStudentIds.has(sn.studentId) && sn.subject === subject);

  // Latest snapshot per student
  const latestByStudent = new Map<string, StudentSkillSnapshot>();
  classSnapshots.forEach((snap) => {
    const existing = latestByStudent.get(snap.studentId);
    if (!existing || new Date(snap.timestamp) > new Date(existing.timestamp)) {
      latestByStudent.set(snap.studentId, snap);
    }
  });

  const totalCount = students.length;
  let redCount = 0;
  let yellowCount = 0;
  let greenCount = 0;

  students.forEach((student) => {
    const snap = latestByStudent.get(student.id);
    const tier = snap ? snap.tier : 'RED'; // default unassessed to intensive support
    if (tier === 'RED') redCount++;
    else if (tier === 'YELLOW') yellowCount++;
    else greenCount++;
  });

  let primaryGapText = '';
  let recommendedAction = '';

  if (subject === 'READING') {
    if (redCount > yellowCount && redCount > greenCount) {
      primaryGapText = `${redCount} students (${Math.round((redCount / (totalCount || 1)) * 100)}%) cannot identify core letter sounds or blend CVC phonemes.`;
      recommendedAction = 'Dedicate 15 mins daily to tactile phonics drills: Floor Letter-Hop & Slate Sound Matches.';
    } else if (yellowCount >= redCount && yellowCount >= greenCount) {
      primaryGapText = `${yellowCount} students (${Math.round((yellowCount / (totalCount || 1)) * 100)}%) decode words slowly and need sentence fluency practice.`;
      recommendedAction = 'Use paired reading relays and stone word-building in groups of 4.';
    } else {
      primaryGapText = `Over ${Math.round((greenCount / (totalCount || 1)) * 100)}% of the cohort is reading connected text on track!`;
      recommendedAction = 'Use On-Track peers as reading buddies to support Yellow group learners.';
    }
  } else {
    if (redCount > yellowCount && redCount > greenCount) {
      primaryGapText = `${redCount} students (${Math.round((redCount / (totalCount || 1)) * 100)}%) struggle with number recognition 1–99 and basic counting quantities.`;
      recommendedAction = 'Introduce physical pebble counters and stick bundles for concrete quantity representation.';
    } else if (yellowCount >= redCount && yellowCount >= greenCount) {
      primaryGapText = `${yellowCount} students (${Math.round((yellowCount / (totalCount || 1)) * 100)}%) stumble on mental 1-digit subtraction and borrowing concept.`;
      recommendedAction = 'Focus on chalk number-line countdowns and unbundling physical tens sticks.';
    } else {
      primaryGapText = `Healthy math foundation: ${greenCount} students (${Math.round((greenCount / (totalCount || 1)) * 100)}%) have mastered 2-digit regrouping.`;
      recommendedAction = 'Introduce multi-step village store word problems on slates.';
    }
  }

  return {
    totalCount,
    redCount,
    yellowCount,
    greenCount,
    primaryGapText,
    recommendedAction
  };
}

/**
 * Inspects recent live tags and detects if a student is eligible for promotion or support check.
 * Explicit heuristic rule: 3 consecutive tags of the same polarity at the current tier.
 */
export function checkPromotionEligibility(
  student: Student,
  subject: Subject,
  currentTier: SkillTier,
  liveTags: LiveTagEvent[]
): PromotionSuggestion | null {
  // Filter tags for this student & subject, sorted descending by timestamp
  const studentTags = liveTags
    .filter((t) => t.studentId === student.id && t.subject === subject)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (studentTags.length < 3) return null;

  const recentThree = studentTags.slice(0, 3);
  const allMastered = recentThree.every((t) => t.tagType === 'PERFORMED_WELL');
  const allStruggling = recentThree.every((t) => t.tagType === 'STRUGGLING');

  if (allMastered) {
    if (currentTier === 'RED') {
      return {
        studentId: student.id,
        studentName: student.firstName,
        subject,
        currentTier: 'RED',
        suggestedTier: 'YELLOW',
        reason: 'Recorded 3 consecutive mastery tags in Intensive Support tasks.',
        consecutiveTagsCount: 3
      };
    }
    if (currentTier === 'YELLOW') {
      return {
        studentId: student.id,
        studentName: student.firstName,
        subject,
        currentTier: 'YELLOW',
        suggestedTier: 'GREEN',
        reason: 'Recorded 3 consecutive mastery tags in Emerging activities.',
        consecutiveTagsCount: 3
      };
    }
  }

  if (allStruggling) {
    if (currentTier === 'GREEN') {
      return {
        studentId: student.id,
        studentName: student.firstName,
        subject,
        currentTier: 'GREEN',
        suggestedTier: 'YELLOW',
        reason: 'Struggled on 3 consecutive On-Track activities. Reviewing foundation is advised.',
        consecutiveTagsCount: 3
      };
    }
    if (currentTier === 'YELLOW') {
      return {
        studentId: student.id,
        studentName: student.firstName,
        subject,
        currentTier: 'YELLOW',
        suggestedTier: 'RED',
        reason: 'Struggled on 3 consecutive Emerging activities. Intensive Support recommended.',
        consecutiveTagsCount: 3
      };
    }
  }

  return null;
}
