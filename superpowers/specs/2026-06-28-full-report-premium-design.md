# Full Report / Premium Redesign — Design Spec

## Goal

Make the Full Report and premium offer feel worth €4.99. Users should understand what the report includes, why it is more valuable than the free result, why all 4 dimensions make it richer, and why unlocking now is reasonable.

## Business model

One-time purchase: **Unlock Full Report · €4.99**
No subscription. No ads. No fake urgency. No countdown timers.

---

## Architecture: Approach chosen

**Full data extension (Approach 1):** Author new `thriveConditions` and `whatDrivesYou` fields for all 8 `CombinedArchetype` entries. Fix `relationshipGuidance` passthrough to `CombinedProfile`. Report reads exclusively from `combined` — no ad-hoc derivation from scattered data.

---

## Files changed

| File | Change |
|---|---|
| `src/data/resultTypes.ts` | Add `thriveConditions`, `whatDrivesYou` to `CombinedArchetype` interface + all 8 entries |
| `src/types/profile.ts` | Add `thriveConditions`, `whatDrivesYou`, `relationshipGuidance` to `CombinedProfile` |
| `src/logic/profileSynthesis.ts` | Pass 3 new fields through; fix `relationshipGuidance` passthrough |
| `app/report.tsx` | Full redesign — hero, dimension status, state-aware free sections, premium card, share card modal, unlocked report sections |
| `app/paywall.tsx` | Improve "what's inside" list, copy, trust signals |

---

## Data layer spec

### `CombinedArchetype` — new fields

```ts
interface CombinedArchetype {
  // existing fields unchanged ...
  thriveConditions: string;  // "what helps you thrive" — conditions, environment, pace
  whatDrivesYou: string;     // "what drives you" — motivation, specific to archetype
}
```

### `CombinedProfile` — new fields

```ts
interface CombinedProfile {
  // existing fields unchanged ...
  thriveConditions: string;
  whatDrivesYou: string;
  relationshipGuidance: string;  // was in CombinedArchetype but never passed through
}
```

### `synthesizeProfile` additions

Add to return object:
```ts
thriveConditions: archetype.thriveConditions,
whatDrivesYou: archetype.whatDrivesYou,
relationshipGuidance: archetype.relationshipGuidance,
```

### Authored content — all 8 archetypes

Copy quality standard: specific, kind, not diagnostic. Avoid "you are thoughtful and creative." Prefer "You often become clearer after having time to organize the emotional and practical sides of a situation separately."

**ReflectiveSage (Deep Observer)**
- `whatDrivesYou`: Being in the presence of ideas that genuinely surprise you. The feeling of making something complex precise — whether that is an argument, a system, or an understanding of a person. Knowing, quietly, that you have seen something others have not yet noticed.
- `thriveConditions`: Uninterrupted time to think. Work that rewards depth over speed. Relationships where presence does not have to be constant to be real. Environments that notice quality rather than output volume.

**CalmArchitect**
- `whatDrivesYou`: Building systems and relationships that actually hold up — not just in ideal conditions, but under pressure. The satisfaction of seeing something you helped design work the way it was meant to. Being the person others can count on to be steady when the situation is not.
- `thriveConditions`: Clear parameters and genuine ownership of your work. Time to plan before committing. Teams that value consistency over urgency. Environments where follow-through is respected as much as ideas.

**PassionateIdealist (Depth Connector)**
- `whatDrivesYou`: Genuine human connection and the sense that what you are doing actually matters to real people. Work and relationships that carry meaning beyond the surface. The feeling of being fully understood — and of understanding someone else that completely.
- `thriveConditions`: Work with a clear human purpose. People who meet your emotional investment with their own. Space to process out loud without being rushed toward a conclusion. Environments that value feeling as information, not noise.

**GroundedExplorer**
- `whatDrivesYou`: Learning something genuinely new — not for credentials, but because the idea itself is interesting. Growth that is real rather than performed. Contributing to something you believe in, in a way that leaves room for your own curiosity to stay alive.
- `thriveConditions`: Environments that reward genuine curiosity and growth. Work that evolves rather than repeating itself. Relationships where you can be both settled and exploring simultaneously. Teams that trust their people to figure things out.

**IndependentConnector (Independent Builder)**
- `whatDrivesYou`: Solving something difficult and doing it well, without needing the process to be validated at every step. The quiet satisfaction of quality work. Deep, earned trust with a small number of people who have genuinely proven they deserve access to your inner world.
- `thriveConditions`: Genuine autonomy and clear ownership. Work that rewards consistent quality over social performance. Relationships that do not require constant maintenance to stay real. Space to process privately before being asked to respond.

**ExpressiveArchitect**
- `whatDrivesYou`: Bringing a vision from concept to reality — and bringing others into it with clarity and energy. Work where creativity and execution exist in the same space. The experience of finishing something you built and having it actually work.
- `thriveConditions`: Roles where you can see both the big picture and the implementation path. Environments that value originality without sacrificing follow-through. Teams that match your energy without requiring you to slow down for bureaucratic reasons. Creative latitude within real constraints.

