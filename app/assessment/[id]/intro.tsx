import React from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ASSESSMENTS, getAssessment } from '../../../src/data/assessments';
import { ProfileOrb } from '../../../src/components/ui/ProfileOrb';
import { Colors } from '../../../src/theme/colors';
import { FontFamily, FontSize, FontWeight } from '../../../src/theme/typography';

export default function AssessmentIntro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const assessment = getAssessment(id);

  if (!assessment) {
    router.back();
    return null;
  }

  const { accentColor } = assessment;
  const dimensionIndex = ASSESSMENTS.findIndex((a) => a.id === id) + 1;
  const totalDimensions = ASSESSMENTS.length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />

      {/* Atmospheric orb — offset top-right, very subtle */}
      <View pointerEvents="none" style={styles.atmosphericOrb}>
        <ProfileOrb clarity={15} color={accentColor} size={320} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Dimension label + icon */}
          <View style={styles.topMeta}>
            <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18`, borderColor: `${accentColor}38` }]}>
              <Ionicons name={assessment.iconName as any} size={24} color={accentColor} />
            </View>
            <Text style={[styles.dimensionLabel, { color: accentColor }]}>
              DIMENSION {dimensionIndex} OF {totalDimensions}
            </Text>
          </View>

          {/* Hero text */}
          <View style={styles.hero}>
            <Text style={styles.title}>{assessment.title}</Text>
            <Text style={styles.subtitle}>{assessment.subtitle}</Text>
            <Text style={styles.promise}>{assessment.promise}</Text>
          </View>

          {/* Stats — compact 3-column */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{assessment.questionCount}</Text>
              <Text style={styles.statLabel}>questions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{assessment.estimatedMinutes} min</Text>
              <Text style={styles.statLabel}>estimated</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{assessment.sections.length}</Text>
              <Text style={styles.statLabel}>sections</Text>
            </View>
          </View>

          {/* What this reveals */}
          <View style={styles.revealsBlock}>
            <Text style={styles.revealsLabel}>WHAT THIS REVEALS</Text>
            <View style={styles.revealPills}>
              {assessment.sections.map((section) => (
                <View
                  key={section.number}
                  style={[styles.revealPill, { borderColor: `${accentColor}30`, backgroundColor: `${accentColor}0D` }]}
                >
                  <View style={[styles.pillDot, { backgroundColor: accentColor }]} />
                  <Text style={[styles.pillText, { color: accentColor }]}>{section.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Framework trust — compact */}
          <View style={[styles.frameworkRow, { borderColor: `${accentColor}20` }]}>
            <Ionicons name="flask-outline" size={13} color={Colors.textTertiary} />
            <Text style={styles.frameworkText}>{assessment.methodologyNote}</Text>
          </View>

          {/* Progress note */}
          <View style={styles.saveNote}>
            <Ionicons name="cloud-done-outline" size={13} color={Colors.success} />
            <Text style={styles.saveText}>Progress saved automatically. Pause and continue anytime.</Text>
          </View>
        </ScrollView>

        {/* CTA footer — floating with gradient fade */}
        <View style={styles.footer}>
          <LinearGradient
            colors={['transparent', Colors.background]}
            style={styles.footerFade}
            pointerEvents="none"
          />
          <TouchableOpacity
            onPress={() => router.push(`/assessment/${id}/question`)}
            activeOpacity={0.85}
            style={[
              styles.startBtn,
              Platform.select({
                ios: {
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.40,
                  shadowRadius: 16,
                },
              }),
            ]}
          >
            <LinearGradient
              colors={[accentColor, `${accentColor}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
            />
            <Text style={styles.startBtnText}>Start assessment</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  atmosphericOrb: {
    position: 'absolute',
    top: -120,
    right: -120,
    opacity: 0.55,
  },
  safeArea: { flex: 1 },
  nav: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 28,
  },

  // Top meta
  topMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dimensionLabel: {
    fontSize: 11,
    fontWeight: FontWeight.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Hero
  hero: { gap: 8 },
  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: FontSize['3xl'] * 1.2,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  promise: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    fontStyle: 'italic',
    lineHeight: FontSize.md * 1.5,
    marginTop: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 3,
  },
  statDivider: { width: 1, backgroundColor: Colors.surfaceBorder },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },

  // Reveals
  revealsBlock: { gap: 14 },
  revealsLabel: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  revealPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  revealPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  pillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  // Framework
  frameworkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  frameworkText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.55,
  },

  // Save note
  saveNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    flex: 1,
    lineHeight: FontSize.xs * 1.55,
  },

  // Footer CTA
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
    position: 'relative',
  },
  footerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -48,
  },
  startBtn: {
    height: 58,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  startBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
});
