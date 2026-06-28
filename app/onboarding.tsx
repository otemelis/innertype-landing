import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { markOnboardingComplete, saveUserName } from '../src/storage/profileStorage';
import { PrimaryGoal } from '../src/types/profile';
import { Colors } from '../src/theme/colors';
import { FontFamily, FontSize, FontWeight } from '../src/theme/typography';
import { AuraBackground } from '../src/components/ui/AuraBackground';
import { ProfileOrb } from '../src/components/ui/ProfileOrb';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const SLIDES: {
  key: string;
  overline: string;
  title: string;
  body: string;
  accent: string;
  orbClarity: number;
}[] = [
  {
    key: 'welcome',
    overline: 'INNERTYPE',
    title: 'You are more\nthan one type.',
    body: 'Most personality tools give you a label. InnerType combines type, traits, relationship patterns, and communication style into one clearer picture of who you are.',
    accent: Colors.innerType,
    orbClarity: 0,
  },
  {
    key: 'reveal',
    overline: 'WATCH IT TAKE SHAPE',
    title: 'Watch your profile\ntake shape.',
    body: 'Every assessment reveals patterns, increases profile clarity, and builds toward your InnerType. The picture becomes clearer as you go.',
    accent: Colors.lavender,
    orbClarity: 30,
  },
  {
    key: 'science',
    overline: 'EVIDENCE-BASED',
    title: 'Built on real\nframeworks.',
    body: 'Science-inspired, not diagnostic. InnerType uses established personality, relationship, and communication frameworks for self-reflection.',
    accent: Colors.softBlue,
    orbClarity: 55,
  },
];

// 'compare' removed from onboarding — it's a later-feature, not a first-session goal
const GOAL_OPTIONS: { key: PrimaryGoal; label: string; description: string; icon: string }[] = [
  {
    key: 'understand_myself',
    label: 'Know myself better',
    description: 'Understand what drives you, what drains you, and what you protect.',
    icon: 'person-circle-outline',
  },
  {
    key: 'improve_relationships',
    label: 'Improve my relationships',
    description: 'Understand how you connect, protect yourself, and build trust.',
    icon: 'heart-outline',
  },
  {
    key: 'communicate_better',
    label: 'Communicate with more ease',
    description: 'Discover your natural style and what makes conversations harder than they need to be.',
    icon: 'chatbubble-outline',
  },
  {
    key: 'work_style',
    label: 'Understand how I work',
    description: 'See how you think, decide, and collaborate — and what blocks you.',
    icon: 'briefcase-outline',
  },
];

const PROGRESSION_STEPS = [
  { clarity: 0, label: 'Unknown' },
  { clarity: 33, label: 'Forming' },
  { clarity: 66, label: 'Taking shape' },
  { clarity: 100, label: 'Revealed' },
];

const FRAMEWORKS = [
  { icon: 'person-outline', label: 'Type-based framework', color: Colors.innerType },
  { icon: 'layers-outline', label: 'Big Five traits', color: Colors.softBlue },
  { icon: 'heart-outline', label: 'Attachment patterns', color: Colors.lavender },
  { icon: 'chatbubbles-outline', label: 'Communication style', color: Colors.gold },
];

type Step = 'slides' | 'name' | 'goal';

// Fade + slide-up animation — used to animate each new slide in on mount
function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, tension: 90, friction: 13, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, translateY };
}

// ── Slide extra visual content ─────────────────────────────────────────────────

function DimensionRow() {
  return (
    <View style={extras.dimRow}>
      {['Type', 'Traits', 'Relationships', 'Communication'].map((d, i) => (
        <React.Fragment key={d}>
          {i > 0 && <Text style={extras.dimSep}>·</Text>}
          <Text style={extras.dimLabel}>{d}</Text>
        </React.Fragment>
      ))}
    </View>
  );
}