**SensitiveGuide (Sensitive Strategist)**
- `whatDrivesYou`: Seeing someone understand something about themselves that was previously unclear — and knowing you helped create the conditions for that. Relationships and work where your emotional intelligence is genuinely useful, not just decorative. Contributing to something that involves and benefits real people.
- `thriveConditions`: Work that connects to human outcomes. Relationships where your insight is valued, not just your output. Environments with enough psychological safety that you can say what you actually observe. Time to tune in without constant external demands.

**AdaptiveRealist**
- `whatDrivesYou`: Doing work that is genuinely useful in whatever form that takes. The sense of being relied upon across different contexts — not for a narrow specialty, but for sound judgment. Stability with enough variety to keep engagement real.
- `thriveConditions`: Environments that reward versatility and practical judgment. Work with real variety over long periods of repetition. Teams that trust you to adapt without requiring you to justify every decision. Relationships where stability and flexibility coexist without tension.

---

## State handling

Completeness is determined by `completedCount` from `[type, personality, relationship, communication].filter(Boolean).length`.

| Count | Hero subtitle | Premium pressure | CTA label |
|---|---|---|---|
| 1 | "1 of 4 dimensions mapped. Your report becomes more precise as you complete more." | Low — soft secondary CTA | "Unlock Full Report · €4.99" (dimmer) |
| 2 | "2 of 4 dimensions mapped. Already reflecting [names]. Add [missing] to complete the picture." | Medium | "Unlock Full Report · €4.99" |
| 3 | "3 of 4 dimensions mapped. One dimension left to complete your profile." | Medium-high | "Unlock Full Report · €4.99" |
| 4 | "All 4 dimensions mapped. This report synthesizes your complete InnerType." | Full — primary CTA, gold shadow | "Unlock Full Report · €4.99" |

When `completedCount < 4`, a **dimension status row** appears below the hero subtitle. It shows all 4 dimensions as compact rows: checkmark + accent colour if done, dim dot + "Start →" link if missing.

When `completedCount < 4`, the premium card shows a soft nudge above the CTA: *"Complete all 4 dimensions for the most precise synthesis."*

---

## Report page structure (scroll order)

### NAV
- Left: `×` close button
- Centre: "Full Report"
- Right: share icon (visible when isPremium)

### HERO (always shown)
- Profile Orb, size 100, `clarity={profileClarity}`, colour `Colors.innerType`
- Badge: ✦ YOUR INNERTYPE
- Archetype name (3xl, display font)
- Archetype tagline
- Profile Clarity: `{profileClarity}%` (shown as `FontSize.md`, accent colour)
- State subtitle (varies by completedCount — see table above)
- [Dimension status row — only when completedCount < 4]

### WHAT YOUR REPORT COMBINES (always shown)
4 compact rows:
```
[icon]  Personality Type        How you process information and make decisions
[icon]  Personality Traits      Your core tendencies and emotional patterns
[icon]  Relationship Pattern    How you connect, protect yourself, and build trust
[icon]  Communication Style     How you handle conflict, boundaries, and repair
```
Footer line (small, tertiary): *"Basic results are free. The full report unlocks the deeper synthesis."*

### FREE SECTIONS (always shown, adapts to completedCount)

**Overview** — `combined.description` (always available once at least 1 assessment done)

**How you think** — if type OR personality done:
- If type done: TypeArchetype description paragraph (from `TYPE_ARCHETYPES.find(a => a.typeCode === result.primaryType)`)
- If personality done: 5 trait bars (O, C, E, A, N)
- If neither done: placeholder copy "Complete Personality Type or Personality Traits to reveal this dimension."

**How you connect** — if relationship done:
- `combined.relationshipPattern` (archetype label + first sentence of relationship result summary)
- If not done: "Complete the Relationship Pattern assessment to reveal this dimension."

**How you communicate** — if communication done:
- `combined.communicationStyle` (archetype label + first sentence)
- If not done: "Complete the Communication Style assessment to reveal this dimension."

**Free preview card** (always shown — gold-tinted border):
- Title: "What others may miss about you"
- Body: `combined.blindSpot` — shown in full (2–3 sentences). This is the generous free preview.
- Growth edge preview: first sentence of `combined.growthEdge`, then gradient fade
- CTA link: "See the full picture →" (routes to /paywall if !isPremium)

### PREMIUM SECTION (shown only when !isPremium)

**Premium card:**
- Badge: ✦ FULL REPORT
- Title: "Unlock your complete InnerType report"
- Subtitle: "Go beyond the result — see how your patterns shape relationships, work, stress, and growth."
- Content chip grid (2 columns, 5 rows):
  ```
  How you think       ·  What drives you
  What drains you     ·  What helps you thrive
  Blind spots         ·  Work style
  Relationship guide  ·  Communication guide
  Growth plan         ·  Shareable card
  ```
