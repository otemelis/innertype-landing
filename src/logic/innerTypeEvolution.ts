import { AssessmentResult } from '../types/assessment';
import { COMBINED_ARCHETYPES } from '../data/resultTypes';

export type InnerTypePhase = 'unknown' | 'emerging' | 'partial' | 'complete';

export interface InnerTypeState {
  phase: InnerTypePhase;
  /** Main label to display prominently */
  displayLabel: string;
  /** Short supporting tag line shown under the label */
  subLabel: string;
  /** One-line status description */
  statusLine: string;
  completedCount: number;
}

// ── Adjective maps ────────────────────────────────────────────────────────────

const PERSONALITY_ADJ: Record<string, string> = {
  ReflectiveExplorer: 'Reflective',
  CalmStrategist: 'Calm',
  WarmConnector: 'Steady',
  SensitiveVisionary: 'Intuitive',
  ExpressiveIdealist: 'Expressive',
  CuriousArchitect: 'Curious',
  GroundedHarmonizer: 'Grounded',
  PrivateAnalyst: 'Private',
};

const RELATIONSHIP_ADJ: Record<string, string> = {
  Secure: 'Open',
  Anxious: 'Invested',
  Avoidant: 'Independent',
  FearfulAvoidant: 'Complex',
};

const COMMUNICATION_ADJ: Record<string, string> = {
  DirectHarmonizer: 'Direct',
  ReflectiveProcessor: 'Reflective',
  CalmStrategist: 'Strategic',
  ExpressiveConnector: 'Expressive',
  IndependentProtector: 'Private',
};

const TYPE_ADJ: Record<string, string> = {
  INTJ: 'Strategic', INTP: 'Analytical', ENTJ: 'Decisive', ENTP: 'Inventive',
  INFJ: 'Visionary', INFP: 'Idealistic', ENFJ: 'Catalytic', ENFP: 'Expansive',
  ISTJ: 'Grounded', ISFJ: 'Sustaining', ESTJ: 'Directing', ESFJ: 'Organizing',
  ISTP: 'Adaptive', ISFP: 'Attentive', ESTP: 'Initiating', ESFP: 'Expressive',
};

// Second-word nouns used when two assessments are complete
const RELATIONSHIP_NOUN: Record<string, string> = {
  Secure: 'Connector',
  Anxious: 'Connector',
  Avoidant: 'Builder',
  FearfulAvoidant: 'Explorer',
};

const COMMUNICATION_NOUN: Record<string, string> = {
  DirectHarmonizer: 'Harmonizer',
  ReflectiveProcessor: 'Analyst',
  CalmStrategist: 'Strategist',
  ExpressiveConnector: 'Connector',
  IndependentProtector: 'Protector',
};

// ── Combined archetype scoring (duplicated from profileSynthesis to avoid circular dep) ──

