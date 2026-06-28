import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DiscoveredPattern } from '../../logic/patternUnlocks';
import { ProfileOrb } from '../ui/ProfileOrb';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';

interface PatternUnlockScreenProps {
  pattern: DiscoveredPattern | null;
  profileClarity: number;
  prevProfileClarity: number;
  sectionNumber: number;
  sectionTitle: string;
  totalSections: number;
  nextSectionTitle?: string;
  accentColor: string;
  onContinue: () => void;
}

// Map section progress to 0–65% so the orb stays in emerging→forming range
// during section breaks. The jump to 100% (revealed) is reserved for the
// climax AssessmentRevealScreen at the very end.
function localOrbClarity(sectionNumber: number, totalSections: number): number {
  return Math.round((sectionNumber / totalSections) * 65);
}

export function PatternUnlockScreen({
  pattern,
  profileClarity,
  prevProfileClarity,
  sectionNumber,
  sectionTitle,
  totalSections,
  nextSectionTitle,
  accentColor,
  onContinue,
}: PatternUnlockScreenProps) {
  const slideAnim = useRef(new Animated.Value(32)).current;
  const orbFadeAnim = useRef(new Animated.Value(0)).current;
  const orbScaleAnim = useRef(new Animated.Value(0.85)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  const clarityIncrease = profileClarity - prevProfileClarity;

  useEffect(() => {
    Animated.sequence([
      // 1: Orb swells in immediately
      Animated.parallel([
        Animated.timing(orbFadeAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(orbScaleAnim, { toValue: 1, tension: 65, friction: 10, useNativeDriver: true }),
      ]),
      // 2: Content slides up
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(contentFadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Atmospheric background — subtle top-of-screen wash */}
      <LinearGradient
        colors={[`${accentColor}14`, 'transparent', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.55 }}
      />

      {/* Orb — uses LOCAL assessment progress (not global profile %) so it
          visibly grows section by section within this assessment */}
      <Animated.View
        style={[
          styles.orbWrap,
          { opacity: orbFadeAnim, transform: [{ scale: orbScaleAnim }] },
        ]}
        pointerEvents="none"
      >
        <ProfileOrb
          clarity={localOrbClarity(sectionNumber, totalSections)}
          color={accentColor}
          size={180}
        />
      </Animated.View>

      {/* Content — slides up after orb */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentFadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Badge */}
        <View style={styles.badge}>
          <View
            style={[
              styles.badgeInner,
              {
                backgroundColor: `${accentColor}18`,
                borderColor: `${accentColor}40`,
                ...Platform.select({
                  ios: {
                    shadowColor: accentColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 14,
                  },
                }),
              },
            ]}
          >
            <Ionicons name="star-outline" size={18} color={accentColor} />
          </View>
          <Text style={[styles.badgeText, { color: accentColor }]}>PATTERN DISCOVERED</Text>
        </View>

        {/* Pattern */}
        <View style={styles.patternGroup}>
          {pattern ? (
            <>
              <Text style={styles.patternName}>{pattern.name}</Text>
              <Text style={styles.patternDesc}>{pattern.description}</Text>
            </>
          ) : (
            <>
              <Text style={styles.patternName}>Section complete</Text>
              <Text style={styles.patternDesc}>
                Your answers for "{sectionTitle}" have been recorded.
              </Text>
            </>
          )}
        </View>

        {/* Assessment section progress — the main progress indicator */}
        <View style={styles.sectionProgressBlock}>
          <Text style={styles.sectionProgressLabel}>
            Section {sectionNumber} of {totalSections} complete
          </Text>
          {/* Segmented dots — one per section, clearly about THIS assessment */}
          <View style={styles.sectionDots}>
            {Array.from({ length: totalSections }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.sectionDot,
                  i < sectionNumber
                    ? { backgroundColor: accentColor }
                    : { backgroundColor: Colors.surfaceBorder },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Profile clarity — secondary stat, clearly labelled as overall profile */}
        {(profileClarity > 0 || clarityIncrease > 0) && (
          <View style={[styles.clarityPill, { borderColor: `${accentColor}30`, backgroundColor: `${accentColor}0C` }]}>
            <Ionicons name="stats-chart-outline" size={12} color={accentColor} style={{ opacity: 0.8 }} />
            <Text style={[styles.clarityPillText, { color: accentColor }]}>
              Overall profile clarity:{' '}
              <Text style={styles.clarityPillNum}>{profileClarity}%</Text>
              {clarityIncrease > 0 && (
                <Text style={styles.clarityPillDelta}> (+{clarityIncrease}%)</Text>
              )}
            </Text>
          </View>
        )}

        {/* CTA — embeds the next section title so "Up next" is the button itself */}
        <TouchableOpacity
          onPress={onContinue}
          activeOpacity={0.85}
          style={styles.ctaWrapper}
        >
          <View
            style={[
              styles.cta,
              Platform.select({
                ios: {
                  shadowColor: accentColor,
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
            <Text style={styles.ctaText}>
              {nextSectionTitle ? `Next: ${nextSectionTitle}` : 'See your result'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 24,
    overflow: 'hidden',
  },

  // Orb — sits above the content scroll
  orbWrap: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    width: '100%',
    alignItems: 'center',
    gap: 22,
  },

  // Badge
  badge: {
    alignItems: 'center',
    gap: 10,
  },
  badgeInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  // Pattern
  patternGroup: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  patternName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: FontSize['2xl'] * 1.15,
  },
  patternDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
    paddingHorizontal: 4,
  },

  // Section progress block
  sectionProgressBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  sectionProgressLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionDots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sectionDot: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },

  // Profile clarity pill — secondary / clearly labelled
  clarityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  clarityPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  clarityPillNum: {
    fontWeight: FontWeight.bold,
  },
  clarityPillDelta: {
    fontWeight: FontWeight.semiBold,
    opacity: 0.8,
  },

  // CTA
  ctaWrapper: { width: '100%' },
  cta: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
});
