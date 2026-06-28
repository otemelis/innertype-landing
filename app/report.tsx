import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile } from '../src/storage/profileStorage';
import { UserProfile } from '../src/types/profile';
import { synthesizeProfile } from '../src/logic/profileSynthesis';
import { CombinedProfile } from '../src/types/profile';
import { COMBINED_ARCHETYPES } from '../src/data/resultTypes';
import { TraitBar } from '../src/components/ui/TraitBar';
import { ProfileOrb } from '../src/components/ui/ProfileOrb';
import { Colors } from '../src/theme/colors';
import { FontSize, FontWeight } from '../src/theme/typography';
import { PersonalityScores } from '../src/types/assessment';

// Free content section
function FreeSection({
  icon,
  title,
  body,
  color = Colors.gold,
  children,
}: {
  icon: string;
  title: string;
  body?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardBorder} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: `${color}18` }]}>
            <Ionicons name={icon as any} size={15} color={color} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {body ? <Text style={styles.cardBody}>{body}</Text> : null}
        {children}
      </View>
    </View>
  );
}

// Locked teaser
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
          <Text style={[styles.cardTitle, { color: Colors.textSecondary, opacity: 0.6 }]}>{title}</Text>
          <Ionicons name="lock-closed-outline" size={12} color={Colors.textTertiary} />
        </View>
        <Text style={styles.lockedTeaser} numberOfLines={2}>{teaser}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ReportScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [combined, setCombined] = useState<CombinedProfile | null>(null);
  const [isPremium, setIsPremium] = useState(false);

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
    });
  }, []);

  if (!combined) {
    return (
      <View style={styles.empty}>
        <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <Ionicons name="document-text-outline" size={40} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>Complete an assessment first</Text>
          <Text style={styles.emptyBody}>
            Your combined profile report appears here after completing at least one assessment.
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  const archetypeData = COMBINED_ARCHETYPES.find((a) => a.key === combined.archetype);
  const displayLabel = archetypeData?.label ?? combined.archetype.replace(/([A-Z])/g, ' $1').trim();
  const personalityScores = profile?.assessmentResults.personality?.scores as PersonalityScores | undefined;

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />

      {/* Subtle ambient — single orb, top-right only */}
      <View pointerEvents="none" style={{ position: 'absolute', top: -180, right: -160, opacity: 0.30 }}>
        <ProfileOrb clarity={100} color={Colors.innerType} size={480} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Full Profile Report</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ─────────────────────────────────── */}
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={11} color={Colors.gold} />
              <Text style={styles.heroBadgeText}>YOUR INNERTYPE</Text>
            </View>
            <Text style={styles.heroName}>{displayLabel}</Text>
            <Text style={styles.heroTagline}>{combined.archetypeTagline}</Text>
            <Text style={styles.heroSubtitle}>Your full InnerType report combines four mapped dimensions: type, traits, relationships, and communication.</Text>
          </View>

          {/* ── Free sections ────────────────────────── */}
          <View style={styles.freeGroup}>
            <Text style={styles.groupLabel}>YOUR PROFILE</Text>

            <FreeSection icon="person-outline" title="Overview" body={combined.description} color={Colors.gold} />

            {personalityScores && (
              <FreeSection icon="prism-outline" title="How you think" color={Colors.personality}>
                <TraitBar label="Curiosity & Openness" value={personalityScores.O} color={Colors.personality} />
                <TraitBar label="Structure & Direction" value={personalityScores.C} color={Colors.personality} />
                <TraitBar label="Energy & Social Drive" value={personalityScores.E} color={Colors.personality} />
                <TraitBar label="Warmth & Cooperation" value={personalityScores.A} color={Colors.personality} />
                <TraitBar label="Emotional Sensitivity" value={personalityScores.N} color={Colors.personality} />
              </FreeSection>
            )}

            <FreeSection icon="heart-outline" title="How you connect" body={combined.relationshipPattern} color={Colors.relationship} />
            <FreeSection icon="chatbubble-outline" title="How you communicate" body={combined.communicationStyle} color={Colors.communication} />

            {/* Free preview — partial glimpse of premium content */}
            <View style={styles.previewCard}>
              <LinearGradient
                colors={[`${Colors.gold}10`, `${Colors.gold}04`]}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.cardBorder, { borderColor: `${Colors.gold}25` }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: Colors.goldDim }]}>
                    <Ionicons name="eye-outline" size={15} color={Colors.gold} />
                  </View>
                  <Text style={styles.cardTitle}>What others may miss about you</Text>
                </View>
                <Text style={styles.cardBody} numberOfLines={3}>{combined.blindSpot}</Text>
                <View style={styles.previewFade} />
                {!isPremium && (
                  <TouchableOpacity onPress={() => router.push('/paywall')} style={styles.previewCta}>
                    <Text style={styles.previewCtaText}>See the full picture →</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* ── Premium section ──────────────────────── */}
          {!isPremium && (
            <View style={styles.premiumGroup}>
              {/* Premium card */}
              <View style={styles.premiumCard}>
                <LinearGradient
                  colors={['rgba(201,169,110,0.12)', 'rgba(201,169,110,0.04)', 'rgba(155,142,196,0.06)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.cardBorder, { borderColor: `${Colors.gold}35` }]} />
                <View style={styles.premiumCardContent}>
                  <View style={styles.premiumCardTop}>
                    <View style={styles.premiumBadge}>
                      <Ionicons name="sparkles" size={11} color={Colors.gold} />
                      <Text style={styles.premiumBadgeText}>FULL REPORT</Text>
                    </View>
                    <Text style={styles.premiumTitle}>Unlock your complete{'\n'}InnerType report</Text>
                    <Text style={styles.premiumDesc}>
                      Go beyond the result — see how your patterns shape relationships, work, stress, and growth.
                    </Text>
                  </View>

                  <View style={styles.premiumFeatures}>
                    {[
                      { icon: 'eye-outline', label: 'Blind spots in full', color: Colors.gold },
                      { icon: 'flash-outline', label: 'What drains you', color: Colors.relationship },
                      { icon: 'leaf-outline', label: 'What helps you thrive', color: Colors.success },
                      { icon: 'briefcase-outline', label: 'Work style', color: Colors.softBlue },
                      { icon: 'people-outline', label: 'Relationship guidance', color: Colors.lavender },
                      { icon: 'trending-up-outline', label: 'Growth plan', color: Colors.communication },
                      { icon: 'share-outline', label: 'Shareable identity card', color: Colors.pearl },
                    ].map((f, i) => (
                      <View key={f.label} style={styles.premiumFeatureRow}>
                        <Ionicons name={f.icon as any} size={14} color={f.color} />
                        <Text style={styles.premiumFeatureLabel}>{f.label}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push('/paywall')}
                    activeOpacity={0.85}
                    style={[
                      styles.premiumCta,
                      Platform.select({
                        ios: {
                          shadowColor: Colors.gold,
                          shadowOffset: { width: 0, height: 5 },
                          shadowOpacity: 0.40,
                          shadowRadius: 14,
                        },
                      }),
                    ]}
                  >
                    <LinearGradient
                      colors={Colors.gradientGold}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
                    />
                    <Ionicons name="sparkles" size={15} color={Colors.textInverse} />
                    <Text style={styles.premiumCtaText}>Unlock Full Report · €4.99</Text>
                  </TouchableOpacity>

                  <Text style={styles.premiumMeta}>One-time · No subscription · No account needed</Text>
                </View>
              </View>

              {/* 3 teaser cards — curated, not filler */}
              <Text style={styles.groupLabel}>PREVIEW</Text>

              <LockedTeaser
                icon="flash-outline"
                title="What drains you"
                teaser="The specific patterns that quietly cost you energy — and how to recognize them before they compound."
                color={Colors.relationship}
                onUnlock={() => router.push('/paywall')}
              />
              <LockedTeaser
                icon="leaf-outline"
                title="What helps you thrive"
                teaser="Conditions where you naturally come alive: the right environment, pace, and relational dynamics."
                color={Colors.success}
                onUnlock={() => router.push('/paywall')}
              />
              <LockedTeaser
                icon="trending-up-outline"
                title="Growth plan"
                teaser="One honest edge to focus on — specific to your combination of patterns, with context for why it matters."
                color={Colors.communication}
                onUnlock={() => router.push('/paywall')}
              />
            </View>
          )}

          {/* Premium: show all unlocked content */}
          {isPremium && (
            <View style={styles.freeGroup}>
              <Text style={styles.groupLabel}>DEEPER PATTERNS</Text>
              <FreeSection icon="flash-outline" title="What drains you" body={combined.stressResponse} color={Colors.relationship} />
              <FreeSection icon="eye-outline" title="Blind spots" body={combined.blindSpot} color={Colors.gold} />
              <FreeSection icon="briefcase-outline" title="Work style" body={combined.workStyle} color={Colors.softBlue} />
              <FreeSection icon="trending-up-outline" title="Growth plan" body={combined.growthEdge} color={Colors.communication} />
            </View>
          )}

          <Text style={styles.footnote}>
            Results reflect self-perception at the time of assessment. Patterns evolve — retaking assessments over time can reveal growth.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1 },
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

  safeArea: { flex: 1 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeBtn: {
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
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48, gap: 24 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.goldDim,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  heroName: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  heroTagline: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.6,
    paddingHorizontal: 12,
  },

  // Groups
  freeGroup: { gap: 12 },
  premiumGroup: { gap: 12 },
  groupLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },

  // Cards
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
    lineHeight: FontSize.sm * 1.65,
  },

  // Preview card
  previewCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  previewFade: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'transparent',
  },
  previewCta: {
    paddingVertical: 4,
  },
  previewCtaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
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
  lockedTeaser: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: FontSize.sm * 1.6,
    opacity: 0.65,
  },

  // Premium card
  premiumCard: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumCardContent: {
    padding: 22,
    gap: 20,
  },
  premiumCardTop: { gap: 10 },
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
  premiumFeatures: { gap: 10 },
  premiumFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumFeatureLabel: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  premiumCta: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
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
  },

  footnote: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.65,
    paddingHorizontal: 16,
  },
});
