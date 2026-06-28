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
    loadProfile()
      .then((p) => {
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
      })
      .catch((e) => console.error('[ReportScreen] loadProfile failed:', e));
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
    flex: 1,
    justifyContent: 'flex-end',
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
