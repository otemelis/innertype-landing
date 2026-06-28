import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/theme/colors';
import { FontSize, FontWeight } from '../src/theme/typography';

const FRAMEWORKS = [
  {
    icon: 'person-outline',
    color: Colors.innerType,
    title: 'Type-Based Personality Framework',
    used_in: 'Personality Type assessment',
    description:
      'Inspired by decades of type-based personality research. Classifies cognitive style across four axes: energy, perception, decision-making, and structure.',
    note: 'Not an official MBTI assessment. Not affiliated with Myers-Briggs or the Myers & Briggs Foundation. Designed for self-reflection only.',
  },
  {
    icon: 'git-network-outline',
    color: Colors.personality,
    title: 'Big Five Personality Model',
    used_in: 'Personality Traits assessment',
    description:
      'The most replicated framework in personality psychology, built on decades of cross-cultural research. Measures five stable dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    note: 'Used in clinical, occupational, and developmental psychology worldwide.',
  },
  {
    icon: 'heart-outline',
    color: Colors.relationship,
    title: 'Attachment Theory',
    used_in: 'Relationship Pattern assessment',
    description:
      'Developed by John Bowlby and expanded by Mary Ainsworth and Phillip Shaver. Identifies how early bonding experiences shape adult patterns of closeness, trust, and emotional regulation in relationships.',
    note: 'The most evidence-based model for understanding adult relational behaviour.',
  },
  {
    icon: 'chatbubbles-outline',
    color: Colors.communication,
    title: 'Nonviolent Communication & Conflict Styles',
    used_in: 'Communication Style assessment',
    description:
      'Draws on Marshall Rosenberg\'s NVC framework and Thomas–Kilmann conflict mode research. Measures how you express needs, navigate disagreement, set limits, and repair after rupture.',
    note: 'Applied in therapy, negotiation, and leadership development contexts.',
  },
];

const PRINCIPLES = [
  {
    icon: 'eye-outline',
    title: 'Descriptive, not prescriptive',
    body: 'InnerType describes your patterns as they are, not as they should be. No result is better than another.',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Private by default',
    body: 'No data leaves your device. All results are stored locally and deleted when you reset.',
  },
  {
    icon: 'layers-outline',
    title: 'Multi-dimensional',
    body: 'A single framework cannot capture you. Four orthogonal dimensions give a richer, more accurate picture.',
  },
  {
    icon: 'trending-up-outline',
    title: 'Growth-oriented',
    body: 'Every result includes a growth edge — the pattern that awareness makes possible to shift.',
  },
];

export default function MethodologyScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Our Methodology</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="flask-outline" size={24} color={Colors.gold} />
            </View>
            <Text style={styles.heroTitle}>Evidence-based self-knowledge</Text>
            <Text style={styles.heroBody}>
              InnerType is built on four independently validated frameworks from academic psychology. We use the frameworks as tools — not as fixed labels. Your results are starting points, not destinations.
            </Text>
          </View>

          {/* Frameworks */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SCIENTIFIC FRAMEWORKS</Text>
            {FRAMEWORKS.map((fw) => (
              <View key={fw.title} style={styles.frameworkCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.frameworkCardBorder} />
                <View style={styles.frameworkHeader}>
                  <View style={[styles.frameworkIconWrap, { backgroundColor: `${fw.color}18` }]}>
                    <Ionicons name={fw.icon as any} size={18} color={fw.color} />
                  </View>
                  <View style={styles.frameworkMeta}>
                    <Text style={styles.frameworkTitle}>{fw.title}</Text>
                    <Text style={[styles.frameworkUsedIn, { color: fw.color }]}>{fw.used_in}</Text>
                  </View>
                </View>
                <Text style={styles.frameworkDescription}>{fw.description}</Text>
                <View style={styles.frameworkNoteRow}>
                  <Ionicons name="information-circle-outline" size={13} color={Colors.textTertiary} />
                  <Text style={styles.frameworkNote}>{fw.note}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Principles */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OUR PRINCIPLES</Text>
            <View style={styles.principlesCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.principlesCardBorder} />
              {PRINCIPLES.map((p, i) => (
                <View key={p.title} style={[styles.principleRow, i < PRINCIPLES.length - 1 && styles.principleRowBorder]}>
                  <View style={styles.principleIconWrap}>
                    <Ionicons name={p.icon as any} size={16} color={Colors.gold} />
                  </View>
                  <View style={styles.principleText}>
                    <Text style={styles.principleTitle}>{p.title}</Text>
                    <Text style={styles.principleBody}>{p.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Privacy note */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PRIVACY & DATA</Text>
            <View style={[styles.principlesCard, { gap: 0 }]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.principlesCardBorder} />
              {[
                { icon: 'phone-portrait-outline', text: 'Your answers and results are stored locally on your device. Nothing is sent to a server.' },
                { icon: 'calculator-outline', text: 'Results are generated from your answers using structured scoring logic. They are prompts for reflection, not fixed labels.' },
                { icon: 'medical-outline', text: 'InnerType is designed for self-reflection. It is not a diagnosis, therapy tool, or clinical assessment.' },
              ].map((item, i, arr) => (
                <View key={item.icon} style={[styles.principleRow, i < arr.length - 1 && styles.principleRowBorder]}>
                  <View style={styles.principleIconWrap}>
                    <Ionicons name={item.icon as any} size={15} color={Colors.softBlue} />
                  </View>
                  <Text style={[styles.principleBody, { flex: 1 }]}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              InnerType is for self-discovery. It is not a substitute for professional psychological assessment or mental health care.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 28 },

  hero: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroBody: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
    paddingHorizontal: 8,
  },

  section: { gap: 12 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  frameworkCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    padding: 16,
    gap: 12,
  },
  frameworkCardBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  frameworkHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  frameworkIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  frameworkMeta: { flex: 1, gap: 3 },
  frameworkTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  frameworkUsedIn: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  frameworkDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.65,
  },
  frameworkNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  frameworkNote: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: FontSize.xs * 1.5,
    flex: 1,
  },

  principlesCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  principlesCardBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  principleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
  },
  principleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  principleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  principleText: { flex: 1, gap: 4 },
  principleTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  principleBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.55,
  },

  disclaimer: {
    paddingHorizontal: 4,
  },
  disclaimerText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.6,
  },
});
