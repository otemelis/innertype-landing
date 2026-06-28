import { AssessmentResult, PersonalityScores, AttachmentScores, CommunicationScores, TypeScores } from '../types/assessment';
import { CombinedProfile } from '../types/profile';
import { COMBINED_ARCHETYPES } from '../data/resultTypes';

function getPersonalityScores(result: AssessmentResult): PersonalityScores {
  return result.scores as PersonalityScores;
}

function getAttachmentScores(result: AssessmentResult): AttachmentScores {
  return result.scores as AttachmentScores;
}

function getCommunicationScores(result: AssessmentResult): CommunicationScores {
  return result.scores as CommunicationScores;
}

function selectCombinedArchetype(
  personality?: AssessmentResult,
  relationship?: AssessmentResult,
  communication?: AssessmentResult,
  typeResult?: AssessmentResult
): string {
  const personalityKey = personality?.primaryType ?? '';
  const relationshipKey = relationship?.primaryType ?? '';
  const communicationKey = communication?.primaryType ?? '';
  const typeKey = typeResult?.primaryType ?? '';

  // Score each combined archetype
  const scores: Record<string, number> = {
    ReflectiveSage: 0,
    CalmArchitect: 0,
    PassionateIdealist: 0,
    GroundedExplorer: 0,
    IndependentConnector: 0,
    ExpressiveArchitect: 0,
    SensitiveGuide: 0,
    AdaptiveRealist: 0,
  };

  // Personality alignment
  const personalityMap: Record<string, Record<string, number>> = {
    ReflectiveExplorer: { ReflectiveSage: 3, IndependentConnector: 1, AdaptiveRealist: 1 },
    CalmStrategist: { CalmArchitect: 3, GroundedExplorer: 1, AdaptiveRealist: 1 },
    WarmConnector: { SensitiveGuide: 3, GroundedExplorer: 1, AdaptiveRealist: 1 },
    SensitiveVisionary: { PassionateIdealist: 3, SensitiveGuide: 1, AdaptiveRealist: 1 },
    ExpressiveIdealist: { ExpressiveArchitect: 2, PassionateIdealist: 2, GroundedExplorer: 1 },
    CuriousArchitect: { CalmArchitect: 2, ExpressiveArchitect: 2, GroundedExplorer: 1 },
    GroundedHarmonizer: { GroundedExplorer: 3, SensitiveGuide: 1, AdaptiveRealist: 1 },
    PrivateAnalyst: { ReflectiveSage: 2, IndependentConnector: 2, AdaptiveRealist: 1 },
  };

  // Relationship alignment
  const relationshipMap: Record<string, Record<string, number>> = {
    Secure: { GroundedExplorer: 2, CalmArchitect: 2, SensitiveGuide: 1 },
    Anxious: { PassionateIdealist: 3, SensitiveGuide: 2 },
    Avoidant: { IndependentConnector: 3, ReflectiveSage: 2 },
    FearfulAvoidant: { ReflectiveSage: 2, IndependentConnector: 1, AdaptiveRealist: 2 },
  };

  // Communication alignment
  const communicationMap: Record<string, Record<string, number>> = {
    DirectHarmonizer: { CalmArchitect: 2, GroundedExplorer: 2, ExpressiveArchitect: 1 },
    ReflectiveProcessor: { ReflectiveSage: 3, IndependentConnector: 1 },
    CalmStrategist: { CalmArchitect: 3, ReflectiveSage: 1 },
    ExpressiveConnector: { PassionateIdealist: 2, SensitiveGuide: 3 },
    IndependentProtector: { IndependentConnector: 3, ReflectiveSage: 1 },
  };

  // Apply personality scores
  if (personalityMap[personalityKey]) {
    for (const [archetype, score] of Object.entries(personalityMap[personalityKey])) {
      scores[archetype] = (scores[archetype] ?? 0) + score;
    }
  }

  // Apply relationship scores
  if (relationshipMap[relationshipKey]) {
    for (const [archetype, score] of Object.entries(relationshipMap[relationshipKey])) {
      scores[archetype] = (scores[archetype] ?? 0) + score;
    }
  }

  // Apply communication scores
  if (communicationMap[communicationKey]) {
    for (const [archetype, score] of Object.entries(communicationMap[communicationKey])) {
      scores[archetype] = (scores[archetype] ?? 0) + score;
    }
  }

  // Type alignment
  const typeMap: Record<string, Record<string, number>> = {
    INTJ: { ReflectiveSage: 3, CalmArchitect: 2 },
    INTP: { ReflectiveSage: 3, CalmArchitect: 2 },
    ENTJ: { CalmArchitect: 2, ExpressiveArchitect: 2, GroundedExplorer: 1 },
    ENTP: { CalmArchitect: 2, ExpressiveArchitect: 2, GroundedExplorer: 1 },
    INFJ: { ReflectiveSage: 2, PassionateIdealist: 2, SensitiveGuide: 1 },
    INFP: { PassionateIdealist: 2, ReflectiveSage: 2, SensitiveGuide: 1 },
    ENFJ: { PassionateIdealist: 2, SensitiveGuide: 2, GroundedExplorer: 1 },
    ENFP: { PassionateIdealist: 2, SensitiveGuide: 2, GroundedExplorer: 1 },
    ISTJ: { GroundedExplorer: 2, CalmArchitect: 2, AdaptiveRealist: 1 },
    ISFJ: { GroundedExplorer: 2, CalmArchitect: 2, AdaptiveRealist: 1 },
    ESTJ: { CalmArchitect: 2, GroundedExplorer: 2, ExpressiveArchitect: 1 },
    ESFJ: { CalmArchitect: 2, GroundedExplorer: 2, ExpressiveArchitect: 1 },
    ISTP: { IndependentConnector: 3, AdaptiveRealist: 1 },
    ISFP: { IndependentConnector: 3, AdaptiveRealist: 1 },
    ESTP: { ExpressiveArchitect: 2, IndependentConnector: 1, AdaptiveRealist: 2 },
    ESFP: { ExpressiveArchitect: 2, IndependentConnector: 1, AdaptiveRealist: 2 },
  };

  if (typeMap[typeKey]) {
    for (const [archetype, score] of Object.entries(typeMap[typeKey])) {
      scores[archetype] = (scores[archetype] ?? 0) + score;
    }
  }

  // Return highest scoring archetype
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best?.[0] ?? 'AdaptiveRealist';
}

