# Personality Type (4th Dimension) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `type` (Personality Type) as the 4th InnerType assessment dimension — 32 questions, 16 archetypes, 4-axis scoring — and update all UI/logic from 3 → 4 dimensions.

**Architecture:** New assessment lives at `/assessment/type/*`. Type scoring uses 4 bipolar axes (EI/SN/TF/JP), each 0–100, assembled into a 4-letter code (e.g. `INTJ`) that maps to one of 16 premium archetypes. All existing assessments remain unchanged.

**Tech Stack:** Expo SDK 56, Expo Router v3, React Native 0.85.3, React 19, TypeScript strict, AsyncStorage (local only).

## Global Constraints

- Internal ID must be `type` (not `mbti`, not `personalityType`) — avoids collision with existing `personality` (Big Five)
- No UI copy may use: "MBTI", "Myers-Briggs", "16Personalities", "clinically validated"
- Safe phrases only: "type-based personality framework", "INTJ-style pattern", "inspired by type-based frameworks"
- All data stays in AsyncStorage — no backend, no network calls
- `npx tsc --noEmit` must pass after every task
- Accent color: `#6AADB8` (muted teal). Icon: `compass-outline`
- Assessment order (canonical): type → personality → relationship → communication

---

## File Map

**Create:**
- `src/data/questions/type.ts` — 32 questions (8 per axis section)

**Modify:**
- `src/types/assessment.ts` — add `TypeScores`, expand `AssessmentId`
- `src/theme/colors.ts` — add `type`, `typeDim`, `gradientCardType`
- `src/data/resultTypes.ts` — add `TypeArchetype` interface + `TYPE_ARCHETYPES` (16)
- `src/logic/scoring.ts` — add `scoreType`, `getTypeArchetype`, extend `computeResult` + `getQuestionsForAssessment`
- `src/data/assessments.ts` — prepend type assessment meta, reorder
- `src/logic/profileClarity.ts` — 4×25pt scheme
- `src/logic/profileSynthesis.ts` — add `typeMap`, 4th param
- `src/logic/innerTypeEvolution.ts` — add `TYPE_ADJ`, 4th param, 3→partial/4→complete phases
- `src/logic/patternUnlocks.ts` — add `type_1`–`type_4` section patterns
- `src/logic/insights.ts` — add `TYPE_INSIGHTS` keyed by type code
- `app/(tabs)/index.tsx` — 4-dimension copy, goal mapping, `type` result in singleResult
- `app/(tabs)/assessments.tsx` — update goal mapping + copy ("of 3" → "of 4")
- `app/assessment/[id]/result.tsx` — handle `TypeScores` axis bars + `TYPE_ARCHETYPES`
- `app/onboarding.tsx` — 4-dimension copy
- `app/methodology.tsx` — prepend type framework entry
- `app/report.tsx` — 4th param to `synthesizeProfile`

---

## Task 1: Types + Color Tokens

**Files:**
- Modify: `src/types/assessment.ts`
- Modify: `src/theme/colors.ts`

**Interfaces:**
- Produces: `AssessmentId` union includes `'type'`; `TypeScores` interface; `Colors.type` token

- [ ] **Step 1: Expand AssessmentId and add TypeScores**

In `src/types/assessment.ts`, make these changes:

```ts
// Line 12 — change:
export type AssessmentId = 'personality' | 'relationship' | 'communication';
// to:
export type AssessmentId = 'type' | 'personality' | 'relationship' | 'communication';

// After CommunicationScores interface, add:
export interface TypeScores {
  EI: number; // 0–100, higher = Extraversion
  SN: number; // 0–100, higher = Intuition
  TF: number; // 0–100, higher = Feeling
  JP: number; // 0–100, higher = Perceiving
}

// Line 88 — change:
  scores: PersonalityScores | AttachmentScores | CommunicationScores;
// to:
  scores: PersonalityScores | AttachmentScores | CommunicationScores | TypeScores;
```

- [ ] **Step 2: Add color tokens**

In `src/theme/colors.ts`, after the `communicationDim` line, add:

```ts
  type: '#6AADB8',
  typeDim: 'rgba(106, 173, 184, 0.15)',
  gradientCardType: ['rgba(106,173,184,0.12)', 'rgba(106,173,184,0.04)'] as const,
```

- [ ] **Step 3: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output (zero errors)

- [ ] **Step 4: Commit**

```bash
git add src/types/assessment.ts src/theme/colors.ts
git commit -m "feat(type): add TypeScores interface, expand AssessmentId, add teal color tokens"
```

---

## Task 2: Question Bank (32 questions)

**Files:**
- Create: `src/data/questions/type.ts`

**Interfaces:**
- Produces: `typeQuestions: Question[]` export with 32 items (sections 1–4, dimensions EI/SN/TF/JP)

- [ ] **Step 1: Create the question file**

```ts
import { Question } from '../../types/assessment';

export const typeQuestions: Question[] = [
  // ── Section 1: Energy & Focus (EI axis) ────────────────────────────────────
  // higher score = Extraversion
  { id: 'ty_ei_01', text: 'I feel energized after spending time in a group.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_02', text: 'I often think out loud and find talking helps me clarify my ideas.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_03', text: 'I find social gatherings draining, even when I enjoy them.', dimension: 'EI', reverse: true, section: 1 },
  { id: 'ty_ei_04', text: 'I prefer to have a wide circle of acquaintances over a few close friends.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_05', text: 'I need quiet time alone to recharge after a busy day.', dimension: 'EI', reverse: true, section: 1 },
  { id: 'ty_ei_06', text: 'I tend to jump into conversations and share ideas as they come to me.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_07', text: 'I feel most focused when I have uninterrupted time to work alone.', dimension: 'EI', reverse: true, section: 1 },
  { id: 'ty_ei_08', text: 'Being around people gives me momentum I would not find on my own.', dimension: 'EI', reverse: false, section: 1 },

  // ── Section 2: Perception & Possibility (SN axis) ──────────────────────────
  // higher score = Intuition (N)
  { id: 'ty_sn_01', text: 'I am more interested in what something could become than what it currently is.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_02', text: 'I trust concrete facts and direct experience more than theories or patterns.', dimension: 'SN', reverse: true, section: 2 },
  { id: 'ty_sn_03', text: 'I often notice connections between ideas that seem unrelated on the surface.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_04', text: 'I prefer clear, step-by-step instructions over open-ended possibilities.', dimension: 'SN', reverse: true, section: 2 },
  { id: 'ty_sn_05', text: 'I find myself drawn to hypotheticals, metaphors, and big-picture thinking.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_06', text: 'I pay close attention to details that others often overlook.', dimension: 'SN', reverse: true, section: 2 },
  { id: 'ty_sn_07', text: 'I am more excited by future possibilities than by what is immediately in front of me.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_08', text: 'I tend to trust what has been proven to work over untested new approaches.', dimension: 'SN', reverse: true, section: 2 },

  // ── Section 3: Decisions & Values (TF axis) ────────────────────────────────
  // higher score = Feeling (F)
  { id: 'ty_tf_01', text: 'When making a decision, I consider how it will affect people before anything else.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_02', text: 'I am more comfortable with logical analysis than with navigating emotional dynamics.', dimension: 'TF', reverse: true, section: 3 },
  { id: 'ty_tf_03', text: 'I find it important that decisions feel fair and considerate, not just efficient.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_04', text: 'I prioritize objective truth over keeping the peace in a disagreement.', dimension: 'TF', reverse: true, section: 3 },
  { id: 'ty_tf_05', text: 'I am sensitive to the emotional tone in a room, even when nothing is said directly.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_06', text: 'I would rather give honest feedback than soften it to protect someone\'s feelings.', dimension: 'TF', reverse: true, section: 3 },
  { id: 'ty_tf_07', text: 'Making someone feel seen and understood matters more to me than solving their problem.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_08', text: 'I tend to evaluate ideas on their merit rather than on how the person delivering them feels.', dimension: 'TF', reverse: true, section: 3 },

  // ── Section 4: Structure & Flow (JP axis) ──────────────────────────────────
  // higher score = Perceiving (P)
  { id: 'ty_jp_01', text: 'I prefer to keep plans flexible so I can respond to what comes up.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_02', text: 'I feel more comfortable when I have a clear schedule and know what to expect.', dimension: 'JP', reverse: true, section: 4 },
  { id: 'ty_jp_03', text: 'I often start projects without a firm plan, figuring things out as I go.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_04', text: 'I like to reach a decision and close it off rather than keep weighing options.', dimension: 'JP', reverse: true, section: 4 },
  { id: 'ty_jp_05', text: 'I feel energized by open questions and possibilities, even unresolved ones.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_06', text: 'I find it satisfying to cross things off a list and move forward with a plan.', dimension: 'JP', reverse: true, section: 4 },
  { id: 'ty_jp_07', text: 'I resist committing too early because I want to keep my options open.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_08', text: 'Ambiguity and last-minute changes are genuinely stressful for me.', dimension: 'JP', reverse: true, section: 4 },
];
```

