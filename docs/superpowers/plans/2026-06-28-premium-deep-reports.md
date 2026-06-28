# Premium Deep Reports — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add contextual premium upsells to all 4 assessment result pages, with a single `isPremium` flag driving locked/unlocked deep report sections per assessment.

**Architecture:** Extend 4 archetype data types with new fields (89 total authored strings stored in the spec), then update `result.tsx` to read `isPremium` from the loaded profile and conditionally render either a contextual locked card or inline deep report sections; `report.tsx` gets a 1-line subtitle fix.

**Tech Stack:** Expo SDK 56, React Native 0.85.3, TypeScript strict, AsyncStorage via `profileStorage.ts`, Expo Router v3, `expo-linear-gradient`, `@expo/vector-icons` Ionicons.

## Global Constraints

- No "MBTI", "Myers-Briggs", "16Personalities", or "clinically validated" in any UI-facing string
- Premium product label: **"Unlock InnerType Premium · €4.99"** — never "from €4.99"
- Premium meta text: **"One-time unlock · No subscription."**
- All premium CTAs route to `/paywall` — no real IAP
- No ads, subscriptions, fake urgency, countdown timers
- All data stays local (AsyncStorage only)
- `npx tsc --noEmit` must pass with zero errors at the end of every task
- All authored strings must be used verbatim from the spec at `docs/superpowers/specs/2026-06-28-premium-deep-reports-design.md`

---

## File map

| File | Change |
|---|---|
| `src/data/resultTypes.ts` | Add fields to 4 interfaces; add authored content for 33 entries; add TRAIT_HIGH/LOW constants |
| `app/assessment/[id]/result.tsx` | Extract `isPremium`; replace premium card; add unlocked sections + share card modal |
| `app/report.tsx` | 1-line subtitle change |

---

### Task 1: TypeArchetype data layer — interface + all 16 entries

**Files:**
- Modify: `src/data/resultTypes.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `TypeArchetype.workStyle: string`, `TypeArchetype.relationshipStyle: string` — both consumed by Tasks 3 and 4

- [ ] **Step 1: Update the TypeArchetype interface**

Find the `TypeArchetype` interface (around line 781 in `src/data/resultTypes.ts`) and add two new required string fields at the end:

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
  workStyle: string;         // NEW
  relationshipStyle: string; // NEW
}
```

- [ ] **Step 2: Verify TypeScript errors on missing fields**

```bash
cd innertype && npx tsc --noEmit 2>&1 | head -20
```

Expected: errors like `Property 'workStyle' is missing in type ...` for all 16 TYPE_ARCHETYPES entries. This confirms the interface gate works.

- [ ] **Step 3: Add workStyle and relationshipStyle to all 16 TYPE_ARCHETYPES entries**

Read the exact strings from the spec at `docs/superpowers/specs/2026-06-28-premium-deep-reports-design.md` (section "TypeArchetype — workStyle and relationshipStyle for all 16 types"). Add after `growthEdge` in each entry. All 16 entries shown below with exact strings:

**INTJ** (after `growthEdge: 'Letting others into...'`):
```typescript
workStyle: 'You do your best work when you have genuine ownership of the problem and the latitude to solve it your way. Collaboration is useful when it adds thinking you do not have — not as a process requirement. You need work that rewards depth and precision.',
relationshipStyle: 'You invest deeply in a very small number of people, and that investment is real. Closeness builds through shared thinking and mutual respect, not through frequency or warmth alone. You can be more emotionally available than you appear — the barrier is trust, not feeling.',
```

**INTP** (after `growthEdge: 'Choosing done over perfect...'`):
```typescript
workStyle: 'You are most productive when you can follow a problem to its root without artificial deadlines cutting off the process. Environments that measure output over depth tend to frustrate you. You produce your best work in independent conditions with access to information and time.',
relationshipStyle: 'Close relationships develop slowly for you, through accumulated experience of being understood. You value intellectual connection and genuine interest in your thinking. Physical presence is not necessary for you to feel close — shared depth is.',
```

**ENTJ** (after `growthEdge: 'Learning when to pause...'`):
```typescript
workStyle: 'You operate best with clear goals, real authority, and high stakes. You think faster than most people around you, which means you need colleagues who can keep up or move aside. You lead regardless of whether you have the title.',
relationshipStyle: 'You are more emotionally invested in your close relationships than your exterior suggests. You show care through action, presence, and honesty — including difficult honesty. You need partners and friends who are direct with you in return.',
```

**ENTP** (after `growthEdge: 'Choosing one thread...'`):
```typescript
workStyle: 'You are most engaged when the work has not been solved before and the rules are not fixed yet. You get bored in roles that optimize execution over invention. You need intellectual peers and contexts where your ability to challenge assumptions is an asset, not a liability.',
relationshipStyle: 'You connect through ideas and debate, often more than through emotional conversation. You respect people who push back on you, and you may find those who do not oddly unsatisfying as close companions. Care shows up as sustained interest in who someone is becoming.',
```

**INFJ** (after `growthEdge: 'Letting people into the process...'`):
```typescript
workStyle: 'You need your work to align with something you believe in, or the energy will not be there regardless of the pay. You work best when you have privacy to think and time to develop ideas before they are tested. Environments that value intuition and depth are where you contribute most.',
relationshipStyle: 'You form very close bonds with very few people. You are often more attuned to others\' emotional states than to your own. You show up fully for people you trust — but the door to that trust opens slowly, and closes quickly if something fundamental is violated.',
```

**INFP** (after `growthEdge: 'Separating feedback about the work...'`):
```typescript
workStyle: 'Meaning is not a bonus for you — it is the fuel. You can sustain significant effort in work that feels authentic, and very little in work that does not. You are creative and introspective, and you produce your best output when given ownership and purpose rather than process.',
relationshipStyle: 'You love deeply and for a long time — often longer than the other person realises. Authenticity in a relationship matters to you more than consistency or frequency. You need the people close to you to meet you in depth, not just in practicality.',
```

