// GainStreak Global State Management with Zustand

import { create } from 'zustand';
import database from '../services/database';
import { calculateAllMuscleRecovery } from '../services/recoveryCalculator';
import { suggestNextWorkout } from '../services/workoutSuggester';
import { calculateStreak, calculateLevel, getLevelProgress } from '../utils/calculations';

// Main App Store
export const useAppStore = create((set, get) => ({
  // State
  isLoading: true,
  isInitialized: false,
  userProfile: null,
  streakData: null,
  muscleRecoveryState: null,
  recoveryData: null,
  workouts: [],
  baselines: {},
  settings: null,
  suggestedWorkout: null,

  // Actions
  initialize: async () => {
    set({ isLoading: true });

    const [userProfile, streakData, muscleRecoveryState, workouts, baselines, settings] = await Promise.all([
      database.getUserProfile(),
      database.getStreakData(),
      database.getMuscleRecoveryState(),
      database.getWorkouts(),
      database.getBaselines(),
      database.getSettings(),
    ]);

    const isInitialized = !!userProfile;

    let recoveryData = null;
    let suggestedWorkout = null;

    if (isInitialized && muscleRecoveryState) {
      recoveryData = calculateAllMuscleRecovery(muscleRecoveryState, userProfile?.age);
      const suggestion = suggestNextWorkout(muscleRecoveryState, userProfile, baselines);
      suggestedWorkout = suggestion.shouldRest ? null : suggestion.workout;
    }

    set({
      isLoading: false,
      isInitialized,
      userProfile,
      streakData,
      muscleRecoveryState,
      recoveryData,
      workouts,
      baselines,
      settings,
      suggestedWorkout,
    });
  },

  createProfile: async (profileData) => {
    const userProfile = await database.createUserProfile(profileData);
    const streakData = await database.getStreakData();
    const muscleRecoveryState = await database.getMuscleRecoveryState();

    set({
      isInitialized: true,
      userProfile,
      streakData,
      muscleRecoveryState,
      recoveryData: calculateAllMuscleRecovery(muscleRecoveryState, userProfile?.age),
    });

    // Generate initial suggestion
    get().refreshSuggestion();

    return userProfile;
  },

  updateProfile: async (updates) => {
    const { userProfile } = get();
    const updatedProfile = { ...userProfile, ...updates };
    await database.saveUserProfile(updatedProfile);
    set({ userProfile: updatedProfile });
    return updatedProfile;
  },

  completeWorkout: async (workout) => {
    const { userProfile, baselines, muscleRecoveryState } = get();

    // Save workout
    const savedWorkout = await database.saveWorkout({
      ...workout,
      completedAt: new Date().toISOString(),
    });

    // Update streak
    const streakData = await database.updateStreak(savedWorkout.date);

    // Update baselines and check for PRs
    const newPRs = [];
    for (const exercise of workout.exercises) {
      if (exercise.sets && exercise.sets.length > 0) {
        const completedSets = exercise.sets.filter(s => s.completed);
        if (completedSets.length > 0) {
          const result = await database.updateBaseline(exercise.id, {
            sets: completedSets,
          });
          if (result.isNewPR) {
            newPRs.push({
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              weight: result.baseline.personalBest.weight,
              reps: result.baseline.personalBest.reps,
            });
          }
        }
      }
    }

    // Update muscle recovery state
    const trainedMuscles = new Set();
    workout.exercises.forEach(ex => {
      if (ex.primaryMuscleGroup) trainedMuscles.add(ex.primaryMuscleGroup);
      if (ex.secondaryMuscleGroups) {
        ex.secondaryMuscleGroups.forEach(m => trainedMuscles.add(m));
      }
    });

    const intensity = workout.intensity || 70;
    await database.updateMultipleMuscleRecovery([...trainedMuscles], intensity);

    // Refresh state
    const [newMuscleRecoveryState, newBaselines, newWorkouts] = await Promise.all([
      database.getMuscleRecoveryState(),
      database.getBaselines(),
      database.getWorkouts(),
    ]);

    set({
      streakData,
      muscleRecoveryState: newMuscleRecoveryState,
      recoveryData: calculateAllMuscleRecovery(newMuscleRecoveryState, userProfile?.age),
      baselines: newBaselines,
      workouts: newWorkouts,
    });

    // Refresh suggestion
    get().refreshSuggestion();

    return {
      workout: savedWorkout,
      streakData,
      newPRs,
    };
  },

  refreshRecovery: async () => {
    const { userProfile } = get();
    const muscleRecoveryState = await database.getMuscleRecoveryState();
    const recoveryData = calculateAllMuscleRecovery(muscleRecoveryState, userProfile?.age);

    set({ muscleRecoveryState, recoveryData });
    get().refreshSuggestion();
  },

  refreshSuggestion: () => {
    const { muscleRecoveryState, userProfile, baselines } = get();

    if (!muscleRecoveryState || !userProfile) return;

    const suggestion = suggestNextWorkout(muscleRecoveryState, userProfile, baselines);
    set({
      suggestedWorkout: suggestion.shouldRest ? null : suggestion.workout,
    });
  },

  updateSettings: async (newSettings) => {
    const { settings } = get();
    const updatedSettings = { ...settings, ...newSettings };
    await database.saveSettings(updatedSettings);
    set({ settings: updatedSettings });
    return updatedSettings;
  },

  clearAllData: async () => {
    await database.clearAllData();
    set({
      isInitialized: false,
      userProfile: null,
      streakData: null,
      muscleRecoveryState: null,
      recoveryData: null,
      workouts: [],
      baselines: {},
      settings: null,
      suggestedWorkout: null,
    });
  },
}));