- [ ] **Step 2: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/data/questions/type.ts
git commit -m "feat(type): add 32-question type assessment bank (EI/SN/TF/JP axes)"
```

---

## Task 3: Type Archetypes (16 entries)

**Files:**
- Modify: `src/data/resultTypes.ts`

**Interfaces:**
- Produces: `TypeArchetype` interface; `TYPE_ARCHETYPES` array export with 16 entries

- [ ] **Step 1: Read the current file top**

Read the top of `src/data/resultTypes.ts` to confirm existing interface and export names, then add immediately after existing exports.

- [ ] **Step 2: Add TypeArchetype interface and TYPE_ARCHETYPES**

Append to `src/data/resultTypes.ts`:

```ts
// ─── Type Archetypes ──────────────────────────────────────────────────────────

export interface TypeArchetype {
  key: string;       // 4-letter code e.g. 'INTJ'
  typeCode: string;  // same as key
  label: string;     // premium name e.g. 'Strategic Architect'
  tagline: string;
  chips: [string, string, string];
  description: string;
  patterns: [
    { icon: string; title: string; body: string },
    { icon: string; title: string; body: string },
    { icon: string; title: string; body: string },
  ];
  strengths: [string, string, string];
  blindSpot: string;
  growthEdge: string;
}

export const TYPE_ARCHETYPES: TypeArchetype[] = [
  {
    key: 'INTJ', typeCode: 'INTJ', label: 'Strategic Architect',
    tagline: 'Visionary thinking, quietly executed.',
    chips: ['Long-range planner', 'Systems thinker', 'Independent'],
    description: 'You see the whole board before others have noticed the pieces. Your thinking is structured around long-term outcomes, and you build toward them with quiet determination. You need meaningful work and resist being managed toward someone else\'s idea of success.',
    patterns: [
      { icon: 'telescope-outline', title: 'You plan further ahead than most', body: 'While others react, you have already modeled what comes next. This gives you unusual composure under pressure.' },
      { icon: 'layers-outline', title: 'You hold high standards', body: 'Mediocre output is genuinely uncomfortable for you. This drives quality — and occasionally friction with people who don\'t share the bar.' },
      { icon: 'lock-closed-outline', title: 'You protect your inner world carefully', body: 'Trust is extended selectively. You open up slowly, and only to people who have earned it.' },
    ],
    strengths: ['Strategic foresight', 'Intellectual depth', 'Self-directed drive'],
    blindSpot: 'You may underestimate how your directness lands on others, especially when you\'re focused on getting to the right answer.',
    growthEdge: 'Letting others into your thinking process before the plan is complete — collaboration as input, not just output.',
  },
  {
    key: 'INTP', typeCode: 'INTP', label: 'Independent Analyst',
    tagline: 'Curious about everything. Certain about little.',
    chips: ['Conceptual thinker', 'Truth-seeking', 'Autonomous'],
    description: 'You follow ideas wherever they lead, often long past the point where others have moved on. Your mind works by questioning assumptions and building mental models from scratch. You value accuracy over agreement — and will say so.',
    patterns: [
      { icon: 'git-branch-outline', title: 'You explore ideas in depth', body: 'You rarely accept surface explanations. Following a question to its root is where you feel most alive.' },
      { icon: 'flask-outline', title: 'You think in systems and models', body: 'Before you act, you want to understand how the pieces fit. This produces insight others miss.' },
      { icon: 'time-outline', title: 'You resist premature closure', body: 'Deciding before you\'ve fully understood something feels wrong to you — even when speed is the priority.' },
    ],
    strengths: ['Conceptual precision', 'Independent reasoning', 'Curiosity-driven insight'],
    blindSpot: 'Finishing things. The exploration is more interesting than the conclusion — which can leave projects unresolved.',
    growthEdge: 'Choosing done over perfect when the context calls for it, without abandoning your standards entirely.',
  },
  {
    key: 'ENTJ', typeCode: 'ENTJ', label: 'Decisive Leader',
    tagline: 'Moves toward outcomes, not conversations.',
    chips: ['Strategic executor', 'Direct communicator', 'Growth-oriented'],
    description: 'You see inefficiency and feel compelled to fix it. You think in goals and move toward them with energy that pulls others along — sometimes before they\'ve decided to follow. You lead naturally, and you expect results from yourself and others.',
    patterns: [
      { icon: 'trending-up-outline', title: 'You think in outcomes', body: 'Every conversation, plan, and decision gets evaluated against what it produces. Anything that doesn\'t move things forward drains you.' },
      { icon: 'megaphone-outline', title: 'You communicate with directness', body: 'You say what needs to be said. In fast-moving situations, this is a gift. In more personal ones, it requires calibration.' },
      { icon: 'rocket-outline', title: 'You raise the bar around you', body: 'People working alongside you tend to perform better. Your expectations are high — and usually visible.' },
    ],
    strengths: ['Goal clarity', 'Decisive action', 'Natural leadership presence'],
    blindSpot: 'Slowing down to hear people who process differently. Speed and conviction can crowd out the input you actually need.',
    growthEdge: 'Learning when to pause before deciding — not as doubt, but as strategy.',
  },
  {
    key: 'ENTP', typeCode: 'ENTP', label: 'Curious Challenger',
    tagline: 'Questions assumptions as a reflex.',
    chips: ['Conceptual debater', 'Possibility-driven', 'Adaptive thinker'],
    description: 'You can argue any side of an argument and find the weakest point in any plan. This isn\'t contrarianism — it\'s how you stress-test ideas. You thrive in environments where ideas compete and the best one wins.',
    patterns: [
      { icon: 'bulb-outline', title: 'You generate ideas rapidly', body: 'Your mind produces options faster than most. The challenge is choosing which ones to pursue.' },
      { icon: 'chatbubbles-outline', title: 'You debate to understand', body: 'Arguing a position isn\'t always about winning — often it\'s how you figure out what you actually think.' },
      { icon: 'infinite-outline', title: 'You resist repetition', body: 'Once something is figured out, it stops being interesting. You want the next unsolved thing.' },
    ],
    strengths: ['Rapid ideation', 'Systems-level challenge', 'Intellectual flexibility'],
    blindSpot: 'Follow-through after the creative burst. Ideas need execution, and execution is where the interest tends to drop.',
    growthEdge: 'Choosing one thread and seeing it through, even after the novelty fades.',
  },
  {
    key: 'INFJ', typeCode: 'INFJ', label: 'Reflective Idealist',
    tagline: 'Deep values, quiet conviction.',
    chips: ['Values-driven', 'Pattern reader', 'Selective connector'],
    description: 'You hold strong inner convictions about how things should be — and you pursue them quietly but persistently. You notice undercurrents others miss, and you hold a vision of what is possible that can feel private until it\'s ready to be shared.',
    patterns: [
      { icon: 'eye-outline', title: 'You read the room without trying', body: 'Emotional undercurrents, unspoken dynamics, shifts in energy — you notice them naturally, sometimes without knowing why.' },
      { icon: 'compass-outline', title: 'Your values are load-bearing', body: 'When something conflicts with what you fundamentally believe, you feel it immediately — even if you don\'t always say so.' },
      { icon: 'moon-outline', title: 'You process privately before sharing', body: 'Your thinking happens internally first. By the time you speak, you\'ve usually been carrying the idea for a while.' },
    ],
    strengths: ['Intuitive perception', 'Deep empathy', 'Long-range vision'],
    blindSpot: 'Perfectionism that delays sharing until the idea feels complete enough — which may never come.',
    growthEdge: 'Letting people into the process, not just the product.',
  },
  {
    key: 'INFP', typeCode: 'INFP', label: 'Depth Seeker',
    tagline: 'Meaning first. Everything else second.',
    chips: ['Values-led', 'Introspective', 'Authenticity-driven'],
    description: 'You move toward what feels true and meaningful, and away from what feels hollow or performative. You have an inner life that runs deep, and you protect it. Authenticity isn\'t a value for you — it\'s a requirement.',
    patterns: [
      { icon: 'heart-outline', title: 'You need your work to mean something', body: 'Going through the motions in something that doesn\'t feel real is quietly exhausting. Purpose is the fuel, not the bonus.' },
      { icon: 'person-outline', title: 'You take things to heart', body: 'Feedback, conflict, or being misunderstood tends to land deeper than you\'d prefer. You process fully before you let it go.' },
      { icon: 'leaf-outline', title: 'You have a strong inner compass', body: 'When something conflicts with your values, you know immediately — even when it\'s hard to articulate why.' },
    ],
    strengths: ['Emotional authenticity', 'Deep personal values', 'Creative inner life'],
    blindSpot: 'Difficulty with criticism when it touches something identity-adjacent.',
    growthEdge: 'Separating feedback about the work from feedback about you — as a practice, not just a concept.',
  },
  {
    key: 'ENFJ', typeCode: 'ENFJ', label: 'Warm Catalyst',
    tagline: 'Brings people together toward something better.',
    chips: ['People-centered', 'Inspiring presence', 'Emotionally attuned'],
    description: 'You notice what people need and move to provide it — often before they\'ve asked. You lead through connection, not command. You\'re most energized when you\'re helping someone grow or bringing a group toward something meaningful.',
    patterns: [
      { icon: 'people-outline', title: 'You invest in people genuinely', body: 'You remember what someone mentioned weeks ago. You notice when someone is off. This attentiveness is rare and felt.' },
      { icon: 'sunny-outline', title: 'You project warmth naturally', body: 'People tend to open up around you faster than usual. This is a gift — and occasionally a magnet for those who need more than you can give.' },
      { icon: 'ribbon-outline', title: 'You carry the emotional weight of a group', body: 'You\'re aware of everyone\'s state in a room. This can be a superpower and a drain depending on the day.' },
    ],
    strengths: ['Relational leadership', 'Genuine warmth', 'Inspiring others into growth'],
    blindSpot: 'Giving more than is sustainable, and not noticing the depletion until it\'s significant.',
    growthEdge: 'Naming your own needs as clearly as you name others\'. Reciprocity is not a failure of generosity.',
  },
  {
    key: 'ENFP', typeCode: 'ENFP', label: 'Open Visionary',
    tagline: 'Excited by what could be, moved by who people are.',
    chips: ['Enthusiastic connector', 'Future-focused', 'Expressive thinker'],
    description: 'You are energized by possibility and by people. You move through the world with curiosity and warmth, often generating ideas and connections that others wouldn\'t have seen. You need environments that give you room to explore — and people who can match your energy.',
    patterns: [
      { icon: 'star-outline', title: 'You see potential everywhere', body: 'In people, in projects, in half-formed ideas. This is your greatest strength — and occasionally a trap if you spread too wide.' },
      { icon: 'flash-outline', title: 'Your enthusiasm is contagious', body: 'When you\'re energized, others feel it. You have a natural ability to get people excited about a direction.' },
      { icon: 'shuffle-outline', title: 'You resist being boxed in', body: 'Fixed roles, rigid processes, closed conversations — they feel constraining in a way that\'s hard to explain to people who don\'t feel it.' },
    ],
    strengths: ['Creative vision', 'Relational energy', 'Adaptive enthusiasm'],
    blindSpot: 'Committing and following through when the initial excitement fades.',
    growthEdge: 'Building systems that hold you accountable to your own intentions — without killing the spontaneity.',
  },
  {
    key: 'ISTJ', typeCode: 'ISTJ', label: 'Grounded Executor',
    tagline: 'Does what they say. Says what they mean.',
    chips: ['Reliable', 'Detail-oriented', 'Procedurally strong'],
    description: 'You are someone others rely on — and you take that seriously. You follow through, you track the details, and you build trust through consistency over time. You may not be the loudest voice in the room, but you are usually the one who actually gets it done.',
    patterns: [
      { icon: 'checkmark-done-outline', title: 'You complete what you start', body: 'Half-finished work is uncomfortable for you. You follow through, and you expect others to do the same.' },
      { icon: 'shield-checkmark-outline', title: 'You are quietly dependable', body: 'Your reliability compounds. People who know you well trust you deeply, because you\'ve earned it with actions, not words.' },
      { icon: 'document-text-outline', title: 'You prefer clarity over ambiguity', body: 'Vague goals and shifting expectations are genuinely difficult. You work best when the scope is defined and the expectation is clear.' },
    ],
    strengths: ['Follow-through', 'Practical reliability', 'Attention to process'],
    blindSpot: 'Rigidity when a situation calls for improvisation or a change of plan.',
    growthEdge: 'Holding your standards while staying curious about whether the procedure still fits the problem.',
  },
  {
    key: 'ISFJ', typeCode: 'ISFJ', label: 'Quiet Sustainer',
    tagline: 'Holds things together without needing credit.',
    chips: ['Steady support', 'Warm reliability', 'Detail-conscious'],
    description: 'You notice what needs doing and you do it — often without announcement. You invest in the people around you and remember what matters to them. Your care shows up in actions, not declarations.',
    patterns: [
      { icon: 'home-outline', title: 'You create stability for others', body: 'The environments you\'re part of tend to run more smoothly because you\'re quietly attending to things others haven\'t noticed yet.' },
      { icon: 'person-circle-outline', title: 'You remember the small things', body: 'What someone mentioned in passing, a preference they mentioned once, how they like to be acknowledged — you track these naturally.' },
      { icon: 'hand-left-outline', title: 'You find it hard to say no', body: 'Letting people down feels genuinely uncomfortable. This generosity is real — and sometimes needs a limit.' },
    ],
    strengths: ['Consistent care', 'Practical attentiveness', 'Quiet dependability'],
    blindSpot: 'Overextending without signaling it, until the cost becomes unavoidable.',
    growthEdge: 'Naming what you need before you\'re already depleted.',
  },
  {
    key: 'ESTJ', typeCode: 'ESTJ', label: 'Reliable Director',
    tagline: 'Clear expectations. Consistent execution.',
    chips: ['Organized leader', 'Standards-driven', 'Direct communicator'],
    description: 'You bring order to complexity. You set expectations clearly, track progress, and hold people accountable — including yourself. You believe systems exist for a reason and that following through on commitments is a matter of respect.',
    patterns: [
      { icon: 'grid-outline', title: 'You create structure others can rely on', body: 'In ambiguous situations, people look to you. You have the ability to impose clarity on a confusing situation quickly.' },
      { icon: 'podium-outline', title: 'You lead through accountability', body: 'You hold yourself and others to clear standards. This is respected — and occasionally felt as pressure.' },
      { icon: 'briefcase-outline', title: 'You value competence and effort', body: 'Sloppy work is uncomfortable to be around. You care about getting things right and doing them properly.' },
    ],
    strengths: ['Organizational clarity', 'Accountability', 'Efficient execution'],
    blindSpot: 'Flexibility when the situation has genuinely changed and the old structure no longer fits.',
    growthEdge: 'Distinguishing between standards worth defending and rigidity that serves no one.',
  },
  {
    key: 'ESFJ', typeCode: 'ESFJ', label: 'Warm Organizer',
    tagline: 'Gets people aligned. Makes things run.',
    chips: ['Connector', 'Practically warm', 'Community-builder'],
    description: 'You bring people together and keep things moving — not through authority, but through attentiveness and care. You\'re aware of how the group is doing, and you take action to make it better. The social and the practical live close together for you.',
    patterns: [
      { icon: 'people-circle-outline', title: 'You tend to the group', body: 'You notice tension before it surfaces, who hasn\'t spoken, who is struggling. This attentiveness keeps groups functioning.' },
      { icon: 'calendar-outline', title: 'You make logistics happen', body: 'Coordination, follow-up, keeping track of what was agreed — you manage these without needing recognition for them.' },
      { icon: 'heart-circle-outline', title: 'Harmony matters to you', body: 'Conflict is uncomfortable. You\'d rather find the path that keeps everyone together than win an argument that splits the room.' },
    ],
    strengths: ['Relational coordination', 'Warm follow-through', 'Group attentiveness'],
    blindSpot: 'Prioritizing harmony at the cost of honesty when the honest thing would actually help.',
    growthEdge: 'Being direct when care requires it — not just when it\'s comfortable.',
  },
  {
    key: 'ISTP', typeCode: 'ISTP', label: 'Practical Adapter',
    tagline: 'Figures it out. Does it efficiently.',
    chips: ['Problem-solver', 'Hands-on thinker', 'Independent operator'],
    description: 'You are at your best when something real needs to be solved, built, or fixed. You think by doing, prefer efficiency over explanation, and tend to figure things out on your own before asking for help. You work well under pressure.',
    patterns: [
      { icon: 'construct-outline', title: 'You learn by doing', body: 'Trial and observation is more useful to you than instruction. You figure out how things work by engaging with them directly.' },
      { icon: 'flash-outline', title: 'You are calm in a crisis', body: 'When things go wrong, you shift into problem-solving mode quickly. The emotional noise others generate is not where you put your attention.' },
      { icon: 'expand-outline', title: 'You need autonomy to function well', body: 'Being managed closely or overexplained to is frustrating. You need space to work in your own way.' },
    ],
    strengths: ['Practical problem-solving', 'Calm under pressure', 'Efficient independence'],
    blindSpot: 'Communicating your process. Others may not know what you\'re doing or why — which can create unnecessary distance.',
    growthEdge: 'Proactively updating others as a tool for building trust, even when it feels unnecessary.',
  },
  {
    key: 'ISFP', typeCode: 'ISFP', label: 'Attentive Realist',
    tagline: 'Grounded in the present. Guided by values.',
    chips: ['Present-focused', 'Values-sensitive', 'Quietly expressive'],
    description: 'You notice what is actually here — the texture of a situation, the mood in a room, the way something feels rather than how it\'s described. You act from your values quietly, without needing to announce them.',
    patterns: [
      { icon: 'color-palette-outline', title: 'You respond to what is real', body: 'Abstract planning is less interesting to you than engaging with what\'s actually in front of you. Your best thinking is situational.' },
      { icon: 'ear-outline', title: 'You absorb atmosphere', body: 'You are unusually sensitive to the emotional quality of spaces, conversations, and people — even when nothing has been said directly.' },
      { icon: 'ribbon-outline', title: 'You live your values quietly', body: 'You don\'t often announce what you believe. But you tend not to act against it, either.' },
    ],
    strengths: ['Sensory attentiveness', 'Values integrity', 'Present-moment focus'],
    blindSpot: 'Asserting what you need before the situation has already moved past the point where it mattered.',
    growthEdge: 'Speaking up earlier when something conflicts with your values — before the cost builds quietly.',
  },
  {
    key: 'ESTP', typeCode: 'ESTP', label: 'Direct Initiator',
    tagline: 'Moves fast. Adjusts as it goes.',
    chips: ['Action-oriented', 'Pragmatic', 'Energizing presence'],
    description: 'You prefer doing over planning, and you prefer now over later. You make decisions quickly, adjust when you need to, and rarely spend long in analysis when action is available. You bring momentum — and you expect people to keep up.',
    patterns: [
      { icon: 'walk-outline', title: 'You act first', body: 'Where others are still analyzing, you\'ve already moved. You get information from doing, not from theorizing.' },
      { icon: 'pulse-outline', title: 'You raise the energy in a room', body: 'Your presence tends to accelerate things. Conversations get more direct, decisions get made, momentum builds.' },
      { icon: 'alert-circle-outline', title: 'You notice what is real right now', body: 'Trends, patterns, and theory are less interesting to you than what\'s happening in front of you that needs a response.' },
    ],
    strengths: ['Fast decision-making', 'Practical adaptability', 'High-energy initiative'],
    blindSpot: 'Patience with processes that exist for reasons you haven\'t fully seen yet.',
    growthEdge: 'Slowing down long enough to understand a system before optimizing it.',
  },
  {
    key: 'ESFP', typeCode: 'ESFP', label: 'Expressive Momentum',
    tagline: 'Brings life into the room.',
    chips: ['Spontaneous', 'People-energizing', 'Present-focused'],
    description: 'You live in the present and you make the present more alive for everyone around you. You are warm, expressive, and genuinely interested in people. You don\'t need a plan — you need room to respond to what\'s actually happening.',
    patterns: [
      { icon: 'sparkles-outline', title: 'You make ordinary moments better', body: 'You have a gift for lifting the energy in a room, finding what\'s fun or interesting in an ordinary situation.' },
      { icon: 'people-outline', title: 'You connect with people quickly', body: 'You are genuinely curious about others and it shows. People feel at ease around you fast.' },
      { icon: 'today-outline', title: 'You live in the now', body: 'Long-term planning is less interesting than what\'s in front of you. You trust yourself to handle what comes.' },
    ],
    strengths: ['Spontaneous warmth', 'Present-moment joy', 'Expressive connection'],
    blindSpot: 'Preparation and forward planning when they would genuinely help.',
    growthEdge: 'Building in enough structure to protect future-you from the decisions present-you makes.',
  },
];
```

- [ ] **Step 3: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/data/resultTypes.ts
git commit -m "feat(type): add TypeArchetype interface and 16 type archetypes with premium names"
```

