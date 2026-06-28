# Design: Personality Type — 4th Assessment Dimension

**Date:** 2026-06-28  
**Status:** Approved  
**Scope:** Add `type` as the 4th InnerType assessment dimension (Personality Type), update all UI/logic from 3 → 4 dimensions.

---

## Background

InnerType currently has 3 assessments: Personality Traits (Big Five), Relationship Pattern (Attachment Theory), Communication Style (NVC/conflict research). This spec adds a 4th dimension — **Personality Type** — inspired by type-based personality frameworks (not officially MBTI). The assessment captures organic demand for type-based self-discovery while fitting cleanly into the existing InnerType system.

---

## Internal ID Decision

The new assessment uses internal ID **`type`** (not `personalityType` or `mbti`). This avoids collision with the existing `personality` (Big Five) ID and is short, clean, and unambiguous in code.

All existing `personality` references continue to refer to the Big Five assessment. Routing: `/assessment/type/intro`, `/assessment/type/question`, `/assessment/type/result`.

---

## Product Positioning

App copy frames the four dimensions as:

> "InnerType combines type, traits, relationships, and communication into one clearer self-discovery profile."

**Canonical dimension order (new):**
1. **Personality Type** — Perception, decisions, energy & structure — Type-based personality framework
2. **Personality Traits** — Thinking, energy, structure & emotion — Big Five personality model
3. **Relationship Pattern** — Closeness, reassurance & independence — Attachment theory
4. **Communication Style** — Conflict, boundaries & repair — Communication style research

---

## Data Model

### `AssessmentId` (expanded)
```ts
export type AssessmentId = 'type' | 'personality' | 'relationship' | 'communication';
```

### `TypeScores` (new)
```ts
export interface TypeScores {
  EI: number;  // 0–100, higher = Extraversion
  SN: number;  // 0–100, higher = Intuition
  TF: number;  // 0–100, higher = Feeling
  JP: number;  // 0–100, higher = Perceiving
}
```

`AssessmentResult.scores` union expands to include `TypeScores`.

---

## Questions (32 total, 4 sections × 8)

All questions use the existing Likert 1–5 format (Strongly Disagree → Strongly Agree). Questions can be marked `reverse: true` where higher agreement signals the lower-score pole.

| Section | Title | Axis | Questions |
|---------|-------|------|-----------|
| 1 | Energy & Focus | E/I | 8 |
| 2 | Perception & Possibility | S/N | 8 |
| 3 | Decisions & Values | T/F | 8 |
| 4 | Structure & Flow | J/P | 8 |

**Axis scoring:**
- Average answer score per axis → `averageToPercent()` → 0–100
- `EI > 50` → Extraversion (E); `EI ≤ 50` → Introversion (I)
- `SN > 50` → Intuition (N); `SN ≤ 50` → Sensing (S)
- `TF > 50` → Feeling (F); `TF ≤ 50` → Thinking (T)
- `JP > 50` → Perceiving (P); `JP ≤ 50` → Judging (J)

Type code assembled from the four poles, e.g., `INTJ`, `ENFP`.

---

## Type Archetypes (16)

Premium names — no official MBTI names, no 16Personalities names.

| Code | Premium Name |
|------|-------------|
| INTJ | Strategic Architect |
| INTP | Independent Analyst |
| ENTJ | Decisive Leader |
| ENTP | Curious Challenger |
| INFJ | Reflective Idealist |
| INFP | Depth Seeker |
| ENFJ | Warm Catalyst |
| ENFP | Open Visionary |
| ISTJ | Grounded Executor |
| ISFJ | Quiet Sustainer |
| ESTJ | Reliable Director |
| ESFJ | Warm Organizer |
| ISTP | Practical Adapter |
| ISFP | Attentive Realist |
| ESTP | Direct Initiator |
| ESFP | Expressive Momentum |

Each archetype has: `key` (type code), `typeCode`, `label` (premium name), `tagline`, `chips[3]`, `description`, `patterns[3]`, `strengths[3]`, `blindSpot`, `growthEdge`.

Result display format:
```
Strategic Architect          ← primary hero (fontFamily: display)
INTJ-style pattern           ← secondary, smaller weight
```

---

## Sections & Pattern Unlocks

New entries in `SECTION_PATTERNS` (`patternUnlocks.ts`):

