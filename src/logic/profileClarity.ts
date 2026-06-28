import { UserProfile } from '../types/profile';

const QUESTION_COUNTS = {
  type: 32,
  personality: 50,
  relationship: 32,
  communication: 28,
} as const;

const COMPLETE_POINTS = {
  type: 25,
  personality: 25,
  relationship: 25,
  communication: 25,
} as const;

const PARTIAL_POINTS = {
  type: 20,
  personality: 20,
  relationship: 20,
  communication: 20,
} as const;

export function calculateProfileClarity(profile: UserProfile): number {
  let clarity = 0;

  const ids = ['type', 'personality', 'relationship', 'communication'] as const;
  for (const id of ids) {
    const result = profile.assessmentResults[id];
    const progress = profile.assessmentProgress[id];

    if (result) {
      clarity += COMPLETE_POINTS[id];
    } else if (progress && !progress.completed && progress.answers.length > 0) {
      const ratio = progress.answers.length / QUESTION_COUNTS[id];
      clarity += Math.round(ratio * PARTIAL_POINTS[id]);
    }
  }

  return Math.min(100, clarity);
}

export function calculateLiveClarity(
  profile: UserProfile,
  assessmentId: 'type' | 'personality' | 'relationship' | 'communication',
  currentAnswerCount: number
): number {
  const fakeProgress = {
    assessmentId,
    currentQuestionIndex: currentAnswerCount,
    answers: Array(currentAnswerCount).fill({ questionId: '', value: 3 }),
    startedAt: '',
    lastUpdatedAt: '',
    completed: false,
  };
  const fakeProfile = {
    ...profile,
    assessmentProgress: {
      ...profile.assessmentProgress,
      [assessmentId]: fakeProgress,
    },
    assessmentResults: { ...profile.assessmentResults, [assessmentId]: undefined },
  } as UserProfile;
  return calculateProfileClarity(fakeProfile);
}

export function getClarityLabel(clarity: number): string {
  if (clarity === 0) return 'Not yet started';
  if (clarity < 15) return 'Just beginning';
  if (clarity < 35) return 'Taking shape';
  if (clarity < 55) return 'Becoming clearer';
  if (clarity < 75) return 'Nearly complete';
  if (clarity < 100) return 'Almost fully revealed';
  return 'Fully revealed';
}

export function getClarityPhrase(clarity: number): string {
  if (clarity === 0) return 'Complete your first assessment to begin your reveal.';
  if (clarity < 15) return 'Your profile is just beginning to take shape.';
  if (clarity < 35) return 'Patterns are starting to emerge.';
  if (clarity < 55) return 'Your profile is becoming clearer.';
  if (clarity < 75) return 'Your InnerType is coming into focus.';
  if (clarity < 100) return 'Your profile is nearly complete.';
  return 'Your InnerType is fully revealed.';
}
