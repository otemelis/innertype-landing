import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile } from '../../src/storage/profileStorage';
import { UserProfile } from '../../src/types/profile';
import { ASSESSMENTS } from '../../src/data/assessments';
import { AssessmentMeta } from '../../src/types/assessment';
import { ProfileOrb } from '../../src/components/ui/ProfileOrb';
import { calculateProfileClarity } from '../../src/logic/profileClarity';
import { Colors } from '../../src/theme/colors';
import { FontSize, FontWeight } from '../../src/theme/typography';

// Short dimension descriptions for the assessment tab cards
const DIMENSION_META: Record<string, { what: string; reveals: string }> = {
  type: {
    what: 'Perception, decisions, energy & structure',
    reveals: 'How you direct energy, take in information, and approach structure.',
  },
  personality: {
    what: 'Thinking, energy, structure & emotion',
    reveals: 'How you think, make decisions, and respond to your inner world.',
  },
  relationship: {
    what: 'Closeness, reassurance & independence',
    reveals: 'How you seek connection, handle trust, and balance intimacy.',
  },
  communication: {
    what: 'Conflict, boundaries & repair',
    reveals: 'How you express needs, navigate tension, and reconnect.',
  },
};

export default function AssessmentsTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, [])
  );

  const completedCount = ASSESSMENTS.filter((a) => profile?.assessmentResults[a.id]).length;
  const clarity = profile ? calculateProfileClarity(profile) : 0;

  // Surface the goal-preferred assessment first so fresh users see the right starting point
  const GOAL_TO_ID: Record<string, string> = {
    understand_myself: 'personality',
    improve_relationships: 'relationship',
    communicate_better: 'communication',
    work_style: 'personality',
  };
  const goalId = profile?.primaryGoal ? GOAL_TO_ID[profile.primaryGoal] : null;
  const orderedAssessments: AssessmentMeta[] = goalId && completedCount === 0
    ? [
        ...ASSESSMENTS.filter((a) => a.id === goalId),
        ...ASSESSMENTS.filter((a) => a.id !== goalId),
      ]
    : ASSESSMENTS;

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerOverline}>PROFILE DIMENSIONS</Text>
              <Text style={styles.headerTitle}>Build your{'\n'}profile</Text>
              <Text style={styles.headerSubtitle}>
                Three dimensions form your complete InnerType — personality, relationships, and communication.
              </Text>
            </View>
            <ProfileOrb clarity={clarity} color={Colors.innerType} size={100} style={styles.headerOrb} />
          </View>

          {/* Clarity indicator */}
          {completedCount > 0 && (
            <View style={styles.clarityBanner}>
              <LinearGradient
                colors={['rgba(212,188,148,0.10)', 'rgba(212,188,148,0.03)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.clarityBannerBorder} />
              <View style={styles.clarityBannerRow}>
                <Text style={styles.clarityBannerPercent}>{clarity}%</Text>
                <Text style={styles.clarityBannerText}>
                  {completedCount === 3
                    ? 'Profile complete — your InnerType is fully revealed.'
                    : `Profile clarity · ${completedCount} of 3 dimensions mapped.`}
                </Text>
              </View>
            </View>
          )}

          {/* Dimension cards */}
          <View style={styles.cardList}>
            {orderedAssessments.map((assessment, index) => {
              const result = profile?.assessmentResults[assessment.id];
              const progress = profile?.assessmentProgress[assessment.id];
              const done = !!result;
              const inProgress = !done && (progress?.answers?.length ?? 0) > 0;
              const meta = DIMENSION_META[assessment.id];

              return (
                <TouchableOpacity
                  key={assessment.id}
                  onPress={() => {
                    if (done) {
                      router.push(`/assessment/${assessment.id}/result`);
                    } else {
                      router.push(`/assessment/${assessment.id}/intro`);
                    }
                  }}
                  activeOpacity={0.8}
                  style={styles.dimCard}
                >
                  {/* Background gradient */}
                  <LinearGradient
                    colors={
                      done
                        ? [`${assessment.accentColor}12`, `${assessment.accentColor}04`]
                        : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.015)']
                    }
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={[styles.dimCardBorder, { borderColor: done ? `${assessment.accentColor}40` : Colors.surfaceBorder }]} />

                  {/* Dimension number */}
                  <View style={styles.dimCardHeader}>
                    <View style={[styles.dimNumber, { backgroundColor: `${assessment.accentColor}18` }]}>
                      <Text style={[styles.dimNumberText, { color: assessment.accentColor }]}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>

                    <View style={[styles.dimIcon, { backgroundColor: `${assessment.accentColor}18` }]}>
                      <Ionicons name={assessment.iconName as any} size={16} color={assessment.accentColor} />
                    </View>

                    {done ? (
                      <View style={[styles.statusBadge, { backgroundColor: `${Colors.success}18` }]}>
                        <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                        <Text style={[styles.statusText, { color: Colors.success }]}>Complete</Text>
                      </View>
                    ) : inProgress ? (
                      <View style={[styles.statusBadge, { backgroundColor: `${assessment.accentColor}18` }]}>
                        <View style={[styles.statusDot, { backgroundColor: assessment.accentColor }]} />
                        <Text style={[styles.statusText, { color: assessment.accentColor }]}>In progress</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Content */}
                  <View style={styles.dimCardContent}>
                    <Text style={styles.dimCardTitle}>{assessment.title}</Text>
                    <Text style={styles.dimCardWhat}>{meta?.what ?? assessment.subtitle}</Text>

                    <View style={styles.dimCardDivider} />

                    <Text style={styles.dimCardReveals} numberOfLines={2}>
                      {meta?.reveals ?? assessment.description}
                    </Text>
                  </View>

                  {/* Footer */}
                  <View style={styles.dimCardFooter}>
                    <View style={styles.dimCardMeta}>
                      <Ionicons name="flask-outline" size={11} color={Colors.textTertiary} />
                      <Text style={styles.dimCardFramework}>{assessment.frameworkLabel}</Text>
                    </View>
                    <View style={styles.dimCardTime}>
                      <Ionicons name="time-outline" size={11} color={Colors.textTertiary} />
                      <Text style={styles.dimCardTimeText}>{assessment.estimatedMinutes} min · {assessment.questionCount} questions</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        if (done) {
                          router.push(`/assessment/${assessment.id}/result`);
                        } else {
                          router.push(`/assessment/${assessment.id}/intro`);
                        }
                      }}
                      activeOpacity={0.8}
                      style={[styles.dimCTA, { borderColor: `${assessment.accentColor}50` }]}
                    >
                      <Text style={[styles.dimCTAText, { color: assessment.accentColor }]}>
                        {done ? 'View result' : inProgress ? 'Continue' : 'Start assessment'}
                      </Text>
                      <Ionicons name="arrow-forward" size={13} color={assessment.accentColor} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Methodology note */}
          <View style={styles.methodologyBox}>
            <TouchableOpacity
              onPress={() => router.push('/methodology' as any)}
              style={styles.methodologyRow}
            >
              <View style={styles.methodologyIcon}>
                <Ionicons name="flask-outline" size={14} color={Colors.gold} />
              </View>
              <View style={styles.methodologyText}>
                <Text style={styles.methodologyTitle}>Evidence-based frameworks</Text>
                <Text style={styles.methodologyBody}>
                  Built on Big Five, Attachment Theory, and NVC research. Designed for self-reflection — not clinical diagnosis.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
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
  scrollContent: { padding: 20, paddingBottom: 104, gap: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingTop: 8,
  },
  headerLeft: {
    flex: 1,
    gap: 10,
  },
  headerOverline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 3,
    color: Colors.innerType,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: FontSize['2xl'] * 1.15,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },
  headerOrb: {
    marginTop: 24,
    flexShrink: 0,
  },

  // Clarity banner
  clarityBanner: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    position: 'relative',
  },
  clarityBannerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${Colors.innerType}35`,
  },
  clarityBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clarityBannerPercent: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.innerType,
    letterSpacing: -0.5,
  },
  clarityBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },

  cardList: { gap: 12 },

  // Dimension card
  dimCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    padding: 18,
    gap: 14,
  },
  dimCardBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderWidth: 1,
  },
  dimCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dimNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimNumberText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  dimIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'auto',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 0.2,
  },
  dimCardContent: {
    gap: 8,
  },
  dimCardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  dimCardWhat: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },
  dimCardDivider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  dimCardReveals: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },
  dimCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dimCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  dimCardFramework: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  dimCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dimCardTimeText: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  dimCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  dimCTAText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  // Methodology
  methodologyBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  methodologyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  methodologyIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  methodologyText: {
    flex: 1,
    gap: 3,
  },
  methodologyTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  methodologyBody: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: FontSize.xs * 1.6,
  },
});
