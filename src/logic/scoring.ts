import { Question, UserAnswer, AssessmentResult, PersonalityScores, AttachmentScores, CommunicationScores, ConfidenceLevel, AssessmentId } from '../types/assessment';
import { personalityQuestions } from '../data/questions/personality';
import { relationshipQuestions } from '../data/questions/relationship';
import { communicationQuestions } from '../data/questions/communication';
import { PERSONALITY_ARCHETYPES, RELATIONSHIP_TYPES, COMMUNICATION_TYPES } from '../data/resultTypes';
import { calculateConfidence } from './confidence';

function scoreValue(rawValue: number, reverse: boolean): number {
  return reverse ? 6 - rawValue : rawValue;
}

function averageToPercent(total: number, count: number): number {
  if (count === 0) return 50;
  const avg = total / count; // 1–5
  return Math.round(((avg - 1) / 4) * 100);
}

// ─── Personality scoring ──────────────────────────────────────────────────────

function scorePersonality(answers: UserAnswer[]): PersonalityScores {
  const dims: Record<string, { total: number; count: number }> = {
    O: { total: 0, count: 0 },
    C: { total: 0, count: 0 },
    E: { total: 0, count: 0 },
    A: { total: 0, count: 0 },
    N: { total: 0, count: 0 },
  };

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  for (const q of personalityQuestions) {
    const raw = answerMap.get(q.id);
    if (raw == null) continue;
    const scored = scoreValue(raw, q.reverse);
    dims[q.dimension].total += scored;
    dims[q.dimension].count += 1;
  }

  return {
    O: averageToPercent(dims.O.total, dims.O.count),
    C: averageToPercent(dims.C.total, dims.C.count),
    E: averageToPercent(dims.E.total, dims.E.count),
    A: averageToPercent(dims.A.total, dims.A.count),
    N: averageToPercent(dims.N.total, dims.N.count),
  };
}

function getPersonalityArchetype(scores: PersonalityScores): string {
  const { O, C, E, A, N } = scores;
  const stability = 100 - N; // inverse of neuroticism

  // Score each archetype based on trait alignment
  const archetypeScores: Record<string, number> = {
    ReflectiveExplorer: O * 0.5 + (100 - E) * 0.3 + stability * 0.2,
    CalmStrategist: C * 0.4 + stability * 0.4 + (100 - E) * 0.2,
    WarmConnector: A * 0.45 + E * 0.35 + stability * 0.2,
    SensitiveVisionary: O * 0.4 + N * 0.4 + (100 - C) * 0.2,
    ExpressiveIdealist: O * 0.35 + E * 0.4 + A * 0.25,
    CuriousArchitect: O * 0.45 + C * 0.4 + stability * 0.15,
    GroundedHarmonizer: A * 0.4 + stability * 0.35 + C * 0.25,
    PrivateAnalyst: (100 - E) * 0.4 + C * 0.35 + O * 0.25,
  };

  return Object.entries(archetypeScores).sort((a, b) => b[1] - a[1])[0][0];
}

// ─── Relationship scoring ─────────────────────────────────────────────────────

function scoreRelationship(answers: UserAnswer[]): AttachmentScores {
  const types: Record<string, { total: number; count: number }> = {
    Secure: { total: 0, count: 0 },
    Anxious: { total: 0, count: 0 },
    Avoidant: { total: 0, count: 0 },
    FearfulAvoidant: { total: 0, count: 0 },
  };

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  for (const q of relationshipQuestions) {
    const raw = answerMap.get(q.id);
    if (raw == null) continue;
    const scored = scoreValue(raw, q.reverse);
    types[q.dimension].total += scored;
    types[q.dimension].count += 1;
  }

  // Proportional scoring: each type's share of total expressed points.
  // Ensures all bars show meaningful non-zero values even when one style dominates.
  const grandTotal =
    types.Secure.total + types.Anxious.total + types.Avoidant.total + types.FearfulAvoidant.total;

  if (grandTotal === 0) {
    return { Secure: 25, Anxious: 25, Avoidant: 25, FearfulAvoidant: 25 };
  }

  return {
    Secure: Math.round((types.Secure.total / grandTotal) * 100),
    Anxious: Math.round((types.Anxious.total / grandTotal) * 100),
    Avoidant: Math.round((types.Avoidant.total / grandTotal) * 100),
    FearfulAvoidant: Math.round((types.FearfulAvoidant.total / grandTotal) * 100),
  };
}

