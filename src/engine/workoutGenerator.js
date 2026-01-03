// FitStreak Workout Generator
// Intelligently generates workouts based on recovery, equipment, and preferences

import { EXERCISES, filterByAvailableEquipment, getExercisesByMuscle } from '../data/exercises';
import { MUSCLE_GROUPS } from '../data/muscles';
import { getMusclesByPriority, calculateAllMuscleRecovery, getRecommendedIntensity } from './recoveryCalculator';
import { suggestProgression, calculateConsistencyScore } from '../utils/calculations';

// Workout type configurations
const WORKOUT_CONFIGS = {
  full_body: {
    name: 'Full Body',
    muscleGroups: ['chest', 'back', 'shoulders', 'quadriceps', 'abs'],
    exerciseCount: { min: 5, max: 7 },
    duration: 45,
  },
  upper_body: {
    name: 'Upper Body',
    muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    exerciseCount: { min: 5, max: 7 },
    duration: 40,
  },
  lower_body: {
    name: 'Lower Body',
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'abs'],
    exerciseCount: { min: 5, max: 6 },
    duration: 40,
  },
  push: {
    name: 'Push Day',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    exerciseCount: { min: 4, max: 6 },
    duration: 35,
  },
  pull: {
    name: 'Pull Day',
    muscleGroups: ['back', 'biceps'],
    exerciseCount: { min: 4, max: 6 },
    duration: 35,
  },
  legs: {
    name: 'Leg Day',
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    exerciseCount: { min: 4, max: 6 },
    duration: 40,
  },
  quick: {
    name: 'Quick Workout',
    muscleGroups: ['chest', 'back', 'quadriceps', 'abs'],
    exerciseCount: { min: 3, max: 4 },
    duration: 20,
  },
  core: {
    name: 'Core Focus',
    muscleGroups: ['abs', 'obliques', 'lowerBack'],
    exerciseCount: { min: 4, max: 5 },
    duration: 20,
  },
};

// Select the best workout type based on muscle recovery
export const selectWorkoutType = (muscleStatus, preferences = {}) => {
  const recovery = calculateAllMuscleRecovery(muscleStatus);

  // Calculate average recovery for different workout types
  const typeScores = Object.entries(WORKOUT_CONFIGS).map(([type, config]) => {
    const avgRecovery = config.muscleGroups.reduce((sum, muscle) => {
      return sum + (recovery[muscle] || 100);
    }, 0) / config.muscleGroups.length;

    // Boost score if matches time preference
    let timeBonus = 0;
    if (preferences.workoutDuration) {
      const durationDiff = Math.abs(config.duration - preferences.workoutDuration);
      timeBonus = durationDiff < 10 ? 10 : 0;
    }

    return {
      type,
      config,
      avgRecovery,
      score: avgRecovery + timeBonus,
    };
  });

  // Filter out types where muscles need too much rest
  const viable = typeScores.filter(t => t.avgRecovery >= 40);

  if (viable.length === 0) {
    // All muscles need rest - suggest quick/core workout
    return 'quick';
  }

  // Sort by score (higher is better - more recovered muscles)
  viable.sort((a, b) => b.score - a.score);

  // Return the type with lowest average recovery (needs training most)
  // but still above threshold
  return viable[viable.length - 1].type;
};

// Select target muscles for workout
export const selectTargetMuscles = (workoutType, muscleStatus, count = 4) => {
  const config = WORKOUT_CONFIGS[workoutType];
  if (!config) return [];

  const recovery = calculateAllMuscleRecovery(muscleStatus);

  // Get muscles for this workout type with their recovery
  const muscles = config.muscleGroups
    .map(muscleId => ({
      muscleId,
      recovery: recovery[muscleId] || 100,
    }))
    .filter(m => m.recovery >= 40) // Only include recovered muscles
    .sort((a, b) => a.recovery - b.recovery); // Lowest recovery first (priority)

  return muscles.slice(0, count);
};

// Select exercises for workout
export const selectExercises = (
  targetMuscles,
  settings = {},
  workoutHistory = [],
  personalRecords = {}
) => {
  const {
    equipment = ['none', 'dumbbells'],
    excludedExercises = [],
    favoriteExercises = [],
    experienceLevel = 'beginner',
  } = settings;

  const selectedExercises = [];
  const usedExercises = new Set();

  // Get recently used exercises to add variety
  const recentExercises = new Set();
  workoutHistory.slice(0, 3).forEach(workout => {
    workout.exercises?.forEach(ex => recentExercises.add(ex.exerciseId));
  });

  targetMuscles.forEach(({ muscleId, recovery }) => {
    // Get exercises for this muscle
    let exercises = getExercisesByMuscle(muscleId, 'primary');

    // Filter by equipment
    exercises = filterByAvailableEquipment(exercises, equipment);

    // Remove excluded
    exercises = exercises.filter(e => !excludedExercises.includes(e.id));

    // Remove already selected
    exercises = exercises.filter(e => !usedExercises.has(e.id));

    // Filter by experience level
    const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    const userLevel = levelOrder[experienceLevel] || 1;
    exercises = exercises.filter(e => {
      const exerciseLevel = levelOrder[e.difficulty] || 1;
      return exerciseLevel <= userLevel;
    });

    if (exercises.length === 0) return;

    // Score exercises
    const scored = exercises.map(exercise => {
      let score = 50; // Base score

      // Boost favorites
      if (favoriteExercises.includes(exercise.id)) {
        score += 30;
      }

      // Reduce score for recently used (variety)
      if (recentExercises.has(exercise.id)) {
        score -= 20;
      }

      // Boost compound movements for beginners
      if (experienceLevel === 'beginner' && exercise.secondaryMuscles?.length > 0) {
        score += 15;
      }

      return { exercise, score };
    });

    // Sort by score and pick best
    scored.sort((a, b) => b.score - a.score);

    const selected = scored[0].exercise;
    usedExercises.add(selected.id);

    // Get recommended intensity based on recovery
    const intensity = getRecommendedIntensity(recovery);

    // Get weight suggestion from history
    const suggestion = suggestProgression(
      workoutHistory.find(w =>
        w.exercises?.some(e => e.exerciseId === selected.id)
      )?.exercises?.find(e => e.exerciseId === selected.id),
      parseInt(selected.defaultReps) || 10
    );

    selectedExercises.push({
      exerciseId: selected.id,
      name: selected.name,
      primaryMuscles: selected.primaryMuscles,
      secondaryMuscles: selected.secondaryMuscles,
      suggestedSets: selected.defaultSets,
      suggestedReps: selected.defaultReps,
      suggestedWeight: suggestion.weight || 0,
      restTime: selected.restTime,
      formCues: selected.formCues,
      intensity,
      sets: [], // Will be filled during workout
    });
  });

  return selectedExercises;
};