export function synthesizeProfile(
  personality?: AssessmentResult,
  relationship?: AssessmentResult,
  communication?: AssessmentResult,
  typeResult?: AssessmentResult
): CombinedProfile | null {
  const completedCount = [personality, relationship, communication, typeResult].filter(Boolean).length;
  if (completedCount === 0) return null;

  const archetypeKey = selectCombinedArchetype(personality, relationship, communication, typeResult);
  const archetype = COMBINED_ARCHETYPES.find((a) => a.key === archetypeKey) ?? COMBINED_ARCHETYPES[7];

  // Build relationship pattern copy
  const relationshipPattern = relationship
    ? `${relationship.archetypeLabel} — ${(COMBINED_ARCHETYPES.find(a => a.key === archetypeKey)?.relationshipGuidance?.split('.')[0] ?? 'You value meaningful connection')}.`
    : 'Complete the Relationship Pattern assessment to reveal this dimension.';

  // Build communication style copy
  const communicationStyle = communication
    ? `${communication.archetypeLabel} — ${communication.summary.split('.')[0]}.`
    : 'Complete the Communication Style assessment to reveal this dimension.';

  // Work style
  const workStyle = archetype.workStyle;

  // Stress response
  const stressResponse = archetype.stressResponse;

  return {
    archetype: archetype.key,
    archetypeTagline: archetype.tagline,
    description: archetype.description,
    strengths: archetype.strengths,
    blindSpot: archetype.blindSpot,
    workStyle,
    relationshipPattern,
    communicationStyle,
    stressResponse,
    growthEdge: archetype.growthEdge,
  };
}

export function getCompletedAssessmentCount(
  personality?: AssessmentResult,
  relationship?: AssessmentResult,
  communication?: AssessmentResult,
  typeResult?: AssessmentResult
): number {
  return [personality, relationship, communication, typeResult].filter(Boolean).length;
}