**ENFJ** (after `growthEdge: 'Naming your own needs...'`):
```typescript
workStyle: 'You are energised by work that serves people in a visible way. You collaborate naturally, often becoming the person who holds the group together emotionally. You do your best work when you can see the human impact — and when the people around you are growing.',
relationshipStyle: 'You give a lot to the people you love — often more than they have asked for. Your attunement to others\' needs is a genuine gift, and it can lead to connections that feel rare. The challenge is ensuring you receive as clearly as you give.',
```

**ENFP** (after `growthEdge: 'Building systems that hold you...'`):
```typescript
workStyle: 'You are energised by possibility, novelty, and connection. You bring ideas and enthusiasm that others build on. The challenge is sustaining effort through the parts of a project that are less interesting — which is where structure or accountability partnerships help.',
relationshipStyle: 'You fall quickly and warmly into connection with people you find interesting. Your enthusiasm for people is genuine, and it tends to be felt. You need depth alongside energy — relationships that can hold both the exciting version of you and the quieter one.',
```

**ISTJ** (after `growthEdge: 'Holding your standards while staying curious...'`):
```typescript
workStyle: 'You are most productive in environments with clear expectations, defined processes, and accountability. You do not need inspiration — you need clarity and a system you can trust. You are the person who ensures things actually get done correctly.',
relationshipStyle: 'You show love through reliability and action, not through expression. The people close to you know they can count on you — and they are right. You are slower to express emotion verbally, but your commitments are deeply consistent.',
```

**ISFJ** (after `growthEdge: 'Naming what you need before you\'re already depleted.'`):
```typescript
workStyle: 'You work best when you understand how your contribution fits into something larger. You are thorough, reliable, and often the person who holds operational details together. Environments that notice consistent quality — rather than just high-profile contribution — are where you thrive.',
relationshipStyle: 'You love quietly and deeply. You invest in people over time through memory, attention, and care. Your relationships tend to build steadily — and once built, they last. You may find it easier to give than to ask, which is the growth edge.',
```

**ESTJ** (after `growthEdge: 'Distinguishing between standards worth defending...'`):
```typescript
workStyle: 'You operate best with clear authority, measurable goals, and a team that follows through on commitments. You create systems and hold people to them — including yourself. You are most valuable in environments that need order and accountability, not just ideas.',
relationshipStyle: 'You are more dependable than expressive, and the people close to you often know the difference. Your care is demonstrated through presence, loyalty, and reliability. You may not always say how you feel — but you show up consistently.',
```

**ESFJ** (after `growthEdge: 'Being direct when care requires it...'`):
```typescript
workStyle: 'You coordinate people naturally and make systems run through attentiveness and follow-through. You are energised by work that serves others and involves visible human connection. You prefer environments where relationships and results go together.',
relationshipStyle: 'Relationships are central to how you experience the world. You invest in the people around you practically and emotionally. You are aware of how everyone is doing, and you take steps to help — sometimes at the cost of your own needs.',
```

**ISTP** (after `growthEdge: 'Proactively updating others as a tool...'`):
```typescript
workStyle: 'You solve problems most efficiently when left to work through them in your own way. Micro-management and overexplanation slow you down. You are best placed in roles where practical judgment and hands-on competence are what matter.',
relationshipStyle: 'You are more emotionally available than you look, but only with people who give you genuine space. Close relationships are built through shared experience, not conversation. You do not need much — but what you need, you need consistently.',
```

**ISFP** (after `growthEdge: 'Speaking up earlier when something conflicts...'`):
```typescript
workStyle: 'You work best when the work has aesthetic, practical, or human meaning you can feel. Abstract performance metrics disconnected from real output are draining. You need environments where quality and authenticity matter more than appearance.',
relationshipStyle: 'You love in a quiet, specific, and often practical way. You notice the small things that matter to people and act on them. You do not need emotional intensity in a relationship — you need authenticity and space.',
```

**ESTP** (after `growthEdge: 'Slowing down long enough to understand a system...'`):
```typescript
workStyle: 'You are most effective when there is a real problem to solve, immediate feedback to work with, and room to improvise. Over-process and under-action frustrate you. You thrive in fast-moving environments where results matter more than method.',
relationshipStyle: 'You connect quickly and warmly, but the depth of that connection varies. You show care through presence, action, and humor. The people who know you well describe you as more loyal than you might advertise.',
```

**ESFP** (after `growthEdge: 'Building in enough structure to protect future-you...'`):
```typescript
workStyle: 'You are most engaged when the work involves people, variety, and visible results. Repetitive tasks without social contact drain you quickly. You bring warmth and energy to collaborative environments and tend to raise morale without trying.',
relationshipStyle: 'You connect fast and genuinely, and you bring joy to the people around you. Sustaining depth through the less exciting phases of a close relationship — the ones that require patience or difficult conversation — is where your relational growth tends to happen.',
```

- [ ] **Step 4: Verify TypeScript passes with zero errors**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output. If errors remain, check that all 16 entries have both `workStyle` and `relationshipStyle` as string values (not empty string).

- [ ] **Step 5: Commit**

```bash
git add src/data/resultTypes.ts
git commit -m "feat(data): add workStyle and relationshipStyle to TypeArchetype (16 entries)"
```

---

### Task 2: PersonalityArchetype, RelationshipType, CommunicationStyleType + TRAIT maps

**Files:**
- Modify: `src/data/resultTypes.ts`

**Interfaces:**
- Consumes: Task 1 (file already updated)
- Produces:
  - `PersonalityArchetype.stressPattern: string`, `.workStyle: string`, `.growthGuidance: string`
  - `RelationshipType.closenessNeeds: string`, `.growthGuidance: string`
  - `CommunicationStyleType.boundaryStyle: string`, `.repairStyle: string`, `.growthGuidance: string`
  - `TRAIT_HIGH: Record<string, string>` (exported)
  - `TRAIT_LOW: Record<string, string>` (exported)
  All consumed by Task 4.