// Active Workout Store (for tracking current workout session)
export const useWorkoutStore = create((set, get) => ({
  // State
  isActive: false,
  workout: null,
  startTime: null,
  currentExerciseIndex: 0,
  exerciseLogs: [],

  // Actions
  startWorkout: (workout) => {
    const exerciseLogs = workout.exercises.map(exercise => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      primaryMuscleGroup: exercise.primaryMuscleGroup,
      secondaryMuscleGroups: exercise.secondaryMuscleGroups,
      sets: Array(exercise.suggestedSets || 3).fill(null).map((_, i) => ({
        setNumber: i + 1,
        weight: exercise.suggestedWeight || 0,
        reps: parseInt(exercise.suggestedReps) || 10,
        rpe: null,
        completed: false,
      })),
    }));

    set({
      isActive: true,
      workout,
      startTime: new Date(),
      currentExerciseIndex: 0,
      exerciseLogs,
    });
  },

  updateSet: (exerciseIndex, setIndex, updates) => {
    const { exerciseLogs } = get();
    const newLogs = [...exerciseLogs];
    newLogs[exerciseIndex] = {
      ...newLogs[exerciseIndex],
      sets: newLogs[exerciseIndex].sets.map((set, i) =>
        i === setIndex ? { ...set, ...updates } : set
      ),
    };
    set({ exerciseLogs: newLogs });
  },

  completeSet: (exerciseIndex, setIndex) => {
    get().updateSet(exerciseIndex, setIndex, { completed: true });
  },

  addSet: (exerciseIndex) => {
    const { exerciseLogs } = get();
    const exercise = exerciseLogs[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];

    const newLogs = [...exerciseLogs];
    newLogs[exerciseIndex] = {
      ...newLogs[exerciseIndex],
      sets: [
        ...newLogs[exerciseIndex].sets,
        {
          setNumber: exercise.sets.length + 1,
          weight: lastSet?.weight || 0,
          reps: lastSet?.reps || 10,
          rpe: null,
          completed: false,
        },
      ],
    };
    set({ exerciseLogs: newLogs });
  },

  removeSet: (exerciseIndex, setIndex) => {
    const { exerciseLogs } = get();
    const newLogs = [...exerciseLogs];
    newLogs[exerciseIndex] = {
      ...newLogs[exerciseIndex],
      sets: newLogs[exerciseIndex].sets.filter((_, i) => i !== setIndex),
    };
    set({ exerciseLogs: newLogs });
  },

  setCurrentExercise: (index) => {
    set({ currentExerciseIndex: index });
  },

  getWorkoutSummary: () => {
    const { workout, startTime, exerciseLogs } = get();
    if (!workout || !startTime) return null;

    const duration = Math.round((new Date() - startTime) / 1000 / 60);
    const completedSets = exerciseLogs.reduce(
      (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
      0
    );
    const totalSets = exerciseLogs.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalVolume = exerciseLogs.reduce(
      (sum, ex) => sum + ex.sets.reduce(
        (setSum, s) => setSum + (s.completed ? s.weight * s.reps : 0),
        0
      ),
      0
    );

    return {
      duration,
      completedSets,
      totalSets,
      totalVolume,
      exercises: exerciseLogs.length,
    };
  },

  finishWorkout: () => {
    const { workout, startTime, exerciseLogs } = get();
    const summary = get().getWorkoutSummary();

    const completedWorkout = {
      ...workout,
      exercises: exerciseLogs.map(log => ({
        ...log,
        sets: log.sets.filter(s => s.completed),
      })),
      duration: summary.duration,
      totalVolume: summary.totalVolume,
      intensity: 70, // Could be calculated from RPE
    };

    set({
      isActive: false,
      workout: null,
      startTime: null,
      currentExerciseIndex: 0,
      exerciseLogs: [],
    });

    return completedWorkout;
  },

  cancelWorkout: () => {
    set({
      isActive: false,
      workout: null,
      startTime: null,
      currentExerciseIndex: 0,
      exerciseLogs: [],
    });
  },
}));

export default { useAppStore, useWorkoutStore };
