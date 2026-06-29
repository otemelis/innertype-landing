# Premium Deep Reports — Design Spec

## Goal

Add contextual premium upsells to all 4 individual assessment result pages. One premium unlock (InnerType Premium · €4.99) reveals deep report sections for every assessment, and the full combined InnerType report. Premium value arrives earlier in the user journey — not just after all 4 assessments are complete.

## Business model

One-time purchase: **Unlock InnerType Premium · €4.99**
Supporting line: **One-time unlock. No subscription.**

No separate per-assessment pricing. No subscriptions. No fake urgency. No real payment integration — `setPremium(true)` mock only.

---

## Architecture

### State

`isPremium: boolean` already exists on `UserProfile`. No type changes needed.

`result.tsx` currently loads the profile but does not read `isPremium`. The first change is extracting it and driving locked/unlocked rendering from it.

### Flow

```
User opens any assessment result page
  → loadProfile() → extract isPremium

  isPremium === false:
    → show free result (unchanged)
    → show contextual premium card (assessment-specific)

  isPremium === true:
    → show free result (unchanged)
    → show deep report sections (assessment-specific, 5–6 sections)

User taps "Unlock InnerType Premium · €4.99"
  → router.push('/paywall')
  → paywall calls setPremium(true) → navigates back
  → result page re-renders with isPremium === true
```

### Files changed

| File | Change |
|---|---|
| `src/data/resultTypes.ts` | Add new fields to 4 archetype interfaces; author all content |
| `app/assessment/[id]/result.tsx` | Load isPremium; replace premium card with 4 contextual variants; add unlocked deep report sections |
| `app/report.tsx` | Update premium card subtitle (2 lines) |

`app/paywall.tsx` — no changes needed (already updated).

---

## Data layer additions

### Design principle

The free result already shows: `description` (hero), `patterns` (3 cards), score bars, `blindSpot` ("GROWTH EDGE"). Deep report sections must show content **not already shown free** — otherwise the premium feels like a repeat.

### `TypeArchetype` — add `workStyle: string`, `relationshipStyle: string`

Update interface:

```typescript
export interface TypeArchetype {
  key: string;
  typeCode: string;
  label: string;
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
  workStyle: string;       // NEW
  relationshipStyle: string; // NEW
}
```

**Authored content — all 16 types:**

**INTJ:**
```
workStyle: 'You do your best work when you have genuine ownership of the problem and the latitude to solve it your way. Collaboration is useful when it adds thinking you do not have — not as a process requirement. You need work that rewards depth and precision.',
relationshipStyle: 'You invest deeply in a very small number of people, and that investment is real. Closeness builds through shared thinking and mutual respect, not through frequency or warmth alone. You can be more emotionally available than you appear — the barrier is trust, not feeling.',
```

**INTP:**
```
workStyle: 'You are most productive when you can follow a problem to its root without artificial deadlines cutting off the process. Environments that measure output over depth tend to frustrate you. You produce your best work in independent conditions with access to information and time.',
relationshipStyle: 'Close relationships develop slowly for you, through accumulated experience of being understood. You value intellectual connection and genuine interest in your thinking. Physical presence is not necessary for you to feel close — shared depth is.',
```

**ENTJ:**
```
workStyle: 'You operate best with clear goals, real authority, and high stakes. You think faster than most people around you, which means you need colleagues who can keep up or move aside. You lead regardless of whether you have the title.',
relationshipStyle: 'You are more emotionally invested in your close relationships than your exterior suggests. You show care through action, presence, and honesty — including difficult honesty. You need partners and friends who are direct with you in return.',
```

**ENTP:**
```
workStyle: 'You are most engaged when the work has not been solved before and the rules are not fixed yet. You get bored in roles that optimize execution over invention. You need intellectual peers and contexts where your ability to challenge assumptions is an asset, not a liability.',
relationshipStyle: 'You connect through ideas and debate, often more than through emotional conversation. You respect people who push back on you, and you may find those who do not oddly unsatisfying as close companions. Care shows up as sustained interest in who someone is becoming.',
```