function RevealExtra() {
  return (
    <View style={extras.revealWrap}>
      {/* Four orb states showing clarity progression */}
      <View style={extras.progressionRow}>
        {PROGRESSION_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <Ionicons
                name="chevron-forward"
                size={11}
                color={Colors.textTertiary}
                style={extras.progressArrow}
              />
            )}
            <View style={extras.progressionStep}>
              <ProfileOrb clarity={step.clarity} color={Colors.lavender} size={44} />
              <Text style={extras.progressionLabel}>{step.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Sample pattern card — shows what a real insight looks like */}
      <View style={extras.patternCard}>
        <View style={extras.patternCardHeader}>
          <View style={extras.patternDot} />
          <Text style={extras.patternOverline}>PATTERN DISCOVERED</Text>
        </View>
        <Text style={extras.patternTitle}>Contextual Expression</Text>
        <Text style={extras.patternBody} numberOfLines={2}>
          "You adjust how directly you communicate depending on who you are with and what is at stake."
        </Text>
      </View>
    </View>
  );
}

function FrameworkExtra() {
  return (
    <View style={extras.frameworkList}>
      {FRAMEWORKS.map((f) => (
        <View key={f.label} style={[extras.frameworkChip, { borderColor: `${f.color}30` }]}>
          <View style={[extras.frameworkIcon, { backgroundColor: `${f.color}14` }]}>
            <Ionicons name={f.icon as any} size={14} color={f.color} />
          </View>
          <Text style={extras.frameworkLabel}>{f.label}</Text>
        </View>
      ))}
      <Text style={extras.frameworkDisclaimer}>
        Designed for self-reflection — not clinical diagnosis.
      </Text>
    </View>
  );
}

// ── Slide renderer — re-mounts on every index change, triggering fresh animation
function SlideContent({ slide }: { slide: (typeof SLIDES)[0] }) {
  const { opacity, translateY } = useFadeIn(0);

  return (
    <Animated.View style={[{ flex: 1 }, { opacity, transform: [{ translateY }] }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.slideContent}
        bounces={false}
      >
        <Text style={[styles.overline, { color: slide.accent }]}>{slide.overline}</Text>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideBody}>{slide.body}</Text>

        {slide.key === 'welcome' && <DimensionRow />}
        {slide.key === 'reveal' && <RevealExtra />}
        {slide.key === 'science' && <FrameworkExtra />}
      </ScrollView>
    </Animated.View>
  );
}

// ── Name screen ───────────────────────────────────────────────────────────────