- [ ] **Step 1: Update PersonalityArchetype interface**

The `PersonalityArchetype` interface is at the very top of `src/data/resultTypes.ts` (line 3, **before** the `PERSONALITY_ARCHETYPES` array). Add 3 new required fields:

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

- [ ] **Step 2: Update RelationshipType interface**

Find the `RelationshipType` interface (around line 243). Add 2 new required fields after `gentleNote`:

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

- [ ] **Step 3: Update CommunicationStyleType interface**

Find the `CommunicationStyleType` interface (around line 398). Add 3 new required fields after `blindSpot`:

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

- [ ] **Step 4: Verify TypeScript errors on missing fields**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: errors for each of the 8+4+5=17 entries missing new fields.

- [ ] **Step 5: Add new fields to all 8 PERSONALITY_ARCHETYPES entries**

Add after the `blindSpot` field in each entry. Exact strings from the spec (section "PersonalityArchetype — stressPattern, workStyle, growthGuidance"):

**ReflectiveExplorer:**
```typescript
stressPattern: 'Under stress, you tend to withdraw into internal processing before you can engage outwardly. The withdrawal can look like distance or detachment to others, even when you are actually working through something important. Stimulating environments or emotional pressure without adequate processing time deplete you faster than most things.',
workStyle: 'You work best with intellectual freedom, uninterrupted focus, and work that rewards depth over speed. Environments that require constant social interaction or fast surface-level output are draining. You produce your best thinking in quiet, with time to follow a problem where it leads.',
growthGuidance: 'The most useful development for you is learning to surface your thinking before it feels complete. This is uncomfortable — but it creates connection, invites collaboration, and often produces better outcomes than finishing alone and presenting. Start with one trusted person.',
```

**CalmStrategist:**
```typescript
stressPattern: 'Stress tends to show up as increased rigidity — a tightening of the plan when the situation is actually calling for flexibility. You may find yourself holding to a structure that is no longer serving the goal, because certainty is more comfortable than improvisation under pressure.',
workStyle: 'You work best with clear goals, defined processes, and the opportunity to plan properly before acting. Environments that reward consistent execution over dramatic output suit you. You are reliable across time — which means roles where long-term follow-through is valued are where you contribute most.',
growthGuidance: 'Your next area of development is learning to read when the plan has outlived its usefulness. Not every shift in circumstances is a problem to solve — some are invitations to adapt. Holding your standards while staying genuinely curious about whether the approach still fits is a high-skill state.',
```

**WarmConnector:**
```typescript
stressPattern: 'Under stress, you tend to absorb others\' emotions while managing your own privately. You may find yourself working to stabilise the people around you when you are the one who actually needs support. The cost of this becomes visible after the fact, not during.',
workStyle: 'You work best in environments that value both relationship quality and practical contribution. Collaborative work energises you when it is genuine rather than performative. You are often a de facto coordinator of human dynamics even without the formal role.',
growthGuidance: 'Advocating for your own needs with the same directness you bring to others is the work. Not because you are not doing enough — but because your sustainability depends on it. The people who care about you cannot help unless they can see what is actually needed.',
```

**SensitiveVisionary:**
```typescript
stressPattern: 'Stress tends to amplify your sensitivity to criticism and interpersonal signals. A critical comment or shift in someone\'s energy can occupy significant mental space, even when it is peripheral to what actually matters. Distinguishing important signals from noise is genuinely harder under pressure.',
workStyle: 'You work best in environments that honour both intuition and quality — where your ability to read beneath the surface is valued rather than discounted. You produce strong outcomes in roles that require emotional intelligence and strategic perception simultaneously. High-noise, low-trust environments cost you significantly.',
growthGuidance: 'Learning to voice your assessments before you have full certainty is both difficult and high-leverage for you. The intuitions you are not sharing are often more accurate than you give them credit for. Trusting them earlier — and testing them with people you respect — is where significant growth is available.',
```

**ExpressiveIdealist:**
```typescript
stressPattern: 'Under stress, your energy can escalate rather than diminish — leading to over-initiation, over-socialising, or optimism that outpaces the reality of a situation. You may generate momentum in a direction that needs a pause rather than more speed. Recognising this as a stress pattern, rather than your natural enthusiasm, gives you a useful pause point.',
workStyle: 'You are most engaged in work that involves people, novelty, and the sense that something is being started. Routine and bureaucracy drain you. You are strongest in roles where your energy and openness to people generate genuine value — and where there is support or structure to ensure follow-through happens.',
growthGuidance: 'Depth of commitment, sustained across time, is where the most significant growth is available to you. Beginning things comes naturally. Staying through the phases that are less exciting — and finding meaning in the consistency rather than the launch — will produce the outcomes your ambition is actually after.',
```

**CuriousArchitect:**
```typescript
stressPattern: 'Under stress, you often disappear into thinking more than is useful — building elaborate frameworks for a situation that actually needs action. The analysis can feel productive while actually being avoidant. Time-bounding your thinking periods and committing to an output before the analysis feels complete is a useful friction.',
workStyle: 'You work best with intellectual latitude, complex problems, and the ability to operate independently for extended periods. Environments that combine creative autonomy with real-world stakes are where you are most motivated. You need intellectual peers who can engage with the full range of what you are building.',
growthGuidance: 'The gap between how clearly you see something internally and how effectively you communicate it externally is the most important gap to close. You have something worth communicating. The work is developing the translation — not as a concession to others, but as the last step in making your thinking actually useful.',
```

