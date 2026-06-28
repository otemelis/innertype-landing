import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile } from '../../src/storage/profileStorage';
import { UserProfile } from '../../src/types/profile';
import { ASSESSMENTS } from '../../src/data/assessments';
import { synthesizeProfile, getCompletedAssessmentCount } from '../../src/logic/profileSynthesis';
import { getFirstInsight, Insight } from '../../src/logic/insights';
import { calculateProfileClarity } from '../../src/logic/profileClarity';
import { getInnerTypeState } from '../../src/logic/innerTypeEvolution';
import { ProfileOrb } from '../../src/components/ui/ProfileOrb';
import { AuraBackground } from '../../src/components/ui/AuraBackground';
import { Colors } from '../../src/theme/colors';
import { FontFamily, FontSize, FontWeight } from '../../src/theme/typography';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Maps each intent choice to the most relevant first assessment
const GOAL_TO_ASSESSMENT_ID: Record<string, string> = {
  understand_myself: 'type',
  improve_relationships: 'relationship',
  communicate_better: 'communication',
  work_style: 'type',
};

const INSIGHT_CATEGORY_COLORS: Record<string, string> = {
  self: Colors.lavender,
  relationships: Colors.softBlue,
  communication: Colors.gold,
  work: Colors.success,
  growth: Colors.pearl,
};

const INSIGHT_CATEGORY_LABELS: Record<string, string> = {
  self: 'Self-awareness',
  relationships: 'Relationships',
  communication: 'Communication',
  work: 'Work style',
  growth: 'Growth edge',
};

