import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ASSESSMENTS, getAssessment } from '../../../src/data/assessments';
import { getAssessmentResult, loadProfile } from '../../../src/storage/profileStorage';
import { AssessmentResult, PersonalityScores, AttachmentScores, CommunicationScores, TypeScores } from '../../../src/types/assessment';
import { UserProfile } from '../../../src/types/profile';
import { calculateProfileClarity } from '../../../src/logic/profileClarity';
import {
  PERSONALITY_ARCHETYPES,
  RELATIONSHIP_TYPES,
  COMMUNICATION_TYPES,
  TYPE_ARCHETYPES,
  TRAIT_HIGH,
  TRAIT_LOW,
  TypeArchetype,
  PersonalityArchetype,
  RelationshipType,
  CommunicationStyleType,
} from '../../../src/data/resultTypes';
import { TraitBar } from '../../../src/components/ui/TraitBar';
import { ConfidenceBadge } from '../../../src/components/ui/ConfidenceBadge';
import { ProfileOrb } from '../../../src/components/ui/ProfileOrb';
import { Colors } from '../../../src/theme/colors';
import { FontFamily, FontSize, FontWeight } from '../../../src/theme/typography';

const PERSONALITY_DIMENSION_LABELS: Record<string, string> = {
  O: 'Curiosity & Openness',
  C: 'Structure & Direction',
  E: 'Energy & Social Drive',
  A: 'Warmth & Cooperation',
  N: 'Emotional Sensitivity',
};

// Spectrum pole labels shown beneath personality trait bars
const PERSONALITY_SPECTRUM: Record<string, [string, string]> = {
  O: ['Concrete', 'Imaginative'],
  C: ['Flexible', 'Structured'],
  E: ['Reserved', 'Outgoing'],
  A: ['Analytical', 'Compassionate'],
  N: ['Steady', 'Sensitive'],
};

const ATTACHMENT_LABELS: Record<string, string> = {
  Secure: 'Open & Grounded',
  Anxious: 'Deeply Invested',
  Avoidant: 'Private Stabilizer',
  FearfulAvoidant: 'Cautiously Complex',
};

const COMMUNICATION_LABELS: Record<string, string> = {
  DirectHarmonizer: 'Direct Harmonizer',
  ReflectiveProcessor: 'Reflective Processor',
  CalmStrategist: 'Calm Strategist',
  ExpressiveConnector: 'Expressive Connector',
  IndependentProtector: 'Independent Protector',
};

const TYPE_AXIS_LABELS: Record<string, string> = {
  EI: 'Energy & Focus',
  SN: 'Perception & Possibility',
  TF: 'Decisions & Values',
  JP: 'Structure & Flow',
};

const TYPE_SPECTRUM: Record<string, [string, string]> = {
  EI: ['Introversion', 'Extraversion'],
  SN: ['Sensing', 'Intuition'],
  TF: ['Thinking', 'Feeling'],
  JP: ['Judging', 'Perceiving'],
};

function getArchetypeData(assessmentId: string, archetypeKey: string) {
  if (assessmentId === 'type') {
    return TYPE_ARCHETYPES.find((a) => a.key === archetypeKey);
  }
  if (assessmentId === 'personality') {
    return PERSONALITY_ARCHETYPES.find((a) => a.key === archetypeKey);
  }
  if (assessmentId === 'relationship') {
    return RELATIONSHIP_TYPES.find((a) => a.key === archetypeKey);
  }
  if (assessmentId === 'communication') {
    return COMMUNICATION_TYPES.find((a) => a.key === archetypeKey);
  }
  return null;
}