**GroundedHarmonizer:**
```typescript
stressPattern: 'Stress tends to push you toward over-accommodation — managing tensions and keeping the peace in ways that delay your own needs getting addressed. You may smooth things over before the underlying issue is fully resolved, which can lead to the same tension recurring.',
workStyle: 'You work best in collaborative environments where reliability and consistency are genuinely valued. You are most effective when the work has human stakes and clear contribution. Your steady, follow-through nature makes you essential in any team that has the self-awareness to notice what you are actually doing.',
growthGuidance: 'Holding tension open long enough for it to be resolved — rather than closing it for the sake of harmony — is the development work. Some conversations need to be uncomfortable to move. Your ability to stay warm while being honest is a rare combination. Using it on behalf of your own needs is the part that needs practice.',
```

**PrivateAnalyst:**
```typescript
stressPattern: 'Stress tends to intensify your withdrawal and self-criticism simultaneously. You may become more reserved externally while holding yourself to higher internal standards than the situation warrants. The gap between what others see and what is actually happening inside widens under pressure.',
workStyle: 'You work best with meaningful problems, high standards, and significant autonomy. Environments that allow independent work with occasional collaboration suit you. The quality of your output tends to be high, and you are most valuable in roles where depth matters.',
growthGuidance: 'Making yourself readable to people who have not yet earned your full trust is genuinely worth doing. Not because openness should be unconditional — but because the gap between your internal life and what others can see is wider than it serves you. Small, deliberate signals of engagement close it significantly.',
```

- [ ] **Step 6: Add new fields to all 4 RELATIONSHIP_TYPES entries**

Add after `gentleNote` in each entry:

**Secure:**
```typescript
closenessNeeds: 'You can hold closeness lightly — moving toward and away from it without the proximity itself becoming a source of anxiety. You need relationships where space is treated as neutral rather than significant. Too much pressure for constant emotional contact is tiring for you, even when the relationship is genuinely good.',
growthGuidance: 'Your secure baseline is a real asset, but it can make it harder to stay patient with partners or friends whose attachment is less settled. The growth edge is not becoming less secure — it is deepening your understanding of what it costs someone else to get there, and adjusting your pace accordingly.',
```

**Anxious:**
```typescript
closenessNeeds: 'You need relationships where the connection is visible enough to feel real. Regular contact, expressed investment, and honest communication about the state of the relationship help you feel settled. Ambiguity and distance without explanation are genuinely difficult — not because you are demanding, but because your attachment system registers uncertainty as a signal worth responding to.',
growthGuidance: 'The most productive development work for this pattern is building your capacity to tolerate ambiguity without immediately seeking reassurance. This is not about needing less — it is about finding the pause between an anxious signal and your response to it. That pause is where you have the most freedom.',
```

**Avoidant:**
```typescript
closenessNeeds: 'You need more independence within a close relationship than most attachment patterns do. This is not about low investment — it is about the conditions under which you can invest without feeling overwhelmed. Relationships where you are given genuine space and are not required to process everything verbally are the ones where you show up most.',
growthGuidance: 'Letting people in more, more often, before complete trust is established is the work. Not recklessly, but progressively. The people who matter most to you benefit more from your presence than from your protection. Small acts of deliberate openness, over time, tend to produce the quality of closeness that is actually worth the risk.',
```

**FearfulAvoidant:**
```typescript
closenessNeeds: 'You need relationships with enough consistency and low-stakes contact to build safety incrementally. You can become genuinely close with people — but only through accumulated evidence of safety, not through leaps. Relationships that move fast toward high intimacy tend to trigger the part of you that protects itself, even when the other person has done nothing wrong.',
growthGuidance: 'The pattern of wanting closeness and then moving away from it — or pushing people away just as it becomes real — is recognisable to you even when it is hard to stop in the moment. The most useful practice is not resisting the impulse entirely, but staying present in low-stakes moments of connection until the threat response softens. It does soften.',
```

- [ ] **Step 7: Add new fields to all 5 COMMUNICATION_TYPES entries**

Add after `blindSpot` in each entry:

**DirectHarmonizer:**
```typescript
boundaryStyle: 'You tend to set limits clearly when they are crossed — though you usually extend significant goodwill before the limit is named. Your directness means limits are stated more explicitly than with most styles, which can feel blunt to people who communicate indirectly. You would rather clarify than manage a resentment.',
repairStyle: 'After conflict, you tend to move toward resolution fairly quickly. Sitting in unresolved tension is uncomfortable. You are willing to say what needs to be said to close a rupture, and you expect others to meet you in that. Drawn-out repair processes test your patience.',
growthGuidance: 'The place where the most development is available is in slowing down the drive to resolve — not to avoid resolution, but to ensure both people have fully had their say before you move on. Sometimes repair feels complete to you before it does to the other person.',
```

**ReflectiveProcessor:**
```typescript
boundaryStyle: 'You tend to set limits indirectly or very late — often after you have absorbed more than you needed to. You notice when something feels off long before you name it. The gap between noticing and saying is where the cost accumulates.',
repairStyle: 'After conflict, you need time to process before you can re-engage. Being pushed toward repair before that has happened tends to produce surface agreement rather than genuine resolution. Given space, you tend to return to people fully — and more thoughtfully than most.',
growthGuidance: 'Naming what you need, when you notice you need it — rather than waiting until the situation is clearer — is the development work. The wait is understandable. But by the time clarity arrives, others may have moved on or drawn the wrong conclusions.',
```

**CalmStrategist** (the communication-style one, key `'CalmStrategist'`):
```typescript
boundaryStyle: 'You set limits through policy and principle rather than through emotional expression. You tend not to make it personal — you state the standard and hold to it. This works well in low-stakes contexts; in high-stakes personal ones, people sometimes need to feel the emotional weight behind the limit, not just the logic.',
repairStyle: 'You approach repair practically and without drama. Once you have identified the problem, you propose a fix. The emotional residue of conflict is less important to you than whether the functional problem has been solved. Some people need more of the emotional piece before the practical is useful.',
growthGuidance: 'Sitting with the relational texture of a conflict — the feelings, not just the facts — is the edge. Not because emotional processing is more valid than practical resolution, but because people sometimes need to be met in the feeling before they can receive the solution.',
```