**INFJ:**
```
workStyle: 'You need your work to align with something you believe in, or the energy will not be there regardless of the pay. You work best when you have privacy to think and time to develop ideas before they are tested. Environments that value intuition and depth are where you contribute most.',
relationshipStyle: 'You form very close bonds with very few people. You are often more attuned to others\' emotional states than to your own. You show up fully for people you trust — but the door to that trust opens slowly, and closes quickly if something fundamental is violated.',
```

**INFP:**
```
workStyle: 'Meaning is not a bonus for you — it is the fuel. You can sustain significant effort in work that feels authentic, and very little in work that does not. You are creative and introspective, and you produce your best output when given ownership and purpose rather than process.',
relationshipStyle: 'You love deeply and for a long time — often longer than the other person realises. Authenticity in a relationship matters to you more than consistency or frequency. You need the people close to you to meet you in depth, not just in practicality.',
```

**ENFJ:**
```
workStyle: 'You are energised by work that serves people in a visible way. You collaborate naturally, often becoming the person who holds the group together emotionally. You do your best work when you can see the human impact — and when the people around you are growing.',
relationshipStyle: 'You give a lot to the people you love — often more than they have asked for. Your attunement to others\' needs is a genuine gift, and it can lead to connections that feel rare. The challenge is ensuring you receive as clearly as you give.',
```

**ENFP:**
```
workStyle: 'You are energised by possibility, novelty, and connection. You bring ideas and enthusiasm that others build on. The challenge is sustaining effort through the parts of a project that are less interesting — which is where structure or accountability partnerships help.',
relationshipStyle: 'You fall quickly and warmly into connection with people you find interesting. Your enthusiasm for people is genuine, and it tends to be felt. You need depth alongside energy — relationships that can hold both the exciting version of you and the quieter one.',
```

**ISTJ:**
```
workStyle: 'You are most productive in environments with clear expectations, defined processes, and accountability. You do not need inspiration — you need clarity and a system you can trust. You are the person who ensures things actually get done correctly.',
relationshipStyle: 'You show love through reliability and action, not through expression. The people close to you know they can count on you — and they are right. You are slower to express emotion verbally, but your commitments are deeply consistent.',
```

**ISFJ:**
```
workStyle: 'You work best when you understand how your contribution fits into something larger. You are thorough, reliable, and often the person who holds operational details together. Environments that notice consistent quality — rather than just high-profile contribution — are where you thrive.',
relationshipStyle: 'You love quietly and deeply. You invest in people over time through memory, attention, and care. Your relationships tend to build steadily — and once built, they last. You may find it easier to give than to ask, which is the growth edge.',
```

**ESTJ:**
```
workStyle: 'You operate best with clear authority, measurable goals, and a team that follows through on commitments. You create systems and hold people to them — including yourself. You are most valuable in environments that need order and accountability, not just ideas.',
relationshipStyle: 'You are more dependable than expressive, and the people close to you often know the difference. Your care is demonstrated through presence, loyalty, and reliability. You may not always say how you feel — but you show up consistently.',
```

**ESFJ:**
```
workStyle: 'You coordinate people naturally and make systems run through attentiveness and follow-through. You are energised by work that serves others and involves visible human connection. You prefer environments where relationships and results go together.',
relationshipStyle: 'Relationships are central to how you experience the world. You invest in the people around you practically and emotionally. You are aware of how everyone is doing, and you take steps to help — sometimes at the cost of your own needs.',
```

**ISTP:**
```
workStyle: 'You solve problems most efficiently when left to work through them in your own way. Micro-management and overexplanation slow you down. You are best placed in roles where practical judgment and hands-on competence are what matter.',
relationshipStyle: 'You are more emotionally available than you look, but only with people who give you genuine space. Close relationships are built through shared experience, not conversation. You do not need much — but what you need, you need consistently.',
```

**ISFP:**
```
workStyle: 'You work best when the work has aesthetic, practical, or human meaning you can feel. Abstract performance metrics disconnected from real output are draining. You need environments where quality and authenticity matter more than appearance.',
relationshipStyle: 'You love in a quiet, specific, and often practical way. You notice the small things that matter to people and act on them. You do not need emotional intensity in a relationship — you need authenticity and space.',
```

