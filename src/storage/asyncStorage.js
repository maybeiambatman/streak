// AsyncStorage wrapper for FitStreak
// Provides typed access to local storage

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  USER: '@fitstreak/user',
  MUSCLE_STATUS: '@fitstreak/muscle_status',
  WORKOUTS: '@fitstreak/workouts',
  PERSONAL_RECORDS: '@fitstreak/personal_records',
  ACHIEVEMENTS: '@fitstreak/achievements',
  SETTINGS: '@fitstreak/settings',
  ONBOARDING_COMPLETE: '@fitstreak/onboarding_complete',
};

// Generic get
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

// Generic set
export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
};

// Generic remove
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

// Clear all app data
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// User data operations
export const getUser = async () => {
  return getData(STORAGE_KEYS.USER);
};

export const setUser = async (user) => {
  return setData(STORAGE_KEYS.USER, user);
};

export const updateUser = async (updates) => {
  const current = await getUser();
  const updated = { ...current, ...updates };
  return setData(STORAGE_KEYS.USER, updated);
};

// Muscle status operations
export const getMuscleStatus = async () => {
  return getData(STORAGE_KEYS.MUSCLE_STATUS);
};

export const setMuscleStatus = async (status) => {
  return setData(STORAGE_KEYS.MUSCLE_STATUS, status);
};

// Workouts operations
export const getWorkouts = async () => {
  const workouts = await getData(STORAGE_KEYS.WORKOUTS);
  return workouts || [];
};

export const setWorkouts = async (workouts) => {
  return setData(STORAGE_KEYS.WORKOUTS, workouts);
};

export const addWorkout = async (workout) => {
  const workouts = await getWorkouts();
  workouts.push(workout);
  return setData(STORAGE_KEYS.WORKOUTS, workouts);
};

export const updateWorkout = async (workoutId, updates) => {
  const workouts = await getWorkouts();
  const index = workouts.findIndex(w => w.id === workoutId);
  if (index >= 0) {
    workouts[index] = { ...workouts[index], ...updates };
    return setData(STORAGE_KEYS.WORKOUTS, workouts);
  }
  return false;
};

export const deleteWorkout = async (workoutId) => {
  const workouts = await getWorkouts();
  const filtered = workouts.filter(w => w.id !== workoutId);
  return setData(STORAGE_KEYS.WORKOUTS, filtered);
};

// Personal records operations
export const getPersonalRecords = async () => {
  const records = await getData(STORAGE_KEYS.PERSONAL_RECORDS);
  return records || {};
};

export const setPersonalRecords = async (records) => {
  return setData(STORAGE_KEYS.PERSONAL_RECORDS, records);
};

export const updatePersonalRecord = async (exerciseId, record) => {
  const records = await getPersonalRecords();
  records[exerciseId] = record;
  return setData(STORAGE_KEYS.PERSONAL_RECORDS, records);
};

// Achievements operations
export const getUnlockedAchievements = async () => {
  const achievements = await getData(STORAGE_KEYS.ACHIEVEMENTS);
  return achievements || [];
};

export const addUnlockedAchievement = async (achievementId) => {
  const achievements = await getUnlockedAchievements();
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId);
    return setData(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }
  return true;
};

// Settings operations
export const getSettings = async () => {
  const settings = await getData(STORAGE_KEYS.SETTINGS);
  return settings || getDefaultSettings();
};

export const setSettings = async (settings) => {
  return setData(STORAGE_KEYS.SETTINGS, settings);
};

export const updateSettings = async (updates) => {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  return setData(STORAGE_KEYS.SETTINGS, updated);
};

// Onboarding operations
export const isOnboardingComplete = async () => {
  const value = await getData(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return value === true;
};

export const setOnboardingComplete = async () => {
  return setData(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
};

// Default settings
const getDefaultSettings = () => ({
  equipment: ['none', 'dumbbells'],
  excludedExercises: [],
  favoriteExercises: [],
  workoutDuration: 30,
  experienceLevel: 'beginner',
  goals: ['general_fitness'],
  units: 'lbs',
  notificationTime: '18:00',
  notificationsEnabled: true,
  theme: 'light',
  soundEnabled: true,
  restTimerDefault: 90,
});

// Export all operations
export default {
  getData,
  setData,
  removeData,
  clearAllData,
  getUser,
  setUser,
  updateUser,
  getMuscleStatus,
  setMuscleStatus,
  getWorkouts,
  setWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  getPersonalRecords,
  setPersonalRecords,
  updatePersonalRecord,
  getUnlockedAchievements,
  addUnlockedAchievement,
  getSettings,
  setSettings,
  updateSettings,
  isOnboardingComplete,
  setOnboardingComplete,
  STORAGE_KEYS,
};
