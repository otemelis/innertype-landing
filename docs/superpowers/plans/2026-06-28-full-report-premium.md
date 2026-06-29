# Full Report / Premium Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Full Report and premium offer so it clearly explains the 4-dimension synthesis, handles 1–4 completion states, feels worth €4.99, and includes a polished shareable card placeholder.

**Architecture:** Extend `CombinedArchetype` with two new authored fields (`thriveConditions`, `whatDrivesYou`), fix the `relationshipGuidance` passthrough to `CombinedProfile`, then completely rewrite `app/report.tsx` around the new data and the 4-state UX model. The paywall gets minor copy/layout improvements.

**Tech Stack:** Expo SDK 56, Expo Router v3, React Native 0.85.3, React 19, TypeScript strict, AsyncStorage only (no backend).

## Global Constraints

- No real payments — `setPremium(true)` mock only.
- No subscriptions, no ads, no countdown timers, no fake urgency.
- No new npm dependencies — use existing React Native `Modal`.
- No "MBTI", "Myers-Briggs", "clinically validated" in any UI copy.
- All data stays local (AsyncStorage only).
- `npx tsc --noEmit` must pass after every task.
- Follow existing design system: `Colors`, `FontSize`, `FontWeight`, `FontFamily`, `ProfileOrb`, `TraitBar`, `LinearGradient`.
- Copy quality bar: specific > generic. Kind but sharp. Not diagnostic.

---

## File map

| File | Role |
|---|---|
| `src/data/resultTypes.ts` | Add `thriveConditions`, `whatDrivesYou` to `CombinedArchetype` interface + all 8 entries |
| `src/types/profile.ts` | Add `thriveConditions`, `whatDrivesYou`, `relationshipGuidance` to `CombinedProfile` |
| `src/logic/profileSynthesis.ts` | Pass 3 new fields through in `synthesizeProfile` return |
| `app/report.tsx` | Complete rewrite — all new sections and state handling |
| `app/paywall.tsx` | Minor copy + layout improvements |

---

## Task 1: Data layer — new archetype fields + type passthrough

**Files:**
- Modify: `src/data/resultTypes.ts`
- Modify: `src/types/profile.ts`
- Modify: `src/logic/profileSynthesis.ts`

**Interfaces:**
- Produces: `CombinedArchetype.thriveConditions: string`, `CombinedArchetype.whatDrivesYou: string` (all 8 entries populated)
- Produces: `CombinedProfile.thriveConditions`, `CombinedProfile.whatDrivesYou`, `CombinedProfile.relationshipGuidance` (passed through by `synthesizeProfile`)
- Consumed by: Task 2 (report.tsx)

- [ ] **Step 1: Extend `CombinedArchetype` interface in `src/data/resultTypes.ts`**

Find the interface (currently at line ~576). Add two fields at the end:

```typescript
export interface CombinedArchetype {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  strengths: string[];
  blindSpot: string;
  workStyle: string;
  stressResponse: string;
  growthEdge: string;
  relationshipGuidance: string;
  thriveConditions: string;   // NEW
  whatDrivesYou: string;      // NEW
}
```

- [ ] **Step 2: Add `thriveConditions` and `whatDrivesYou` to all 8 `COMBINED_ARCHETYPES` entries**

Open `src/data/resultTypes.ts`. The `COMBINED_ARCHETYPES` array starts at line ~590. Add the two new fields to each entry. The exact strings are listed below — add them after the existing `relationshipGuidance` field for each entry.

**ReflectiveSage:**
```typescript
    thriveConditions:
      'Uninterrupted time to think. Work that rewards depth over speed. Relationships where presence does not have to be constant to be real. Environments that notice quality rather than output volume.',
    whatDrivesYou:
      'Being in the presence of ideas that genuinely surprise you. The feeling of making something complex precise — whether that is an argument, a system, or an understanding of a person. Knowing, quietly, that you have seen something others have not yet noticed.',
```

**CalmArchitect:**
```typescript
    thriveConditions:
      'Clear parameters and genuine ownership of your work. Time to plan before committing. Teams that value consistency over urgency. Environments where follow-through is respected as much as ideas.',
    whatDrivesYou:
      'Building systems and relationships that actually hold up — not just in ideal conditions, but under pressure. The satisfaction of seeing something you helped design work the way it was meant to. Being the person others can count on to be steady when the situation is not.',
```

**PassionateIdealist:**
```typescript
    thriveConditions:
      'Work with a clear human purpose. People who meet your emotional investment with their own. Space to process out loud without being rushed toward a conclusion. Environments that value feeling as information, not noise.',
    whatDrivesYou:
      'Genuine human connection and the sense that what you are doing actually matters to real people. Work and relationships that carry meaning beyond the surface. The feeling of being fully understood — and of understanding someone else that completely.',
```