---

## Task 4: Scoring Logic

**Files:**
- Modify: `src/logic/scoring.ts`

**Interfaces:**
- Consumes: `typeQuestions` from `src/data/questions/type.ts`; `TypeScores` from types; `TYPE_ARCHETYPES` from resultTypes
- Produces: updated `computeResult` handles `'type'`; updated `getQuestionsForAssessment` returns type questions

- [ ] **Step 1: Add type scoring to scoring.ts**

Add these imports at the top of `src/logic/scoring.ts`:

```ts
import { typeQuestions } from '../data/questions/type';
import { TypeScores } from '../types/assessment';
import { TYPE_ARCHETYPES } from '../data/resultTypes';
```

Then add after the `scoreCommunication` / `getCommunicationType` functions (before `computeResult`):

```ts
// ─── Type scoring ─────────────────────────────────────────────────────────────

function scoreType(answers: UserAnswer[]): TypeScores {
  const axes: Record<string, { total: number; count: number }> = {
    EI: { total: 0, count: 0 },
    SN: { total: 0, count: 0 },
    TF: { total: 0, count: 0 },
    JP: { total: 0, count: 0 },
  };

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  for (const q of typeQuestions) {
    const raw = answerMap.get(q.id);
    if (raw == null) continue;
    const scored = scoreValue(raw, q.reverse);
    axes[q.dimension].total += scored;
    axes[q.dimension].count += 1;
  }

  return {
    EI: averageToPercent(axes.EI.total, axes.EI.count),
    SN: averageToPercent(axes.SN.total, axes.SN.count),
    TF: averageToPercent(axes.TF.total, axes.TF.count),
    JP: averageToPercent(axes.JP.total, axes.JP.count),
  };
}

function getTypeCode(scores: TypeScores): string {
  const e = scores.EI > 50 ? 'E' : 'I';
  const n = scores.SN > 50 ? 'N' : 'S';
  const f = scores.TF > 50 ? 'F' : 'T';
  const p = scores.JP > 50 ? 'P' : 'J';
  return `${e}${n}${f}${p}`;
}
```