**ESTP:**
```
workStyle: 'You are most effective when there is a real problem to solve, immediate feedback to work with, and room to improvise. Over-process and under-action frustrate you. You thrive in fast-moving environments where results matter more than method.',
relationshipStyle: 'You connect quickly and warmly, but the depth of that connection varies. You show care through presence, action, and humor. The people who know you well describe you as more loyal than you might advertise.',
```

**ESFP:**
```
workStyle: 'You are most engaged when the work involves people, variety, and visible results. Repetitive tasks without social contact drain you quickly. You bring warmth and energy to collaborative environments and tend to raise morale without trying.',
relationshipStyle: 'You connect fast and genuinely, and you bring joy to the people around you. Sustaining depth through the less exciting phases of a close relationship — the ones that require patience or difficult conversation — is where your relational growth tends to happen.',
```

---

### `PersonalityArchetype` — add `stressPattern: string`, `workStyle: string`, `growthGuidance: string`

Update interface:

```typescript
export interface PersonalityArchetype {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  patterns: { icon: string; title: string; body: string }[];
  strengths: string[];
  blindSpot: string;
  stressPattern: string;  // NEW
  workStyle: string;      // NEW
  growthGuidance: string; // NEW
}
```

**Authored content — all 8 archetypes:**

**ReflectiveExplorer:**
```
stressPattern: 'Under stress, you tend to withdraw into internal processing before you can engage outwardly. The withdrawal can look like distance or detachment to others, even when you are actually working through something important. Stimulating environments or emotional pressure without adequate processing time deplete you faster than most things.',
workStyle: 'You work best with intellectual freedom, uninterrupted focus, and work that rewards depth over speed. Environments that require constant social interaction or fast surface-level output are draining. You produce your best thinking in quiet, with time to follow a problem where it leads.',
growthGuidance: 'The most useful development for you is learning to surface your thinking before it feels complete. This is uncomfortable — but it creates connection, invites collaboration, and often produces better outcomes than finishing alone and presenting. Start with one trusted person.',
```

**CalmStrategist:**
```
stressPattern: 'Stress tends to show up as increased rigidity — a tightening of the plan when the situation is actually calling for flexibility. You may find yourself holding to a structure that is no longer serving the goal, because certainty is more comfortable than improvisation under pressure.',
workStyle: 'You work best with clear goals, defined processes, and the opportunity to plan properly before acting. Environments that reward consistent execution over dramatic output suit you. You are reliable across time — which means roles where long-term follow-through is valued are where you contribute most.',
growthGuidance: 'Your next area of development is learning to read when the plan has outlived its usefulness. Not every shift in circumstances is a problem to solve — some are invitations to adapt. Holding your standards while staying genuinely curious about whether the approach still fits is a high-skill state.',
```

**WarmConnector:**
```
stressPattern: 'Under stress, you tend to absorb others\' emotions while managing your own privately. You may find yourself working to stabilise the people around you when you are the one who actually needs support. The cost of this becomes visible after the fact, not during.',
workStyle: 'You work best in environments that value both relationship quality and practical contribution. Collaborative work energises you when it is genuine rather than performative. You are often a de facto coordinator of human dynamics even without the formal role.',
growthGuidance: 'Advocating for your own needs with the same directness you bring to others is the work. Not because you are not doing enough — but because your sustainability depends on it. The people who care about you cannot help unless they can see what is actually needed.',
```

**SensitiveVisionary:**
```
stressPattern: 'Stress tends to amplify your sensitivity to criticism and interpersonal signals. A critical comment or shift in someone\'s energy can occupy significant mental space, even when it is peripheral to what actually matters. Distinguishing important signals from noise is genuinely harder under pressure.',
workStyle: 'You work best in environments that honour both intuition and quality — where your ability to read beneath the surface is valued rather than discounted. You produce strong outcomes in roles that require emotional intelligence and strategic perception simultaneously. High-noise, low-trust environments cost you significantly.',
growthGuidance: 'Learning to voice your assessments before you have full certainty is both difficult and high-leverage for you. The intuitions you are not sharing are often more accurate than you give them credit for. Trusting them earlier — and testing them with people you respect — is where significant growth is available.',
```

