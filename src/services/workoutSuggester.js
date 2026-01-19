// GainStreak Workout Suggestion Engine
// Suggests workouts based on muscle recovery state

import { MuscleGroups, Equipment, WorkoutTypes } from '../types';
import { calculateAllMuscleRecovery, getTrainableMuscles } from './recoveryCalculator';
import { getExercisesByMuscleGroup, filterExercisesByEquipment } from '../data/exercises';

// Workout Templates
const WORKOUT_TEMPLATES = [
  {
    name: WorkoutTypes.PUSH,
    muscles: [MuscleGroups.CHEST, MuscleGroups.SHOULDERS, MuscleGroups.TRICEPS],
    description: 'Chest, shoulders, and triceps',
    estimatedDuration: 45,
  },
  {
    name: WorkoutTypes.PULL,
    muscles: [MuscleGroups.BACK, MuscleGroups.BICEPS],
    description: 'Back and biceps',
    estimatedDuration: 45,
  },
  {
    name: WorkoutTypes.LEGS,
    muscles: [MuscleGroups.QUADRICEPS, MuscleGroups.HAMSTRINGS, MuscleGroups.GLUTES, MuscleGroups.CALVES],
    description: 'Full leg workout',
    estimatedDuration: 50,
  },
  {
    name: WorkoutTypes.UPPER,
    muscles: [MuscleGroups.CHEST, MuscleGroups.BACK, MuscleGroups.SHOULDERS, MuscleGroups.BICEPS, MuscleGroups.TRICEPS],
    description: 'Complete upper body',
    estimatedDuration: 60,
  },
  {
    name: WorkoutTypes.LOWER,
    muscles: [MuscleGroups.QUADRICEPS, MuscleGroups.HAMSTRINGS, MuscleGroups.GLUTES, MuscleGroups.CALVES],
    description: 'Complete lower body',
    estimatedDuration: 50,
  },
  {
    name: WorkoutTypes.FULL,
    muscles: [MuscleGroups.CHEST, MuscleGroups.BACK, MuscleGroups.QUADRICEPS, MuscleGroups.SHOULDERS],
    description: 'Full body compound movements',
    estimatedDuration: 55,
  },
];

/**
 * Score a workout template based on muscle recovery
 */
const scoreTemplate = (template, recoveryData) => {
  const relevantRecoveries = template.muscles
    .map(muscle => recoveryData[muscle]?.recoveryScore || 100);

  const avgRecovery = relevantRecoveries.reduce((sum, r) => sum + r, 0) / relevantRecoveries.length;
  const minRecovery = Math.min(...relevantRecoveries);

  // Penalize if any muscle is too fatigued
  const penalty = minRecovery < 40 ? (40 - minRecovery) * 2 : 0;

  return {
    ...template,
    score: avgRecovery - penalty,
    avgRecovery,
    minRecovery,
  };
};

/**
 * Suggest the next workout based on recovery state
 */
export const suggestNextWorkout = (
  muscleRecoveryState,
  userProfile = {},
  baselines = {}
) => {
  const userAge = userProfile.age || 25;
  const availableEquipment = userProfile.availableEquipment || Object.values(Equipment);

  const recoveryData = calculateAllMuscleRecovery(muscleRecoveryState, userAge);

  // Score all templates
  const scoredTemplates = WORKOUT_TEMPLATES
    .map(template => scoreTemplate(template, recoveryData))
    .sort((a, b) => b.score - a.score);

  // Get the best template
  const bestTemplate = scoredTemplates[0];

  // If best template has very low score, suggest rest
  if (bestTemplate.minRecovery < 30) {
    return {
      shouldRest: true,
      reason: 'Your muscles need more recovery time',
      nextBestWorkout: bestTemplate,
      hoursUntilReady: estimateHoursUntilReady(recoveryData, bestTemplate.muscles),
    };
  }

  // Build the workout
  const workout = buildWorkoutFromTemplate(
    bestTemplate,
    availableEquipment,
    userProfile.fitnessLevel,
    baselines
  );

  return {
    shouldRest: false,
    workout,
    reason: generateWorkoutReason(bestTemplate, recoveryData),
    alternatives: scoredTemplates.slice(1, 3).map(t => ({
      name: t.name,
      score: Math.round(t.score),
    })),
  };
};

/**
 * Build a workout from a template
 */