**ExpressiveConnector:**
```typescript
boundaryStyle: 'You find it genuinely difficult to set limits when doing so risks the relationship. You may absorb more than is sustainable because you are unwilling to introduce friction. When limits do get set, they sometimes come out more sharply than intended — the result of long restraint rather than aggression.',
repairStyle: 'You repair through warmth and re-connection rather than through explicit conversation about what went wrong. You tend to soften things with affection and check-in rather than revisit the conflict directly. This works in some relationships; in others, it can leave the underlying issue unaddressed.',
growthGuidance: 'Learning to name a limit in the moment rather than after the resentment has built is the highest-leverage development available here. You can be warm and direct at the same time — the warmth does not require you to be silent about what you need.',
```

**IndependentProtector:**
```typescript
boundaryStyle: 'You set limits clearly and early, usually through withdrawal rather than direct statement. Others often feel the boundary before it is articulated. You are not interested in over-explaining your limits — you expect them to be respected once they are visible.',
repairStyle: 'After conflict, you need significant time and space before re-engagement is possible. Coming back too quickly feels like unfinished business. When you do return, it is usually with clarity — but the period of distance can feel extended to others who process differently.',
growthGuidance: 'Articulating limits verbally — rather than letting them be inferred from your behavior — shortens the distance others feel and reduces the chance of misinterpretation. Not all of your withdrawal is readable as a boundary. Some of it looks like rejection.',
```

- [ ] **Step 8: Add TRAIT_HIGH and TRAIT_LOW constants**

At the very bottom of `src/data/resultTypes.ts` (after the closing `];` of `TYPE_ARCHETYPES`), add:

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

- [ ] **Step 9: Verify TypeScript passes with zero errors**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output. If errors remain, verify every PERSONALITY_ARCHETYPES entry has `stressPattern`, `workStyle`, `growthGuidance`; every RELATIONSHIP_TYPES entry has `closenessNeeds`, `growthGuidance`; every COMMUNICATION_TYPES entry has `boundaryStyle`, `repairStyle`, `growthGuidance`.

- [ ] **Step 10: Commit**

```bash
git add src/data/resultTypes.ts
git commit -m "feat(data): add premium fields to PersonalityArchetype, RelationshipType, CommunicationStyleType + TRAIT maps"
```

---

### Task 3: result.tsx — isPremium state + contextual locked card

**Files:**
- Modify: `app/assessment/[id]/result.tsx`

**Interfaces:**
- Consumes: `UserProfile.isPremium: boolean` (already on the type, already loaded via `loadProfile()`); all new archetype fields from Tasks 1–2 (TypeScript will enforce they exist)
- Produces: `isPremium: boolean` state + contextual locked card UI — consumed by Task 4

- [ ] **Step 1: Add isPremium state**

In `ResultScreen` component, find the existing state declarations (lines 104–106):

```typescript
const [result, setResult] = useState<AssessmentResult | null>(null);
const [profileClarity, setProfileClarity] = useState(0);
const [profile, setProfile] = useState<UserProfile | null>(null);
```

Add `isPremium` after them:

```typescript
const [isPremium, setIsPremium] = useState(false);
```

- [ ] **Step 2: Extract isPremium in loadProfile chain + add catch**

Find the `Promise.all` block (lines 113–126). It currently has no `.catch`. Add `setIsPremium` extraction and a `.catch`:

```typescript
Promise.all([
  getAssessmentResult(id as any),
  loadProfile(),
]).then(([r, p]) => {
  setResult(r);
  setProfile(p);
  setIsPremium(p?.isPremium ?? false);
  setProfileClarity(calculateProfileClarity(p));
  Animated.parallel([
    Animated.timing(heroFade, { toValue: 1, duration: 450, delay: 80, useNativeDriver: true }),
    Animated.spring(heroSlide, { toValue: 0, tension: 80, friction: 14, delay: 80, useNativeDriver: true }),
  ]).start();
}).catch((e) => console.error('[ResultScreen] loadProfile failed:', e));
```

- [ ] **Step 3: Replace existing premium card section**

Find and delete the entire existing `{/* ── Premium unlock ── */}` block (lines 355–398 in the original file), which renders the old generic card with "Unlock Full Report · from €4.99".

Replace it with the conditional contextual card shown only when `!isPremium`:

```tsx
{/* ── Contextual premium card (locked) ── */}
{!isPremium && (
  <View style={styles.premiumCard}>
    <LinearGradient
      colors={[`${accentColor}12`, `${accentColor}04`]}
      style={StyleSheet.absoluteFill}
    />
    <View style={[styles.premiumBorder, { borderColor: `${accentColor}30` }]} />
    <View style={styles.premiumContent}>
      <View style={[styles.premiumBadge, { backgroundColor: `${accentColor}18` }]}>
        <Ionicons name="star-outline" size={11} color={accentColor} />
        <Text style={[styles.premiumBadgeText, { color: accentColor }]}>✦ DEEP REPORT</Text>
      </View>

      <Text style={styles.premiumTitle}>
        {id === 'type' && 'Go deeper into your Personality Type'}
        {id === 'personality' && 'Go deeper into your trait profile'}
        {id === 'relationship' && 'Go deeper into your relationship pattern'}
        {id === 'communication' && 'Go deeper into your communication style'}
      </Text>

      <Text style={styles.premiumSubtitle}>
        {id === 'type' && 'Unlock your full type report — plus all deep reports and your complete InnerType synthesis.'}
        {id === 'personality' && 'Unlock deeper guidance for your core tendencies — plus all other reports.'}
        {id === 'relationship' && 'Unlock deeper insight into how you connect, protect yourself, and build trust.'}
        {id === 'communication' && 'Unlock deeper guidance for conflict, boundaries, and repair — plus all other reports.'}
      </Text>

      <View style={styles.premiumFeatures}>
        {(id === 'type'
          ? ['Full type interpretation', 'Work style', 'How you connect', 'Growth guidance', 'Share card preview']
          : id === 'personality'
          ? ['Highest & lowest traits', 'Strengths', 'Stress patterns', 'Work style', 'Growth guidance']
          : id === 'relationship'
          ? ['How trust builds', 'What creates distance', 'Closeness needs', 'Strengths', 'Growth guidance']
          : ['Conflict style', 'Boundary style', 'Repair style', 'Work & team style', 'Growth guidance']
        ).map((f) => (
          <View key={f} style={styles.featureRow}>
            <Ionicons name="checkmark" size={12} color={accentColor} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.premiumNudge}>
        Also unlocks all other deep reports + full InnerType report
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/paywall')}
        style={styles.unlockBtn}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={Colors.gradientGold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
        />
        <Text style={styles.unlockBtnText}>Unlock InnerType Premium · €4.99</Text>
      </TouchableOpacity>

      <Text style={styles.premiumMeta}>One-time unlock · No subscription.</Text>
    </View>
  </View>
)}
```