**ExpressiveIdealist:**
```
stressPattern: 'Under stress, your energy can escalate rather than diminish — leading to over-initiation, over-socialising, or optimism that outpaces the reality of a situation. You may generate momentum in a direction that needs a pause rather than more speed. Recognising this as a stress pattern, rather than your natural enthusiasm, gives you a useful pause point.',
workStyle: 'You are most engaged in work that involves people, novelty, and the sense that something is being started. Routine and bureaucracy drain you. You are strongest in roles where your energy and openness to people generate genuine value — and where there is support or structure to ensure follow-through happens.',
growthGuidance: 'Depth of commitment, sustained across time, is where the most significant growth is available to you. Beginning things comes naturally. Staying through the phases that are less exciting — and finding meaning in the consistency rather than the launch — will produce the outcomes your ambition is actually after.',
```

**CuriousArchitect:**
```
stressPattern: 'Under stress, you often disappear into thinking more than is useful — building elaborate frameworks for a situation that actually needs action. The analysis can feel productive while actually being avoidant. Time-bounding your thinking periods and committing to an output before the analysis feels complete is a useful friction.',
workStyle: 'You work best with intellectual latitude, complex problems, and the ability to operate independently for extended periods. Environments that combine creative autonomy with real-world stakes are where you are most motivated. You need intellectual peers who can engage with the full range of what you are building.',
growthGuidance: 'The gap between how clearly you see something internally and how effectively you communicate it externally is the most important gap to close. You have something worth communicating. The work is developing the translation — not as a concession to others, but as the last step in making your thinking actually useful.',
```

**GroundedHarmonizer:**
```
stressPattern: 'Stress tends to push you toward over-accommodation — managing tensions and keeping the peace in ways that delay your own needs getting addressed. You may smooth things over before the underlying issue is fully resolved, which can lead to the same tension recurring.',
workStyle: 'You work best in collaborative environments where reliability and consistency are genuinely valued. You are most effective when the work has human stakes and clear contribution. Your steady, follow-through nature makes you essential in any team that has the self-awareness to notice what you are actually doing.',
growthGuidance: 'Holding tension open long enough for it to be resolved — rather than closing it for the sake of harmony — is the development work. Some conversations need to be uncomfortable to move. Your ability to stay warm while being honest is a rare combination. Using it on behalf of your own needs is the part that needs practice.',
```

**PrivateAnalyst:**
```
stressPattern: 'Stress tends to intensify your withdrawal and self-criticism simultaneously. You may become more reserved externally while holding yourself to higher internal standards than the situation warrants. The gap between what others see and what is actually happening inside widens under pressure.',
workStyle: 'You work best with meaningful problems, high standards, and significant autonomy. Environments that allow independent work with occasional collaboration suit you. The quality of your output tends to be high, and you are most valuable in roles where depth matters.',
growthGuidance: 'Making yourself readable to people who have not yet earned your full trust is genuinely worth doing. Not because openness should be unconditional — but because the gap between your internal life and what others can see is wider than it serves you. Small, deliberate signals of engagement close it significantly.',
```

---

### `RelationshipType` — add `closenessNeeds: string`, `growthGuidance: string`

Update interface:

```typescript
export interface RelationshipType {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  patterns: { icon: string; title: string; body: string }[];
  connectionStyle: string;
  stressResponse: string;
  strengths: string[];
  blindSpot: string;
  gentleNote: string;
  closenessNeeds: string;  // NEW
  growthGuidance: string;  // NEW
}
```

**Authored content — all 4 types:**

**Secure:**
```
closenessNeeds: 'You can hold closeness lightly — moving toward and away from it without the proximity itself becoming a source of anxiety. You need relationships where space is treated as neutral rather than significant. Too much pressure for constant emotional contact is tiring for you, even when the relationship is genuinely good.',
growthGuidance: 'Your secure baseline is a real asset, but it can make it harder to stay patient with partners or friends whose attachment is less settled. The growth edge is not becoming less secure — it is deepening your understanding of what it costs someone else to get there, and adjusting your pace accordingly.',
```

