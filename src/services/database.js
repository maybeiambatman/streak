// GainStreak Database Service
// Handles all data persistence with AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  createDefaultUserProfile,
  createDefaultStreakData,
  createDefaultMuscleRecoveryState,
  MuscleGroups,
} from '../types';

// Storage Keys
const KEYS = {
  USER_PROFILE: '@gainstreak_user_profile',
  WORKOUTS: '@gainstreak_workouts',
  EXERCISE_LOGS: '@gainstreak_exercise_logs',
  SET_LOGS: '@gainstreak_set_logs',
  BASELINES: '@gainstreak_baselines',
  STREAK: '@gainstreak_streak',
  MUSCLE_RECOVERY: '@gainstreak_muscle_recovery',
  SETTINGS: '@gainstreak_settings',
};

// ==================== USER PROFILE ====================

export const getUserProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const createUserProfile = async (userData) => {
  const profile = {
    ...createDefaultUserProfile(),
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  await saveUserProfile(profile);

  // Initialize related data
  await saveStreakData(createDefaultStreakData());
  await saveMuscleRecoveryState(createDefaultMuscleRecoveryState());

  return profile;
};

// ==================== WORKOUTS ====================

export const getWorkouts = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

export const saveWorkout = async (workout) => {
  try {
    const workouts = await getWorkouts();
    const newWorkout = {
      ...workout,
      id: workout.id || uuidv4(),
      date: workout.date || new Date().toISOString(),
    };
    workouts.push(newWorkout);
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
    return newWorkout;
  } catch (error) {
    console.error('Error saving workout:', error);
    return null;
  }
};

export const getWorkoutById = async (workoutId) => {
  const workouts = await getWorkouts();
  return workouts.find(w => w.id === workoutId) || null;
};

export const getRecentWorkouts = async (limit = 10) => {
  const workouts = await getWorkouts();
  return workouts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const getWorkoutsInRange = async (startDate, endDate) => {
  const workouts = await getWorkouts();
  return workouts.filter(w => {
    const date = new Date(w.date);
    return date >= startDate && date <= endDate;
  });
};

// ==================== EXERCISE BASELINES ====================

export const getBaselines = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BASELINES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting baselines:', error);
    return {};
  }
};

export const saveBaselines = async (baselines) => {
  try {
    await AsyncStorage.setItem(KEYS.BASELINES, JSON.stringify(baselines));
    return true;
  } catch (error) {
    console.error('Error saving baselines:', error);
    return false;
  }
};

export const updateBaseline = async (exerciseId, newLog) => {
  const baselines = await getBaselines();
  const currentBaseline = baselines[exerciseId] || {
    exerciseId,
    typicalWeight: 0,
    typicalReps: 0,
    typicalSets: 0,
    typicalVolume: 0,
    personalBest: { weight: 0, reps: 0, date: null },
    dataPoints: 0,
  };

  // Calculate new set data
  const avgWeight = newLog.sets.reduce((sum, s) => sum + s.weight, 0) / newLog.sets.length;
  const avgReps = newLog.sets.reduce((sum, s) => sum + s.reps, 0) / newLog.sets.length;
  const totalVolume = newLog.sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);

  // Weighted average favoring recent data
  const weight = Math.min(currentBaseline.dataPoints, 10);
  const newWeight = 1;
  const totalWeight = weight + newWeight;

  const updatedBaseline = {
    ...currentBaseline,
    typicalWeight: (currentBaseline.typicalWeight * weight + avgWeight * newWeight) / totalWeight,
    typicalReps: (currentBaseline.typicalReps * weight + avgReps * newWeight) / totalWeight,
    typicalSets: (currentBaseline.typicalSets * weight + newLog.sets.length * newWeight) / totalWeight,
    typicalVolume: (currentBaseline.typicalVolume * weight + totalVolume * newWeight) / totalWeight,
    dataPoints: currentBaseline.dataPoints + 1,
  };

  // Check for personal best
  const maxWeightSet = newLog.sets.reduce((max, set) =>
    set.weight > max.weight ? set : max,
    { weight: 0, reps: 0 }
  );

  if (maxWeightSet.weight > currentBaseline.personalBest.weight) {
    updatedBaseline.personalBest = {
      weight: maxWeightSet.weight,
      reps: maxWeightSet.reps,
      date: new Date().toISOString(),
    };
  }

  baselines[exerciseId] = updatedBaseline;
  await saveBaselines(baselines);

  return {
    baseline: updatedBaseline,
    isNewPR: maxWeightSet.weight > currentBaseline.personalBest.weight,
  };
};

// ==================== STREAK ====================

export const getStreakData = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.STREAK);
    return data ? JSON.parse(data) : createDefaultStreakData();
  } catch (error) {
    console.error('Error getting streak data:', error);
    return createDefaultStreakData();
  }
};