export default function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const heroFadeAnim = useRef(new Animated.Value(0)).current;
  const prevClarityRef = useRef<number | null>(null);
  const celebrateScale = useRef(new Animated.Value(1)).current;

  const load = useCallback(async () => {
    const p = await loadProfile();
    setProfile(p);
    return p;
  }, []);

  useFocusEffect(
    useCallback(() => {
      heroFadeAnim.setValue(0);
      load().then((p) => {
        const newClarity = p ? calculateProfileClarity(p) : 0;
        // Animate orb when clarity increases (e.g., after completing an assessment)
        if (prevClarityRef.current !== null && newClarity > prevClarityRef.current) {
          Animated.sequence([
            Animated.spring(celebrateScale, { toValue: 1.06, tension: 80, friction: 5, useNativeDriver: true }),
            Animated.spring(celebrateScale, { toValue: 1.0, tension: 80, friction: 8, useNativeDriver: true }),
          ]).start();
        }
        prevClarityRef.current = newClarity;
        Animated.timing(heroFadeAnim, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }).start();
      });
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const completedCount = profile
    ? getCompletedAssessmentCount(
        profile.assessmentResults.personality,
        profile.assessmentResults.relationship,
        profile.assessmentResults.communication,
        (profile.assessmentResults as any).type
      )
    : 0;

  const combinedProfile =
    completedCount >= 2
      ? synthesizeProfile(
          profile?.assessmentResults.personality,
          profile?.assessmentResults.relationship,
          profile?.assessmentResults.communication,
          (profile?.assessmentResults as any).type
        )
      : null;

  const clarity = profile ? calculateProfileClarity(profile) : 0;

  const innerType = profile
    ? getInnerTypeState(
        profile.assessmentResults.personality,
        profile.assessmentResults.relationship,
        profile.assessmentResults.communication,
        (profile.assessmentResults as any).type
      )
    : null;

  const firstInsight: Insight | null = profile ? getFirstInsight(profile) : null;
  const userName = profile?.userName;
  const orbColor = Colors.innerType;
  // Respect the user's stated goal when picking the recommended first assessment
  const goalId = profile?.primaryGoal ? GOAL_TO_ASSESSMENT_ID[profile.primaryGoal] : null;
  const incompleteAssessments = ASSESSMENTS.filter((a) => !profile?.assessmentResults[a.id]);
  const nextAssessment =
    goalId && incompleteAssessments.find((a) => a.id === goalId)
      ? incompleteAssessments.find((a) => a.id === goalId)!
      : incompleteAssessments[0] ?? null;

  const singleResult =
    completedCount === 1
      ? (profile?.assessmentResults as any).type ||
        profile?.assessmentResults.personality ||
        profile?.assessmentResults.relationship ||
        profile?.assessmentResults.communication
      : null;

  const summaryStrengths =
    (combinedProfile?.strengths ?? singleResult?.strengths ?? []).slice(0, 3);
  const summaryDescription = combinedProfile?.description ?? singleResult?.summary ?? '';
  const summaryBlindSpot = combinedProfile?.blindSpot ?? singleResult?.blindSpot ?? '';

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

  const insightColor = firstInsight
    ? (INSIGHT_CATEGORY_COLORS[firstInsight.category] ?? Colors.gold)
    : Colors.gold;

  const bridge = bridgeText();
  const heroMeta = heroMetaLabel();
  const hasSummary = combinedProfile !== null || singleResult != null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
      <AuraBackground
        color={Colors.innerType}
        intensity={0.42}
        size={540}
        style={{ top: -SCREEN_H * 0.27, right: -SCREEN_W * 0.51 }}
      />
      <AuraBackground
        color={Colors.lavender}
        intensity={0.25}
        size={420}
        style={{ top: SCREEN_H * 0.52, left: -SCREEN_W * 0.46 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.textTertiary}
            />
          }
        >
          {/* ── Header ──────────────────────────── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.wordmarkSub}>YOUR</Text>
              <Text style={styles.wordmarkMain}>InnerType</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/settings' as any)}
              style={styles.settingsBtn}
            >
              <Ionicons name="settings-outline" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ── Hero ────────────────────────────── */}
          <Animated.View style={[styles.hero, { opacity: heroFadeAnim }]}>
            {/* Orb — the emotional centerpiece */}
            <Animated.View style={[styles.orbWrap, { transform: [{ scale: celebrateScale }] }]}>
              <ProfileOrb clarity={clarity} color={orbColor} size={200} />
            </Animated.View>

            {/* Clarity number */}
            <View style={styles.clarityBlock}>
              <Text
                style={[
                  styles.clarityPct,
                  { color: clarity > 0 ? orbColor : Colors.textTertiary },
                ]}
              >
                {clarity}%
              </Text>
              <Text style={styles.clarityLabel}>Profile clarity</Text>
            </View>

            {/* Identity */}
            {innerType && innerType.phase !== 'unknown' ? (
              <View style={styles.identityBlock}>
                <Text style={styles.heroMeta}>{heroMeta}</Text>
                <Text style={styles.heroName}>{innerType.displayLabel}</Text>
                {innerType.subLabel ? (
                  <Text style={styles.heroSub} numberOfLines={2}>
                    {innerType.subLabel}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.identityBlock}>
                <Text style={styles.heroInvitation}>
                  {userName
                    ? `${userName}, something specific about you is waiting to be named.`
                    : 'Something specific about you is waiting to be named.'}
                </Text>
              </View>
            )}

            {/* Dimension status — minimal dots */}
            <View style={styles.dimStatus}>
              <Text style={styles.dimStatusCount}>
                {completedCount} of 4 dimensions mapped
              </Text>
              <View style={styles.dimStatusRow}>
                {ASSESSMENTS.map((a, i) => {
                  const done = !!profile?.assessmentResults[a.id];
                  const inProg =
                    !done &&
                    (profile?.assessmentProgress[a.id]?.answers?.length ?? 0) > 0;
                  return (
                    <React.Fragment key={a.id}>
                      {i > 0 && <View style={styles.dimStatusSep} />}
                      <TouchableOpacity
                        onPress={() => {
                          if (done) {
                            router.push(`/assessment/${a.id}/result`);
                          } else {
                            router.push(`/assessment/${a.id}/intro`);
                          }
                        }}
                        activeOpacity={0.7}
                        style={styles.dimStatusItem}
                      >
                        <View
                          style={[
                            styles.dimDot,
                            {
                              backgroundColor: done
                                ? a.accentColor
                                : inProg
                                ? `${a.accentColor}55`
                                : Colors.surfaceBorder,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.dimName,
                            done && { color: a.accentColor },
                            inProg && { color: Colors.textSecondary },
                          ]}
                        >
                          {a.title.split(' ')[0]}
                        </Text>
                        {done && (
                          <Ionicons name="checkmark" size={10} color={a.accentColor} />
                        )}
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>

            {/* Primary CTA — single per page */}
            {clarity < 100 && nextAssessment ? (
              <TouchableOpacity
                onPress={() => {
                  const hasProgress =
                    (profile?.assessmentProgress[nextAssessment.id]?.answers?.length ?? 0) > 0;
                  router.push(
                    hasProgress
                      ? `/assessment/${nextAssessment.id}/question`
                      : `/assessment/${nextAssessment.id}/intro`
                  );
                }}
                activeOpacity={0.85}
                style={[
                  styles.primaryCTA,
                  Platform.select({
                    ios: {
                      shadowColor: nextAssessment.accentColor,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.28,
                      shadowRadius: 14,
                    },
                  }),
                ]}
              >
                <LinearGradient
                  colors={[nextAssessment.accentColor, `${nextAssessment.accentColor}CC`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                />
                <View style={styles.primaryCTAInner}>
                  <View style={styles.primaryCTALeft}>
                    <Text style={styles.primaryCTAOverline}>NEXT DIMENSION</Text>
                    <Text style={styles.primaryCTALabel}>{nextAssessment.title}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
                </View>
              </TouchableOpacity>
            ) : clarity >= 100 ? (
              <TouchableOpacity
                onPress={() => router.push('/report')}
                activeOpacity={0.85}
                style={[
                  styles.primaryCTA,
                  Platform.select({
                    ios: {
                      shadowColor: Colors.gold,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.32,
                      shadowRadius: 14,
                    },
                  }),
                ]}
              >
                <LinearGradient
                  colors={Colors.gradientGold}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                />
                <View style={styles.primaryCTAInner}>
                  <View style={styles.primaryCTALeft}>
                    <Text style={styles.primaryCTAOverline}>COMPLETE</Text>
                    <Text style={styles.primaryCTALabel}>View your full InnerType report</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
                </View>
              </TouchableOpacity>
            ) : null}
          </Animated.View>

          {/* ── Narrative bridge ─────────────────── */}
          {bridge && (
            <View style={styles.bridge}>
              <Text style={styles.bridgeText}>{bridge}</Text>
            </View>
          )}

          {/* ── Profile Summary — Level 2 premium surface ── */}
          {hasSummary && (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>
                  {completedCount >= 4 ? 'PROFILE SUMMARY' : 'CURRENT PATTERN'}
                </Text>
              </View>

              {/* Glass identity card */}
              <View
                style={[
                  styles.summaryCard,
                  Platform.select({
                    ios: {
                      shadowColor: Colors.innerType,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.18,
                      shadowRadius: 20,
                    },
                  }),
                ]}
              >
                {/* Background gradient wash — gold ↘ lavender */}
                <LinearGradient
                  colors={[
                    'rgba(212,188,148,0.10)',
                    'rgba(155,142,196,0.07)',
                    'rgba(0,0,0,0)',
                  ]}
                  start={{ x: 0.1, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                {/* Border overlay */}
                <View style={styles.summaryCardBorder} />

                <View style={styles.summaryCardContent}>
                  {/* Badge */}
                  <View style={styles.summaryBadge}>
                    <Ionicons name="star-outline" size={11} color={Colors.gold} />
                    <Text style={styles.summaryBadgeText}>WHAT DEFINES YOU</Text>
                  </View>

                  {/* Strength chips */}
                  {summaryStrengths.length > 0 && (
                    <View style={styles.strengthsRow}>
                      {summaryStrengths.map((s: string) => (
                        <View key={s} style={styles.strengthChip}>
                          <Text style={styles.strengthChipText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Description */}
                  {summaryDescription ? (
                    <Text style={styles.summaryDesc} numberOfLines={5}>
                      {summaryDescription}
                    </Text>
                  ) : null}

                  {/* Growth edge — soft inset, no nested border */}
                  {summaryBlindSpot ? (
                    <View style={styles.growthInset}>
                      <View style={styles.growthInsetHeader}>
                        <Ionicons name="leaf-outline" size={12} color={Colors.success} />
                        <Text style={styles.growthLabel}>Growth edge</Text>
                      </View>
                      <Text style={styles.growthText} numberOfLines={3}>
                        {summaryBlindSpot}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          )}

          {/* ── For you today — Level 2 premium surface ── */}
          {firstInsight && (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>FOR YOU TODAY</Text>
                <TouchableOpacity onPress={() => router.push('/insights' as any)}>
                  <Text style={styles.sectionLink}>View all</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/insights' as any)}
                activeOpacity={0.82}
                style={[
                  styles.insightCard,
                  Platform.select({
                    ios: {
                      shadowColor: insightColor,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.14,
                      shadowRadius: 18,
                    },
                  }),
                ]}
              >
                {/* Category-color gradient wash — dialed back so the left bar dominates */}
                <LinearGradient
                  colors={[`${insightColor}06`, `${insightColor}02`, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                {/* Color-tinted border */}
                <View style={[styles.insightCardBorder, { borderColor: `${insightColor}28` }]} />

                {/* Left accent bar */}
                <View style={[styles.insightLeftBar, { backgroundColor: insightColor }]} />

                <View style={styles.insightContent}>
                  {/* Category row with icon */}
                  <View style={styles.insightCategoryRow}>
                    <View
                      style={[
                        styles.insightCategoryIcon,
                        { backgroundColor: `${insightColor}18` },
                      ]}
                    >
                      <Ionicons
                        name={firstInsight.icon as any}
                        size={12}
                        color={insightColor}
                      />
                    </View>
                    <Text style={[styles.insightCategoryLabel, { color: insightColor }]}>
                      {INSIGHT_CATEGORY_LABELS[firstInsight.category] ?? firstInsight.category}
                    </Text>
                  </View>

                  {/* Personalized title */}
                  <Text style={styles.insightTitle}>
                    {userName
                      ? `${userName}, ${firstInsight.title
                          .charAt(0)
                          .toLowerCase()}${firstInsight.title.slice(1)}`
                      : firstInsight.title}
                  </Text>

                  {/* Body copy */}
                  <Text style={styles.insightBody} numberOfLines={3}>
                    {firstInsight.body}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Your Dimensions — Level 3 utility ── */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>YOUR DIMENSIONS</Text>
              {completedCount > 0 && (
                <Text style={styles.sectionMeta}>{completedCount} of 4 done</Text>
              )}
            </View>

            <View style={styles.dimList}>
              {ASSESSMENTS.map((a, idx) => {
                const result = profile?.assessmentResults[a.id];
                const progress = profile?.assessmentProgress[a.id];
                const done = !!result;
                const inProg = !done && (progress?.answers?.length ?? 0) > 0;
                // Next action: the first non-done assessment
                const isNext = !done && a.id === nextAssessment?.id;

                return (
                  <TouchableOpacity
                    key={a.id}
                    onPress={() => {
                      if (done) {
                        router.push(`/assessment/${a.id}/result`);
                      } else {
                        router.push(`/assessment/${a.id}/intro`);
                      }
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.dimListRow,
                      idx < ASSESSMENTS.length - 1 && styles.dimListDivider,
                      isNext && styles.dimListRowNext,
                    ]}
                  >
                    {/* Subtle next-action left accent */}
                    {isNext && (
                      <View
                        style={[styles.dimListNextAccent, { backgroundColor: a.accentColor }]}
                      />
                    )}

                    <View
                      style={[
                        styles.dimListIcon,
                        {
                          backgroundColor: done
                            ? `${a.accentColor}18`
                            : isNext
                            ? `${a.accentColor}14`
                            : 'rgba(255,255,255,0.04)',
                        },
                      ]}
                    >
                      <Ionicons
                        name={a.iconName as any}
                        size={16}
                        color={
                          done
                            ? a.accentColor
                            : isNext
                            ? `${a.accentColor}CC`
                            : Colors.textTertiary
                        }
                      />
                    </View>

                    <View style={styles.dimListText}>
                      <Text
                        style={[
                          styles.dimListTitle,
                          done && { color: Colors.textPrimary },
                          isNext && { color: Colors.textSecondary },
                        ]}
                      >
                        {a.title}
                      </Text>
                      <Text style={styles.dimListSub}>{a.frameworkLabel}</Text>
                    </View>

                    <View style={styles.dimListRight}>
                      {done ? (
                        <>
                          <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                          <Text style={[styles.dimListStatus, { color: Colors.success }]}>
                            Done
                          </Text>
                        </>
                      ) : inProg ? (
                        <>
                          <Text style={[styles.dimListStatus, { color: a.accentColor }]}>
                            Continue
                          </Text>
                          <Ionicons name="chevron-forward" size={13} color={a.accentColor} />
                        </>
                      ) : isNext ? (
                        <>
                          <Text
                            style={[
                              styles.dimListStatus,
                              styles.dimListStatusNext,
                              { color: a.accentColor },
                            ]}
                          >
                            Start
                          </Text>
                          <Ionicons name="chevron-forward" size={13} color={a.accentColor} />
                        </>
                      ) : (
                        <Text style={[styles.dimListStatus, { color: Colors.textTertiary }]}>
                          Locked
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Footer ──────────────────────────── */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => router.push('/methodology' as any)}
              style={styles.footerLink}
            >
              <Ionicons name="flask-outline" size={13} color={Colors.textTertiary} />
              <Text style={styles.footerLinkText}>Our methodology</Text>
            </TouchableOpacity>
            <View style={styles.footerDivider} />
            <TouchableOpacity
              onPress={() => router.push('/settings' as any)}
              style={styles.footerLink}
            >
              <Text style={styles.footerLinkText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Platform.OS === 'ios' ? 108 : 84 },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
  },
  wordmarkSub: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 3.5,
    color: Colors.innerType,
  },
  wordmarkMain: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    marginTop: 1,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
  },
  orbWrap: {
    marginBottom: 4,
  },
  clarityBlock: {
    alignItems: 'center',
    gap: 3,
  },
  clarityPct: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
    letterSpacing: -2.5,
    lineHeight: 52,
  },
  clarityLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  identityBlock: {
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
  },
  heroMeta: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  heroName: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.5,
  },
  heroInvitation: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.55,
    fontStyle: 'italic',
  },

  // Dimension status pills (hero) ─ minimal dots
  dimStatus: {
    alignItems: 'center',
    gap: 10,
  },
  dimStatusCount: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.3,
  },
  dimStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dimStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dimStatusSep: {
    width: 1,
    height: 12,
    backgroundColor: Colors.surfaceBorder,
  },
  dimDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dimName: {
    fontSize: 11,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    letterSpacing: 0.2,
  },

  // Primary CTA
  primaryCTA: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryCTAInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryCTALeft: { gap: 2 },
  primaryCTAOverline: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 2,
    color: `${Colors.textInverse}88`,
    textTransform: 'uppercase',
  },
  primaryCTALabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },

  // ── Narrative bridge ─────────────────────────────────────────
  bridge: {
    paddingHorizontal: 36,
    marginTop: -4,
    marginBottom: 8,
  },
  bridgeText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.7,
    fontStyle: 'italic',
  },

  // ── Section scaffolding ──────────────────────────────────────
  sectionWrap: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionLink: {
    fontSize: FontSize.sm,
    color: Colors.gold,
    fontWeight: FontWeight.medium,
  },
  sectionMeta: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },

  // ── Profile Summary (Level 2 — premium identity card) ────────
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  summaryCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(221,211,190,0.22)',
  },
  summaryCardContent: {
    padding: 22,
    gap: 16,
    zIndex: 1,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.goldDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  summaryBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  strengthsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  strengthChip: {
    backgroundColor: Colors.goldDim,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,188,148,0.25)',
  },
  strengthChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.goldLight,
    letterSpacing: 0.2,
  },
  summaryDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.65,
  },
  // Growth edge — soft tinted inset, no border, no nested card feel
  growthInset: {
    backgroundColor: 'rgba(107,175,139,0.09)',
    borderRadius: 14,
    padding: 14,
    gap: 7,
  },
  growthInsetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  growthLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  growthText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },

  // ── For you today (Level 2 — personalized insight card) ──────
  insightCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
  },
  insightCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
  },
  insightLeftBar: {
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  insightContent: {
    flex: 1,
    padding: 18,
    gap: 9,
    zIndex: 1,
  },
  insightCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  insightCategoryIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCategoryLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  insightTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: FontSize.base * 1.38,
    letterSpacing: -0.2,
  },
  insightBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.62,
  },

  // ── Your Dimensions (Level 3 — compact utility rows) ─────────
  dimList: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  dimListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    position: 'relative',
  },
  dimListDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  // Next action: slightly elevated background
  dimListRowNext: {
    backgroundColor: 'rgba(255,255,255,0.028)',
  },
  // Thin left accent for next dimension
  dimListNextAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2.5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    opacity: 0.8,
  },
  dimListIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dimListText: {
    flex: 1,
    gap: 2,
  },
  dimListTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
    letterSpacing: -0.1,
  },
  dimListSub: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    opacity: 0.7,
  },
  dimListRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  dimListStatus: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  dimListStatusNext: {
    fontWeight: FontWeight.semibold,
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
    paddingBottom: 8,
    marginHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    gap: 10,
    marginTop: 28,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  footerDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.surfaceBorder,
  },
});