function selectCombinedKey(
  personalityKey: string,
  relationshipKey: string,
  communicationKey: string,
  typeKey: string = ''
): string {
  const scores: Record<string, number> = {
    ReflectiveSage: 0, CalmArchitect: 0, PassionateIdealist: 0,
    GroundedExplorer: 0, IndependentConnector: 0, ExpressiveArchitect: 0,
    SensitiveGuide: 0, AdaptiveRealist: 0,
  };

  const pMap: Record<string, Record<string, number>> = {
    ReflectiveExplorer: { ReflectiveSage: 3, IndependentConnector: 1, AdaptiveRealist: 1 },
    CalmStrategist: { CalmArchitect: 3, GroundedExplorer: 1, AdaptiveRealist: 1 },
    WarmConnector: { SensitiveGuide: 3, GroundedExplorer: 1, AdaptiveRealist: 1 },
    SensitiveVisionary: { PassionateIdealist: 3, SensitiveGuide: 1, AdaptiveRealist: 1 },
    ExpressiveIdealist: { ExpressiveArchitect: 2, PassionateIdealist: 2, GroundedExplorer: 1 },
    CuriousArchitect: { CalmArchitect: 2, ExpressiveArchitect: 2, GroundedExplorer: 1 },
    GroundedHarmonizer: { GroundedExplorer: 3, SensitiveGuide: 1, AdaptiveRealist: 1 },
    PrivateAnalyst: { ReflectiveSage: 2, IndependentConnector: 2, AdaptiveRealist: 1 },
  };
  const rMap: Record<string, Record<string, number>> = {
    Secure: { GroundedExplorer: 2, CalmArchitect: 2, SensitiveGuide: 1 },
    Anxious: { PassionateIdealist: 3, SensitiveGuide: 2 },
    Avoidant: { IndependentConnector: 3, ReflectiveSage: 2 },
    FearfulAvoidant: { ReflectiveSage: 2, IndependentConnector: 1, AdaptiveRealist: 2 },
  };
  const cMap: Record<string, Record<string, number>> = {
    DirectHarmonizer: { CalmArchitect: 2, GroundedExplorer: 2, ExpressiveArchitect: 1 },
    ReflectiveProcessor: { ReflectiveSage: 3, IndependentConnector: 1 },
    CalmStrategist: { CalmArchitect: 3, ReflectiveSage: 1 },
    ExpressiveConnector: { PassionateIdealist: 2, SensitiveGuide: 3 },
    IndependentProtector: { IndependentConnector: 3, ReflectiveSage: 1 },
  };

  const tMap: Record<string, Record<string, number>> = {
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

  for (const [k, v] of Object.entries(pMap[personalityKey] ?? {})) scores[k] = (scores[k] ?? 0) + v;
  for (const [k, v] of Object.entries(rMap[relationshipKey] ?? {})) scores[k] = (scores[k] ?? 0) + v;
  for (const [k, v] of Object.entries(cMap[communicationKey] ?? {})) scores[k] = (scores[k] ?? 0) + v;
  for (const [k, v] of Object.entries(tMap[typeKey] ?? {})) scores[k] = (scores[k] ?? 0) + v;

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'AdaptiveRealist';
}

// ── Main export ───────────────────────────────────────────────────────────────

export function getInnerTypeState(
  personality?: AssessmentResult,
  relationship?: AssessmentResult,
  communication?: AssessmentResult,
  typeResult?: AssessmentResult,
): InnerTypeState {
  const completedCount = [personality, relationship, communication, typeResult].filter(Boolean).length;

  if (completedCount === 0) {
    return {
      phase: 'unknown',
      displayLabel: 'Unknown',
      subLabel: 'Complete your first assessment to reveal your first pattern.',
      statusLine: 'Begin your first assessment to start the reveal.',
      completedCount: 0,
    };
  }

  // Derive first adjective from whichever was completed — typeResult checked first
  let adjective = 'Reflective';
  if (typeResult) adjective = TYPE_ADJ[typeResult.archetype] ?? 'Strategic';
  else if (personality) adjective = PERSONALITY_ADJ[personality.archetype] ?? 'Reflective';
  else if (relationship) adjective = RELATIONSHIP_ADJ[relationship.archetype] ?? 'Open';
  else if (communication) adjective = COMMUNICATION_ADJ[communication.archetype] ?? 'Direct';

  if (completedCount === 1) {
    return {
      phase: 'emerging',
      displayLabel: adjective,
      subLabel: 'First signal revealed — three dimensions remaining.',
      statusLine: 'One dimension mapped. Three more to complete your InnerType.',
      completedCount: 1,
    };
  }

  // Two completed — form a two-word partial label
  if (completedCount === 2) {
    let noun = 'Connector';
    if (typeResult && personality) noun = PERSONALITY_ADJ[personality.archetype] ? 'Thinker' : 'Connector';
    else if (personality && relationship) noun = RELATIONSHIP_NOUN[relationship.archetype] ?? 'Connector';
    else if (personality && communication) noun = COMMUNICATION_NOUN[communication.archetype] ?? 'Strategist';
    else if (relationship && communication) noun = COMMUNICATION_NOUN[communication.archetype] ?? 'Connector';
    else if (typeResult && relationship) noun = RELATIONSHIP_NOUN[relationship.archetype] ?? 'Connector';
    else if (typeResult && communication) noun = COMMUNICATION_NOUN[communication.archetype] ?? 'Strategist';

    return {
      phase: 'partial',
      displayLabel: `${adjective} ${noun}`,
      subLabel: 'Two dimensions mapped — two remaining.',
      statusLine: 'Your InnerType is taking shape. Two more assessments to reveal it fully.',
      completedCount: 2,
    };
  }

  if (completedCount === 3) {
    // Strong partial — show two-word label, indicate one more dimension
    let noun = 'Connector';
    if (relationship) noun = RELATIONSHIP_NOUN[relationship.archetype] ?? 'Connector';
    else if (communication) noun = COMMUNICATION_NOUN[communication.archetype] ?? 'Strategist';
    return {
      phase: 'partial',
      displayLabel: `${adjective} ${noun}`,
      subLabel: 'Three dimensions mapped — one remaining.',
      statusLine: 'Your InnerType is nearly complete. One more assessment to fully reveal it.',
      completedCount: 3,
    };
  }

  // All four complete — use the full combined archetype label
  const key = selectCombinedKey(
    personality?.archetype ?? '',
    relationship?.archetype ?? '',
    communication?.archetype ?? '',
    typeResult?.archetype ?? ''
  );
  const archetype = COMBINED_ARCHETYPES.find((a) => a.key === key);

  return {
    phase: 'complete',
    displayLabel: archetype?.label ?? 'Reflective Architect',
    subLabel: archetype?.tagline ?? '',
    statusLine: 'Profile complete. All four dimensions revealed.',
    completedCount: 4,
  };
}