- [ ] **Step 4: Replace premium styles in StyleSheet.create**

Find all existing premium-related styles in `StyleSheet.create` (the `premiumCard`, `premiumBorder`, `premiumContent`, `premiumRow`, `premiumIconWrap`, `premiumTitle`, `premiumSubtitle`, `premiumFeatures`, `featureRow`, `featureText`, `unlockBtn`, `unlockBtnText` block) and replace them with:

```typescript
// ── Contextual premium card ──
premiumCard: {
  borderRadius: 20,
  overflow: 'hidden',
  position: 'relative',
},
premiumBorder: {
  ...StyleSheet.absoluteFill,
  borderRadius: 20,
  borderWidth: 1,
},
premiumContent: {
  padding: 20,
  gap: 14,
  zIndex: 1,
},
premiumBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  alignSelf: 'flex-start',
  paddingHorizontal: 9,
  paddingVertical: 4,
  borderRadius: 20,
},
premiumBadgeText: {
  fontSize: 9,
  fontWeight: FontWeight.bold,
  letterSpacing: 1.5,
},
premiumTitle: {
  fontSize: FontSize.lg,
  fontWeight: FontWeight.semiBold,
  color: Colors.textPrimary,
  lineHeight: FontSize.lg * 1.3,
},
premiumSubtitle: {
  fontSize: FontSize.sm,
  color: Colors.textSecondary,
  lineHeight: FontSize.sm * 1.6,
},
premiumFeatures: { gap: 8 },
featureRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
featureText: {
  fontSize: FontSize.sm,
  color: Colors.textSecondary,
},
premiumNudge: {
  fontSize: FontSize.xs,
  color: Colors.textTertiary,
  fontStyle: 'italic',
},
unlockBtn: {
  height: 50,
  borderRadius: 14,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
},
unlockBtnText: {
  fontSize: FontSize.base,
  fontWeight: FontWeight.bold,
  color: Colors.textInverse,
  letterSpacing: 0.3,
},
premiumMeta: {
  fontSize: FontSize.xs,
  color: Colors.textTertiary,
  textAlign: 'center',
},
```