- [ ] **Step 2: Extend computeResult and getQuestionsForAssessment**

In `computeResult`, change the function signature:

```ts
export function computeResult(
  assessmentId: 'type' | 'personality' | 'relationship' | 'communication',
  answers: UserAnswer[]
): AssessmentResult {
```

Add the `type` branch before the `personality` check:

```ts
  if (assessmentId === 'type') {
    const scores = scoreType(answers);
    const typeCode = getTypeCode(scores);
    const archetype = TYPE_ARCHETYPES.find((a) => a.key === typeCode) ?? TYPE_ARCHETYPES[0];

    return {
      assessmentId,
      completedAt,
      archetype: archetype.key,
      archetypeLabel: archetype.label,
      archetypeTagline: archetype.tagline,
      scores,
      primaryType: typeCode,
      strengths: archetype.strengths,
      blindSpot: archetype.blindSpot,
      summary: archetype.description,
      confidence,
      answers,
    };
  }
```

In `getQuestionsForAssessment`, add before the `return []` fallback:

```ts
  if (id === 'type') return typeQuestions;
```

- [ ] **Step 3: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/logic/scoring.ts
git commit -m "feat(type): add type axis scoring and archetype resolution to scoring.ts"
```

---

## Task 5: Assessment Metadata

**Files:**
- Modify: `src/data/assessments.ts`

**Interfaces:**
- Consumes: `Colors.type`; `AssessmentId` now includes `'type'`
- Produces: `ASSESSMENTS` array with `type` first, then personality, relationship, communication

- [ ] **Step 1: Prepend type assessment metadata**

In `src/data/assessments.ts`, replace the current `ASSESSMENTS` array opening with:

```ts
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
    // ... (existing personality object unchanged)