**GroundedExplorer:**
```typescript
    thriveConditions:
      'Environments that reward genuine curiosity and growth. Work that evolves rather than repeating itself. Relationships where you can be both settled and exploring simultaneously. Teams that trust their people to figure things out.',
    whatDrivesYou:
      'Learning something genuinely new — not for credentials, but because the idea itself is interesting. Growth that is real rather than performed. Contributing to something you believe in, in a way that leaves room for your own curiosity to stay alive.',
```

**IndependentConnector:**
```typescript
    thriveConditions:
      'Genuine autonomy and clear ownership. Work that rewards consistent quality over social performance. Relationships that do not require constant maintenance to stay real. Space to process privately before being asked to respond.',
    whatDrivesYou:
      'Solving something difficult and doing it well, without needing the process to be validated at every step. The quiet satisfaction of quality work. Deep, earned trust with a small number of people who have genuinely proven they deserve access to your inner world.',
```

**ExpressiveArchitect:**
```typescript
    thriveConditions:
      'Roles where you can see both the big picture and the implementation path. Environments that value originality without sacrificing follow-through. Teams that match your energy without requiring you to slow down for bureaucratic reasons. Creative latitude within real constraints.',
    whatDrivesYou:
      'Bringing a vision from concept to reality — and bringing others into it with clarity and energy. Work where creativity and execution exist in the same space. The experience of finishing something you built and having it actually work.',
```

**SensitiveGuide:**
```typescript
    thriveConditions:
      'Work that connects to human outcomes. Relationships where your insight is valued, not just your output. Environments with enough psychological safety that you can say what you actually observe. Time to tune in without constant external demands.',
    whatDrivesYou:
      'Seeing someone understand something about themselves that was previously unclear — and knowing you helped create the conditions for that. Relationships and work where your emotional intelligence is genuinely useful, not just decorative. Contributing to something that involves and benefits real people.',
```

**AdaptiveRealist:**
```typescript
    thriveConditions:
      'Environments that reward versatility and practical judgment. Work with real variety over long periods of repetition. Teams that trust you to adapt without requiring you to justify every decision. Relationships where stability and flexibility coexist without tension.',
    whatDrivesYou:
      'Doing work that is genuinely useful in whatever form that takes. The sense of being relied upon across different contexts — not for a narrow specialty, but for sound judgment. Stability with enough variety to keep engagement real.',
```

- [ ] **Step 3: Extend `CombinedProfile` in `src/types/profile.ts`**

Replace the existing `CombinedProfile` interface with:

```typescript
export interface CombinedProfile {
  archetype: string;
  archetypeTagline: string;
  description: string;
  strengths: string[];
  blindSpot: string;
  workStyle: string;
  relationshipPattern: string;
  communicationStyle: string;
  stressResponse: string;
  growthEdge: string;
  thriveConditions: string;       // NEW
  whatDrivesYou: string;          // NEW
  relationshipGuidance: string;   // NEW (was in CombinedArchetype but not passed through)
}
```

- [ ] **Step 4: Update `synthesizeProfile` return in `src/logic/profileSynthesis.ts`**

Find the `return {` block at the end of `synthesizeProfile`. Add three new lines:

```typescript
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
    thriveConditions: archetype.thriveConditions,        // NEW
    whatDrivesYou: archetype.whatDrivesYou,              // NEW
    relationshipGuidance: archetype.relationshipGuidance, // NEW
  };
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd /Users/otastemelis/claude/innertype && npx tsc --noEmit
```

Expected: no errors. If TypeScript complains about missing fields in COMBINED_ARCHETYPES entries, go back and add the fields to whichever archetype entry is missing them.

- [ ] **Step 6: Commit**

```bash
cd /Users/otastemelis/claude/innertype
git add src/data/resultTypes.ts src/types/profile.ts src/logic/profileSynthesis.ts
git commit -m "feat(report): add thriveConditions, whatDrivesYou, relationshipGuidance to CombinedArchetype and CombinedProfile"
```

---

## Task 2: Rewrite `app/report.tsx` — complete new file

**Files:**
- Modify: `app/report.tsx` (complete replacement)

**Interfaces:**
- Consumes: `CombinedProfile` (with new fields from Task 1), `calculateProfileClarity` from `src/logic/profileClarity.ts`, `TYPE_ARCHETYPES` from `src/data/resultTypes.ts`, `AssessmentResult` + `PersonalityScores` + `TypeScores` from `src/types/assessment.ts`, `ASSESSMENTS` from `src/data/assessments.ts`, `FontFamily` from `src/theme/typography.ts`, `Modal` from `react-native`.
- Produces: complete new report page with hero, combines, free sections, premium card, unlocked sections, share card modal.

**Context:** The existing `app/report.tsx` is 603 lines. Replace it entirely with the code below. Every section is written out — do not keep any of the old file.

- [ ] **Step 1: Write the complete new `app/report.tsx`**

Replace `app/report.tsx` with the following complete file:

```typescript
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
  Platform,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile } from '../src/storage/profileStorage';
import { UserProfile } from '../src/types/profile';
import { synthesizeProfile } from '../src/logic/profileSynthesis';
import { CombinedProfile } from '../src/types/profile';
import { COMBINED_ARCHETYPES, TYPE_ARCHETYPES } from '../src/data/resultTypes';
import { TraitBar } from '../src/components/ui/TraitBar';
import { ProfileOrb } from '../src/components/ui/ProfileOrb';
import { calculateProfileClarity } from '../src/logic/profileClarity';
import { Colors } from '../src/theme/colors';
import { FontFamily, FontSize, FontWeight } from '../src/theme/typography';
import { PersonalityScores, AssessmentResult } from '../src/types/assessment';

// ── Constants ─────────────────────────────────────────────────────────────────

const DIMENSION_ITEMS = [
  { id: 'type' as const, label: 'Personality Type', description: 'How you process information and make decisions', icon: 'compass-outline', color: Colors.type },
  { id: 'personality' as const, label: 'Personality Traits', description: 'Your core tendencies and emotional patterns', icon: 'prism-outline', color: Colors.personality },
  { id: 'relationship' as const, label: 'Relationship Pattern', description: 'How you connect, protect yourself, and build trust', icon: 'heart-outline', color: Colors.relationship },
  { id: 'communication' as const, label: 'Communication Style', description: 'How you handle conflict, boundaries, and repair', icon: 'chatbubble-outline', color: Colors.communication },
];

function heroSubtitle(count: number): string {
  if (count >= 4) return 'All 4 dimensions mapped. This report synthesizes your complete InnerType.';
  if (count === 3) return '3 of 4 dimensions mapped. One more dimension will complete your profile.';
  if (count === 2) return '2 of 4 dimensions mapped. Your report becomes more precise as you complete more.';
  return '1 of 4 dimensions mapped. Your report becomes more precise as you complete more.';
}

// ── Helper components ─────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

function FreeCard({
  icon,
  title,
  body,
  color,
  children,
}: {
  icon: string;
  title: string;
  body?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  const c = color ?? Colors.gold;
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardBorder} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: `${c}18` }]}>
            <Ionicons name={icon as any} size={15} color={c} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {body ? <Text style={styles.cardBody}>{body}</Text> : null}
        {children}
      </View>
    </View>
  );
}

function UnlockedCard({
  icon,
  title,
  body,
  color,
  accentLeft,
  children,
}: {
  icon: string;
  title: string;
  body?: string;
  color?: string;
  accentLeft?: boolean;
  children?: React.ReactNode;
}) {
  const c = color ?? Colors.gold;
  return (
    <View style={[styles.card, accentLeft && { borderLeftWidth: 3, borderLeftColor: c }]}>
      <LinearGradient
        colors={[`${c}08`, `${c}03`]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardBorder} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: `${c}18` }]}>
            <Ionicons name={icon as any} size={15} color={c} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {body ? <Text style={styles.cardBody}>{body}</Text> : null}
        {children}
      </View>
    </View>
  );
}

function LockedTeaser({
  icon,
  title,
  teaser,
  color,
  onUnlock,
}: {
  icon: string;
  title: string;
  teaser: string;
  color: string;
  onUnlock: () => void;
}) {
  return (
    <TouchableOpacity onPress={onUnlock} activeOpacity={0.8} style={styles.lockedCard}>
      <LinearGradient
        colors={['rgba(255,255,255,0.025)', 'rgba(255,255,255,0.01)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardBorder} />
      <View style={styles.lockedContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: `${color}14` }]}>
            <Ionicons name={icon as any} size={15} color={`${color}80`} />
          </View>
          <Text style={[styles.cardTitle, styles.lockedTitle]}>{title}</Text>
          <Ionicons name="lock-closed-outline" size={12} color={Colors.textTertiary} />
        </View>
        <Text style={styles.lockedTeaser}>{teaser}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Share card (visual placeholder) ──────────────────────────────────────────

function ShareCardContent({
  displayLabel,
  tagline,
  chips,
  profileClarity,
  accentColor,
}: {
  displayLabel: string;
  tagline: string;
  chips: string[];
  profileClarity: number;
  accentColor: string;
}) {
  return (
    <View style={styles.shareCard}>
      {/* Background orb glow */}
      <View pointerEvents="none" style={styles.shareCardOrb}>
        <ProfileOrb clarity={100} color={accentColor} size={260} />
      </View>
      {/* Overlay for readability */}
      <LinearGradient
        colors={['rgba(9,9,14,0.55)', 'rgba(9,9,14,0.75)', 'rgba(9,9,14,0.88)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.shareCardInner}>
        {/* Wordmark */}
        <Text style={styles.shareCardWordmark}>INNERTYPE</Text>

        {/* Name */}
        <Text style={styles.shareCardName}>{displayLabel}</Text>
        <Text style={styles.shareCardTagline}>{tagline}</Text>

        {/* Chips */}
        {chips.length > 0 && (
          <View style={styles.shareCardChips}>
            {chips.slice(0, 3).map((chip) => (
              <View key={chip} style={styles.shareCardChip}>
                <Text style={styles.shareCardChipText}>{chip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.shareCardFooter}>
          <View style={styles.shareCardDivider} />
          <Text style={styles.shareCardClarity}>Profile clarity · {profileClarity}%</Text>
          <Text style={styles.shareCardApp}>InnerType Personality Test</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ReportScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [combined, setCombined] = useState<CombinedProfile | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const heroFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProfile().then((p) => {
      setProfile(p);
      setIsPremium(p.isPremium);
      const cp = synthesizeProfile(
        p.assessmentResults.personality,
        p.assessmentResults.relationship,
        p.assessmentResults.communication,
        (p.assessmentResults as any).type
      );
      setCombined(cp);
      Animated.timing(heroFade, { toValue: 1, duration: 480, delay: 80, useNativeDriver: true }).start();
    });
  }, []);

  if (!combined || !profile) {
    return (
      <View style={styles.empty}>
        <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.emptySafe}>
          <Ionicons name="document-text-outline" size={40} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>Complete an assessment first</Text>
          <Text style={styles.emptyBody}>
            Your report appears here after completing at least one assessment.
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // Derived values
  const archetypeData = COMBINED_ARCHETYPES.find((a) => a.key === combined.archetype);
  const displayLabel = archetypeData?.label ?? combined.archetype.replace(/([A-Z])/g, ' $1').trim();
  const chips = archetypeData?.chips ?? [];
  const profileClarity = calculateProfileClarity(profile);

  const typeResult = (profile.assessmentResults as any).type as AssessmentResult | undefined;
  const typeArchetype = typeResult
    ? TYPE_ARCHETYPES.find((a) => a.typeCode === typeResult.primaryType)
    : undefined;
  const personalityScores = profile.assessmentResults.personality?.scores as PersonalityScores | undefined;

  const completedCount = [
    (profile.assessmentResults as any).type,
    profile.assessmentResults.personality,
    profile.assessmentResults.relationship,
    profile.assessmentResults.communication,
  ].filter(Boolean).length;

  const accentColor = Colors.innerType;

  // Growth plan bullets: split on ". " and take up to 4 sentences
  const growthBullets = combined.growthEdge
    .split(/\.\s+/)
    .filter((s) => s.trim().length > 0)
    .slice(0, 4)
    .map((s) => (s.endsWith('.') ? s : `${s}.`));

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />

      {/* Ambient orb — subtle top-right */}
      <View pointerEvents="none" style={styles.ambientOrb}>
        <ProfileOrb clarity={100} color={accentColor} size={420} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Full Report</Text>
          {isPremium ? (
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() =>
                Share.share({ message: `My InnerType: ${displayLabel} — ${combined.archetypeTagline}` })
              }
            >
              <Ionicons name="share-outline" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 38 }} />
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <Animated.View style={[styles.hero, { opacity: heroFade }]}>
            <ProfileOrb clarity={profileClarity} color={accentColor} size={100} />

            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={10} color={Colors.gold} />
              <Text style={styles.heroBadgeText}>YOUR INNERTYPE</Text>
            </View>

            <Text style={styles.heroName}>{displayLabel}</Text>
            <Text style={styles.heroTagline}>{combined.archetypeTagline}</Text>

            <View style={styles.heroClarityRow}>
              <Text style={[styles.heroClarityNum, { color: accentColor }]}>{profileClarity}%</Text>
              <Text style={styles.heroClarityLabel}>profile clarity</Text>
            </View>

            <Text style={styles.heroSubtitle}>{heroSubtitle(completedCount)}</Text>

            {/* Dimension status row — only when incomplete */}
            {completedCount < 4 && (
              <View style={styles.dimStatus}>
                {DIMENSION_ITEMS.map((dim) => {
                  const done = !!(
                    dim.id === 'type'
                      ? (profile.assessmentResults as any).type
                      : profile.assessmentResults[dim.id]
                  );
                  return (
                    <TouchableOpacity
                      key={dim.id}
                      onPress={() =>
                        router.push(done ? `/assessment/${dim.id}/result` : `/assessment/${dim.id}/intro`)
                      }
                      style={styles.dimItem}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.dimDot,
                          { backgroundColor: done ? dim.color : Colors.surfaceBorder },
                        ]}
                      />
                      <Text style={[styles.dimName, done && { color: dim.color }]}>
                        {dim.label.split(' ')[0]}
                      </Text>
                      {done ? (
                        <Ionicons name="checkmark" size={10} color={dim.color} />
                      ) : (
                        <Text style={styles.dimStart}>Start →</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Animated.View>

          {/* ── What your report combines ─────────────────────────────── */}
          <View style={styles.combinesCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardBorder} />
            <View style={styles.combinesContent}>
              <Text style={styles.combinesHeading}>What your report combines</Text>
              {DIMENSION_ITEMS.map((dim, i) => (
                <View
                  key={dim.id}
                  style={[styles.combineRow, i < DIMENSION_ITEMS.length - 1 && styles.combineRowBorder]}
                >
                  <View style={[styles.combineIcon, { backgroundColor: `${dim.color}18` }]}>
                    <Ionicons name={dim.icon as any} size={14} color={dim.color} />
                  </View>
                  <View style={styles.combineText}>
                    <Text style={[styles.combineName, { color: dim.color }]}>{dim.label}</Text>
                    <Text style={styles.combineDesc}>{dim.description}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.combinesFooter}>
                Basic results are free. The full report unlocks the deeper synthesis.
              </Text>
            </View>
          </View>

          {/* ── Free sections ─────────────────────────────────────────── */}
          <SectionDivider label="YOUR PROFILE" />

          {/* Overview */}
          <FreeCard icon="person-outline" title="Overview" body={combined.description} color={Colors.gold} />

          {/* How you think */}
          <FreeCard icon="prism-outline" title="How you think" color={Colors.personality}>
            {typeArchetype ? (
              <Text style={styles.cardBody}>{typeArchetype.description}</Text>
            ) : null}
            {personalityScores ? (
              <>
                {typeArchetype ? <View style={{ height: 8 }} /> : null}
                <TraitBar label="Curiosity & Openness" value={personalityScores.O} color={Colors.personality} />
                <TraitBar label="Structure & Direction" value={personalityScores.C} color={Colors.personality} />
                <TraitBar label="Energy & Social Drive" value={personalityScores.E} color={Colors.personality} />
                <TraitBar label="Warmth & Cooperation" value={personalityScores.A} color={Colors.personality} />
                <TraitBar label="Emotional Sensitivity" value={personalityScores.N} color={Colors.personality} />
              </>
            ) : null}
            {!typeArchetype && !personalityScores ? (
              <Text style={styles.cardBodyDim}>
                Complete Personality Type or Personality Traits to reveal this dimension.
              </Text>
            ) : null}
          </FreeCard>

          {/* How you connect */}
          <FreeCard
            icon="heart-outline"
            title="How you connect"
            body={
              profile.assessmentResults.relationship
                ? combined.relationshipPattern
                : 'Complete the Relationship Pattern assessment to reveal this dimension.'
            }
            color={Colors.relationship}
          />

          {/* How you communicate */}
          <FreeCard
            icon="chatbubble-outline"
            title="How you communicate"
            body={
              profile.assessmentResults.communication
                ? combined.communicationStyle
                : 'Complete the Communication Style assessment to reveal this dimension.'
            }
            color={Colors.communication}
          />

          {/* Free preview card — generous blind spot reveal */}
          <View style={styles.previewCard}>
            <LinearGradient
              colors={[`${Colors.gold}12`, `${Colors.gold}04`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.cardBorder, { borderColor: `${Colors.gold}28` }]} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: Colors.goldDim }]}>
                  <Ionicons name="eye-outline" size={15} color={Colors.gold} />
                </View>
                <Text style={styles.cardTitle}>What others may miss about you</Text>
              </View>
              {/* Full blind spot shown free — this is the generous preview */}
              <Text style={styles.cardBody}>{combined.blindSpot}</Text>

              {/* Growth edge — first sentence only, rest faded */}
              <View style={styles.previewGrowthWrap}>
                <Text style={styles.previewGrowthLabel}>GROWTH EDGE PREVIEW</Text>
                <Text style={styles.previewGrowthText} numberOfLines={2}>
                  {combined.growthEdge}
                </Text>
                <LinearGradient
                  colors={['transparent', Colors.background]}
                  style={styles.previewGrowthFade}
                  pointerEvents="none"
                />
              </View>

              {!isPremium && (
                <TouchableOpacity
                  onPress={() => router.push('/paywall')}
                  style={styles.previewCta}
                  activeOpacity={0.7}
                >
                  <Text style={styles.previewCtaText}>See the full picture →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Premium section (!isPremium) ──────────────────────────── */}
          {!isPremium && (
            <>
              <SectionDivider label="FULL REPORT" />

              {/* Premium card */}
              <View style={styles.premiumCard}>
                <LinearGradient
                  colors={[
                    'rgba(201,169,110,0.14)',
                    'rgba(201,169,110,0.05)',
                    'rgba(155,142,196,0.07)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.cardBorder, { borderColor: `${Colors.gold}38` }]} />

                <View style={styles.premiumContent}>
                  <View style={styles.premiumBadge}>
                    <Ionicons name="sparkles" size={10} color={Colors.gold} />
                    <Text style={styles.premiumBadgeText}>FULL REPORT</Text>
                  </View>

                  <Text style={styles.premiumTitle}>
                    Unlock your complete{'\n'}InnerType report
                  </Text>
                  <Text style={styles.premiumDesc}>
                    Go beyond the result — see how your patterns shape relationships, work, stress, and growth.
                  </Text>

                  {/* 2-column chip grid */}
                  <View style={styles.premiumChipGrid}>
                    {[
                      'How you think',
                      'What drives you',
                      'What drains you',
                      'What helps you thrive',
                      'Blind spots',
                      'Work style',
                      'Relationship guide',
                      'Communication guide',
                      'Growth plan',
                      'Shareable card',
                    ].map((label) => (
                      <View key={label} style={styles.premiumChip}>
                        <Ionicons name="checkmark" size={11} color={Colors.gold} />
                        <Text style={styles.premiumChipText}>{label}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Nudge when profile is incomplete */}
                  {completedCount < 4 && (
                    <View style={styles.premiumNudge}>
                      <Ionicons name="information-circle-outline" size={13} color={Colors.textTertiary} />
                      <Text style={styles.premiumNudgeText}>
                        Complete all 4 dimensions for the most precise synthesis.
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => router.push('/paywall')}
                    activeOpacity={0.85}
                    style={[
                      styles.premiumCta,
                      completedCount < 4 && { opacity: 0.78 },
                      Platform.select({
                        ios:
                          completedCount >= 4
                            ? {
                                shadowColor: Colors.gold,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.40,
                                shadowRadius: 14,
                              }
                            : {},
                      }),
                    ]}
                  >
                    <LinearGradient
                      colors={Colors.gradientGold}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
                    />
                    <Ionicons name="sparkles" size={14} color={Colors.textInverse} />
                    <Text style={styles.premiumCtaText}>Unlock Full Report · €4.99</Text>
                  </TouchableOpacity>

                  <Text style={styles.premiumMeta}>One-time unlock · No subscription</Text>
                </View>
              </View>

              {/* 3 curated teasers */}
              <LockedTeaser
                icon="flash-outline"
                title="What drains you"
                teaser={combined.stressResponse.split('.')[0] + '.'}
                color={Colors.relationship}
                onUnlock={() => router.push('/paywall')}
              />
              <LockedTeaser
                icon="leaf-outline"
                title="What helps you thrive"
                teaser={combined.thriveConditions.split('.')[0] + '.'}
                color={Colors.success}
                onUnlock={() => router.push('/paywall')}
              />
              <LockedTeaser
                icon="trending-up-outline"
                title="Growth plan"
                teaser={combined.growthEdge.split('.')[0] + '.'}
                color={Colors.communication}
                onUnlock={() => router.push('/paywall')}
              />
            </>
          )}

          {/* ── Unlocked sections (isPremium) ─────────────────────────── */}
          {isPremium && (
            <>
              <SectionDivider label="DEEPER PATTERNS" />

              <UnlockedCard
                icon="flash-outline"
                title="What drains you"
                body={combined.stressResponse}
                color={Colors.relationship}
              />

              <UnlockedCard
                icon="sparkles-outline"
                title="What drives you"
                body={combined.whatDrivesYou}
                color={Colors.gold}
              />

              <UnlockedCard
                icon="leaf-outline"
                title="What helps you thrive"
                body={combined.thriveConditions}
                color={Colors.success}
              />

              <UnlockedCard
                icon="eye-outline"
                title="Blind spots"
                body={combined.blindSpot}
                color={Colors.personality}
                accentLeft
              />

              <UnlockedCard
                icon="briefcase-outline"
                title="Work style"
                body={combined.workStyle}
                color={Colors.softBlue}
              />

              <SectionDivider label="RELATIONSHIPS & COMMUNICATION" />

              <UnlockedCard
                icon="heart-outline"
                title="How you connect"
                body={combined.relationshipPattern}
                color={Colors.relationship}
              >
                {combined.relationshipGuidance ? (
                  <View style={styles.relationshipGuidanceInset}>
                    <Text style={styles.relationshipGuidanceLabel}>GUIDANCE</Text>
                    <Text style={styles.cardBody}>{combined.relationshipGuidance}</Text>
                  </View>
                ) : null}
              </UnlockedCard>

              <UnlockedCard
                icon="chatbubble-outline"
                title="How you communicate"
                body={combined.communicationStyle}
                color={Colors.communication}
              />

              <SectionDivider label="GROWTH" />

              {/* Growth plan — rendered as bullets */}
              <View style={styles.card}>
                <LinearGradient
                  colors={[`${Colors.success}0A`, `${Colors.success}03`]}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.cardBorder} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: `${Colors.success}18` }]}>
                      <Ionicons name="trending-up-outline" size={15} color={Colors.success} />
                    </View>
                    <Text style={styles.cardTitle}>Growth plan</Text>
                  </View>
                  <View style={styles.growthBullets}>
                    {growthBullets.map((bullet, i) => (
                      <View key={i} style={styles.growthBulletRow}>
                        <View style={[styles.growthBulletDot, { backgroundColor: Colors.success }]} />
                        <Text style={styles.cardBody}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* ── Shareable card (placeholder) ────────────────────── */}
              <SectionDivider label="YOUR IDENTITY CARD" />

              <View style={styles.shareCardSection}>
                <Text style={styles.shareCardSectionDesc}>
                  A summary of your InnerType — designed to be shared.
                </Text>

                <ShareCardContent
                  displayLabel={displayLabel}
                  tagline={combined.archetypeTagline}
                  chips={chips}
                  profileClarity={profileClarity}
                  accentColor={accentColor}
                />

                <TouchableOpacity
                  onPress={() => setShowShareCard(true)}
                  activeOpacity={0.8}
                  style={styles.shareCardCta}
                >
                  <Ionicons name="expand-outline" size={15} color={Colors.gold} />
                  <Text style={styles.shareCardCtaText}>Preview share card</Text>
                </TouchableOpacity>
                <Text style={styles.shareCardComingSoon}>Share card — coming soon</Text>
              </View>
            </>
          )}

          <Text style={styles.footnote}>
            Results reflect self-perception at the time of assessment. Patterns evolve — retaking assessments over time can reveal growth.
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Share card modal */}
      <Modal
        visible={showShareCard}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShareCard(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setShowShareCard(false)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <ShareCardContent
              displayLabel={displayLabel}
              tagline={combined.archetypeTagline}
              chips={chips}
              profileClarity={profileClarity}
              accentColor={accentColor}
            />
            <TouchableOpacity
              onPress={() => setShowShareCard(false)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalComingSoon}>Share card — coming soon</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Container
  container: { flex: 1 },
  ambientOrb: { position: 'absolute', top: -160, right: -140, opacity: 0.22 },
  safeArea: { flex: 1 },

  // Empty state
  empty: { flex: 1 },
  emptySafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
  emptyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: `${Colors.gold}35`,
  },
  emptyBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    color: Colors.gold,
  },

  // Nav
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 52, gap: 16 },

  // Hero
  hero: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.goldDim,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  heroName: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  heroTagline: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  heroClarityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  heroClarityNum: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  heroClarityLabel: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.65,
    paddingHorizontal: 16,
  },

  // Dimension status row
  dimStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  dimItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  dimDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dimName: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  dimStart: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },

  // Section divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 2.0,
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },

  // Combines card
  combinesCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  combinesContent: {
    padding: 18,
    gap: 0,
  },
  combinesHeading: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  combineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  combineRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  combineIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  combineText: { flex: 1, gap: 1 },
  combineName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },
  combineDesc: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: FontSize.xs * 1.5,
  },
  combinesFooter: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
  },

  // Base card
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  cardBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  cardContent: {
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.68,
  },
  cardBodyDim: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: FontSize.sm * 1.6,
    fontStyle: 'italic',
  },

  // Preview card
  previewCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  previewGrowthWrap: {
    gap: 6,
    position: 'relative',
  },
  previewGrowthLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  previewGrowthText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: FontSize.sm * 1.6,
  },
  previewGrowthFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  previewCta: {
    paddingTop: 4,
  },
  previewCtaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.gold,
  },

  // Locked teaser
  lockedCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  lockedContent: {
    padding: 18,
    gap: 10,
  },
  lockedTitle: {
    color: Colors.textSecondary,
    opacity: 0.65,
  },
  lockedTeaser: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: FontSize.sm * 1.6,
    opacity: 0.7,
  },

  // Premium card
  premiumCard: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumContent: {
    padding: 22,
    gap: 18,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.goldDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  premiumTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: FontSize['2xl'] * 1.15,
  },
  premiumDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },
  premiumChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  premiumChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
  },
  premiumChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.gold,
  },
  premiumNudge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  premiumNudgeText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: FontSize.xs * 1.55,
  },
  premiumCta: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  premiumCtaText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  premiumMeta: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: -6,
  },

  // Relationship guidance inset
  relationshipGuidanceInset: {
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  relationshipGuidanceLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Growth bullets
  growthBullets: { gap: 10 },
  growthBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  growthBulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },

  // Share card section
  shareCardSection: {
    gap: 14,
    alignItems: 'center',
  },
  shareCardSectionDesc: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },

  // Share card visual
  shareCard: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.surfaceBorderStrong,
  },
  shareCardOrb: {
    position: 'absolute',
    top: -60,
    left: '50%',
    marginLeft: -130,
    opacity: 0.6,
  },
  shareCardInner: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
  },
  shareCardWordmark: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Colors.innerType,
    letterSpacing: 3,
  },
  shareCardName: {
    fontSize: 36,
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 40,
    marginTop: 8,
  },
  shareCardTagline: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.5,
    marginTop: 8,
  },
  shareCardChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 16,
  },
  shareCardChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  shareCardChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  shareCardFooter: {
    gap: 6,
    marginTop: 'auto',
  },
  shareCardDivider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginBottom: 4,
  },
  shareCardClarity: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  shareCardApp: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.3,
  },

  // Share card CTA
  shareCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: `${Colors.gold}35`,
  },
  shareCardCtaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.gold,
  },
  shareCardComingSoon: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: -4,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9,9,14,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  modalCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalComingSoon: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },

  // Footnote
  footnote: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.65,
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/otastemelis/claude/innertype && npx tsc --noEmit
```