**Anxious:**
```
closenessNeeds: 'You need relationships where the connection is visible enough to feel real. Regular contact, expressed investment, and honest communication about the state of the relationship help you feel settled. Ambiguity and distance without explanation are genuinely difficult — not because you are demanding, but because your attachment system registers uncertainty as a signal worth responding to.',
growthGuidance: 'The most productive development work for this pattern is building your capacity to tolerate ambiguity without immediately seeking reassurance. This is not about needing less — it is about finding the pause between an anxious signal and your response to it. That pause is where you have the most freedom.',
```

**Avoidant:**
```
closenessNeeds: 'You need more independence within a close relationship than most attachment patterns do. This is not about low investment — it is about the conditions under which you can invest without feeling overwhelmed. Relationships where you are given genuine space and are not required to process everything verbally are the ones where you show up most.',
growthGuidance: 'Letting people in more, more often, before complete trust is established is the work. Not recklessly, but progressively. The people who matter most to you benefit more from your presence than from your protection. Small acts of deliberate openness, over time, tend to produce the quality of closeness that is actually worth the risk.',
```

**FearfulAvoidant:**
```
closenessNeeds: 'You need relationships with enough consistency and low-stakes contact to build safety incrementally. You can become genuinely close with people — but only through accumulated evidence of safety, not through leaps. Relationships that move fast toward high intimacy tend to trigger the part of you that protects itself, even when the other person has done nothing wrong.',
growthGuidance: 'The pattern of wanting closeness and then moving away from it — or pushing people away just as it becomes real — is recognisable to you even when it is hard to stop in the moment. The most useful practice is not resisting the impulse entirely, but staying present in low-stakes moments of connection until the threat response softens. It does soften.',
```

---

### `CommunicationStyleType` — add `boundaryStyle: string`, `repairStyle: string`, `growthGuidance: string`

Update interface:

```typescript
export interface CommunicationStyleType {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  patterns: { icon: string; title: string; body: string }[];
  conflictPattern: string;
  bestEnvironment: string;
  strengths: string[];
  blindSpot: string;
  boundaryStyle: string;  // NEW
  repairStyle: string;    // NEW
  growthGuidance: string; // NEW
}
```

**Authored content — all 5 types:**

**DirectHarmonizer:**
```
boundaryStyle: 'You tend to set limits clearly when they are crossed — though you usually extend significant goodwill before the limit is named. Your directness means limits are stated more explicitly than with most styles, which can feel blunt to people who communicate indirectly. You would rather clarify than manage a resentment.',
repairStyle: 'After conflict, you tend to move toward resolution fairly quickly. Sitting in unresolved tension is uncomfortable. You are willing to say what needs to be said to close a rupture, and you expect others to meet you in that. Drawn-out repair processes test your patience.',
growthGuidance: 'The place where the most development is available is in slowing down the drive to resolve — not to avoid resolution, but to ensure both people have fully had their say before you move on. Sometimes repair feels complete to you before it does to the other person.',
```

**ReflectiveProcessor:**
```
boundaryStyle: 'You tend to set limits indirectly or very late — often after you have absorbed more than you needed to. You notice when something feels off long before you name it. The gap between noticing and saying is where the cost accumulates.',
repairStyle: 'After conflict, you need time to process before you can re-engage. Being pushed toward repair before that has happened tends to produce surface agreement rather than genuine resolution. Given space, you tend to return to people fully — and more thoughtfully than most.',
growthGuidance: 'Naming what you need, when you notice you need it — rather than waiting until the situation is clearer — is the development work. The wait is understandable. But by the time clarity arrives, others may have moved on or drawn the wrong conclusions.',
```

**CalmStrategist (communication):**
```
boundaryStyle: 'You set limits through policy and principle rather than through emotional expression. You tend not to make it personal — you state the standard and hold to it. This works well in low-stakes contexts; in high-stakes personal ones, people sometimes need to feel the emotional weight behind the limit, not just the logic.',
repairStyle: 'You approach repair practically and without drama. Once you have identified the problem, you propose a fix. The emotional residue of conflict is less important to you than whether the functional problem has been solved. Some people need more of the emotional piece before the practical is useful.',
growthGuidance: 'Sitting with the relational texture of a conflict — the feelings, not just the facts — is the edge. Not because emotional processing is more valid than practical resolution, but because people sometimes need to be met in the feeling before they can receive the solution.',
```