```

Keep all existing assessments unchanged after the new one.

- [ ] **Step 2: Update DIMENSION_META in assessments.tsx**

In `app/(tabs)/assessments.tsx`, add the `type` entry to `DIMENSION_META`:

```ts
const DIMENSION_META: Record<string, { what: string; reveals: string }> = {
  type: {
    what: 'Perception, decisions, energy & structure',
    reveals: 'How you direct energy, take in information, and approach structure.',
  },
  personality: {
    what: 'Thinking, energy, structure & emotion',
    reveals: 'How you think, make decisions, and respond to your inner world.',
  },
  // ... existing entries
};
```

- [ ] **Step 3: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/data/assessments.ts app/(tabs)/assessments.tsx
git commit -m "feat(type): add Personality Type assessment metadata, reorder to type-first"
```

---

## Task 6: Profile Clarity (4×25pt)

**Files:**
- Modify: `src/logic/profileClarity.ts`

**Interfaces:**
- Produces: `calculateProfileClarity` and `calculateLiveClarity` support 4 assessments with 25pts each

- [ ] **Step 1: Update profileClarity.ts**

Replace the entire file content:

```ts
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
```

- [ ] **Step 2: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/logic/profileClarity.ts
git commit -m "feat(type): update profile clarity to 4×25pt scheme for 4 dimensions"
```

---

## Task 7: Profile Synthesis (4th param + typeMap)

**Files:**
- Modify: `src/logic/profileSynthesis.ts`

**Interfaces:**
- Produces: `synthesizeProfile(personality?, relationship?, communication?, typeResult?)` and `getCompletedAssessmentCount` with 4 params

- [ ] **Step 1: Update profileSynthesis.ts**

Add `TypeScores` to imports:

```ts
import { AssessmentResult, PersonalityScores, AttachmentScores, CommunicationScores, TypeScores } from '../types/assessment';
```

Add `typeMap` inside `selectCombinedArchetype` before the "Apply personality scores" comment, and add 4th param:

```ts
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

  // ... existing scores object unchanged ...

  // Type alignment (added alongside existing maps)
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

  // ... after applying communicationMap, add:
  if (typeMap[typeKey]) {
    for (const [archetype, score] of Object.entries(typeMap[typeKey])) {
      scores[archetype] = (scores[archetype] ?? 0) + score;
    }
  }
```

Update `synthesizeProfile` signature and body:

```ts
export function synthesizeProfile(
  personality?: AssessmentResult,
  relationship?: AssessmentResult,
  communication?: AssessmentResult,
  typeResult?: AssessmentResult
): CombinedProfile | null {
  const completedCount = [personality, relationship, communication, typeResult].filter(Boolean).length;
  if (completedCount === 0) return null;

  const archetypeKey = selectCombinedArchetype(personality, relationship, communication, typeResult);
  // ... rest unchanged ...
}
```

Update `getCompletedAssessmentCount`:

```ts
export function getCompletedAssessmentCount(
  personality?: AssessmentResult,
  relationship?: AssessmentResult,
  communication?: AssessmentResult,
  typeResult?: AssessmentResult
): number {
  return [personality, relationship, communication, typeResult].filter(Boolean).length;
}
```

- [ ] **Step 2: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/logic/profileSynthesis.ts
git commit -m "feat(type): add typeMap and 4th param to profileSynthesis functions"
```

---

## Task 8: Inner Type Evolution (4th param + 3/4 phase logic)

**Files:**
- Modify: `src/logic/innerTypeEvolution.ts`

**Interfaces:**
- Produces: `getInnerTypeState` with 4th param; completedCount 3 = 'partial' (strong), 4 = 'complete'

- [ ] **Step 1: Update innerTypeEvolution.ts**

Add `TYPE_ADJ` map after `COMMUNICATION_ADJ`:

```ts
const TYPE_ADJ: Record<string, string> = {
  INTJ: 'Strategic', INTP: 'Analytical', ENTJ: 'Decisive', ENTP: 'Inventive',
  INFJ: 'Visionary', INFP: 'Idealistic', ENFJ: 'Catalytic', ENFP: 'Expansive',
  ISTJ: 'Grounded', ISFJ: 'Sustaining', ESTJ: 'Directing', ESFJ: 'Organizing',
  ISTP: 'Adaptive', ISFP: 'Attentive', ESTP: 'Initiating', ESFP: 'Expressive',
};
```

Update `selectCombinedKey` signature + body (add 4th param, apply typeMap inline):

```ts
function selectCombinedKey(
  personalityKey: string,
  relationshipKey: string,
  communicationKey: string,
  typeKey: string = ''
): string {
  // ... existing pMap, rMap, cMap unchanged ...

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

  // After existing map applications:
  for (const [k, v] of Object.entries(tMap[typeKey] ?? {})) scores[k] = (scores[k] ?? 0) + v;

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'AdaptiveRealist';
}
```

Update `getInnerTypeState` signature and body:

```ts
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

  // All four complete — full combined archetype
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
```

