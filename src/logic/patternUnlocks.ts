export interface DiscoveredPattern {
  id: string;
  name: string;
  description: string;
}

type Tendency = 'high' | 'mid' | 'low';

// Per-section pattern definitions keyed as `assessmentId_sectionNumber`
const SECTION_PATTERNS: Record<string, Record<Tendency, DiscoveredPattern>> = {
  // ── Personality ──────────────────────────────────────────────────────────────
  personality_1: {
    high: {
      id: 'depth_seeking',
      name: 'Depth Seeking',
      description: 'You tend to stay inside an idea longer than most — extracting meaning before moving on.',
    },
    mid: {
      id: 'selective_curiosity',
      name: 'Selective Curiosity',
      description: 'You explore deeply when something earns your attention, and disengage quickly when it does not.',
    },
    low: {
      id: 'grounded_focus',
      name: 'Grounded Focus',
      description: 'You trust what is proven over what is novel. This makes you unusually good at follow-through.',
    },
  },
  personality_2: {
    high: {
      id: 'strategic_planning',
      name: 'Strategic Planning',
      description: 'You build a structure before you act — which gives you unusual reliability under pressure.',
    },
    mid: {
      id: 'adaptive_structure',
      name: 'Adaptive Structure',
      description: 'You move between planning and flexibility depending on what the situation actually demands.',
    },
    low: {
      id: 'intuitive_action',
      name: 'Intuitive Action',
      description: 'You trust your read of a situation before any formal plan — which gives you real speed and agility.',
    },
  },
  personality_3: {
    high: {
      id: 'social_energy',
      name: 'Social Energy',
      description: 'You gain real momentum from other people — and may slow down when left alone for too long.',
    },
    mid: {
      id: 'contextual_energy',
      name: 'Contextual Energy',
      description: 'You shift between social and solitary modes depending on what the situation asks from you.',
    },
    low: {
      id: 'internal_processing',
      name: 'Internal Processing',
      description: 'You do your best thinking privately, before the conversation — not during it.',
    },
  },
  personality_4: {
    high: {
      id: 'relational_warmth',
      name: 'Relational Warmth',
      description: 'You track what others need, often before they ask. This attentiveness builds deep trust over time.',
    },
    mid: {
      id: 'principled_cooperation',
      name: 'Principled Cooperation',
      description: 'You cooperate when values align — and hold your ground when they do not.',
    },
    low: {
      id: 'independent_judgment',
      name: 'Independent Judgment',
      description: 'You trust your own read of a situation before seeking consensus. Direct and decisive.',
    },
  },
  personality_5: {
    high: {
      id: 'emotional_depth',
      name: 'Emotional Depth',
      description: 'Your inner world is rich and detailed. You feel and notice more than most people realise.',
    },
    mid: {
      id: 'emotional_selectivity',
      name: 'Emotional Selectivity',
      description: 'You experience emotions fully when something matters, and compartmentalise when you choose.',
    },
    low: {
      id: 'steady_processing',
      name: 'Steady Processing',
      description: 'You stay level when others escalate. This makes you a stabilising presence in difficult moments.',
    },
  },
  // ── Relationship ──────────────────────────────────────────────────────────────
  relationship_1: {
    high: {
      id: 'deep_investment',
      name: 'Deep Investment',
      description: 'When you are in — a friendship, a relationship — you are genuinely and fully in.',
    },
    mid: {
      id: 'measured_closeness',
      name: 'Measured Closeness',
      description: 'You open gradually, and your investment tends to match what feels reciprocal and earned.',
    },
    low: {
      id: 'independence_orientation',
      name: 'Independence Orientation',
      description: 'You value relationships that leave you room to remain fully yourself without merging.',
    },
  },
  relationship_2: {
    high: {
      id: 'relational_security',
      name: 'Relational Security',
      description: 'You feel settled in close relationships without needing constant confirmation. This is rare.',
    },
    mid: {
      id: 'earned_trust',
      name: 'Earned Trust',
      description: 'You extend trust gradually, through consistent evidence — not first impressions or enthusiasm.',
    },
    low: {
      id: 'relational_vigilance',
      name: 'Relational Vigilance',
      description: 'You notice inconsistency in people early. This perceptiveness protects you — sometimes at a cost.',
    },
  },
  relationship_3: {
    high: {
      id: 'self_reliance',
      name: 'Self-Reliance',
      description: 'Your first instinct when something goes wrong is to handle it yourself. A form of real competence.',
    },
    mid: {
      id: 'selective_openness',
      name: 'Selective Openness',
      description: 'You share what feels safe, and keep the rest until trust is genuinely established.',
    },
    low: {
      id: 'openness_to_support',
      name: 'Openness to Support',
      description: 'You can let people in when you need them — which requires a kind of trust that not everyone manages.',
    },
  },
  relationship_4: {
    high: {
      id: 'proximity_seeking',
      name: 'Proximity Seeking',
      description: 'When things feel uncertain, you tend to seek connection — which comes from genuine care.',
    },
    mid: {
      id: 'adaptive_stress_response',
      name: 'Adaptive Response',
      description: 'Under stress, you may alternate between seeking connection and needing space. Both are real.',
    },
    low: {
      id: 'processing_time',
      name: 'Processing Time',
      description: 'When tension rises, you step back first. Space is how you return to clarity before re-engaging.',
    },
  },
  // ── Communication ─────────────────────────────────────────────────────────────
  communication_1: {
    high: {
      id: 'direct_expression',
      name: 'Direct Expression',
      description: 'You tend to say what you mean — and expect others to do the same. Ambiguity is frustrating for you.',
    },
    mid: {
      id: 'contextual_expression',
      name: 'Contextual Expression',
      description: 'You adjust how directly you communicate depending on who you are with and what is at stake.',
    },
    low: {
      id: 'careful_expression',
      name: 'Careful Expression',
      description: 'You choose words deliberately, editing internally before speaking. This produces real precision.',
    },
  },
  communication_2: {
    high: {
      id: 'direct_resolution',
      name: 'Direct Resolution',
      description: 'You prefer to address tension rather than let it sit. Unresolved conflict is uncomfortable for you.',
    },
    mid: {
      id: 'considered_resolution',
      name: 'Considered Resolution',
      description: 'You approach conflict thoughtfully — preferring to understand before responding.',
    },
    low: {
      id: 'conflict_processing_time',
      name: 'Conflict Processing Time',
      description: 'You need space before engaging with conflict productively. The pause is how you find clarity.',
    },
  },
  communication_3: {
    high: {
      id: 'clear_limits',
      name: 'Clear Limits',
      description: 'You know what you protect and can name it — which makes your relationships more honest over time.',
    },
    mid: {
      id: 'flexible_limits',
      name: 'Flexible Limits',
      description: 'Your limits adjust to context — firmer with those you trust less, more open with those you trust more.',
    },
    low: {
      id: 'relational_openness',
      name: 'Relational Openness',
      description: 'You tend toward transparency and accessibility — which creates trust quickly.',
    },
  },
  // ── Type ─────────────────────────────────────────────────────────────────────
  type_1: {
    high: {
      id: 'social_momentum',
      name: 'Social Momentum',
      description: 'You gain energy from people and environments. Interaction is fuel, not a cost — and it shows.',
    },
    mid: {
      id: 'adaptive_energy',
      name: 'Adaptive Energy',
      description: 'You move fluidly between social and solitary modes depending on what a situation asks from you.',
    },
    low: {
      id: 'private_focus',
      name: 'Private Focus',
      description: 'Your best thinking happens in quiet, before or after the conversation — not during it.',
    },
  },
  type_2: {
    high: {
      id: 'pattern_seeking',
      name: 'Pattern Seeking',
      description: 'You notice connections others miss. Your mind moves naturally toward what something could become.',
    },
    mid: {
      id: 'integrative_sight',
      name: 'Integrative Sight',
      description: 'You hold both the concrete and the abstract, drawing from each as the situation calls for it.',
    },
    low: {
      id: 'detail_anchoring',
      name: 'Detail Anchoring',
      description: 'You trust what is observable and proven. Your attention to specifics is a real form of precision.',
    },
  },
  type_3: {
    high: {
      id: 'values_led_judgment',
      name: 'Values-Led Judgment',
      description: 'You weigh the relational and human cost of decisions before anything else. This is a strength.',
    },
    mid: {
      id: 'balanced_reasoning',
      name: 'Balanced Reasoning',
      description: 'You hold both logic and impact in mind. You can reason precisely and still notice what it costs.',
    },
    low: {
      id: 'analytical_distance',
      name: 'Analytical Distance',
      description: 'You evaluate on the merits first. This gives you clarity others lose when emotion clouds the analysis.',
    },
  },
  type_4: {
    high: {
      id: 'adaptive_flow',
      name: 'Adaptive Flow',
      description: 'You stay open to what is emerging, keeping options alive until the right moment to commit.',
    },
    mid: {
      id: 'flexible_structure',
      name: 'Flexible Structure',
      description: 'You work best with a plan that can bend. Structure gives you direction; flexibility keeps you real.',
    },
    low: {
      id: 'planned_momentum',
      name: 'Planned Momentum',
      description: 'You build clarity through decisions. Closing options creates energy for you, not loss.',
    },
  },
};

function getSectionTendency(answerValues: number[]): Tendency {
  if (answerValues.length === 0) return 'mid';
  const avg = answerValues.reduce((a, b) => a + b, 0) / answerValues.length;
  if (avg >= 3.6) return 'high';
  if (avg <= 2.4) return 'low';
  return 'mid';
}

export function getPatternForSection(
  assessmentId: string,
  sectionNumber: number,
  sectionAnswerValues: number[]
): DiscoveredPattern | null {
  const key = `${assessmentId}_${sectionNumber}`;
  const patterns = SECTION_PATTERNS[key];
  if (!patterns) return null;
  const tendency = getSectionTendency(sectionAnswerValues);
  return patterns[tendency] ?? patterns.mid;
}