- [ ] **Step 5: Verify TypeScript passes**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add app/assessment/[id]/result.tsx
git commit -m "feat(result): add isPremium state and contextual locked premium card (4 variants)"
```

---

### Task 4: result.tsx — unlocked deep report sections + share card modal

**Files:**
- Modify: `app/assessment/[id]/result.tsx`

**Interfaces:**
- Consumes: `isPremium` state (Task 3); `TypeArchetype`, `PersonalityArchetype`, `RelationshipType`, `CommunicationStyleType` with all new fields (Tasks 1–2); `TRAIT_HIGH`, `TRAIT_LOW` (Task 2); `PersonalityScores` (already imported)
- Produces: fully rendered unlocked deep report sections when `isPremium === true`; share card + Modal for `id === 'type'`

- [ ] **Step 1: Add Modal to react-native imports**

Find the existing react-native import block (line 2). Add `Modal`:

```typescript
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Animated,
  Modal,
} from 'react-native';
```

- [ ] **Step 2: Add typed archetype imports and TRAIT maps**

Update the resultTypes import (currently around line 21–25):

```typescript
import {
  PERSONALITY_ARCHETYPES,
  RELATIONSHIP_TYPES,
  COMMUNICATION_TYPES,
  TYPE_ARCHETYPES,
  TRAIT_HIGH,
  TRAIT_LOW,
  TypeArchetype,
  PersonalityArchetype,
  RelationshipType,
  CommunicationStyleType,
} from '../../../src/data/resultTypes';
```

- [ ] **Step 3: Add shareCardVisible state**

After the `isPremium` state line, add:

```typescript
const [shareCardVisible, setShareCardVisible] = useState(false);
```

- [ ] **Step 4: Add renderUnlockedSections function**

Add this function inside `ResultScreen`, after `renderScoreBars` and before the `return` statement. The function closes over `archetypeData`, `result`, `accentColor`, `profileClarity`, `shareCardVisible`, `setShareCardVisible`, and the dimension label maps.

```tsx
function renderUnlockedSections() {
  if (!archetypeData || !result) return null;

  // ── Deep report: Personality Type ──────────────────────────────
  if (id === 'type') {
    const typeData = archetypeData as TypeArchetype;
    return (
      <>
        <View style={styles.deepReportDivider}>
          <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
          <View style={styles.deepReportLine} />
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="star-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
          </View>
          <View style={styles.deepCard}>
            {typeData.strengths.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                <Text style={styles.deepText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="briefcase-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WORK STYLE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{typeData.workStyle}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="heart-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>HOW YOU CONNECT</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{typeData.relationshipStyle}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="trending-up-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{typeData.growthEdge}</Text>
          </View>
        </View>

        {/* Share card */}
        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="share-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>SHARE CARD PREVIEW</Text>
          </View>
          <View style={[styles.shareCardWrap, { borderColor: `${accentColor}30` }]}>
            <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
            <View pointerEvents="none" style={{ position: 'absolute', top: -60, right: -60, opacity: 0.35 }}>
              <ProfileOrb clarity={100} color={accentColor} size={220} />
            </View>
            <Text style={[styles.shareCardWordmark, { color: accentColor }]}>INNERTYPE</Text>
            <Text style={[styles.shareCardCode, { color: accentColor }]}>{result.primaryType}</Text>
            <Text style={styles.shareCardLabel}>{result.archetypeLabel}</Text>
            <View style={styles.shareCardChips}>
              {typeData.chips.map((c, i) => (
                <View key={i} style={[styles.shareCardChip, { borderColor: `${accentColor}30` }]}>
                  <Text style={[styles.shareCardChipText, { color: accentColor }]}>{c}</Text>
                </View>
              ))}
            </View>
            <View style={styles.shareCardFooter}>
              <Text style={styles.shareCardClarity}>Profile clarity · {profileClarity}%</Text>
              <Text style={styles.shareCardFooterText}>InnerType Personality Test</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShareCardVisible(true)}
            style={[styles.shareCardPreviewBtn, { borderColor: `${accentColor}30` }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.shareCardPreviewBtnText, { color: accentColor }]}>Preview share card</Text>
          </TouchableOpacity>
          <Text style={styles.shareCardComingSoon}>Share card — coming soon</Text>
        </View>

        <Modal
          visible={shareCardVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setShareCardVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShareCardVisible(false)}
          >
            <View style={[styles.shareCardModal, { borderColor: `${accentColor}30` }]}>
              <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
              <View pointerEvents="none" style={{ position: 'absolute', top: -80, right: -80, opacity: 0.35 }}>
                <ProfileOrb clarity={100} color={accentColor} size={320} />
              </View>
              <Text style={[styles.shareCardWordmark, { color: accentColor, fontSize: 13 }]}>INNERTYPE</Text>
              <Text style={[styles.shareCardCode, { color: accentColor, fontSize: 80, lineHeight: 80 }]}>{result.primaryType}</Text>
              <Text style={[styles.shareCardLabel, { fontSize: FontSize.xl }]}>{result.archetypeLabel}</Text>
              <View style={styles.shareCardChips}>
                {typeData.chips.map((c, i) => (
                  <View key={i} style={[styles.shareCardChip, { borderColor: `${accentColor}30` }]}>
                    <Text style={[styles.shareCardChipText, { color: accentColor }]}>{c}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.shareCardFooter}>
                <Text style={styles.shareCardClarity}>Profile clarity · {profileClarity}%</Text>
                <Text style={styles.shareCardFooterText}>InnerType Personality Test</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  // ── Deep report: Personality Traits ────────────────────────────
  if (id === 'personality') {
    const personalityData = archetypeData as PersonalityArchetype;
    const scores = result.scores as PersonalityScores;
    const allDims = ['O', 'C', 'E', 'A', 'N'] as const;
    type Dim = typeof allDims[number];
    const sortedDims = ([...allDims] as Dim[]).sort((a, b) => scores[b] - scores[a]);
    const highest = sortedDims.slice(0, 2);
    const lowest = sortedDims.slice(-2).reverse();

    return (
      <>
        <View style={styles.deepReportDivider}>
          <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
          <View style={styles.deepReportLine} />
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="arrow-up-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>HIGHEST TRAITS</Text>
          </View>
          <View style={styles.deepCard}>
            {highest.map((dim) => (
              <View key={dim} style={styles.traitInterpBlock}>
                <Text style={[styles.traitInterpDim, { color: accentColor }]}>
                  {PERSONALITY_DIMENSION_LABELS[dim]}
                </Text>
                {TRAIT_HIGH[dim] ? (
                  <Text style={styles.deepText}>{TRAIT_HIGH[dim]}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="arrow-down-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>LOWEST TRAITS</Text>
          </View>
          <View style={styles.deepCard}>
            {lowest.map((dim) => (
              <View key={dim} style={styles.traitInterpBlock}>
                <Text style={[styles.traitInterpDim, { color: accentColor }]}>
                  {PERSONALITY_DIMENSION_LABELS[dim]}
                </Text>
                {TRAIT_LOW[dim] ? (
                  <Text style={styles.deepText}>{TRAIT_LOW[dim]}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="star-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
          </View>
          <View style={styles.deepCard}>
            {personalityData.strengths.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                <Text style={styles.deepText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="flash-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRESS PATTERN</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{personalityData.stressPattern}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="briefcase-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WORK STYLE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{personalityData.workStyle}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="trending-up-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{personalityData.growthGuidance}</Text>
          </View>
        </View>
      </>
    );
  }

  // ── Deep report: Relationship Pattern ──────────────────────────
  if (id === 'relationship') {
    const relData = archetypeData as RelationshipType;
    return (
      <>
        <View style={styles.deepReportDivider}>
          <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
          <View style={styles.deepReportLine} />
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>HOW TRUST BUILDS</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{relData.connectionStyle}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="flash-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WHAT CREATES DISTANCE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{relData.stressResponse}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="star-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
          </View>
          <View style={styles.deepCard}>
            {relData.strengths.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                <Text style={styles.deepText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WHAT YOU MAY NOT SAY</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{relData.gentleNote}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="heart-circle-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>CLOSENESS NEEDS</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{relData.closenessNeeds}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="trending-up-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{relData.growthGuidance}</Text>
          </View>
        </View>
      </>
    );
  }

  // ── Deep report: Communication Style ───────────────────────────
  if (id === 'communication') {
    const commData = archetypeData as CommunicationStyleType;
    return (
      <>
        <View style={styles.deepReportDivider}>
          <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
          <View style={styles.deepReportLine} />
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="warning-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>CONFLICT STYLE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{commData.conflictPattern}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="briefcase-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WORK & TEAM STYLE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{commData.bestEnvironment}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="star-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
          </View>
          <View style={styles.deepCard}>
            {commData.strengths.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                <Text style={styles.deepText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="shield-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>BOUNDARY STYLE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{commData.boundaryStyle}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="refresh-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>REPAIR STYLE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{commData.repairStyle}</Text>
          </View>
        </View>

        <View style={styles.deepSection}>
          <View style={styles.deepSectionHeader}>
            <Ionicons name="trending-up-outline" size={14} color={accentColor} />
            <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
          </View>
          <View style={styles.deepCard}>
            <Text style={styles.deepText}>{commData.growthGuidance}</Text>
          </View>
        </View>
      </>
    );
  }

  return null;
}
```

- [ ] **Step 5: Add the unlocked sections call site in the ScrollView**

In the JSX, after the `{!isPremium && (...)}` contextual card block and before `{/* ── Actions ── */}`, add:

```tsx
{/* ── Unlocked deep report sections ── */}
{isPremium && renderUnlockedSections()}
```

- [ ] **Step 6: Add new styles for deep report sections and share card**

At the end of `StyleSheet.create({...})`, before the closing `}`, add:

```typescript
// ── Deep report sections ──
deepReportDivider: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
deepReportLabel: {
  fontSize: 9,
  fontWeight: FontWeight.bold,
  letterSpacing: 1.5,
  flexShrink: 0,
},
deepReportLine: {
  flex: 1,
  height: 1,
  backgroundColor: Colors.surfaceBorder,
},
deepSection: { gap: 8 },
deepSectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},
deepSectionTitle: {
  fontSize: 10,
  fontWeight: FontWeight.bold,
  letterSpacing: 1.2,
},
deepCard: {
  backgroundColor: Colors.surface,
  borderRadius: 14,
  padding: 16,
  borderWidth: 1,
  borderColor: Colors.surfaceBorder,
  gap: 10,
},
deepText: {
  fontSize: FontSize.base,
  color: Colors.textSecondary,
  lineHeight: FontSize.base * 1.65,
},
bulletRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 10,
},
bullet: {
  width: 5,
  height: 5,
  borderRadius: 2.5,
  marginTop: 8,
  flexShrink: 0,
},
traitInterpBlock: { gap: 5 },
traitInterpDim: {
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semiBold,
},
// ── Share card ──
shareCardWrap: {
  borderRadius: 18,
  overflow: 'hidden',
  borderWidth: 1,
  padding: 24,
  gap: 10,
  position: 'relative',
  aspectRatio: 0.75,
  justifyContent: 'flex-end',
},
shareCardWordmark: {
  fontSize: 10,
  fontWeight: FontWeight.bold,
  letterSpacing: 3,
  position: 'absolute',
  top: 24,
  left: 24,
},
shareCardCode: {
  fontSize: 58,
  fontWeight: FontWeight.bold,
  letterSpacing: -2,
  lineHeight: 58,
},
shareCardLabel: {
  fontSize: FontSize.lg,
  fontFamily: FontFamily.display,
  fontWeight: '400',
  color: Colors.textPrimary,
},
shareCardChips: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 6,
},
shareCardChip: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
  borderWidth: 1,
  backgroundColor: 'rgba(255,255,255,0.04)',
},
shareCardChipText: {
  fontSize: FontSize.xs,
  fontWeight: FontWeight.medium,
},
shareCardFooter: {
  gap: 3,
  paddingTop: 10,
  borderTopWidth: 1,
  borderTopColor: Colors.surfaceBorder,
},
shareCardClarity: {
  fontSize: FontSize.xs,
  color: Colors.textSecondary,
  fontWeight: FontWeight.medium,
},
shareCardFooterText: {
  fontSize: FontSize.xs,
  color: Colors.textTertiary,
},
shareCardPreviewBtn: {
  height: 42,
  borderRadius: 12,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
shareCardPreviewBtnText: {
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semiBold,
},
shareCardComingSoon: {
  fontSize: FontSize.xs,
  color: Colors.textTertiary,
  textAlign: 'center',
},
modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.85)',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
},
shareCardModal: {
  width: '100%',
  borderRadius: 20,
  overflow: 'hidden',
  borderWidth: 1,
  padding: 32,
  gap: 14,
  position: 'relative',
  aspectRatio: 0.75,
  justifyContent: 'flex-end',
},
```

- [ ] **Step 7: Verify TypeScript passes**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output. Common issues to fix if errors appear:
- `PersonalityScores` key access: `scores[a]` where `a: 'O'|'C'|'E'|'A'|'N'` — ensure `PersonalityScores` is typed with those exact keys, not an index signature
- Cast syntax: if direct `as TypeArchetype` fails, use `archetypeData as unknown as TypeArchetype`
- `result.primaryType` may be `string | undefined` — add `result.primaryType ?? ''` if TypeScript complains

- [ ] **Step 8: Commit**

```bash
git add app/assessment/[id]/result.tsx
git commit -m "feat(result): add unlocked deep report sections + share card modal for all 4 assessment types"
```

---

### Task 5: report.tsx subtitle update + final typecheck

**Files:**
- Modify: `app/report.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: corrected subtitle on the report.tsx premium card

- [ ] **Step 1: Update the premium card subtitle in report.tsx**

Find around line 535–537 in `app/report.tsx`:

```tsx
<Text style={styles.premiumDesc}>
  Go beyond the result — see how your patterns shape relationships, work, stress, and growth.
</Text>
```

Change to:

```tsx
<Text style={styles.premiumDesc}>
  Unlock all 4 deep assessment reports and your complete InnerType synthesis.
</Text>
```

- [ ] **Step 2: Run final full typecheck**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output (zero errors). This is the definitive verification that all 5 tasks are complete and consistent.

- [ ] **Step 3: Commit**

```bash
git add app/report.tsx
git commit -m "fix(report): update premium card subtitle to reference all 4 deep assessment reports"
```