| Key | High | Mid | Low |
|-----|------|-----|-----|
| `type_1` | Social Momentum | Adaptive Energy | Private Focus |
| `type_2` | Pattern Seeking | Integrative Sight | Detail Anchoring |
| `type_3` | Values-Led Judgment | Balanced Reasoning | Analytical Distance |
| `type_4` | Adaptive Flow | Flexible Structure | Planned Momentum |

---

## Profile Clarity (4 equal buckets)

```ts
const QUESTION_COUNTS = {
  type: 32, personality: 50, relationship: 32, communication: 28
};

const COMPLETE_POINTS = {
  type: 25, personality: 25, relationship: 25, communication: 25
};

const PARTIAL_POINTS = {
  type: 20, personality: 20, relationship: 20, communication: 20
};
```

- 0 assessments → 0%
- Partial first → 1–24%
- 1 complete → 25%
- 2 complete → ~50%
- 3 complete → ~75%
- 4 complete → 100%

`calculateLiveClarity` updated to accept `'type' | 'personality' | 'relationship' | 'communication'`.

---

## Profile Synthesis

`synthesizeProfile()` and `getCompletedAssessmentCount()` now accept an optional 4th param: `typeResult?: AssessmentResult`.

A `typeMap` added to `selectCombinedArchetype()`:

| Type codes | Weighted archetypes |
|-----------|---------------------|
| INTJ, INTP | ReflectiveSage+3, CalmArchitect+2 |
| ENTJ, ENTP | CalmArchitect+2, CuriousArchitect+2, ExpressiveArchitect+1 |
| INFJ, INFP | ReflectiveSage+2, PassionateIdealist+2, SensitiveGuide+1 |
| ENFJ, ENFP | PassionateIdealist+2, SensitiveGuide+2, GroundedExplorer+1 |
| ISTJ, ISFJ | GroundedExplorer+2, CalmArchitect+2, AdaptiveRealist+1 |
| ESTJ, ESFJ | CalmArchitect+2, GroundedExplorer+2, ExpressiveArchitect+1 |
| ISTP, ISFP | IndependentConnector+3, AdaptiveRealist+1 |
| ESTP, ESFP | ExpressiveArchitect+2, IndependentConnector+1, AdaptiveRealist+2 |

---

## Color Token

```ts
type: '#6AADB8',          // muted teal — distinct from amber/lavender/blue
typeDim: 'rgba(106, 173, 184, 0.15)',
gradientCardType: ['rgba(106,173,184,0.12)', 'rgba(106,173,184,0.04)'] as const,
```

Assessment icon: `compass-outline`.

---

## Assessment Metadata

```ts
{
  id: 'type',
  title: 'Personality Type',
  subtitle: 'Perception, decisions, energy & structure',
  description: 'Discover your cognitive style — how you direct energy, take in information, make decisions, and approach structure.',
  promise: 'This dimension reveals how you navigate the world from the inside out.',
  methodologyNote: 'Inspired by type-based personality frameworks. Designed for self-reflection, not official certification or clinical diagnosis.',
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
}
```

---

## Goal Mapping (updated)

```ts
const GOAL_TO_ASSESSMENT_ID = {
  understand_myself: 'type',      // type is the organic hook
  improve_relationships: 'relationship',
  communicate_better: 'communication',
  work_style: 'type',             // type answers this clearly
};
```

---

## Result Screen (type-specific)

The result page reuses the existing `[id]/result.tsx` structure. Type-specific additions:

- **Spectrum bars**: 4 axis bars (EI, SN, TF, JP) with pole labels:
  - EI: `['Introversion', 'Extraversion']`
  - SN: `['Sensing', 'Intuition']`
  - TF: `['Thinking', 'Feeling']`
  - JP: `['Judging', 'Perceiving']`
- **Type code display**: Shown below the premium archetype name at smaller size
- **No official MBTI copy** anywhere in the result screen

---

## Insights (type-axis additions)

New entries in `insights.ts` keyed by type archetype (`INTJ`, `INFP`, etc.) covering:

- Introversion-style: processing time, internal clarity
- Extraversion-style: thinking-by-talking, social momentum
- Intuition-style: noticing what could be before what is
- Sensing-style: trusting the observable and proven
- Thinking-style: solving structure before emotional residue
- Feeling-style: noticing relational cost of decisions first
- Judging-style: closure as freedom; open loops as drain
- Perceiving-style: resisting premature closure; possibility still alive