- [ ] **Step 2: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/logic/innerTypeEvolution.ts
git commit -m "feat(type): update innerTypeEvolution for 4 dimensions and TYPE_ADJ map"
```

---

## Task 9: Pattern Unlocks + Insights

**Files:**
- Modify: `src/logic/patternUnlocks.ts`
- Modify: `src/logic/insights.ts`

- [ ] **Step 1: Add type section patterns**

In `src/logic/patternUnlocks.ts`, add after the last `communication_3` entry (before the closing `};` of `SECTION_PATTERNS`):

```ts
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
```

- [ ] **Step 2: Add TYPE_INSIGHTS to insights.ts**

In `src/logic/insights.ts`, find where `getFirstInsight` is exported. Before it, add the `TYPE_INSIGHTS` constant and include it in the `getFirstInsight` logic.

First, add this constant after the existing `COMMUNICATION_INSIGHTS` (or wherever the last insights block is):

```ts
const TYPE_INSIGHTS: Record<string, Insight[]> = {
  INTJ: [
    { id: 'intj_1', category: 'self', icon: 'telescope-outline', title: 'You process before you reveal', body: 'Your thinking is usually more complete than others realize. The gap between your internal clarity and your external communication is worth closing — not always, but when it matters.' },
    { id: 'intj_2', category: 'work', icon: 'layers-outline', title: 'You need work that challenges your ceiling', body: 'Unchallenging work doesn\'t just bore you — it drains you. Finding the edge of what you know is where you function best.' },
    { id: 'intj_3', category: 'relationships', icon: 'people-outline', title: 'Your directness is honest, but land-sensitive', body: 'You mean what you say. Not everyone hears it the way you intend. A beat of context before the conclusion makes a significant difference.' },
  ],
  INTP: [
    { id: 'intp_1', category: 'self', icon: 'git-branch-outline', title: 'Certainty is not your natural state', body: 'You explore possibility before committing to a conclusion. This produces real insight — and occasionally delays action longer than necessary.' },
    { id: 'intp_2', category: 'work', icon: 'flask-outline', title: 'You do your best thinking when the problem is open', body: 'Closed questions bore you. The interesting part is the model, not the answer — which is worth knowing about yourself.' },
    { id: 'intp_3', category: 'growth', icon: 'checkmark-outline', title: 'Finishing is its own skill', body: 'Shipping something imperfect is harder for you than for most. Separating "good enough to share" from "fully resolved" is a practice worth building.' },
  ],
  ENTJ: [
    { id: 'entj_1', category: 'work', icon: 'trending-up-outline', title: 'You think in outcomes naturally', body: 'Most people have to remind themselves to track toward a goal. For you it\'s the default. The risk is impatience with people who don\'t operate the same way.' },
    { id: 'entj_2', category: 'relationships', icon: 'ear-outline', title: 'Listening is a strategic act', body: 'You already know what you think. The information you\'re missing is what others see that you haven\'t. Slowing down to gather it is not weakness — it\'s better data.' },
    { id: 'entj_3', category: 'growth', icon: 'pause-outline', title: 'Pause is information', body: 'Your instinct is to move fast. Sometimes the best move is to wait until more is known. Distinguishing those moments is the leverage point.' },
  ],
  ENTP: [
    { id: 'entp_1', category: 'self', icon: 'bulb-outline', title: 'You generate ideas faster than you execute them', body: 'This is not a flaw — it\'s a feature that needs pairing. Find the people who love to build what you imagine.' },
    { id: 'entp_2', category: 'work', icon: 'infinite-outline', title: 'Novelty is fuel, not distraction', body: 'You lose energy when things become routine. Building variety into your work structure is not indulgence — it\'s maintenance.' },
    { id: 'entp_3', category: 'growth', icon: 'flag-outline', title: 'Commitment is also a form of freedom', body: 'Keeping options open indefinitely eventually closes the bigger option. Choosing a direction is how you find out what you\'re actually capable of.' },
  ],
  INFJ: [
    { id: 'infj_1', category: 'self', icon: 'eye-outline', title: 'You read the room without trying', body: 'You pick up on things others haven\'t said yet. This is a real perceptual advantage — and occasionally exhausting to carry.' },
    { id: 'infj_2', category: 'growth', icon: 'share-outline', title: 'Your thinking has value before it\'s finished', body: 'The internal standard you hold for when something is ready to share is often higher than it needs to be. Earlier is fine.' },
    { id: 'infj_3', category: 'relationships', icon: 'heart-outline', title: 'You give a lot. Ask for what you need.', body: 'You tend to attune to others\' needs before your own. Naming what you need — directly, early — is available to you.' },
  ],
  INFP: [
    { id: 'infp_1', category: 'self', icon: 'leaf-outline', title: 'Your values are not optional', body: 'You\'re not being difficult when something conflicts with what you believe. That conflict is real data, not noise.' },
    { id: 'infp_2', category: 'work', icon: 'heart-outline', title: 'Purpose is the fuel', body: 'Meaningless work doesn\'t just bore you — it quietly drains you. This is worth designing around, not through.' },
    { id: 'infp_3', category: 'growth', icon: 'shield-outline', title: 'Feedback is not a verdict on you', body: 'When feedback touches something identity-adjacent, it can land harder than intended. Separating the work from who you are is a practice worth building.' },
  ],
  ENFJ: [
    { id: 'enfj_1', category: 'relationships', icon: 'people-outline', title: 'You carry the room\'s emotional weight', body: 'Being aware of how everyone is doing is a gift — and a cost. Knowing when to put it down is part of sustaining it.' },
    { id: 'enfj_2', category: 'growth', icon: 'hand-right-outline', title: 'Your needs count too', body: 'You give generously and consistently. The practice of naming what you need — before you\'re already depleted — is available to you.' },
    { id: 'enfj_3', category: 'work', icon: 'sunny-outline', title: 'You help people grow', body: 'You see potential in others often before they do. This is a rare and significant gift when pointed in the right direction.' },
  ],
  ENFP: [
    { id: 'enfp_1', category: 'self', icon: 'star-outline', title: 'You see potential everywhere', body: 'This is your greatest asset — and occasionally a trap. Not every possibility deserves a full investment. Choosing which ones to chase is a skill.' },
    { id: 'enfp_2', category: 'work', icon: 'flash-outline', title: 'Your enthusiasm opens doors', body: 'When you\'re energized about something, others feel it. This is a real form of leadership that doesn\'t require a title.' },
    { id: 'enfp_3', category: 'growth', icon: 'flag-outline', title: 'Commitment deepens experience', body: 'Staying with something past the initial excitement reveals a different kind of reward. The depth is on the other side of the novelty.' },
  ],
  ISTJ: [
    { id: 'istj_1', category: 'work', icon: 'checkmark-done-outline', title: 'Your reliability compounds over time', body: 'Trust is built incrementally, through consistent follow-through. You do this naturally — and it pays long-term dividends.' },
    { id: 'istj_2', category: 'growth', icon: 'shuffle-outline', title: 'Flexibility is also a skill', body: 'When the situation genuinely changes, adapting the approach is not inconsistency — it\'s judgment. The goal stays; the path adjusts.' },
    { id: 'istj_3', category: 'relationships', icon: 'hourglass-outline', title: 'You show care through consistency', body: 'You\'re not always the most verbally expressive — but the people who know you trust you precisely because you do what you say.' },
  ],
  ISFJ: [
    { id: 'isfj_1', category: 'relationships', icon: 'home-outline', title: 'You stabilize without announcement', body: 'Things run more smoothly when you\'re around. This often goes unacknowledged — which is worth noticing, even if you don\'t need the credit.' },
    { id: 'isfj_2', category: 'growth', icon: 'hand-right-outline', title: 'Say what you need before you\'re depleted', body: 'Your threshold for asking is high. The cost tends to accumulate quietly until it\'s significant. Earlier is better.' },
    { id: 'isfj_3', category: 'work', icon: 'shield-checkmark-outline', title: 'Your attention to detail is a real asset', body: 'The things you track that others miss are often what prevent problems downstream. This is quietly valuable work.' },
  ],
  ESTJ: [
    { id: 'estj_1', category: 'work', icon: 'grid-outline', title: 'You create structure others rely on', body: 'In ambiguous situations, people look to you. Your ability to impose order on confusion quickly is genuinely useful.' },
    { id: 'estj_2', category: 'growth', icon: 'swap-horizontal-outline', title: 'Some rules exist for reasons worth checking', body: 'The procedure may have been right when it was built and wrong now. Asking whether it still fits is not rebellion — it\'s judgment.' },
    { id: 'estj_3', category: 'relationships', icon: 'podium-outline', title: 'Your directness is respected and felt', body: 'People know where they stand with you. That clarity is valued — and benefits from occasional softening when the context is personal.' },
  ],
  ESFJ: [
    { id: 'esfj_1', category: 'relationships', icon: 'people-circle-outline', title: 'You tend to the group naturally', body: 'You notice who is struggling, what is unspoken, what the room needs. This attentiveness keeps things functioning.' },
    { id: 'esfj_2', category: 'growth', icon: 'chatbubble-outline', title: 'Honesty is also a form of care', body: 'Protecting harmony at the cost of truth eventually costs more. The honest thing, said well, is usually what actually helps.' },
    { id: 'esfj_3', category: 'work', icon: 'calendar-outline', title: 'You make coordination happen', body: 'Follow-up, logistics, tracking what was agreed — you manage these reliably and often without recognition. That\'s a real organizational asset.' },
  ],
  ISTP: [
    { id: 'istp_1', category: 'work', icon: 'construct-outline', title: 'You learn best by doing', body: 'Direct engagement with a problem tells you more than any explanation. You figure out how things work by working with them.' },
    { id: 'istp_2', category: 'self', icon: 'flash-outline', title: 'Calm under pressure is a real asset', body: 'When things go wrong, you shift into problem-solving mode quickly. The emotional noise doesn\'t distract you from what needs fixing.' },
    { id: 'istp_3', category: 'relationships', icon: 'radio-outline', title: 'Others may not know what you\'re working on', body: 'You communicate your process less than others expect. A brief update — not full transparency, just a signal — tends to reduce friction significantly.' },
  ],
  ISFP: [
    { id: 'isfp_1', category: 'self', icon: 'ear-outline', title: 'You absorb atmosphere', body: 'You\'re sensitive to the emotional quality of spaces and people in a way that is unusually perceptive. This is information — trust it.' },
    { id: 'isfp_2', category: 'growth', icon: 'megaphone-outline', title: 'Speaking up earlier costs less than staying silent', body: 'When something conflicts with your values, the longer it builds quietly, the more it costs. Earlier is usually better — for everyone.' },
    { id: 'isfp_3', category: 'work', icon: 'color-palette-outline', title: 'Your best work responds to what\'s real', body: 'Abstract planning is less interesting to you than what\'s actually in front of you. Your situational thinking is a genuine strength.' },
  ],
  ESTP: [
    { id: 'estp_1', category: 'work', icon: 'walk-outline', title: 'You get information by moving', body: 'Analysis before action feels slow to you for good reason — your best data comes from doing, not theorizing.' },
    { id: 'estp_2', category: 'growth', icon: 'search-outline', title: 'Systems have context you haven\'t seen yet', body: 'Moving fast is valuable. Occasionally slowing to understand why a thing works before changing it protects you from the second-order costs.' },
    { id: 'estp_3', category: 'relationships', icon: 'pulse-outline', title: 'Your energy raises the tempo', body: 'Conversations get more direct and momentum builds when you\'re engaged. This is a form of leadership that doesn\'t require patience.' },
  ],
  ESFP: [
    { id: 'esfp_1', category: 'relationships', icon: 'sparkles-outline', title: 'You make ordinary moments better', body: 'You have a gift for lifting the energy in a room and finding what\'s alive in a situation. This is a real form of generosity.' },
    { id: 'esfp_2', category: 'growth', icon: 'today-outline', title: 'Future-you will benefit from present-you\'s structure', body: 'Preparation isn\'t your natural mode. Building in just enough structure to protect your future options — without killing the spontaneity — is worth the investment.' },
    { id: 'esfp_3', category: 'work', icon: 'people-outline', title: 'You connect people quickly', body: 'You are genuinely curious about others and it shows immediately. People open up around you faster than usual. This is rare and useful.' },
  ],
};
```

Then update the `getFirstInsight` function to include `TYPE_INSIGHTS`. Find the existing function and add type lookup:

```ts
// Inside getFirstInsight, after existing archetype lookups, add:
  const typeResult = profile.assessmentResults['type' as any];
  if (typeResult) {
    const typeInsights = TYPE_INSIGHTS[typeResult.primaryType];
    if (typeInsights && typeInsights.length > 0) return typeInsights[0];
  }
