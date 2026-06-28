import React, { useState, useCallback } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile } from '../src/storage/profileStorage';
import { UserProfile } from '../src/types/profile';
import { getInsightsForProfile, Insight } from '../src/logic/insights';
import { synthesizeProfile } from '../src/logic/profileSynthesis';
import { COMBINED_ARCHETYPES } from '../src/data/resultTypes';
import { Colors } from '../src/theme/colors';
import { FontSize, FontWeight } from '../src/theme/typography';

const CATEGORY_COLORS: Record<string, string> = {
  self: Colors.lavender,
  relationships: Colors.softBlue,
  communication: Colors.gold,
  work: Colors.success,
  growth: Colors.pearl,
};

const CATEGORY_LABELS: Record<string, string> = {
  self: 'Self-awareness',
  relationships: 'Relationships',
  communication: 'Communication',
  work: 'Work style',
  growth: 'Growth edge',
};

const CATEGORY_ICONS: Record<string, string> = {
  self: 'telescope-outline',
  relationships: 'people-outline',
  communication: 'chatbubble-outline',
  work: 'briefcase-outline',
  growth: 'trending-up-outline',
};

// Compact insight card for the secondary list
function InsightRow({ insight }: { insight: Insight }) {
  const color = CATEGORY_COLORS[insight.category] ?? Colors.gold;
  const label = CATEGORY_LABELS[insight.category] ?? insight.category;

  return (
    <View style={styles.insightRow}>
      <View style={[styles.insightRowBar, { backgroundColor: color }]} />
      <View style={styles.insightRowContent}>
        <View style={styles.insightRowHeader}>
          <View style={[styles.insightRowIcon, { backgroundColor: `${color}18` }]}>
            <Ionicons name={insight.icon as any} size={13} color={color} />
          </View>
          <Text style={[styles.insightRowCategory, { color }]}>{label}</Text>
        </View>
        <Text style={styles.insightRowTitle}>{insight.title}</Text>
        <Text style={styles.insightRowBody}>{insight.body}</Text>
      </View>
    </View>
  );
}

export default function InsightsScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, [])
  );

  const insights = profile ? getInsightsForProfile(profile) : [];
  const heroInsight = insights[0] ?? null;
  const restInsights = insights.slice(1);

  const userName = profile?.userName;

  const combined =
    profile
      ? synthesizeProfile(
          profile.assessmentResults.personality,
          profile.assessmentResults.relationship,
          profile.assessmentResults.communication,
          profile.assessmentResults.type
        )
      : null;

  const archetypeLabel = combined
    ? (COMBINED_ARCHETYPES.find((a) => a.key === combined.archetype)?.label ?? combined.archetype)
    : null;

  const heroColor = heroInsight ? (CATEGORY_COLORS[heroInsight.category] ?? Colors.gold) : Colors.gold;
  const heroLabel = heroInsight ? (CATEGORY_LABELS[heroInsight.category] ?? heroInsight.category) : '';
  const heroIcon = heroInsight ? (CATEGORY_ICONS[heroInsight.category] ?? 'sparkles-outline') : 'sparkles-outline';

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Page header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Your Insights</Text>
            <Text style={styles.pageSubtitle}>
              {archetypeLabel
                ? `Drawn from your ${archetypeLabel} profile.`
                : 'These insights update as more dimensions are mapped.'}
            </Text>
          </View>

          {insights.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={40} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No insights yet</Text>
              <Text style={styles.emptyBody}>
                Complete at least one assessment to see insights tailored to your profile.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/assessments')}
                style={styles.emptyBtn}
              >
                <Text style={styles.emptyBtnText}>View assessments</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Hero insight */}
              {heroInsight && (
                <View style={[styles.heroCard, { borderColor: `${heroColor}30` }]}>
                  <LinearGradient
                    colors={[`${heroColor}12`, `${heroColor}04`, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />

                  <View style={styles.heroCardContent}>
                    <View style={styles.heroCardTop}>
                      <View style={[styles.heroIconWrap, { backgroundColor: `${heroColor}18` }]}>
                        <Ionicons name={heroIcon as any} size={20} color={heroColor} />
                      </View>
                      <Text style={[styles.heroCategoryLabel, { color: heroColor }]}>
                        {heroLabel.toUpperCase()}
                      </Text>
                    </View>

                    <Text style={styles.heroTitle}>
                      {userName
                        ? `${userName}, ${heroInsight.title.charAt(0).toLowerCase()}${heroInsight.title.slice(1)}`
                        : heroInsight.title}
                    </Text>

                    <Text style={styles.heroBody}>{heroInsight.body}</Text>
                  </View>
                </View>
              )}

              {/* Context note */}
              {archetypeLabel && (
                <Text style={styles.contextNote}>
                  Based on your {archetypeLabel} profile
                </Text>
              )}

              {/* Secondary insights */}
              {restInsights.length > 0 && (
                <View style={styles.insightsList}>
                  {restInsights.map((insight) => (
                    <InsightRow key={insight.id} insight={insight} />
                  ))}
                </View>
              )}

              <Text style={styles.footer}>
                Insights reflect your self-perception at time of assessment and update as you complete more dimensions.
              </Text>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 20,
  },

  // Page header
  pageHeader: { paddingTop: 8, gap: 6 },
  pageTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.55,
  },

  // Hero card
  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  heroCardContent: {
    padding: 22,
    gap: 14,
  },
  heroCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCategoryLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 2.0,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: FontSize.xl * 1.3,
    letterSpacing: -0.3,
  },
  heroBody: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.65,
  },

  // Context note
  contextNote: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Insight rows
  insightsList: { gap: 10 },
  insightRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  insightRowBar: {
    width: 3,
  },
  insightRowContent: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  insightRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightRowIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightRowCategory: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  insightRowTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    lineHeight: FontSize.base * 1.35,
  },
  insightRowBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  emptyBody: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
    paddingHorizontal: 24,
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
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

  footer: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.6,
    paddingHorizontal: 12,
  },
});