function NameStep({
  userName,
  setUserName,
  onContinue,
}: {
  userName: string;
  setUserName: (v: string) => void;
  onContinue: () => void;
}) {
  const nameInputRef = useRef<TextInput>(null);
  const { opacity, translateY } = useFadeIn(80);

  useEffect(() => {
    const t = setTimeout(() => nameInputRef.current?.focus(), 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Animated.View style={[styles.nameScreen, { opacity, transform: [{ translateY }] }]}>
        <View style={styles.nameOrbWrap}>
          <ProfileOrb clarity={0} color={Colors.innerType} size={130} />
        </View>

        <View style={styles.nameContent}>
          <Text style={styles.nameOverline}>PERSONAL</Text>
          <Text style={styles.nameTitle}>What should{'\n'}we call you?</Text>
          <Text style={styles.nameSubtitle}>
            We'll use this only to make your insights feel more personal.
            You can skip it or change it later.
          </Text>

          <View style={styles.nameInputWrap}>
            <TextInput
              ref={nameInputRef}
              value={userName}
              onChangeText={setUserName}
              placeholder="First name or nickname"
              placeholderTextColor={Colors.textTertiary}
              style={styles.nameInput}
              maxLength={32}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={onContinue}
            />
          </View>

          <TouchableOpacity onPress={onContinue} activeOpacity={0.85} style={styles.nameButton}>
            <LinearGradient
              colors={Colors.gradientGold}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
            />
            <Text style={styles.nameButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
          </TouchableOpacity>

          {/* Shown when name is empty — unambiguous alternative */}
          {!userName.trim() && (
            <TouchableOpacity onPress={onContinue} activeOpacity={0.7} style={styles.skipLink}>
              <Text style={styles.skipLinkText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

// ── Goal screen ───────────────────────────────────────────────────────────────

function GoalStep({
  userName,
  selectedGoal,
  setSelectedGoal,
  onStart,
  loading,
}: {
  userName: string;
  selectedGoal: PrimaryGoal | null;
  setSelectedGoal: (g: PrimaryGoal) => void;
  onStart: () => void;
  loading: boolean;
}) {
  const { opacity, translateY } = useFadeIn(60);

  return (
    <Animated.View style={[styles.goalScreen, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalOverline}>PERSONALIZE</Text>
        <Text style={styles.goalTitle}>
          {userName ? `${userName}, what\nmatters to you?` : 'What matters most\nto you right now?'}
        </Text>
        <Text style={styles.goalSubtitle}>
          Your answer helps us surface the most relevant insights. You can change this later.
        </Text>
      </View>

      <ScrollView
        style={styles.goalListScroll}
        contentContainerStyle={styles.goalListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {GOAL_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSelectedGoal(opt.key)}
            activeOpacity={0.8}
            style={[styles.goalOption, selectedGoal === opt.key && styles.goalOptionSelected]}
          >
            <View style={[styles.goalIcon, selectedGoal === opt.key && styles.goalIconSelected]}>
              <Ionicons
                name={opt.icon as any}
                size={20}
                color={selectedGoal === opt.key ? Colors.gold : Colors.textSecondary}
              />
            </View>
            <View style={styles.goalText}>
              <Text style={[styles.goalLabel, selectedGoal === opt.key && styles.goalLabelSelected]}>
                {opt.label}
              </Text>
              <Text style={styles.goalDesc}>{opt.description}</Text>
            </View>
            {selectedGoal === opt.key && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.gold} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={onStart}
        disabled={!selectedGoal || loading}
        activeOpacity={0.85}
        style={[styles.startButton, (!selectedGoal || loading) && { opacity: 0.4 }]}
      >
        <LinearGradient
          colors={Colors.gradientGold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
        />
        <Text style={styles.startButtonText}>Start building my profile</Text>
        <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const [step, setStep] = useState<Step>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<PrimaryGoal | null>(null);
  const [loading, setLoading] = useState(false);

  const goNext = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setStep('name');
    }
  };

  const goToGoal = async () => {
    if (userName.trim()) {
      await saveUserName(userName.trim());
    }
    setStep('goal');
  };

  const handleStart = async () => {
    if (!selectedGoal || loading) return;
    setLoading(true);
    await markOnboardingComplete(selectedGoal);
    router.replace('/(tabs)');
  };

  const currentSlide = SLIDES[slideIndex];
  const currentAccent = currentSlide.accent;

  // ── Name screen ──────────────────────────────────────────────────
  if (step === 'name') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.backgroundSecondary]}
          style={StyleSheet.absoluteFill}
        />
        <AuraBackground color={Colors.innerType} intensity={0.7} size={560} style={{ top: -SCREEN_H * 0.25, left: -SCREEN_W * 0.46 }} />
        <SafeAreaView style={styles.safeArea}>
          <NameStep userName={userName} setUserName={setUserName} onContinue={goToGoal} />
        </SafeAreaView>
      </View>
    );
  }

  // ── Goal screen ──────────────────────────────────────────────────
  if (step === 'goal') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.backgroundSecondary]}
          style={StyleSheet.absoluteFill}
        />
        <AuraBackground color={Colors.lavender} intensity={0.85} size={580} style={{ top: -SCREEN_H * 0.25, right: -SCREEN_W * 0.51 }} />
        <SafeAreaView style={styles.safeArea}>
          <GoalStep
            userName={userName}
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onStart={handleStart}
            loading={loading}
          />
        </SafeAreaView>
      </View>
    );
  }

  // ── Slides ───────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={StyleSheet.absoluteFill}
      />
      <AuraBackground
        color={currentAccent}
        intensity={0.72}
        size={620}
        style={{ top: -SCREEN_H * 0.27, left: -SCREEN_W * 0.46 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Orb — clarity evolves with each slide */}
        <View style={styles.orbArea}>
          <ProfileOrb clarity={currentSlide.orbClarity} color={currentAccent} size={160} />
        </View>

        {/* Active slide — key prop causes remount + fresh fade-in animation */}
        <View style={styles.slideArea}>
          <SlideContent key={slideIndex} slide={currentSlide} />
        </View>

        {/* Bottom controls */}
        <View style={styles.controls}>
          {/* Progress dots */}
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === slideIndex
                    ? { backgroundColor: currentAccent, width: 20 }
                    : { backgroundColor: Colors.textTertiary },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={goNext} style={styles.nextButton} activeOpacity={0.85}>
            <LinearGradient
              colors={[currentAccent, `${currentAccent}BB`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
            />
            <Text style={styles.nextButtonText}>
              {slideIndex < SLIDES.length - 1 ? 'Continue' : 'Get started'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── Slide extra styles ────────────────────────────────────────────────────────

const extras = StyleSheet.create({
  // Slide 1 — three dimensions row
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dimSep: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  dimLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },

  // Slide 2 — orb progression + pattern preview
  revealWrap: {
    gap: 14,
    marginTop: 10,
  },
  progressionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(155,142,196,0.07)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(155,142,196,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  progressArrow: {
    marginBottom: 14,
    flexShrink: 0,
  },
  progressionStep: {
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  progressionLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  patternCard: {
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(155,142,196,0.22)',
    padding: 14,
    gap: 6,
  },
  patternCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lavender,
  },
  patternOverline: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.lavender,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  patternTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },
  patternBody: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: FontSize.xs * 1.65,
    fontStyle: 'italic',
  },

  // Slide 3 — framework chips
  frameworkList: {
    gap: 8,
    marginTop: 8,
  },
  frameworkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  frameworkIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameworkLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  frameworkDisclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

// ── Main styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  kav: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Slides ──────────────────────────────────────────────────────
  orbArea: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  // slideArea fills remaining space between orb and controls
  slideArea: {
    flex: 1,
  },
  slideContent: {
    paddingHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 18,
  },
  overline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: FontSize['3xl'] * 1.2,
  },
  slideBody: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: FontSize.md * 1.65,
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 52 : 36,
    gap: 14,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    width: 6,
  },
  nextButton: {
    width: '100%',
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  nextButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },

  // ── Name screen ─────────────────────────────────────────────────
  nameScreen: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  nameOrbWrap: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 8,
  },
  nameContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
  },
  nameOverline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 2.5,
    color: Colors.innerType,
    textTransform: 'uppercase',
  },
  nameTitle: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: FontSize['2xl'] * 1.2,
  },
  nameSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.6,
  },
  nameInputWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderStrong,
    backgroundColor: Colors.backgroundSecondary,
    overflow: 'hidden',
  },
  nameInput: {
    height: 54,
    paddingHorizontal: 18,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  nameButton: {
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    marginTop: 4,
  },
  nameButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipLinkText: {
    fontSize: FontSize.base,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },

  // ── Goal screen ─────────────────────────────────────────────────
  goalScreen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 56 : 36,
    gap: 18,
  },
  goalHeader: { gap: 10 },
  goalOverline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 2.5,
    color: Colors.lavender,
    textTransform: 'uppercase',
  },
  goalTitle: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.display,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: FontSize['2xl'] * 1.2,
  },
  goalSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.6,
  },
  goalListScroll: { flex: 1 },
  goalListContent: {
    gap: 10,
    paddingBottom: 20,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.surface,
  },
  goalOptionSelected: {
    borderColor: `${Colors.gold}55`,
    backgroundColor: Colors.goldDim,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  goalIconSelected: { backgroundColor: Colors.goldDim },
  goalText: { flex: 1, gap: 3 },
  goalLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  goalLabelSelected: { color: Colors.textPrimary },
  goalDesc: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: FontSize.sm * 1.5,
  },
  startButton: {
    height: 58,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  startButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
});