const buildWorkoutFromTemplate = (
  template,
  availableEquipment,
  fitnessLevel = 'intermediate',
  baselines = {}
) => {
  const exercises = [];

  template.muscles.forEach(muscle => {
    // Get exercises for this muscle
    let muscleExercises = getExercisesByMuscleGroup(muscle, 'primary');

    // Filter by available equipment
    muscleExercises = filterExercisesByEquipment(muscleExercises, availableEquipment);

    // Filter by difficulty if beginner
    if (fitnessLevel === 'beginner') {
      const beginnerExercises = muscleExercises.filter(e => e.difficulty === 'beginner');
      if (beginnerExercises.length > 0) {
        muscleExercises = beginnerExercises;
      }
    }

    // Select 1-2 exercises per muscle group
    const numExercises = template.muscles.length > 3 ? 1 : 2;
    const selectedExercises = muscleExercises.slice(0, numExercises);

    selectedExercises.forEach(exercise => {
      const baseline = baselines[exercise.id];

      exercises.push({
        ...exercise,
        suggestedSets: getSuggestedSets(fitnessLevel),
        suggestedReps: getSuggestedReps(exercise, fitnessLevel),
        suggestedWeight: baseline?.typicalWeight || 0,
        previousBest: baseline?.personalBest || null,
      });
    });
  });

  return {
    name: template.name,
    description: template.description,
    focusMuscleGroups: template.muscles,
    exercises,
    estimatedDuration: template.estimatedDuration,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Get suggested sets based on fitness level
 */
const getSuggestedSets = (fitnessLevel) => {
  switch (fitnessLevel) {
    case 'beginner': return 3;
    case 'intermediate': return 4;
    case 'advanced': return 4;
    default: return 3;
  }
};

/**
 * Get suggested reps for an exercise
 */
const getSuggestedReps = (exercise, fitnessLevel) => {
  // Compound movements: lower reps
  // Isolation movements: higher reps
  const isCompound = exercise.secondaryMuscleGroups?.length > 0;

  if (isCompound) {
    return fitnessLevel === 'beginner' ? '8-10' : '6-8';
  }
  return fitnessLevel === 'beginner' ? '12-15' : '10-12';
};

/**
 * Generate reason for workout suggestion
 */
const generateWorkoutReason = (template, recoveryData) => {
  const avgRecovery = Math.round(template.avgRecovery);

  if (avgRecovery >= 90) {
    return `Your ${template.name.toLowerCase()} muscles are fully recovered and ready for an intense session!`;
  }
  if (avgRecovery >= 70) {
    return `Good recovery on ${template.name.toLowerCase()} muscles. You can push hard today.`;
  }
  return `${template.name} is your best option based on current muscle recovery.`;
};

/**
 * Estimate hours until muscles are ready
 */
const estimateHoursUntilReady = (recoveryData, muscles) => {
  const hoursNeeded = muscles.map(muscle =>
    recoveryData[muscle]?.hoursUntilRecovered || 0
  );
  return Math.max(...hoursNeeded);
};

/**
 * Get quick workout (shorter, fewer exercises)
 */
export const suggestQuickWorkout = (
  muscleRecoveryState,
  userProfile = {},
  duration = 20
) => {
  const userAge = userProfile.age || 25;
  const availableEquipment = userProfile.availableEquipment || Object.values(Equipment);

  const trainableMuscles = getTrainableMuscles(muscleRecoveryState, userAge, 60);

  if (trainableMuscles.length === 0) {
    return {
      shouldRest: true,
      reason: 'All muscles need more recovery. Consider rest or very light activity.',
    };
  }

  // Pick top 2-3 most recovered muscles
  const targetMuscles = trainableMuscles.slice(0, 3).map(m => m.muscleGroup);

  const exercises = [];
  targetMuscles.forEach(muscle => {
    let muscleExercises = getExercisesByMuscleGroup(muscle, 'primary');
    muscleExercises = filterExercisesByEquipment(muscleExercises, availableEquipment);

    if (muscleExercises.length > 0) {
      const exercise = muscleExercises[0];
      exercises.push({
        ...exercise,
        suggestedSets: 3,
        suggestedReps: '10-12',
        suggestedWeight: 0,
      });
    }
  });

  return {
    shouldRest: false,
    workout: {
      name: 'Quick Workout',
      description: `${duration}-minute session targeting recovered muscles`,
      focusMuscleGroups: targetMuscles,
      exercises,
      estimatedDuration: duration,
      createdAt: new Date().toISOString(),
    },
  };
};

/**
 * Get workout for specific muscle groups
 */
export const buildCustomWorkout = (
  muscleGroups,
  availableEquipment,
  fitnessLevel = 'intermediate',
  baselines = {}
) => {
  const exercises = [];

  muscleGroups.forEach(muscle => {
    let muscleExercises = getExercisesByMuscleGroup(muscle, 'primary');
    muscleExercises = filterExercisesByEquipment(muscleExercises, availableEquipment);

    // Select 2 exercises per muscle
    const selectedExercises = muscleExercises.slice(0, 2);

    selectedExercises.forEach(exercise => {
      const baseline = baselines[exercise.id];

      exercises.push({
        ...exercise,
        suggestedSets: getSuggestedSets(fitnessLevel),
        suggestedReps: getSuggestedReps(exercise, fitnessLevel),
        suggestedWeight: baseline?.typicalWeight || 0,
        previousBest: baseline?.personalBest || null,
      });
    });
  });

  return {
    name: 'Custom Workout',
    description: `Targeting: ${muscleGroups.join(', ')}`,
    focusMuscleGroups: muscleGroups,
    exercises,
    estimatedDuration: exercises.length * 8 + 5,
    createdAt: new Date().toISOString(),
  };
};

export default {
  suggestNextWorkout,
  suggestQuickWorkout,
  buildCustomWorkout,
  WORKOUT_TEMPLATES,
};