**ExpressiveConnector:**
```
boundaryStyle: 'You find it genuinely difficult to set limits when doing so risks the relationship. You may absorb more than is sustainable because you are unwilling to introduce friction. When limits do get set, they sometimes come out more sharply than intended — the result of long restraint rather than aggression.',
repairStyle: 'You repair through warmth and re-connection rather than through explicit conversation about what went wrong. You tend to soften things with affection and check-in rather than revisit the conflict directly. This works in some relationships; in others, it can leave the underlying issue unaddressed.',
growthGuidance: 'Learning to name a limit in the moment rather than after the resentment has built is the highest-leverage development available here. You can be warm and direct at the same time — the warmth does not require you to be silent about what you need.',
```

**IndependentProtector:**
```
boundaryStyle: 'You set limits clearly and early, usually through withdrawal rather than direct statement. Others often feel the boundary before it is articulated. You are not interested in over-explaining your limits — you expect them to be respected once they are visible.',
repairStyle: 'After conflict, you need significant time and space before re-engagement is possible. Coming back too quickly feels like unfinished business. When you do return, it is usually with clarity — but the period of distance can feel extended to others who process differently.',
growthGuidance: 'Articulating limits verbally — rather than letting them be inferred from your behavior — shortens the distance others feel and reduces the chance of misinterpretation. Not all of your withdrawal is readable as a boundary. Some of it looks like rejection.',
```

---

### Trait interpretations — `TRAIT_HIGH` and `TRAIT_LOW` maps

New constants to add to `src/data/resultTypes.ts` (at the bottom, after the other type archetype exports):

```typescript
export const TRAIT_HIGH: Record<string, string> = {
  O: 'You are drawn to ideas, novelty, and complexity. New frameworks, unconventional thinking, and open-ended questions tend to energise you. You are more likely than most to be changed by a good conversation.',
  C: 'You bring genuine follow-through and structure to almost everything you take on. Commitments feel real to you. You tend to hold yourself to a consistent standard even when no one is watching.',
  E: 'You are energised by contact with people and drawn toward environments where things are happening. Social engagement fills rather than drains you. Isolation for extended periods becomes uncomfortable fairly quickly.',
  A: 'You lead with warmth and tend toward cooperation over competition. You are genuinely responsive to others\' needs and states. This makes you easy to work with and often a stabilising presence — at some cost to your own directness.',
  N: 'You feel things fully and often notice the emotional texture of situations before others do. Your sensitivity is real information — it tells you things. The challenge is distinguishing signal from noise, especially under stress.',
};

export const TRAIT_LOW: Record<string, string> = {
  O: 'You prefer what is concrete, tested, and reliable. Proven approaches give you more confidence than novel ones, and you trust experience over theory. This is a strength in contexts where consistency and precision matter.',
  C: 'You work best with flexibility and open-ended timelines. Fixed processes and rigid planning tend to feel constraining. You often do your best thinking in response to what is actually happening rather than what was anticipated.',
  E: 'You restore through solitude and prefer depth over breadth in your social world. Extended social contact is tiring regardless of how much you enjoy it. Your best thinking happens in quiet, and you are more present in small groups than large ones.',
  A: 'You tend to be more analytic than accommodating when interests conflict. You are direct and willing to disagree, which is useful in contexts where truth matters more than harmony. It can create friction in environments built around consensus.',
  N: 'You tend to stay regulated under conditions that would destabilise others. Emotional pressure does not quickly disrupt your functioning. This is a genuine strength in high-stakes situations — and something to stay aware of when others around you are struggling.',
};
```

**Usage in result.tsx (Personality Traits deep report):**

```typescript
// Derive highest and lowest 2 traits from scores
const entries = Object.entries(scores as PersonalityScores) as [string, number][];
const sorted = [...entries].sort((a, b) => b[1] - a[1]);
const highest = sorted.slice(0, 2);   // top 2
const lowest = sorted.slice(-2).reverse(); // bottom 2
```

