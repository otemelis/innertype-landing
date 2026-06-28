import { UserAnswer, ConfidenceLevel } from '../types/assessment';
import { personalityQuestions } from '../data/questions/personality';
import { relationshipQuestions } from '../data/questions/relationship';
import { communicationQuestions } from '../data/questions/communication';

function getNeutralRatio(answers: UserAnswer[]): number {
  const neutrals = answers.filter((a) => a.value === 3).length;
  return neutrals / answers.length;
}

function getReverseConsistencyScore(answers: UserAnswer[], assessmentId: string): number {
  const questions =
    assessmentId === 'personality'
      ? personalityQuestions
      : assessmentId === 'relationship'
      ? relationshipQuestions
      : communicationQuestions;

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  let inconsistencies = 0;
  let reversePairs = 0;

  // Group by dimension
  const byDimension = new Map<string, { id: string; reverse: boolean }[]>();
  for (const q of questions) {
    const group = byDimension.get(q.dimension) ?? [];
    group.push({ id: q.id, reverse: q.reverse });
    byDimension.set(q.dimension, group);
  }

  for (const [, qs] of byDimension) {
    const normal = qs.filter((q) => !q.reverse);
    const reversed = qs.filter((q) => q.reverse);

    if (normal.length === 0 || reversed.length === 0) continue;

    const normalAvg = normal.reduce((sum, q) => sum + (answerMap.get(q.id) ?? 3), 0) / normal.length;
    const reversedAvg = reversed.reduce((sum, q) => sum + (answerMap.get(q.id) ?? 3), 0) / reversed.length;

    // For a consistent responder: normal and reversed scores should be inversely related
    // If both are high (4+) or both are low (1-2), that's suspicious
    const bothHigh = normalAvg >= 3.8 && reversedAvg >= 3.8;
    const bothLow = normalAvg <= 2.2 && reversedAvg <= 2.2;

    if (bothHigh || bothLow) inconsistencies++;
    reversePairs++;
  }

  return reversePairs > 0 ? inconsistencies / reversePairs : 0;
}

export function calculateConfidence(answers: UserAnswer[], assessmentId: string): ConfidenceLevel {
  if (answers.length === 0) return 'Low';

  const neutralRatio = getNeutralRatio(answers);
  const inconsistencyRatio = getReverseConsistencyScore(answers, assessmentId);
  const completionRatio = answers.length > 0 ? 1 : 0; // already completed if we're scoring

  // Penalty scoring
  let penalties = 0;

  if (neutralRatio > 0.5) penalties += 2; // More than half neutral answers
  else if (neutralRatio > 0.3) penalties += 1;

  if (inconsistencyRatio > 0.5) penalties += 2;
  else if (inconsistencyRatio > 0.25) penalties += 1;

  if (penalties >= 3) return 'Low';
  if (penalties >= 1) return 'Medium';
  return 'High';
}