---

## Onboarding Copy Updates

**Screen 1 body:**
> "Most personality tools give you a label. InnerType combines type, traits, relationship patterns, and communication style into one clearer picture of who you are."

**Dimension pills (replacing 3 with 4):**
Type · Traits · Relationships · Communication

**Framework chips (Screen 3):**
Type-based framework · Big Five traits · Attachment patterns · Communication style

---

## Home / Profile Screen Updates

- Dimension status: "0 of 4 dimensions mapped" through "4 of 4 dimensions mapped"
- Complete state: "Your four dimensions now form one unified InnerType profile."
- `nextAssessment` logic respects updated goal mapping (defaults to `type`)
- Compact dimension row shows all 4 dimensions

---

## Assessments Tab Updates

- Title: "Build your profile"
- Subtitle: "Each assessment maps a different dimension of how you think, connect, communicate, and move through the world."
- Cards display in order: Personality Type → Personality Traits → Relationship Pattern → Communication Style
- Clarity banner: "1 of 4" through "4 of 4"

---

## Methodology Screen Updates

New framework entry prepended:

```
Type-Based Personality Framework
Used in: Personality Type assessment
Description: Inspired by decades of type-based personality research. Classifies cognitive style across four axes: energy, perception, decision-making, and structure.
Note: Not an official MBTI assessment. Not affiliated with Myers-Briggs or the Myers & Briggs Foundation. Designed for self-reflection only.
```

Multi-dimensional principle updated: "Four orthogonal dimensions give a richer, more accurate picture."

---

## Full Report Updates

- Header copy: "Your full InnerType report combines four mapped dimensions: type, traits, relationships, and communication."
- All "3 dimensions" → "4 dimensions" occurrences updated

---

## Legal / Brand Safety

- No use of "MBTI", "Myers-Briggs", "16Personalities", or "clinically validated" in any UI-facing string
- Safe phrases used throughout: "type-based personality framework", "INTJ-style pattern", "inspired by type-based frameworks", "designed for self-reflection"

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/data/questions/type.ts` | 32 questions (8 per axis) |

## Files to Modify

| File | Change |
|------|--------|
| `src/types/assessment.ts` | Add `TypeScores`, expand `AssessmentId` |
| `src/data/assessments.ts` | Add type meta, reorder (type first) |
| `src/data/resultTypes.ts` | Add `TypeArchetype` interface + `TYPE_ARCHETYPES` (16) |
| `src/logic/scoring.ts` | Add type scoring + archetype resolution |
| `src/logic/profileClarity.ts` | 4-dimension point allocation |
| `src/logic/profileSynthesis.ts` | Add typeMap, 4-param signatures |
| `src/logic/patternUnlocks.ts` | Add type section patterns (4 sections) |
| `src/logic/insights.ts` | Add TYPE_INSIGHTS keyed by type code |
| `src/theme/colors.ts` | Add `type`, `typeDim`, `gradientCardType` |
| `app/(tabs)/index.tsx` | 4-dimension copy, goal mapping |
| `app/(tabs)/assessments.tsx` | 4-dimension cards + ordering |
| `app/onboarding.tsx` | 4-dimension copy + chips |
| `app/methodology.tsx` | Add type framework entry |
| `app/report.tsx` | 4-dimension copy |
| `app/assessment/[id]/result.tsx` | Handle `TypeScores` axis bars |

---

## Acceptance Criteria

1. App has exactly 4 assessments; new one titled "Personality Type" (not "MBTI Test")
2. 32 real deterministic questions scoring E/I, S/N, T/F, J/P axes
3. 16 type archetypes with premium names; result shows `INTJ-style pattern` format
4. Profile Clarity supports 4 dimensions (25pts each)
5. Home/Profile shows 0–4 dimensions mapped correctly
6. Onboarding references 4 dimensions
7. Assessments page shows all 4 in correct order
8. Full report references 4 dimensions
9. Profile synthesis uses Personality Type
10. No UI copy claims official MBTI or clinical validation
11. Existing 3 assessments still work; no stored data corrupted
12. `npx tsc --noEmit` passes with zero errors