- [If completedCount < 4]: Nudge row: ⚠ "Complete all 4 dimensions for the most precise synthesis."
- CTA: "Unlock Full Report · €4.99" — gold gradient button
  - Full shadow when completedCount === 4
  - Reduced opacity (0.75) when completedCount < 4
- Footer: "One-time unlock · No subscription"

**3 teaser cards** (below premium card):
1. "What drains you" — teaser: first sentence of `combined.stressResponse` + lock icon
2. "What helps you thrive" — teaser: first sentence of `combined.thriveConditions` + lock icon
3. "Growth plan" — teaser: first sentence of `combined.growthEdge` + lock icon

Each teaser is tappable and routes to /paywall. Text is legible (not blurred). Lock icon in corner.

### UNLOCKED SECTIONS (shown only when isPremium)

Section divider style: small uppercase label, hairline separator.

1. **OVERVIEW** — `combined.description` (full card)
2. **HOW YOU THINK** — type description paragraph (if type done) + 5 personality trait bars (if personality done). If type done but personality not, type description only. If neither done, "Complete these assessments to reveal this section."
3. **HOW YOU CONNECT** — `combined.relationshipPattern` (relationship label + summary) + `combined.relationshipGuidance` (full, in a second inset block titled "Relationship guidance")
4. **HOW YOU COMMUNICATE** — `combined.communicationStyle` (full)
5. **WHAT DRIVES YOU** — `combined.whatDrivesYou` (full authored paragraph)
6. **WHAT DRAINS YOU** — `combined.stressResponse` (full)
7. **BLIND SPOTS** — `combined.blindSpot` (full). Slightly more prominent style — inset left border, warning-amber tint.
8. **WHAT HELPS YOU THRIVE** — `combined.thriveConditions` (full)
9. **WORK STYLE** — `combined.workStyle` (full)
10. **RELATIONSHIP GUIDANCE** — `combined.relationshipGuidance` (full — this is separate from "How you connect", which shows the pattern label. This section goes deeper.)
11. **GROWTH PLAN** — `combined.growthEdge` paragraph, rendered as a bulleted-style list (split on ". " into 2–4 points). Rendered with leaf icon.
12. **YOUR IDENTITY CARD** — shareable card placeholder (see below)

### SHAREABLE CARD (inline in unlocked section)

A styled `View` with fixed aspect ratio (approx 3:4), rendered inline. This is a visual placeholder — no image export.

Card contents:
- Background: dark base (`Colors.background`) with absolute-positioned `ProfileOrb` at ~60% opacity as glow
- Top: "INNERTYPE" wordmark (small caps, `Colors.innerType`)
- Centre: Archetype name (large, display font)
- Below name: tagline (small, secondary)
- 3 chips row (from `archetypeData.chips`)
- Footer divider line
- "Profile clarity · {profileClarity}%" small text
- Bottom: "InnerType Personality Test" footer (tertiary, small)

CTA below card: "Preview share card" button — opens React Native `Modal` (transparent backdrop) showing the same card rendered at a larger scale, with a close button.

Small text below CTA: "Share card — coming soon"

---

## Paywall page improvements

- Replace feature icon list with the same 2-column chip grid used in the premium card
- Improve hero subtitle to reference "your complete InnerType" not just "the result"
- Keep existing mock purchase flow (`setPremium(true)`) and Alert
- Keep trust row and restore button

---

## Visual design rules

- No repetitive locked boxes (replaced by single premium card + 3 curated teasers)
- Profile Orb in hero: size 100, real clarity value
- Section dividers: 10pt uppercase label + hairline (`Colors.surfaceBorder`)
- Cards: `borderRadius: 18`, glass gradient, `Colors.surfaceBorder` border
- Premium card: `borderRadius: 22`, gold-tinted gradient
- Copy: specific > generic. Kind but sharp. Not diagnostic.
- No fake urgency. No countdown. No aggressive language.

---

## Acceptance criteria

1. Report hero shows Profile Orb, Profile Clarity %, archetype name and tagline.
2. Report hero correctly reflects 1/2/3/4 completion states with appropriate subtitle and dimension status row.
3. "What your report combines" section always visible — explains the 4-dimension synthesis.
4. Free preview includes: Overview, How you think/connect/communicate (adapts to completion), full blind spot preview, faded growth edge.
5. Premium card is single, strong, well-designed. No repetitive locked boxes except 3 curated teasers.
6. Unlocked state has 12 sections including shareable card placeholder.
7. `combined.relationshipGuidance`, `combined.thriveConditions`, `combined.whatDrivesYou` are populated for all 8 archetypes.
8. Shareable card visual renders inline; "Preview share card" opens a modal showing the card at scale.
9. No real payment processing added.
10. `npx tsc --noEmit` passes.
