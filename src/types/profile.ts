import { AssessmentId, AssessmentResult, AssessmentProgress } from './assessment';

export type PrimaryGoal =
  | 'understand_myself'
  | 'improve_relationships'
  | 'communicate_better'
  | 'work_style'
  | 'compare';

export interface UserProfile {
  onboardingComplete: boolean;
  primaryGoal?: PrimaryGoal;
  userName?: string;
  assessmentResults: Partial<Record<AssessmentId, AssessmentResult>>;
  assessmentProgress: Partial<Record<AssessmentId, AssessmentProgress>>;
  createdAt: string;
  isPremium: boolean;
}

export interface CombinedProfile {
  archetype: string;
  archetypeTagline: string;
  description: string;
  strengths: string[];
  blindSpot: string;
  workStyle: string;
  relationshipPattern: string;
  communicationStyle: string;
  stressResponse: string;
  growthEdge: string;
  thriveConditions: string;
  whatDrivesYou: string;
  relationshipGuidance: string;
}

export const EMPTY_PROFILE: UserProfile = {
  onboardingComplete: false,
  assessmentResults: {},
  assessmentProgress: {},
  createdAt: new Date().toISOString(),
  isPremium: false,
};