function getRelationshipType(scores: AttachmentScores): string {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getRelationshipSecondary(scores: AttachmentScores, primary: string): string | undefined {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length < 2) return undefined;
  const [, topScore] = sorted[0];
  const [secondKey, secondScore] = sorted[1];
  // Only report secondary if it's within 15 points of primary
  if (topScore - secondScore <= 15) return secondKey;
  return undefined;
}

// ─── Communication scoring ────────────────────────────────────────────────────

function scoreCommunication(answers: UserAnswer[]): CommunicationScores {
  const types: Record<string, { total: number; count: number }> = {
    DirectHarmonizer: { total: 0, count: 0 },
    ReflectiveProcessor: { total: 0, count: 0 },
    CalmStrategist: { total: 0, count: 0 },
    ExpressiveConnector: { total: 0, count: 0 },
    IndependentProtector: { total: 0, count: 0 },
  };

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  for (const q of communicationQuestions) {
    const raw = answerMap.get(q.id);
    if (raw == null) continue;
    const scored = scoreValue(raw, q.reverse);
    types[q.dimension].total += scored;
    types[q.dimension].count += 1;
  }

  // Proportional scoring: each type's share of total expressed points.
  const grandTotal =
    types.DirectHarmonizer.total +
    types.ReflectiveProcessor.total +
    types.CalmStrategist.total +
    types.ExpressiveConnector.total +
    types.IndependentProtector.total;

  if (grandTotal === 0) {
    return {
      DirectHarmonizer: 20,
      ReflectiveProcessor: 20,
      CalmStrategist: 20,
      ExpressiveConnector: 20,
      IndependentProtector: 20,
    };
  }

  return {
    DirectHarmonizer: Math.round((types.DirectHarmonizer.total / grandTotal) * 100),
    ReflectiveProcessor: Math.round((types.ReflectiveProcessor.total / grandTotal) * 100),
    CalmStrategist: Math.round((types.CalmStrategist.total / grandTotal) * 100),
    ExpressiveConnector: Math.round((types.ExpressiveConnector.total / grandTotal) * 100),
    IndependentProtector: Math.round((types.IndependentProtector.total / grandTotal) * 100),
  };
}

function getCommunicationType(scores: CommunicationScores): string {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

// ─── Master scoring function ──────────────────────────────────────────────────

export function computeResult(
  assessmentId: AssessmentId,
  answers: UserAnswer[]
): AssessmentResult {
  const completedAt = new Date().toISOString();
  const confidence = calculateConfidence(answers, assessmentId);

  if (assessmentId === 'personality') {
    const scores = scorePersonality(answers);
    const primaryKey = getPersonalityArchetype(scores);
    const archetype = PERSONALITY_ARCHETYPES.find((a) => a.key === primaryKey) ?? PERSONALITY_ARCHETYPES[0];

    return {
      assessmentId,
      completedAt,
      archetype: archetype.key,
      archetypeLabel: archetype.label,
      archetypeTagline: archetype.tagline,
      scores,
      primaryType: primaryKey,
      strengths: archetype.strengths,
      blindSpot: archetype.blindSpot,
      summary: archetype.description,
      confidence,
      answers,
    };
  }

  if (assessmentId === 'relationship') {
    const scores = scoreRelationship(answers);
    const primaryKey = getRelationshipType(scores);
    const secondaryKey = getRelationshipSecondary(scores, primaryKey);
    const type = RELATIONSHIP_TYPES.find((t) => t.key === primaryKey) ?? RELATIONSHIP_TYPES[0];

    return {
      assessmentId,
      completedAt,
      archetype: type.key,
      archetypeLabel: type.label,
      archetypeTagline: type.tagline,
      scores,
      primaryType: primaryKey,
      secondaryType: secondaryKey,
      strengths: type.strengths,
      blindSpot: type.blindSpot,
      summary: type.description,
      confidence,
      answers,
    };
  }

  // communication
  const scores = scoreCommunication(answers);
  const primaryKey = getCommunicationType(scores);
  const type = COMMUNICATION_TYPES.find((t) => t.key === primaryKey) ?? COMMUNICATION_TYPES[0];

  return {
    assessmentId,
    completedAt,
    archetype: type.key,
    archetypeLabel: type.label,
    archetypeTagline: type.tagline,
    scores,
    primaryType: primaryKey,
    strengths: type.strengths,
    blindSpot: type.blindSpot,
    summary: type.description,
    confidence,
    answers,
  };
}

export function getQuestionsForAssessment(id: string): Question[] {
  if (id === 'personality') return personalityQuestions;
  if (id === 'relationship') return relationshipQuestions;
  if (id === 'communication') return communicationQuestions;
  return [];
}
