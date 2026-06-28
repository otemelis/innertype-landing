export type PersonalityDimension = 'O' | 'C' | 'E' | 'A' | 'N';

export type AttachmentType = 'Secure' | 'Anxious' | 'Avoidant' | 'FearfulAvoidant';

export type CommunicationType =
  | 'DirectHarmonizer'
  | 'ReflectiveProcessor'
  | 'CalmStrategist'
  | 'ExpressiveConnector'
  | 'IndependentProtector';

export type AssessmentId = 'type' | 'personality' | 'relationship' | 'communication';

export interface AssessmentSection {
  number: number;
  title: string;
  tagline: string;
}

export interface AssessmentMeta {
  id: AssessmentId;
  title: string;
  subtitle: string;
  description: string;
  promise: string;
  methodologyNote: string;
  frameworkLabel?: string;
  estimatedMinutes: number;
  questionCount: number;
  sections: AssessmentSection[];
  accentColor: string;
  iconName: string;
}

export interface Question {
  id: string;
  text: string;
  dimension: string;
  reverse: boolean;
  section: number;
}

export interface UserAnswer {
  questionId: string;
  value: number; // 1–5
}

export interface AssessmentProgress {
  assessmentId: AssessmentId;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startedAt: string;
  lastUpdatedAt: string;
  completed: boolean;
}

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface PersonalityScores {
  O: number; // 0–100
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface AttachmentScores {
  Secure: number;
  Anxious: number;
  Avoidant: number;
  FearfulAvoidant: number;
}

export interface CommunicationScores {
  DirectHarmonizer: number;
  ReflectiveProcessor: number;
  CalmStrategist: number;
  ExpressiveConnector: number;
  IndependentProtector: number;
}

export interface TypeScores {
  EI: number; // 0–100, higher = Extraversion
  SN: number; // 0–100, higher = Intuition
  TF: number; // 0–100, higher = Feeling
  JP: number; // 0–100, higher = Perceiving
}

export interface AssessmentResult {
  assessmentId: AssessmentId;
  completedAt: string;
  archetype: string;
  archetypeLabel: string;
  archetypeTagline: string;
  scores: PersonalityScores | AttachmentScores | CommunicationScores | TypeScores;
  primaryType: string;
  secondaryType?: string;
  strengths: string[];
  blindSpot: string;
  summary: string;
  confidence: ConfidenceLevel;
  answers: UserAnswer[];
}