// Adjust workout based on difficulty level
export const adjustWorkoutForDifficulty = (workout, difficultyLevel) => {
  const adjustments = {
    struggling: { setMultiplier: 0.6, exerciseLimit: 4 },
    building: { setMultiplier: 0.8, exerciseLimit: 5 },
    consistent: { setMultiplier: 1.0, exerciseLimit: 7 },
    crushing: { setMultiplier: 1.2, exerciseLimit: 8 },
  };

  const adj = adjustments[difficultyLevel] || adjustments.building;

  // Limit exercises
  const limitedExercises = workout.exercises.slice(0, adj.exerciseLimit);

  // Adjust sets
  const adjustedExercises = limitedExercises.map(exercise => ({
    ...exercise,
    suggestedSets: Math.max(2, Math.round(exercise.suggestedSets * adj.setMultiplier)),
  }));

  return {
    ...workout,
    exercises: adjustedExercises,
    difficultyLevel,
  };
};

// Main workout generation function
export const generateWorkout = (
  muscleStatus,
  settings = {},
  workoutHistory = [],
  personalRecords = {},
  consistencyScore = 70
) => {
  // 1. Select workout type
  const workoutType = selectWorkoutType(muscleStatus, settings);
  const config = WORKOUT_CONFIGS[workoutType];

  // 2. Get difficulty level based on consistency
  const difficultyLevel = getDifficultyLevel(consistencyScore);

  // 3. Select target muscles
  const targetMuscles = selectTargetMuscles(
    workoutType,
    muscleStatus,
    config.exerciseCount.max
  );

  // 4. Select exercises
  const exercises = selectExercises(
    targetMuscles,
    settings,
    workoutHistory,
    personalRecords
  );

  // 5. Create workout object
  const workout = {
    type: workoutType,
    name: config.name,
    targetMuscles: targetMuscles.map(m => m.muscleId),
    exercises,
    estimatedDuration: config.duration,
    intensity: 'moderate',
    createdAt: new Date().toISOString(),
  };

  // 6. Adjust for difficulty
  return adjustWorkoutForDifficulty(workout, difficultyLevel);
};

// Get difficulty level from consistency score
const getDifficultyLevel = (consistencyScore) => {
  if (consistencyScore < 50) return 'struggling';
  if (consistencyScore < 75) return 'building';
  if (consistencyScore < 90) return 'consistent';
  return 'crushing';
};

// Generate a quick workout
export const generateQuickWorkout = (muscleStatus, settings = {}) => {
  const config = WORKOUT_CONFIGS.quick;

  const targetMuscles = selectTargetMuscles('quick', muscleStatus, 4);
  const exercises = selectExercises(targetMuscles, settings);

  // Limit to 3-4 exercises, 2-3 sets each
  const quickExercises = exercises.slice(0, 4).map(ex => ({
    ...ex,
    suggestedSets: Math.min(ex.suggestedSets, 3),
  }));

  return {
    type: 'quick',
    name: 'Quick Workout',
    targetMuscles: targetMuscles.map(m => m.muscleId),
    exercises: quickExercises,
    estimatedDuration: 20,
    intensity: 'light',
    createdAt: new Date().toISOString(),
    difficultyLevel: 'building',
  };
};

// Get alternative workout suggestion
export const getAlternativeWorkout = (currentType, muscleStatus, settings) => {
  // Get a different type that's also viable
  const alternatives = Object.keys(WORKOUT_CONFIGS).filter(t => t !== currentType);

  for (const altType of alternatives) {
    const targetMuscles = selectTargetMuscles(altType, muscleStatus, 4);
    if (targetMuscles.length >= 3) {
      return generateWorkout(
        muscleStatus,
        { ...settings, preferredType: altType },
        [],
        {}
      );
    }
  }

  return generateQuickWorkout(muscleStatus, settings);
};

export default {
  generateWorkout,
  generateQuickWorkout,
  getAlternativeWorkout,
  selectWorkoutType,
  selectTargetMuscles,
  selectExercises,
  adjustWorkoutForDifficulty,
  WORKOUT_CONFIGS,
};
