// FitStreak Recovery Calculator
// Calculates muscle recovery status based on workout history

import { MUSCLE_GROUPS, INTENSITY_FACTORS, VOLUME_FACTORS } from '../data/muscles';
import { getHoursSince } from '../utils/dateHelpers';

// Calculate recovery percentage for a single muscle
export const calculateMuscleRecovery = (muscle, muscleId) => {
  // If never trained, fully recovered
  if (!muscle.lastTrained) {
    return 100;
  }

  const muscleConfig = MUSCLE_GROUPS[muscleId];
  if (!muscleConfig) {
    return 100;
  }

  const hoursSince = getHoursSince(muscle.lastTrained);
  const baseRecoveryHours = muscleConfig.baseRecoveryHours || 48;

  // Apply intensity multiplier
  const intensityMultiplier = INTENSITY_FACTORS[muscle.lastIntensity] || 1.0;

  // Apply volume multiplier if available
  const volumeMultiplier = VOLUME_FACTORS[muscle.lastVolume] || 1.0;

  // Total recovery time needed
  const recoveryNeeded = baseRecoveryHours * intensityMultiplier * volumeMultiplier;

  // Calculate percentage recovered
  const recoveryPercent = Math.min(100, (hoursSince / recoveryNeeded) * 100);

  return Math.round(recoveryPercent);
};

// Calculate recovery for all muscles
export const calculateAllMuscleRecovery = (muscleStatus) => {
  if (!muscleStatus || !muscleStatus.muscles) {
    return {};
  }

  const recovery = {};

  Object.keys(muscleStatus.muscles).forEach(muscleId => {
    const muscle = muscleStatus.muscles[muscleId];
    recovery[muscleId] = calculateMuscleRecovery(muscle, muscleId);
  });

  return recovery;
};

// Get estimated time until fully recovered
export const getTimeUntilRecovered = (muscle, muscleId, targetPercent = 100) => {
  if (!muscle.lastTrained) {
    return 0; // Already recovered
  }

  const muscleConfig = MUSCLE_GROUPS[muscleId];
  if (!muscleConfig) {
    return 0;
  }

  const hoursSince = getHoursSince(muscle.lastTrained);
  const baseRecoveryHours = muscleConfig.baseRecoveryHours || 48;
  const intensityMultiplier = INTENSITY_FACTORS[muscle.lastIntensity] || 1.0;

  const totalRecoveryHours = baseRecoveryHours * intensityMultiplier;
  const targetHours = (targetPercent / 100) * totalRecoveryHours;

  const hoursRemaining = Math.max(0, targetHours - hoursSince);

  return Math.round(hoursRemaining);
};

// Get recovery status label
export const getRecoveryStatusLabel = (percentage) => {
  if (percentage >= 70) return 'Fresh';
  if (percentage >= 40) return 'Recovered';
  if (percentage >= 20) return 'Recovering';
  return 'Needs Rest';
};

// Get recovery category for filtering
export const getRecoveryCategory = (percentage) => {
  if (percentage >= 70) return 'fresh';
  if (percentage >= 40) return 'recovered';
  if (percentage >= 20) return 'recovering';
  return 'needsRest';
};

// Check if muscle is ready for training
export const isMuscleReadyForTraining = (percentage, intensity = 'moderate') => {
  const thresholds = {
    light: 20,    // Can do light work if at least 20%
    moderate: 40, // Need at least 40% for moderate
    heavy: 70,    // Need at least 70% for heavy
    extreme: 85,  // Need at least 85% for max effort
  };

  return percentage >= (thresholds[intensity] || 40);
};

// Get recommended intensity based on recovery
export const getRecommendedIntensity = (percentage) => {
  if (percentage >= 85) return 'heavy';
  if (percentage >= 70) return 'moderate';
  if (percentage >= 40) return 'light';
  return 'rest'; // Should not train
};

// Sort muscles by priority (lowest recovery first, within trainable range)
export const getMusclesByPriority = (muscleStatus, minRecovery = 40) => {
  const recovery = calculateAllMuscleRecovery(muscleStatus);

  return Object.entries(recovery)
    .filter(([_, percent]) => percent >= minRecovery)
    .sort((a, b) => a[1] - b[1]) // Lowest recovery first (needs training most)
    .map(([muscleId, percent]) => ({
      muscleId,
      recovery: percent,
      status: getRecoveryStatusLabel(percent),
      recommendedIntensity: getRecommendedIntensity(percent),
    }));
};

// Get muscles grouped by category with recovery status
export const getMusclesByCategory = (muscleStatus) => {
  const recovery = calculateAllMuscleRecovery(muscleStatus);

  return {
    upper: Object.entries(recovery)
      .filter(([id]) => ['chest', 'back', 'shoulders', 'biceps', 'triceps'].includes(id))
      .map(([id, percent]) => ({ muscleId: id, recovery: percent })),

    core: Object.entries(recovery)
      .filter(([id]) => ['abs', 'obliques', 'lowerBack'].includes(id))
      .map(([id, percent]) => ({ muscleId: id, recovery: percent })),

    lower: Object.entries(recovery)
      .filter(([id]) => ['quadriceps', 'hamstrings', 'glutes', 'calves'].includes(id))
      .map(([id, percent]) => ({ muscleId: id, recovery: percent })),
  };
};

// Calculate impact of a workout on muscle recovery
export const calculateWorkoutImpact = (exercises, intensity = 'moderate') => {
  const impact = {};

  exercises.forEach(exercise => {
    // Primary muscles get full impact
    exercise.primaryMuscles?.forEach(muscleId => {
      impact[muscleId] = {
        recoveryDrop: 100, // Fully depletes
        intensity,
        isPrimary: true,
      };
    });

    // Secondary muscles get partial impact
    exercise.secondaryMuscles?.forEach(muscleId => {
      if (!impact[muscleId]) {
        impact[muscleId] = {
          recoveryDrop: 40, // Partial depletion
          intensity: intensity === 'heavy' ? 'moderate' : 'light',
          isPrimary: false,
        };
      }
    });
  });

  return impact;
};

// Predict recovery status after workout
export const predictPostWorkoutRecovery = (muscleStatus, exercises, intensity) => {
  const currentRecovery = calculateAllMuscleRecovery(muscleStatus);
  const impact = calculateWorkoutImpact(exercises, intensity);

  const predicted = { ...currentRecovery };

  Object.entries(impact).forEach(([muscleId, impactData]) => {
    predicted[muscleId] = Math.max(0, predicted[muscleId] - impactData.recoveryDrop);
  });

  return predicted;
};

export default {
  calculateMuscleRecovery,
  calculateAllMuscleRecovery,
  getTimeUntilRecovered,
  getRecoveryStatusLabel,
  getRecoveryCategory,
  isMuscleReadyForTraining,
  getRecommendedIntensity,
  getMusclesByPriority,
  getMusclesByCategory,
  calculateWorkoutImpact,
  predictPostWorkoutRecovery,
};