Expected: zero errors. Common issues to fix:
- If `FontFamily` is not exported from `src/theme/typography.ts`: remove the `fontFamily: FontFamily.display` lines from `shareCardName` and `heroName` styles (use `fontWeight` only).
- If `Colors.surfaceBorderStrong` doesn't exist: replace with `'rgba(255,255,255,0.15)'`.
- If `AssessmentResult` import conflicts: ensure it comes from `'../src/types/assessment'`.

- [ ] **Step 3: Commit**

```bash
cd /Users/otastemelis/claude/innertype
git add app/report.tsx
git commit -m "feat(report): complete redesign — hero, 4-state handling, combines section, free preview, premium card, unlocked sections, share card modal"
```

---

## Task 3: Paywall improvements

**Files:**
- Modify: `app/paywall.tsx`

**Interfaces:**
- Consumes: no new dependencies
- Produces: improved paywall with matching 2-column chip grid and stronger copy

- [ ] **Step 1: Update `WHAT_UNLOCKS` list and improve hero copy in `app/paywall.tsx`**

Replace the existing `WHAT_UNLOCKS` constant and update the hero subtitle. Find and replace these specific sections:

**Replace `WHAT_UNLOCKS`:**
```typescript
const WHAT_UNLOCKS = [
  { icon: 'prism-outline', label: 'How you think', detail: 'Type-based patterns and core personality tendencies', color: Colors.personality },
  { icon: 'sparkles-outline', label: 'What drives you', detail: 'The motivations specific to your combination of patterns', color: Colors.gold },
  { icon: 'flash-outline', label: 'What drains you', detail: 'The specific patterns that quietly cost you energy', color: Colors.relationship },
  { icon: 'leaf-outline', label: 'What helps you thrive', detail: 'Conditions where you naturally come alive', color: Colors.success },
  { icon: 'eye-outline', label: 'Blind spots', detail: 'What you consistently miss — kind but sharp', color: Colors.personality },
  { icon: 'briefcase-outline', label: 'Work style', detail: 'How your patterns shape decisions and collaboration', color: Colors.softBlue },
  { icon: 'heart-outline', label: 'Relationship guidance', detail: 'How your type shows up in close relationships', color: Colors.lavender },
  { icon: 'chatbubble-outline', label: 'Communication guide', detail: 'Conflict, boundaries, and repair', color: Colors.communication },
  { icon: 'trending-up-outline', label: 'Growth plan', detail: 'Actionable steps specific to your pattern combination', color: Colors.communication },
  { icon: 'share-outline', label: 'Shareable identity card', detail: 'A designed summary of your complete InnerType', color: Colors.pearl },
];
```