Threshold for "high" vs "low": score ≥ 60 → use `TRAIT_HIGH`; score ≤ 40 → use `TRAIT_LOW`. Between 40–60: show the trait bar only (no interpretation text — the score is in the middle range and neither pole is dominant).

---

## UI design — locked premium card

### Placement

Replaces the existing generic premium card in `result.tsx`. Rendered where the current card is — below the "GROWTH EDGE" section, above the actions row.

### Structure (all 4 assessments)

```
[glass card — accentColor tint on gradient + border]
  [badge: ✦ DEEP REPORT — accentColor]
  [title: "Go deeper into your [assessment name]"]
  [subtitle: assessment-specific (see below)]
  [includes list: 5 items, simple checkmark rows]
  [nudge: small text — "Also unlocks all other deep reports + full InnerType report"]
  [CTA button: gold gradient — "Unlock InnerType Premium · €4.99"]
  [meta: "One-time unlock · No subscription"]
```

The card background gradient uses `[accentColor + '12', accentColor + '04']` — subtle, not aggressive. The CTA button always uses `Colors.gradientGold` — consistent premium signal.

### Assessment-specific content

**Personality Type:**
- Title: Go deeper into your Personality Type
- Subtitle: Unlock your full type report — plus all deep reports and your complete InnerType synthesis.
- Includes: Full type interpretation · Work style · How you connect · Growth guidance · Share card preview

**Personality Traits:**
- Title: Go deeper into your trait profile
- Subtitle: Unlock deeper guidance for your core tendencies — plus all other reports.
- Includes: Highest & lowest traits · Strengths · Stress patterns · Work style · Growth guidance

**Relationship Pattern:**
- Title: Go deeper into your relationship pattern
- Subtitle: Unlock deeper insight into how you connect, protect yourself, and build trust.
- Includes: How trust builds · What creates distance · Closeness needs · Strengths · Growth guidance

**Communication Style:**
- Title: Go deeper into your communication style
- Subtitle: Unlock deeper guidance for conflict, boundaries, and repair — plus all other reports.
- Includes: Conflict style · Boundary style · Repair style · Work & team style · Growth guidance

---

## UI design — unlocked deep report sections

### Placement

When `isPremium === true`, the premium card is replaced by deep report sections. Section cards render inline below the free content (below "GROWTH EDGE"), above the actions row.

### Pattern

```
[section divider: "DEEP REPORT" label + hairline, accentColor label]

[compact card — accentColor tint]
  [small uppercase label + icon]
  [body text or bullet list]

[compact card...]
...
```

Same glass card pattern as `report.tsx` unlocked sections (`UnlockedCard`), but using the assessment `accentColor`.

Strengths render as a bullet list. All other sections are paragraph text.

### Sections per assessment

**Personality Type deep report** (sources: TypeArchetype fields):

| Label | Icon | Source |
|---|---|---|
| STRENGTHS | `star-outline` | `archetypeData.strengths` (bullet list) |
| WORK STYLE | `briefcase-outline` | `archetypeData.workStyle` (NEW) |
| HOW YOU CONNECT | `heart-outline` | `archetypeData.relationshipStyle` (NEW) |
| GROWTH GUIDANCE | `trending-up-outline` | `archetypeData.growthEdge` (exists, not shown free) |
| SHARE CARD PREVIEW | — | Inline visual card + "Preview share card" → Modal |

**Personality Traits deep report** (sources: PersonalityArchetype + score-derived):

| Label | Icon | Source |
|---|---|---|
| HIGHEST TRAITS | `arrow-up-outline` | top 2 scores → `TRAIT_HIGH[dim]` or bar only |
| LOWEST TRAITS | `arrow-down-outline` | bottom 2 scores → `TRAIT_LOW[dim]` or bar only |
| STRENGTHS | `star-outline` | `archetypeData.strengths` (bullet list) |
| STRESS PATTERN | `flash-outline` | `archetypeData.stressPattern` (NEW) |
| WORK STYLE | `briefcase-outline` | `archetypeData.workStyle` (NEW) |
| GROWTH GUIDANCE | `trending-up-outline` | `archetypeData.growthGuidance` (NEW) |

