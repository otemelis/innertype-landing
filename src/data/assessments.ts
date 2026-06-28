import { AssessmentMeta } from '../types/assessment';
import { Colors } from '../theme/colors';

export const ASSESSMENTS: AssessmentMeta[] = [
  {
    id: 'type',
    title: 'Personality Type',
    subtitle: 'Perception, decisions, energy & structure',
    description:
      'Discover your cognitive style — how you direct energy, take in information, make decisions, and approach structure.',
    promise: 'This dimension reveals how you navigate the world from the inside out.',
    methodologyNote:
      'Inspired by type-based personality frameworks. Designed for self-reflection, not official certification or clinical diagnosis.',
    frameworkLabel: 'Type-based personality framework',
    estimatedMinutes: 8,
    questionCount: 32,
    accentColor: Colors.type,
    iconName: 'compass-outline',
    sections: [
      { number: 1, title: 'Energy & Focus', tagline: 'What restores you and where attention naturally goes.' },
      { number: 2, title: 'Perception & Possibility', tagline: 'How you take in information and notice patterns.' },
      { number: 3, title: 'Decisions & Values', tagline: 'How you weigh logic, impact, fairness, and feeling.' },
      { number: 4, title: 'Structure & Flow', tagline: 'How you approach plans, closure, flexibility, and momentum.' },
    ],
  },
  {
    id: 'personality',
    title: 'Personality Traits',
    subtitle: 'Thinking, energy, structure & emotion',
    description:
      'Understand how you think, make decisions, seek novelty, and respond to pressure. Five core dimensions that run through everything you do.',
    promise: 'This dimension reveals how you organize your inner world.',
    methodologyNote:
      'Built on Big Five personality research. Designed for self-reflection and personal insight — not clinical diagnosis.',
    frameworkLabel: 'Big Five personality model',
    estimatedMinutes: 12,
    questionCount: 50,
    accentColor: Colors.personality,
    iconName: 'prism-outline',
    sections: [
      { number: 1, title: 'Curiosity & Openness', tagline: 'How you explore and experience the world.' },
      { number: 2, title: 'Structure & Direction', tagline: 'How you organize, plan, and follow through.' },
      { number: 3, title: 'Energy & Connection', tagline: 'How you engage with others and your environment.' },
      { number: 4, title: 'Warmth & Cooperation', tagline: 'How you relate to and care for others.' },
      { number: 5, title: 'Emotional Sensitivity', tagline: 'How you experience and process emotions.' },
    ],
  },
  {
    id: 'relationship',
    title: 'Relationship Pattern',
    subtitle: 'Closeness, reassurance & independence',
    description:
      'Understand how you seek closeness, protect yourself, and build trust. Patterns that show up in every relationship you value.',
    promise: 'This dimension shows how you connect, protect yourself, and build trust.',
    methodologyNote:
      'Inspired by attachment theory. Designed to explore patterns, not label you permanently.',
    frameworkLabel: 'Attachment theory',
    estimatedMinutes: 8,
    questionCount: 32,
    accentColor: Colors.relationship,
    iconName: 'heart-outline',
    sections: [
      { number: 1, title: 'Seeking Closeness', tagline: 'How you approach emotional intimacy.' },
      { number: 2, title: 'Trust & Security', tagline: 'How stable and settled you feel in relationships.' },
      { number: 3, title: 'Independence & Vulnerability', tagline: 'How you balance self-reliance and openness.' },
      { number: 4, title: 'Connection Under Stress', tagline: 'How you respond when relationships feel uncertain.' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Style',
    subtitle: 'Conflict, boundaries & repair',
    description:
      'See how you express needs, navigate disagreement, set limits, and reconnect after tension. The patterns that shape how people experience conversations with you.',
    promise: 'This dimension maps how you express, protect, and repair in conversation.',
    methodologyNote:
      'Based on communication and conflict-style research. Results are prompts for self-reflection, not a verdict.',
    frameworkLabel: 'NVC & conflict style research',
    estimatedMinutes: 6,
    questionCount: 28,
    accentColor: Colors.communication,
    iconName: 'chatbubble-outline',
    sections: [
      { number: 1, title: 'How You Express Yourself', tagline: 'Your natural voice in conversations.' },
      { number: 2, title: 'How You Navigate Conflict', tagline: 'Your approach when tension arises.' },
      { number: 3, title: 'Boundaries & Connection Needs', tagline: 'What you protect and what you open.' },
    ],
  },
];

export function getAssessment(id: string): AssessmentMeta | undefined {
  return ASSESSMENTS.find((a) => a.id === id);
}
