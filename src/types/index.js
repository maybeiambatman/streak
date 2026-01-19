// GainStreak Type Definitions

// Muscle Groups
export const MuscleGroups = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  QUADRICEPS: 'quadriceps',
  HAMSTRINGS: 'hamstrings',
  GLUTES: 'glutes',
  CALVES: 'calves',
  CORE: 'core',
};

// Equipment Types
export const Equipment = {
  BARBELL: 'barbell',
  DUMBBELL: 'dumbbell',
  CABLE: 'cable',
  MACHINE: 'machine',
  BODYWEIGHT: 'bodyweight',
  KETTLEBELL: 'kettlebell',
};

// Difficulty Levels
export const Difficulty = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Fitness Goals
export const FitnessGoals = {
  BUILD_MUSCLE: 'build_muscle',
  LOSE_FAT: 'lose_fat',
  GAIN_STRENGTH: 'gain_strength',
  IMPROVE_ENDURANCE: 'improve_endurance',
  MAINTAIN_FITNESS: 'maintain_fitness',
};

// Workout Templates
export const WorkoutTypes = {
  PUSH: 'Push Day',
  PULL: 'Pull Day',
  LEGS: 'Leg Day',
  UPPER: 'Upper Body',
  LOWER: 'Lower Body',
  FULL: 'Full Body',
};

// Streak Milestones
export const StreakMilestones = [7, 14, 30, 60, 90, 180, 365];

// Base recovery days for each muscle group
export const BaseRecoveryDays = {
  [MuscleGroups.QUADRICEPS]: 3,
  [MuscleGroups.HAMSTRINGS]: 3,
  [MuscleGroups.GLUTES]: 2.5,
  [MuscleGroups.BACK]: 2.5,
  [MuscleGroups.CHEST]: 2,
  [MuscleGroups.SHOULDERS]: 2,
  [MuscleGroups.BICEPS]: 1.5,
  [MuscleGroups.TRICEPS]: 1.5,
  [MuscleGroups.CALVES]: 1.5,
  [MuscleGroups.CORE]: 1,
};

// Default user profile structure
export const createDefaultUserProfile = () => ({
  id: null,
  name: '',
  age: 25,
  weight: 70,
  weightUnit: 'kg',
  fitnessLevel: Difficulty.INTERMEDIATE,
  goals: [FitnessGoals.BUILD_MUSCLE],
  preferredWorkoutDays: 4,
  availableEquipment: Object.values(Equipment),
  createdAt: new Date().toISOString(),
});

// Default streak data
export const createDefaultStreakData = () => ({
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  streakFreezesRemaining: 1,
  streakFreezeUsedThisWeek: false,
});

// Default muscle recovery state
export const createDefaultMuscleRecoveryState = () => {
  const state = {};
  Object.values(MuscleGroups).forEach(muscle => {
    state[muscle] = {
      lastTrainedDate: null,
      lastTrainedIntensity: 0,
      recoveryScore: 100,
    };
  });
  return state;
};