export const saveStreakData = async (streakData) => {
  try {
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(streakData));
    return true;
  } catch (error) {
    console.error('Error saving streak data:', error);
    return false;
  }
};

export const updateStreak = async (workoutDate) => {
  const streakData = await getStreakData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workoutDay = new Date(workoutDate);
  workoutDay.setHours(0, 0, 0, 0);

  const lastWorkout = streakData.lastWorkoutDate
    ? new Date(streakData.lastWorkoutDate)
    : null;

  if (lastWorkout) {
    lastWorkout.setHours(0, 0, 0, 0);
  }

  let newStreak = streakData.currentStreak;

  if (!lastWorkout) {
    // First workout ever
    newStreak = 1;
  } else if (workoutDay.getTime() === lastWorkout.getTime()) {
    // Same day workout, streak unchanged
  } else if (workoutDay.getTime() - lastWorkout.getTime() === 86400000) {
    // Consecutive day
    newStreak = streakData.currentStreak + 1;
  } else if (workoutDay.getTime() - lastWorkout.getTime() > 86400000) {
    // Gap in workouts - check for streak freeze
    const gapDays = Math.floor((workoutDay.getTime() - lastWorkout.getTime()) / 86400000);

    if (gapDays === 2 && streakData.streakFreezesRemaining > 0 && !streakData.streakFreezeUsedThisWeek) {
      // One day missed, use streak freeze
      newStreak = streakData.currentStreak + 1;
      streakData.streakFreezesRemaining -= 1;
      streakData.streakFreezeUsedThisWeek = true;
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  const updatedStreakData = {
    ...streakData,
    currentStreak: newStreak,
    longestStreak: Math.max(streakData.longestStreak, newStreak),
    lastWorkoutDate: workoutDate,
  };

  // Reset streak freeze weekly (simplified - resets on reaching 7-day streak milestone)
  if (newStreak % 7 === 0 && newStreak > 0) {
    updatedStreakData.streakFreezesRemaining = 1;
    updatedStreakData.streakFreezeUsedThisWeek = false;
  }

  await saveStreakData(updatedStreakData);
  return updatedStreakData;
};

// ==================== MUSCLE RECOVERY ====================

export const getMuscleRecoveryState = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MUSCLE_RECOVERY);
    return data ? JSON.parse(data) : createDefaultMuscleRecoveryState();
  } catch (error) {
    console.error('Error getting muscle recovery state:', error);
    return createDefaultMuscleRecoveryState();
  }
};

export const saveMuscleRecoveryState = async (state) => {
  try {
    await AsyncStorage.setItem(KEYS.MUSCLE_RECOVERY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Error saving muscle recovery state:', error);
    return false;
  }
};

export const updateMuscleRecovery = async (muscleGroup, intensity) => {
  const state = await getMuscleRecoveryState();

  state[muscleGroup] = {
    lastTrainedDate: new Date().toISOString(),
    lastTrainedIntensity: intensity,
    recoveryScore: 0,
  };

  await saveMuscleRecoveryState(state);
  return state;
};

export const updateMultipleMuscleRecovery = async (muscleGroups, intensity) => {
  const state = await getMuscleRecoveryState();
  const now = new Date().toISOString();

  muscleGroups.forEach(muscle => {
    state[muscle] = {
      lastTrainedDate: now,
      lastTrainedIntensity: intensity,
      recoveryScore: 0,
    };
  });

  await saveMuscleRecoveryState(state);
  return state;
};

// ==================== SETTINGS ====================

export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return getDefaultSettings();
  }
};

export const getDefaultSettings = () => ({
  notifications: {
    streakReminder: true,
    workoutReminder: true,
    reminderTime: '18:00',
  },
  weightUnit: 'kg',
  restDays: [0, 6], // Sunday and Saturday
  theme: 'light',
});

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// ==================== UTILITY ====================

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const exportData = async () => {
  try {
    const data = {};
    for (const [key, storageKey] of Object.entries(KEYS)) {
      const value = await AsyncStorage.getItem(storageKey);
      data[key] = value ? JSON.parse(value) : null;
    }
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export default {
  // User
  getUserProfile,
  saveUserProfile,
  createUserProfile,

  // Workouts
  getWorkouts,
  saveWorkout,
  getWorkoutById,
  getRecentWorkouts,
  getWorkoutsInRange,

  // Baselines
  getBaselines,
  saveBaselines,
  updateBaseline,

  // Streak
  getStreakData,
  saveStreakData,
  updateStreak,

  // Muscle Recovery
  getMuscleRecoveryState,
  saveMuscleRecoveryState,
  updateMuscleRecovery,
  updateMultipleMuscleRecovery,

  // Settings
  getSettings,
  saveSettings,

  // Utility
  clearAllData,
  exportData,
};