const GOAL_TO_ID: Record<string, string> = {
  understand_myself: 'type',
  improve_relationships: 'relationship',
  communicate_better: 'communication',
  work_style: 'type',
};

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const assessment = getAssessment(id);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [profileClarity, setProfileClarity] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [shareCardVisible, setShareCardVisible] = useState(false);

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getAssessmentResult(id as any),
      loadProfile(),
    ]).then(([r, p]) => {
      setResult(r);
      setProfile(p);
      setIsPremium(p?.isPremium ?? false);
      setProfileClarity(calculateProfileClarity(p));
      Animated.parallel([
        Animated.timing(heroFade, { toValue: 1, duration: 450, delay: 80, useNativeDriver: true }),
        Animated.spring(heroSlide, { toValue: 0, tension: 80, friction: 14, delay: 80, useNativeDriver: true }),
      ]).start();
    }).catch((e) => console.error('[ResultScreen] loadProfile failed:', e));
  }, [id]);

  if (!assessment || !result) return null;

  const { accentColor } = assessment;
  const archetypeData = getArchetypeData(id, result.archetype);

  // Determine the best next incomplete assessment (goal-aware)
  const goalId = profile?.primaryGoal ? GOAL_TO_ID[profile.primaryGoal] : null;
  const incompleteAssessments = ASSESSMENTS.filter((a) => a.id !== id && !profile?.assessmentResults[a.id]);
  const nextAssessment =
    goalId && incompleteAssessments.find((a) => a.id === goalId)
      ? incompleteAssessments.find((a) => a.id === goalId)!
      : incompleteAssessments[0] ?? null;

  async function handleShare() {
    try {
      await Share.share({
        message: `My ${assessment!.title} result: ${result!.archetypeLabel} — via InnerType`,
      });
    } catch {}
  }

  function renderScoreBars() {
    if (id === 'type') {
      const scores = result!.scores as TypeScores;
      return (
        <>
          <View style={styles.typeCodeRow}>
            <Text style={styles.typeCodeLabel}>{result!.primaryType}-style pattern</Text>
          </View>
          {(['EI', 'SN', 'TF', 'JP'] as const).map((axis) => (
            <TraitBar
              key={axis}
              label={TYPE_AXIS_LABELS[axis]}
              value={scores[axis]}
              color={accentColor}
              lowLabel={TYPE_SPECTRUM[axis][0]}
              highLabel={TYPE_SPECTRUM[axis][1]}
            />
          ))}
        </>
      );
    }
    if (id === 'personality') {
      const scores = result!.scores as PersonalityScores;
      return Object.entries(scores).map(([dim, val]) => (
        <TraitBar
          key={dim}
          label={PERSONALITY_DIMENSION_LABELS[dim] ?? dim}
          value={val}
          color={accentColor}
          lowLabel={PERSONALITY_SPECTRUM[dim]?.[0]}
          highLabel={PERSONALITY_SPECTRUM[dim]?.[1]}
        />
      ));
    }
    if (id === 'relationship') {
      const scores = result!.scores as AttachmentScores;
      return Object.entries(scores).map(([type, val]) => (
        <TraitBar
          key={type}
          label={ATTACHMENT_LABELS[type] ?? type}
          value={val}
          color={accentColor}
        />
      ));
    }
    if (id === 'communication') {
      const scores = result!.scores as CommunicationScores;
      return Object.entries(scores).map(([type, val]) => (
        <TraitBar
          key={type}
          label={COMMUNICATION_LABELS[type] ?? type}
          value={val}
          color={accentColor}
        />
      ));
    }
    return null;
  }

  const chips = archetypeData?.chips ?? [];
  const patterns = archetypeData?.patterns ?? [];
  const blindSpot = archetypeData?.blindSpot ?? result.blindSpot;
  const description = result.summary;

  function renderUnlockedSections() {
    if (!archetypeData || !result) return null;

    // ── Deep report: Personality Type ──────────────────────────────
    if (id === 'type') {
      const typeData = archetypeData as unknown as TypeArchetype;
      return (
        <>
          <View style={styles.deepReportDivider}>
            <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
            <View style={styles.deepReportLine} />
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="star-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
            </View>
            <View style={styles.deepCard}>
              {typeData.strengths.map((s, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                  <Text style={styles.deepText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="briefcase-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WORK STYLE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{typeData.workStyle}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="heart-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>HOW YOU CONNECT</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{typeData.relationshipStyle}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="trending-up-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{typeData.growthEdge}</Text>
            </View>
          </View>

          {/* Share card */}
          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="share-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>SHARE CARD PREVIEW</Text>
            </View>
            <View style={[styles.shareCardWrap, { borderColor: `${accentColor}30` }]}>
              <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
              <View pointerEvents="none" style={{ position: 'absolute', top: -60, right: -60, opacity: 0.35 }}>
                <ProfileOrb clarity={100} color={accentColor} size={220} />
              </View>
              <Text style={[styles.shareCardWordmark, { color: accentColor }]}>INNERTYPE</Text>
              <Text style={[styles.shareCardCode, { color: accentColor }]}>{result.primaryType ?? ''}</Text>
              <Text style={styles.shareCardLabel}>{result.archetypeLabel}</Text>
              <View style={styles.shareCardChips}>
                {typeData.chips.map((c, i) => (
                  <View key={i} style={[styles.shareCardChip, { borderColor: `${accentColor}30` }]}>
                    <Text style={[styles.shareCardChipText, { color: accentColor }]}>{c}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.shareCardFooter}>
                <Text style={styles.shareCardClarity}>Profile clarity · {profileClarity}%</Text>
                <Text style={styles.shareCardFooterText}>InnerType Personality Test</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShareCardVisible(true)}
              style={[styles.shareCardPreviewBtn, { borderColor: `${accentColor}30` }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.shareCardPreviewBtnText, { color: accentColor }]}>Preview share card</Text>
            </TouchableOpacity>
            <Text style={styles.shareCardComingSoon}>Share card — coming soon</Text>
          </View>

          <Modal
            visible={shareCardVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setShareCardVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShareCardVisible(false)}
            >
              <View style={[styles.shareCardModal, { borderColor: `${accentColor}30` }]}>
                <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
                <View pointerEvents="none" style={{ position: 'absolute', top: -80, right: -80, opacity: 0.35 }}>
                  <ProfileOrb clarity={100} color={accentColor} size={320} />
                </View>
                <Text style={[styles.shareCardWordmark, { color: accentColor, fontSize: 13 }]}>INNERTYPE</Text>
                <Text style={[styles.shareCardCode, { color: accentColor, fontSize: 80, lineHeight: 80 }]}>{result.primaryType ?? ''}</Text>
                <Text style={[styles.shareCardLabel, { fontSize: FontSize.xl }]}>{result.archetypeLabel}</Text>
                <View style={styles.shareCardChips}>
                  {typeData.chips.map((c, i) => (
                    <View key={i} style={[styles.shareCardChip, { borderColor: `${accentColor}30` }]}>
                      <Text style={[styles.shareCardChipText, { color: accentColor }]}>{c}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.shareCardFooter}>
                  <Text style={styles.shareCardClarity}>Profile clarity · {profileClarity}%</Text>
                  <Text style={styles.shareCardFooterText}>InnerType Personality Test</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      );
    }

    // ── Deep report: Personality Traits ────────────────────────────
    if (id === 'personality') {
      const personalityData = archetypeData as unknown as PersonalityArchetype;
      const scores = result.scores as PersonalityScores;
      const allDims = ['O', 'C', 'E', 'A', 'N'] as const;
      type Dim = typeof allDims[number];
      const sortedDims = ([...allDims] as Dim[]).sort((a, b) => scores[b] - scores[a]);
      const highest = sortedDims.slice(0, 2);
      const lowest = sortedDims.slice(-2).reverse();

      return (
        <>
          <View style={styles.deepReportDivider}>
            <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
            <View style={styles.deepReportLine} />
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="arrow-up-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>HIGHEST TRAITS</Text>
            </View>
            <View style={styles.deepCard}>
              {highest.map((dim) => (
                <View key={dim} style={styles.traitInterpBlock}>
                  <Text style={[styles.traitInterpDim, { color: accentColor }]}>
                    {PERSONALITY_DIMENSION_LABELS[dim]}
                  </Text>
                  {TRAIT_HIGH[dim] ? (
                    <Text style={styles.deepText}>{TRAIT_HIGH[dim]}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="arrow-down-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>LOWEST TRAITS</Text>
            </View>
            <View style={styles.deepCard}>
              {lowest.map((dim) => (
                <View key={dim} style={styles.traitInterpBlock}>
                  <Text style={[styles.traitInterpDim, { color: accentColor }]}>
                    {PERSONALITY_DIMENSION_LABELS[dim]}
                  </Text>
                  {TRAIT_LOW[dim] ? (
                    <Text style={styles.deepText}>{TRAIT_LOW[dim]}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="star-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
            </View>
            <View style={styles.deepCard}>
              {personalityData.strengths.map((s, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                  <Text style={styles.deepText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="flash-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRESS PATTERN</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{personalityData.stressPattern}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="briefcase-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WORK STYLE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{personalityData.workStyle}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="trending-up-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{personalityData.growthGuidance}</Text>
            </View>
          </View>
        </>
      );
    }

    // ── Deep report: Relationship Pattern ──────────────────────────
    if (id === 'relationship') {
      const relData = archetypeData as unknown as RelationshipType;
      return (
        <>
          <View style={styles.deepReportDivider}>
            <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
            <View style={styles.deepReportLine} />
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>HOW TRUST BUILDS</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{relData.connectionStyle}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="flash-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WHAT CREATES DISTANCE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{relData.stressResponse}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="star-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
            </View>
            <View style={styles.deepCard}>
              {relData.strengths.map((s, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                  <Text style={styles.deepText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WHAT YOU MAY NOT SAY</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{relData.gentleNote}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="heart-circle-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>CLOSENESS NEEDS</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{relData.closenessNeeds}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="trending-up-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{relData.growthGuidance}</Text>
            </View>
          </View>
        </>
      );
    }

    // ── Deep report: Communication Style ───────────────────────────
    if (id === 'communication') {
      const commData = archetypeData as unknown as CommunicationStyleType;
      return (
        <>
          <View style={styles.deepReportDivider}>
            <Text style={[styles.deepReportLabel, { color: accentColor }]}>DEEP REPORT</Text>
            <View style={styles.deepReportLine} />
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="warning-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>CONFLICT STYLE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{commData.conflictPattern}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="briefcase-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>WORK & TEAM STYLE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{commData.bestEnvironment}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="star-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>STRENGTHS</Text>
            </View>
            <View style={styles.deepCard}>
              {commData.strengths.map((s, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bullet, { backgroundColor: accentColor }]} />
                  <Text style={styles.deepText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="shield-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>BOUNDARY STYLE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{commData.boundaryStyle}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="refresh-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>REPAIR STYLE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{commData.repairStyle}</Text>
            </View>
          </View>

          <View style={styles.deepSection}>
            <View style={styles.deepSectionHeader}>
              <Ionicons name="trending-up-outline" size={14} color={accentColor} />
              <Text style={[styles.deepSectionTitle, { color: accentColor }]}>GROWTH GUIDANCE</Text>
            </View>
            <View style={styles.deepCard}>
              <Text style={styles.deepText}>{commData.growthGuidance}</Text>
            </View>
          </View>
        </>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBackground} style={StyleSheet.absoluteFill} />
      {/* Subtle ambient — smaller, less intrusive than AuraBackground */}
      <View pointerEvents="none" style={{ position: 'absolute', top: -120, right: -120, opacity: 0.6 }}>
        <ProfileOrb clarity={100} color={accentColor} size={340} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.navBtn}>
            <Ionicons name="home-outline" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Your Result</Text>
          <TouchableOpacity onPress={handleShare} style={styles.navBtn}>
            <Ionicons name="share-outline" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Reveal moment banner ── */}
          <Animated.View
            style={[
              styles.revealBanner,
              { opacity: heroFade, transform: [{ translateY: heroSlide }] },
            ]}
          >
            <View style={[styles.revealIconWrap, { backgroundColor: `${accentColor}18` }]}>
              <Ionicons name="star-outline" size={14} color={accentColor} />
            </View>
            <View style={styles.revealText}>
              <Text style={[styles.revealTitle, { color: accentColor }]}>Pattern revealed</Text>
              <Text style={styles.revealSub}>
                Profile clarity{' '}
                <Text style={styles.revealClarityNum}>{profileClarity}%</Text>
              </Text>
            </View>
          </Animated.View>

          {/* ── Hero ── */}
          <Animated.View
            style={[
              styles.heroCard,
              { opacity: heroFade, transform: [{ translateY: heroSlide }] },
            ]}
          >
            <LinearGradient
              colors={[`${accentColor}1A`, `${accentColor}05`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.heroCardBorder, { borderColor: `${accentColor}38` }]} />

            <View style={styles.heroContent}>
              {/* Badge */}
              <View style={[styles.assessmentBadge, { backgroundColor: `${accentColor}18` }]}>
                <Ionicons name={assessment.iconName as any} size={12} color={accentColor} />
                <Text style={[styles.badgeText, { color: accentColor }]}>
                  {assessment.title.toUpperCase()}
                </Text>
              </View>

              {/* Personality type: show 4-letter code prominently */}
              {id === 'type' && result.primaryType && (
                <View style={styles.typeHeroBlock}>
                  <Text style={[styles.typeHeroCode, { color: accentColor }]}>
                    {result.primaryType}
                  </Text>
                  <View style={[styles.typeHeroPill, { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10` }]}>
                    <Text style={[styles.typeHeroPillText, { color: accentColor }]}>
                      {result.primaryType}-style pattern
                    </Text>
                  </View>
                </View>
              )}

              {/* Title */}
              <Text style={styles.heroName}>{result.archetypeLabel}</Text>
              <Text style={styles.heroTagline}>{result.archetypeTagline}</Text>

              {/* Chips */}
              {chips.length > 0 && (
                <View style={styles.chipsRow}>
                  {chips.map((chip, i) => (
                    <View key={i} style={[styles.chip, { borderColor: `${accentColor}30` }]}>
                      <Text style={[styles.chipText, { color: accentColor }]}>{chip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Confidence */}
              <ConfidenceBadge level={result.confidence} />

              {/* Description */}
              <Text style={styles.heroDescription}>
                {description}
              </Text>
            </View>
          </Animated.View>

          {/* ── Pattern cards ── */}
          {patterns.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>HOW THIS SHOWS UP</Text>
              <View style={styles.patternsList}>
                {patterns.map((pattern, i) => (
                  <View key={i} style={styles.patternCard}>
                    <View style={[styles.patternIconWrap, { backgroundColor: `${accentColor}14` }]}>
                      <Ionicons name={pattern.icon as any} size={18} color={accentColor} />
                    </View>
                    <View style={styles.patternBody}>
                      <Text style={styles.patternTitle}>{pattern.title}</Text>
                      <Text style={styles.patternText}>{pattern.body}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Score breakdown ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>YOUR SCORES</Text>
            <View style={styles.barsCard}>
              {renderScoreBars()}
            </View>
          </View>

          {/* ── Growth edge ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GROWTH EDGE</Text>
            <View style={styles.growthCard}>
              <Ionicons name="leaf-outline" size={16} color={Colors.success} style={{ marginBottom: 4 }} />
              <Text style={styles.growthText}>{blindSpot}</Text>
            </View>
          </View>

          {/* ── Contextual premium card (locked) ── */}
          {!isPremium && (
            <View style={styles.premiumCard}>
              <LinearGradient
                colors={[`${accentColor}12`, `${accentColor}04`]}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.premiumBorder, { borderColor: `${accentColor}30` }]} />
              <View style={styles.premiumContent}>
                <View style={[styles.premiumBadge, { backgroundColor: `${accentColor}18` }]}>
                  <Ionicons name="star-outline" size={11} color={accentColor} />
                  <Text style={[styles.premiumBadgeText, { color: accentColor }]}>✦ DEEP REPORT</Text>
                </View>

                <Text style={styles.premiumTitle}>
                  {id === 'type' && 'Go deeper into your Personality Type'}
                  {id === 'personality' && 'Go deeper into your trait profile'}
                  {id === 'relationship' && 'Go deeper into your relationship pattern'}
                  {id === 'communication' && 'Go deeper into your communication style'}
                </Text>

                <Text style={styles.premiumSubtitle}>
                  {id === 'type' && 'Unlock your full type report — plus all deep reports and your complete InnerType synthesis.'}
                  {id === 'personality' && 'Unlock deeper guidance for your core tendencies — plus all other reports.'}
                  {id === 'relationship' && 'Unlock deeper insight into how you connect, protect yourself, and build trust.'}
                  {id === 'communication' && 'Unlock deeper guidance for conflict, boundaries, and repair — plus all other reports.'}
                </Text>

                <View style={styles.premiumFeatures}>
                  {(id === 'type'
                    ? ['Full type interpretation', 'Work style', 'How you connect', 'Growth guidance', 'Share card preview']
                    : id === 'personality'
                    ? ['Highest & lowest traits', 'Strengths', 'Stress patterns', 'Work style', 'Growth guidance']
                    : id === 'relationship'
                    ? ['How trust builds', 'What creates distance', 'Closeness needs', 'Strengths', 'Growth guidance']
                    : ['Conflict style', 'Boundary style', 'Repair style', 'Work & team style', 'Growth guidance']
                  ).map((f) => (
                    <View key={f} style={styles.featureRow}>
                      <Ionicons name="checkmark" size={12} color={accentColor} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.premiumNudge}>
                  Also unlocks all other deep reports + full InnerType report
                </Text>

                <TouchableOpacity
                  onPress={() => router.push('/paywall')}
                  style={styles.unlockBtn}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={Colors.gradientGold}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                  />
                  <Text style={styles.unlockBtnText}>Unlock InnerType Premium · €4.99</Text>
                </TouchableOpacity>

                <Text style={styles.premiumMeta}>One-time unlock · No subscription.</Text>
              </View>
            </View>
          )}

          {/* ── Unlocked deep report sections ── */}
          {isPremium && renderUnlockedSections()}

          {/* ── Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => router.push(`/assessment/${id}/intro`)}
              style={styles.retakeBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                nextAssessment
                  ? router.push(`/assessment/${nextAssessment.id}/intro`)
                  : router.push('/(tabs)')
              }
              style={styles.nextBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>
                {nextAssessment ? nextAssessment.title : 'View profile'}
              </Text>
              <Ionicons name="arrow-forward" size={15} color={Colors.gold} />
            </TouchableOpacity>
          </View>

          <Text style={styles.methodNote}>
            Results reflect your self-perception at the time of completion. Patterns can shift — retaking in future months reveals how you grow.
          </Text>
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
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
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
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48, gap: 24 },

  // ── Reveal banner ──
  revealBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
  },
  revealIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  revealText: { flex: 1, gap: 2 },
  revealTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },
  revealSub: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  revealClarityNum: {
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },

  // ── Hero ──
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCardBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  heroContent: {
    padding: 24,
    gap: 12,
    zIndex: 1,
  },
  assessmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
  },
  heroName: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: FontSize['3xl'] * 1.15,
  },
  heroTagline: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginTop: -4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  heroDescription: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.65,
    marginTop: 4,
  },

  // ── Sections ──
  section: { gap: 12 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Pattern cards ──
  patternsList: { gap: 10 },
  patternCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  patternIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  patternBody: { flex: 1, gap: 5 },
  patternTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  patternText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },

  // ── Type hero (prominent 4-letter code) ──
  typeHeroBlock: {
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  typeHeroCode: {
    fontSize: 56,
    fontWeight: FontWeight.bold,
    letterSpacing: -1.5,
    lineHeight: 56,
  },
  typeHeroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeHeroPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 0.5,
  },

  // ── Type code (in score bars section) ──
  typeCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeCodeLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },

  // ── Bars ──
  barsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 4,
  },

  // ── Growth edge ──
  growthCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  growthText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.65,
  },

  // ── Contextual premium card ──
  premiumCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderWidth: 1,
  },
  premiumContent: {
    padding: 20,
    gap: 14,
    zIndex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
  },
  premiumTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    lineHeight: FontSize.lg * 1.3,
  },
  premiumSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },
  premiumFeatures: { gap: 8 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  premiumNudge: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  unlockBtn: {
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  premiumMeta: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },

  // ── Actions ──
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  retakeBtnText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  nextBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: `${Colors.gold}35`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nextBtnText: {
    fontSize: FontSize.sm,
    color: Colors.gold,
    fontWeight: FontWeight.semiBold,
  },
  methodNote: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.65,
    paddingHorizontal: 12,
  },

  // ── Deep report sections ──
  deepReportDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deepReportLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
    flexShrink: 0,
  },
  deepReportLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  deepSection: { gap: 8 },
  deepSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deepSectionTitle: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.2,
  },
  deepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 10,
  },
  deepText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.65,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 8,
    flexShrink: 0,
  },
  traitInterpBlock: { gap: 5 },
  traitInterpDim: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },

  // ── Share card ──
  shareCardWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 24,
    gap: 10,
    position: 'relative',
    aspectRatio: 0.75,
    justifyContent: 'flex-end',
  },
  shareCardWordmark: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 3,
    position: 'absolute',
    top: 24,
    left: 24,
  },
  shareCardCode: {
    fontSize: 58,
    fontWeight: FontWeight.bold,
    letterSpacing: -2,
    lineHeight: 58,
  },
  shareCardLabel: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  shareCardChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  shareCardChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  shareCardChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  shareCardFooter: {
    gap: 3,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  shareCardClarity: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  shareCardFooterText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  shareCardPreviewBtn: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareCardPreviewBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },
  shareCardComingSoon: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  shareCardModal: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 32,
    gap: 14,
    position: 'relative',
    aspectRatio: 0.75,
    justifyContent: 'flex-end',
  },
});