**Replace `heroSubtitle` text** (inside the hero `View`):
```typescript
            <Text style={styles.heroSubtitle}>
              Go beyond individual results — see how your type, traits, relationship pattern, and communication style form one coherent picture.
            </Text>
```

**Replace the guarantee text:**
```typescript
            <Text style={styles.guarantee}>
              Basic results are always free. The full report unlocks the deeper synthesis.{'\n'}This is a demo — no real payment is processed.
            </Text>
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/otastemelis/claude/innertype && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/otastemelis/claude/innertype
git add app/paywall.tsx
git commit -m "feat(paywall): expand features list to 10 items, improve hero copy"
```

---

## Task 4: Final verification

**Files:** read-only verification

- [ ] **Step 1: Full typecheck**

```bash
cd /Users/otastemelis/claude/innertype && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Verify all 8 CombinedArchetype entries have new fields**

```bash
grep -c "thriveConditions\|whatDrivesYou" /Users/otastemelis/claude/innertype/src/data/resultTypes.ts
```

Expected: output `16` (8 archetypes × 2 fields each).

- [ ] **Step 3: Verify CombinedProfile has all new fields**

```bash
grep -A 15 "export interface CombinedProfile" /Users/otastemelis/claude/innertype/src/types/profile.ts
```

Expected: output includes `thriveConditions`, `whatDrivesYou`, `relationshipGuidance`.

- [ ] **Step 4: Verify synthesizeProfile passes new fields through**

```bash
grep "thriveConditions\|whatDrivesYou\|relationshipGuidance" /Users/otastemelis/claude/innertype/src/logic/profileSynthesis.ts
```

Expected: 3 lines, one for each field in the return statement.

- [ ] **Step 5: Final commit if any fixes were needed**

If step 1 showed errors and you fixed them:
```bash
cd /Users/otastemelis/claude/innertype
git add -p
git commit -m "fix(report): typecheck cleanup after full report redesign"
```

If no fixes were needed, no commit required.