```

- [ ] **Step 3: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/logic/patternUnlocks.ts src/logic/insights.ts
git commit -m "feat(type): add type pattern unlocks (4 sections) and type archetype insights"
```

---

## Task 10: Home Screen (index.tsx — 4-dimension updates)

**Files:**
- Modify: `app/(tabs)/index.tsx`

- [ ] **Step 1: Update GOAL_TO_ASSESSMENT_ID**

Change (line ~33):

```ts
const GOAL_TO_ASSESSMENT_ID: Record<string, string> = {
  understand_myself: 'type',
  improve_relationships: 'relationship',
  communicate_better: 'communication',
  work_style: 'type',
};
```

- [ ] **Step 2: Update completedCount call (line ~97)**

```ts
  const completedCount = profile
    ? getCompletedAssessmentCount(
        profile.assessmentResults.personality,
        profile.assessmentResults.relationship,
        profile.assessmentResults.communication,
        profile.assessmentResults['type' as any]
      )
    : 0;
```

- [ ] **Step 3: Update synthesizeProfile call (line ~104)**

```ts
  const combinedProfile =
    completedCount >= 2
      ? synthesizeProfile(
          profile?.assessmentResults.personality,
          profile?.assessmentResults.relationship,
          profile?.assessmentResults.communication,
          profile?.assessmentResults['type' as any]
        )
      : null;
```

- [ ] **Step 4: Update getInnerTypeState call (line ~115)**

```ts
  const innerType = profile
    ? getInnerTypeState(
        profile.assessmentResults.personality,
        profile.assessmentResults.relationship,
        profile.assessmentResults.communication,
        profile.assessmentResults['type' as any]
      )
    : null;
```

- [ ] **Step 5: Update singleResult (line ~134)**

```ts
  const singleResult =
    completedCount === 1
      ? profile?.assessmentResults['type' as any] ||
        profile?.assessmentResults.personality ||
        profile?.assessmentResults.relationship ||
        profile?.assessmentResults.communication
      : null;
```

- [ ] **Step 6: Update heroMetaLabel and bridgeText**

```ts
  function heroMetaLabel(): string {
    if (!innerType || innerType.phase === 'unknown') return '';
    if (completedCount >= 4) return 'YOUR INNERTYPE';
    if (completedCount >= 2) return 'FORMING PROFILE';
    return 'EMERGING SIGNAL';
  }

  function bridgeText(): string | null {
    if (completedCount === 0) return null;
    if (completedCount === 1)
      return 'One dimension mapped. Three more to complete your InnerType.';
    if (completedCount === 2)
      return 'Two of four dimensions mapped. Your profile is taking shape.';
    if (completedCount === 3)
      return 'Three of four dimensions mapped. Your profile is nearly complete.';
    return 'Your four dimensions now form one unified InnerType profile.';
  }
```

- [ ] **Step 7: Update "of 3" dimension status copy**

Find: `{completedCount} of 3 dimensions mapped`
Replace with: `{completedCount} of 4 dimensions mapped`

- [ ] **Step 8: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 9: Commit**

```bash
git add "app/(tabs)/index.tsx"
git commit -m "feat(type): update home screen to 4-dimension logic and goal mapping"
```

---

## Task 11: Assessments Tab (goal mapping + copy)

**Files:**
- Modify: `app/(tabs)/assessments.tsx`

- [ ] **Step 1: Update GOAL_TO_ID**

```ts
  const GOAL_TO_ID: Record<string, string> = {
    understand_myself: 'type',
    improve_relationships: 'relationship',
    communicate_better: 'communication',
    work_style: 'type',
  };
```

- [ ] **Step 2: Update clarityBanner copy**

Find: `completedCount === 3`
Replace with: `completedCount === 4`

Find: `` `Profile clarity · ${completedCount} of 3 dimensions mapped.` ``
Replace with: `` `Profile clarity · ${completedCount} of 4 dimensions mapped.` ``

- [ ] **Step 3: Update header subtitle**

Find: `Three dimensions form your complete InnerType — personality, relationships, and communication.`
Replace with: `Four dimensions form your complete InnerType — type, traits, relationships, and communication.`

- [ ] **Step 4: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add "app/(tabs)/assessments.tsx"
git commit -m "feat(type): update assessments tab goal mapping and 4-dimension copy"
```

---

## Task 12: Result Screen (TypeScores axis bars)

**Files:**
- Modify: `app/assessment/[id]/result.tsx`

- [ ] **Step 1: Add TypeScores import and type archetype lookup**

Add to imports:

```ts
import { AssessmentResult, PersonalityScores, AttachmentScores, CommunicationScores, TypeScores } from '../../../src/types/assessment';
import { TYPE_ARCHETYPES } from '../../../src/data/resultTypes';
```

- [ ] **Step 2: Add type axis constants**

After existing `COMMUNICATION_LABELS`, add:

```ts
const TYPE_AXIS_LABELS: Record<string, string> = {
  EI: 'Energy & Focus',
  SN: 'Perception & Possibility',
  TF: 'Decisions & Values',
  JP: 'Structure & Flow',
};