**Relationship Pattern deep report** (sources: RelationshipType fields):

| Label | Icon | Source |
|---|---|---|
| HOW TRUST BUILDS | `shield-checkmark-outline` | `archetypeData.connectionStyle` (not shown free) |
| WHAT CREATES DISTANCE | `flash-outline` | `archetypeData.stressResponse` (not shown free) |
| STRENGTHS | `star-outline` | `archetypeData.strengths` (bullet list) |
| WHAT YOU MAY NOT SAY | `chatbubble-ellipses-outline` | `archetypeData.gentleNote` (not shown free) |
| CLOSENESS NEEDS | `heart-circle-outline` | `archetypeData.closenessNeeds` (NEW) |
| GROWTH GUIDANCE | `trending-up-outline` | `archetypeData.growthGuidance` (NEW) |

**Communication Style deep report** (sources: CommunicationStyleType fields):

| Label | Icon | Source |
|---|---|---|
| CONFLICT STYLE | `warning-outline` | `archetypeData.conflictPattern` (not shown free) |
| WORK & TEAM STYLE | `briefcase-outline` | `archetypeData.bestEnvironment` (not shown free) |
| STRENGTHS | `star-outline` | `archetypeData.strengths` (bullet list) |
| BOUNDARY STYLE | `shield-outline` | `archetypeData.boundaryStyle` (NEW) |
| REPAIR STYLE | `refresh-outline` | `archetypeData.repairStyle` (NEW) |
| GROWTH GUIDANCE | `trending-up-outline` | `archetypeData.growthGuidance` (NEW) |

---

## Share card — Personality Type only

When `isPremium === true` and `id === 'type'`, show an inline share card preview at the bottom of the deep report. Same visual design as the share card in `report.tsx`:

- Dark background with `ProfileOrb` glow (assessment accentColor)
- "INNERTYPE" wordmark
- 4-letter type code (large, bold, accentColor) — e.g., "ISTJ"
- Archetype label (display font)
- 3 chips
- "Profile clarity · X%" footer
- "InnerType Personality Test" footer

CTA below card: "Preview share card" → opens React Native `Modal` showing the card at scale.
Small text: "Share card — coming soon"

---

## report.tsx — minor update

Update the premium card subtitle (1 line change):

**Find:**
```
"Go beyond the result — see how your patterns shape relationships, work, stress, and growth."
```

**Replace with:**
```
"Unlock all 4 deep assessment reports and your complete InnerType synthesis."
```

---

## Security / legal constraints (unchanged from previous sprint)

- No "MBTI", "Myers-Briggs", "16Personalities", "clinically validated" in any UI-facing string
- Safe phrases only: "type-based personality framework", "ISTJ-style pattern", "inspired by type-based frameworks"
- Exception: methodology disclaimer "Not an official MBTI assessment. Not affiliated with Myers-Briggs or the Myers & Briggs Foundation." is permitted
- No real payment integration — `setPremium(true)` mock only
- All data local (AsyncStorage only)
- No fake urgency, no countdown timers, no subscriptions

---

## Acceptance criteria

1. There is only one premium product: InnerType Premium · €4.99. No "from €4.99" anywhere.
2. Each of the 4 assessment result pages has a contextual premium card with assessment-specific title, subtitle, and includes list.
3. All contextual cards CTA routes to `/paywall` which sets the same `isPremium` flag.
4. When `isPremium === true`, each result page shows its deep report sections inline below the free result.
5. Deep report sections use only content not already shown in the free result (no redundancy).
6. Personality Type deep report includes a share card preview with Modal.
7. Personality Traits highest/lowest sections are score-derived (show the actual top 2 and bottom 2 dimensions).
8. All 89 new authored strings are present in the data (32 TypeArchetype + 24 PersonalityArchetype + 8 RelationshipType + 15 CommunicationStyleType + 10 trait interpretations).
9. Free result is unchanged — same hero, patterns, scores, growth edge.
10. `report.tsx` premium card subtitle updated to reference "all 4 deep assessment reports."
11. `npx tsc --noEmit` passes with zero errors.
12. No ads, subscriptions, real payments, or fake urgency added.
