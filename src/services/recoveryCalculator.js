// GainStreak Recovery Calculator Service
// Calculates muscle recovery status and recommendations

import { MuscleGroups, BaseRecoveryDays } from '../types';
import { calculateRecoveryScore } from '../utils/calculations';
import { getRecoveryColor } from '../utils/colors';
import { differenceInHours } from 'date-fns';

/**
 * Calculate recovery state for all muscle groups
 */
export const calculateAllMuscleRecovery = (muscleRecoveryState, userAge = 25) => {
  const recoveryData = {};

  Object.values(MuscleGroups).forEach(muscle => {
    const muscleState = muscleRecoveryState[muscle];

    if (!muscleState || !muscleState.lastTrainedDate) {
      recoveryData[muscle] = {
        muscleGroup: muscle,
        recoveryScore: 100,
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        suggestedRecoveryDays: 0,
        hoursUntilRecovered: 0,
        color: getRecoveryColor(100),
        status: 'fully_recovered',
        canTrain: true,
      };
    } else {
      const recoveryScore = calculateRecoveryScore(
        muscle,
        muscleState.lastTrainedDate,
        muscleState.lastTrainedIntensity,
        userAge
      );

      const baseRecovery = BaseRecoveryDays[muscle] || 2;
      const intensityMultiplier = 1 + (muscleState.lastTrainedIntensity / 100) * 0.5;
      const requiredHours = baseRecovery * 24 * intensityMultiplier;
      const hoursSince = differenceInHours(new Date(), new Date(muscleState.lastTrainedDate));
      const hoursRemaining = Math.max(0, requiredHours - hoursSince);

      recoveryData[muscle] = {
        muscleGroup: muscle,
        recoveryScore,
        lastTrainedDate: muscleState.lastTrainedDate,
        lastTrainedIntensity: muscleState.lastTrainedIntensity,
        suggestedRecoveryDays: baseRecovery * intensityMultiplier,
        hoursUntilRecovered: Math.round(hoursRemaining),
        color: getRecoveryColor(recoveryScore),
        status: getRecoveryStatus(recoveryScore),
        canTrain: recoveryScore >= 50,
      };
    }
  });

  return recoveryData;
};

/**
 * Get recovery status label
 */
const getRecoveryStatus = (recoveryScore) => {
  if (recoveryScore >= 90) return 'fully_recovered';
  if (recoveryScore >= 70) return 'mostly_recovered';
  if (recoveryScore >= 50) return 'partially_recovered';
  if (recoveryScore >= 30) return 'recovering';
  return 'needs_rest';
};

/**
 * Get muscles sorted by recovery priority (most recovered first)
 */
export const getMusclesByRecoveryPriority = (muscleRecoveryState, userAge = 25) => {
  const recoveryData = calculateAllMuscleRecovery(muscleRecoveryState, userAge);

  return Object.values(recoveryData)
    .sort((a, b) => b.recoveryScore - a.recoveryScore);
};

/**
 * Get muscles that are ready to train
 */
export const getTrainableMuscles = (muscleRecoveryState, userAge = 25, minRecovery = 50) => {
  const recoveryData = calculateAllMuscleRecovery(muscleRecoveryState, userAge);

  return Object.values(recoveryData)
    .filter(m => m.recoveryScore >= minRecovery)
    .sort((a, b) => b.recoveryScore - a.recoveryScore);
};

/**
 * Get muscles that need rest
 */
export const getMusclesNeedingRest = (muscleRecoveryState, userAge = 25) => {
  const recoveryData = calculateAllMuscleRecovery(muscleRecoveryState, userAge);

  return Object.values(recoveryData)
    .filter(m => m.recoveryScore < 50)
    .sort((a, b) => a.recoveryScore - b.recoveryScore);
};

/**
 * Calculate workout impact on muscles
 */
export const calculateWorkoutImpact = (exercises, intensity = 50) => {
  const impact = {};

  exercises.forEach(exercise => {
    // Primary muscle gets full impact
    if (exercise.primaryMuscleGroup) {
      impact[exercise.primaryMuscleGroup] = {
        muscle: exercise.primaryMuscleGroup,
        impactScore: intensity,
        isPrimary: true,
      };
    }

    // Secondary muscles get reduced impact
    if (exercise.secondaryMuscleGroups) {
      exercise.secondaryMuscleGroups.forEach(muscle => {
        if (!impact[muscle] || !impact[muscle].isPrimary) {
          impact[muscle] = {
            muscle,
            impactScore: intensity * 0.5,
            isPrimary: false,
          };
        }
      });
    }
  });

  return impact;
};

/**
 * Predict recovery status after a workout
 */
export const predictPostWorkoutRecovery = (
  currentRecoveryState,
  exercises,
  intensity,
  userAge = 25
) => {
  const currentRecovery = calculateAllMuscleRecovery(currentRecoveryState, userAge);
  const impact = calculateWorkoutImpact(exercises, intensity);

  const predictedRecovery = {};

  Object.keys(currentRecovery).forEach(muscle => {
    const current = currentRecovery[muscle];
    const muscleImpact = impact[muscle];

    if (muscleImpact) {
      predictedRecovery[muscle] = {
        ...current,
        recoveryScore: 0,
        status: 'needs_rest',
        canTrain: false,
        color: getRecoveryColor(0),
      };
    } else {
      predictedRecovery[muscle] = current;
    }
  });

  return predictedRecovery;
};

/**
 * Get recommended intensity based on recovery
 */
export const getRecommendedIntensity = (recoveryScore) => {
  if (recoveryScore >= 90) return { level: 'high', maxIntensity: 100, label: 'Go all out!' };
  if (recoveryScore >= 70) return { level: 'moderate-high', maxIntensity: 80, label: 'Push yourself' };
  if (recoveryScore >= 50) return { level: 'moderate', maxIntensity: 60, label: 'Moderate effort' };
  if (recoveryScore >= 30) return { level: 'light', maxIntensity: 40, label: 'Take it easy' };
  return { level: 'rest', maxIntensity: 0, label: 'Rest recommended' };
};

/**
 * Format recovery time for display
 */
export const formatRecoveryTime = (hours) => {
  if (hours <= 0) return 'Ready';
  if (hours < 1) return 'Less than 1 hour';
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = Math.round(hours / 24 * 10) / 10;
  return `${days} day${days !== 1 ? 's' : ''}`;
};

/**
 * Get muscle display name
 */
export const getMuscleDisplayName = (muscle) => {
  const names = {
    [MuscleGroups.CHEST]: 'Chest',
    [MuscleGroups.BACK]: 'Back',
    [MuscleGroups.SHOULDERS]: 'Shoulders',
    [MuscleGroups.BICEPS]: 'Biceps',
    [MuscleGroups.TRICEPS]: 'Triceps',
    [MuscleGroups.QUADRICEPS]: 'Quadriceps',
    [MuscleGroups.HAMSTRINGS]: 'Hamstrings',
    [MuscleGroups.GLUTES]: 'Glutes',
    [MuscleGroups.CALVES]: 'Calves',
    [MuscleGroups.CORE]: 'Core',
  };
  return names[muscle] || muscle;
};

export default {
  calculateAllMuscleRecovery,
  getMusclesByRecoveryPriority,
  getTrainableMuscles,
  getMusclesNeedingRest,
  calculateWorkoutImpact,
  predictPostWorkoutRecovery,
  getRecommendedIntensity,
  formatRecoveryTime,
  getMuscleDisplayName,
};
