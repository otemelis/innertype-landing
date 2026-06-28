import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setPremium } from '../src/storage/profileStorage';
import { ProfileOrb } from '../src/components/ui/ProfileOrb';
import { Colors } from '../src/theme/colors';
import { FontSize, FontWeight } from '../src/theme/typography';

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

export default function Paywall() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    await setPremium(true);
    setLoading(false);
    Alert.alert(
      'Full report unlocked',
      'Your complete InnerType report is now available. In a production app, payment would be processed securely.',
      [{ text: 'View report', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.backgroundSecondary, Colors.background]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Nav */}
        <View style={styles.nav}>
          <View style={{ width: 38 }} />
          <Text style={styles.navTitle}>Full Report</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero orb + headline */}
          <View style={styles.hero}>
            <ProfileOrb clarity={100} color={Colors.innerType} size={160} />
            <Text style={styles.heroTitle}>Unlock your full{'\n'}InnerType report</Text>
            <Text style={styles.heroSubtitle}>
              Go beyond individual results — see how your type, traits, relationship pattern, and communication style form one coherent picture.
            </Text>
          </View>

          {/* What unlocks */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHAT'S INSIDE</Text>
            <View style={styles.featureCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.featureCardBorder} />
              {WHAT_UNLOCKS.map((f, i) => (
                <View
                  key={f.label}
                  style={[styles.featureRow, i < WHAT_UNLOCKS.length - 1 && styles.featureRowBorder]}
                >
                  <View style={[styles.featureIcon, { backgroundColor: `${f.color}18` }]}>
                    <Ionicons name={f.icon as any} size={15} color={f.color} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                    <Text style={styles.featureDetail}>{f.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Price + CTA */}
          <View style={styles.purchaseSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>€4.99</Text>
              <Text style={styles.priceNote}>One-time · No subscription</Text>
            </View>

            <TouchableOpacity
              onPress={handlePurchase}
              disabled={loading}
              activeOpacity={0.85}
              style={[
                styles.purchaseButton,
                loading && { opacity: 0.7 },
                Platform.select({
                  ios: {
                    shadowColor: Colors.gold,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  },
                }),
              ]}
            >
              <LinearGradient
                colors={Colors.gradientGold}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
              />
              <Text style={styles.purchaseButtonText}>
                {loading ? 'Processing...' : 'Unlock Full Report · €4.99'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.guarantee}>
              Basic results are always free. The full report unlocks the deeper synthesis.{'\n'}This is a demo — no real payment is processed.
            </Text>
          </View>

          {/* Trust row */}
          <View style={styles.trustRow}>
            {[
              { icon: 'phone-portrait-outline', label: 'Local only' },
              { icon: 'lock-closed-outline', label: 'No account' },
              { icon: 'shield-checkmark-outline', label: 'Private' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Ionicons name={t.icon as any} size={14} color={Colors.textTertiary} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore purchases</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
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
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48, gap: 32 },

  // Hero
  hero: {
    alignItems: 'center',
    gap: 18,
    paddingTop: 8,
  },
  heroTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: FontSize['2xl'] * 1.15,
  },
  heroSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
    maxWidth: 290,
  },

  // Features
  section: { gap: 12 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  featureCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  featureCardBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1, gap: 2 },
  featureLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  featureDetail: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: FontSize.xs * 1.5,
  },

  // Purchase
  purchaseSection: {
    gap: 14,
    alignItems: 'center',
  },
  priceRow: {
    alignItems: 'center',
    gap: 4,
  },
  priceValue: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  priceNote: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  purchaseButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  guarantee: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.65,
    paddingHorizontal: 16,
  },

  // Trust
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  trustItem: {
    alignItems: 'center',
    gap: 5,
  },
  trustLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  restoreText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
});
