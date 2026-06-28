import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, EMPTY_PROFILE } from '../types/profile';
import { AssessmentProgress, AssessmentResult, AssessmentId } from '../types/assessment';

const PROFILE_KEY = '@innertype:profile';

export async function loadProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    return JSON.parse(raw) as UserProfile;
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function saveUserName(name: string): Promise<void> {
  const profile = await loadProfile();
  await saveProfile({ ...profile, userName: name.trim() || undefined });
}

export async function markOnboardingComplete(primaryGoal?: string): Promise<UserProfile> {
  const profile = await loadProfile();
  const updated: UserProfile = {
    ...profile,
    onboardingComplete: true,
    primaryGoal: primaryGoal as UserProfile['primaryGoal'],
    createdAt: profile.createdAt || new Date().toISOString(),
  };
  await saveProfile(updated);
  return updated;
}

export async function saveAssessmentProgress(progress: AssessmentProgress): Promise<void> {
  const profile = await loadProfile();
  const updated: UserProfile = {
    ...profile,
    assessmentProgress: {
      ...profile.assessmentProgress,
      [progress.assessmentId]: progress,
    },
  };
  await saveProfile(updated);
}

export async function saveAssessmentResult(result: AssessmentResult): Promise<void> {
  const profile = await loadProfile();
  const updatedProgress = { ...profile.assessmentProgress };
  delete updatedProgress[result.assessmentId];

  const updated: UserProfile = {
    ...profile,
    assessmentResults: {
      ...profile.assessmentResults,
      [result.assessmentId]: result,
    },
    assessmentProgress: updatedProgress,
  };
  await saveProfile(updated);
}

export async function getAssessmentProgress(id: AssessmentId): Promise<AssessmentProgress | null> {
  const profile = await loadProfile();
  return profile.assessmentProgress[id] ?? null;
}

export async function getAssessmentResult(id: AssessmentId): Promise<AssessmentResult | null> {
  const profile = await loadProfile();
  return profile.assessmentResults[id] ?? null;
}

export async function resetAllData(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_KEY);
}

export async function setPremium(value: boolean): Promise<void> {
  const profile = await loadProfile();
  await saveProfile({ ...profile, isPremium: value });
}