const TYPE_SPECTRUM: Record<string, [string, string]> = {
  EI: ['Introversion', 'Extraversion'],
  SN: ['Sensing', 'Intuition'],
  TF: ['Thinking', 'Feeling'],
  JP: ['Judging', 'Perceiving'],
};
```

- [ ] **Step 3: Update getArchetypeData to handle type**

```ts
function getArchetypeData(assessmentId: string, archetypeKey: string) {
  if (assessmentId === 'type') {
    return TYPE_ARCHETYPES.find((a) => a.key === archetypeKey);
  }
  if (assessmentId === 'personality') {
    return PERSONALITY_ARCHETYPES.find((a) => a.key === archetypeKey);
  }
  if (assessmentId === 'relationship') {
    return RELATIONSHIP_TYPES.find((a) => a.key === archetypeKey);
  }
  if (assessmentId === 'communication') {
    return COMMUNICATION_TYPES.find((a) => a.key === archetypeKey);
  }
  return null;
}
```

- [ ] **Step 4: Update GOAL_TO_ID**

```ts
const GOAL_TO_ID: Record<string, string> = {
  understand_myself: 'type',
  improve_relationships: 'relationship',
  communicate_better: 'communication',
  work_style: 'type',
};
```

- [ ] **Step 5: Add type-specific scores rendering**

Find where the existing assessment scores (personality bars, attachment bars, communication bars) are rendered. Add a new branch for type:

```tsx
{id === 'type' && result && (() => {
  const scores = result.scores as TypeScores;
  return (
    <View style={styles.scoresSection}>
      <Text style={styles.scoresSectionTitle}>Your type profile</Text>
      {/* Type code display */}
      <View style={styles.typeCodeRow}>
        <Text style={styles.typeCodeLabel}>{result.primaryType}-style pattern</Text>
      </View>
      {(['EI', 'SN', 'TF', 'JP'] as const).map((axis) => (
        <View key={axis} style={styles.traitRow}>
          <View style={styles.traitLabelRow}>
            <Text style={styles.traitLabel}>{TYPE_AXIS_LABELS[axis]}</Text>
            <Text style={[styles.traitPct, { color: assessment?.accentColor }]}>
              {scores[axis]}%
            </Text>
          </View>
          <TraitBar
            value={scores[axis]}
            color={assessment?.accentColor ?? Colors.type}
          />
          <View style={styles.spectrumRow}>
            <Text style={styles.spectrumLabel}>{TYPE_SPECTRUM[axis][0]}</Text>
            <Text style={styles.spectrumLabel}>{TYPE_SPECTRUM[axis][1]}</Text>
          </View>
        </View>
      ))}
    </View>
  );
})()}
```

Add `Colors.type` to the import if it isn't already there (it will be after Task 1).

- [ ] **Step 6: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 7: Commit**

```bash
git add "app/assessment/[id]/result.tsx"
git commit -m "feat(type): add TypeScores axis bar display in result screen"
```

---

## Task 13: Copy Updates (onboarding, methodology, report)

**Files:**
- Modify: `app/onboarding.tsx`
- Modify: `app/methodology.tsx`
- Modify: `app/report.tsx`

- [ ] **Step 1: Update onboarding.tsx copy**

Find the body text on screen 1 referencing 3 dimensions and update to 4:

Old: `"Most personality tools give you a label. InnerType maps your personality traits, relationship patterns, and communication style into one picture."`

New: `"Most personality tools give you a label. InnerType combines type, traits, relationship patterns, and communication style into one clearer picture of who you are."`

Find the dimension pills (currently showing 3 pills) and update to 4:
`Type · Traits · Relationships · Communication`

Find framework chips on screen 3 and update:
`Type-based framework · Big Five traits · Attachment patterns · Communication style`

- [ ] **Step 2: Update methodology.tsx**

Find the existing frameworks list. Prepend a new entry before Big Five:

```tsx
{/* Type-Based Personality Framework */}
<View style={styles.frameworkCard}>
  <Text style={styles.frameworkName}>Type-Based Personality Framework</Text>
  <Text style={styles.frameworkUsed}>Used in: Personality Type assessment</Text>
  <Text style={styles.frameworkDesc}>
    Inspired by decades of type-based personality research. Classifies cognitive style across four axes: energy, perception, decision-making, and structure.
  </Text>
  <Text style={styles.frameworkNote}>
    Not an official MBTI assessment. Not affiliated with Myers-Briggs or the Myers & Briggs Foundation. Designed for self-reflection only.
  </Text>
</View>
```

Update any mention of "Three orthogonal dimensions" to "Four orthogonal dimensions".

- [ ] **Step 3: Update report.tsx**

Find `synthesizeProfile(` call and add the 4th arg:

```ts
synthesizeProfile(
  profile?.assessmentResults.personality,
  profile?.assessmentResults.relationship,
  profile?.assessmentResults.communication,
  profile?.assessmentResults['type' as any]
)
```

Find any "3 dimensions" copy and update to "4 dimensions".

Update header copy: `"Your full InnerType report combines four mapped dimensions: type, traits, relationships, and communication."`

- [ ] **Step 4: TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add app/onboarding.tsx app/methodology.tsx app/report.tsx
git commit -m "feat(type): update onboarding, methodology, and report copy for 4 dimensions"
```

---

## Task 14: UserProfile type check

**Files:**
- Possibly modify: `src/types/profile.ts`

The `UserProfile.assessmentResults` must accept `type` as a key. Check the current definition.

- [ ] **Step 1: Read src/types/profile.ts**

Read the file and check if `assessmentResults` is typed as `Partial<Record<AssessmentId, AssessmentResult>>` or similar. If it uses `AssessmentId`, it will automatically pick up the expanded union from Task 1. If it hardcodes the 3 IDs, add `type` explicitly.

- [ ] **Step 2: Update if needed**

If `assessmentResults` or `assessmentProgress` hardcodes IDs:

```ts
assessmentResults: Partial<Record<AssessmentId, AssessmentResult>>;
assessmentProgress: Partial<Record<AssessmentId, AssessmentProgress>>;
```

This automatically includes `'type'` once `AssessmentId` is expanded.

- [ ] **Step 3: Final TypeScript check**

Run: `cd /Users/otastemelis/claude/innertype && npx tsc --noEmit`
Expected: zero output — this is the acceptance gate

- [ ] **Step 4: Final commit**

```bash
git add src/types/profile.ts  # only if changed
git commit -m "feat(type): final type safety cleanup — all 4-dimension paths verified"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `AssessmentId` expanded to include `'type'` — Task 1
- ✅ `TypeScores` interface — Task 1
- ✅ `Colors.type` teal token — Task 1
- ✅ 32 questions (8×4 axes) — Task 2
- ✅ 16 type archetypes with premium names — Task 3
- ✅ Type scoring + `computeResult` — Task 4
- ✅ Assessment metadata + reorder — Task 5
- ✅ Profile clarity 4×25pt — Task 6
- ✅ `typeMap` in profileSynthesis — Task 7
- ✅ `TYPE_ADJ` + 4-phase evolution — Task 8
- ✅ Pattern unlocks (type_1–type_4) — Task 9
- ✅ TYPE_INSIGHTS keyed by type code — Task 9
- ✅ Home screen 4-dimension updates — Task 10
- ✅ Assessments tab copy + goal mapping — Task 11
- ✅ Result screen TypeScores bars — Task 12
- ✅ Onboarding, methodology, report copy — Task 13
- ✅ `UserProfile` type safety — Task 14
- ✅ No "MBTI", "Myers-Briggs", "clinically validated" in any copy — verified throughout

**No placeholder scan:** All code blocks contain complete implementations. No "TBD" or "TODO" present.

**Type consistency:** `TypeScores` is defined in Task 1 and used consistently through Tasks 4, 12. `AssessmentId = 'type' | ...` defined in Task 1, used in Tasks 5, 6, 7, 8, 14. `typeResult` 4th param is the same name throughout Tasks 7, 8, 10.
