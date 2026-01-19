// GainStreak Calculation Utilities

import { differenceInDays, differenceInHours, startOfDay, isToday, isYesterday } from 'date-fns';
import { BaseRecoveryDays } from '../types';

/**
 * Calculate recovery score for a muscle group
 * Uses exponential back-off based on muscle group, intensity, and user age
 */
export const calculateRecoveryScore = (
  muscleGroup,
  lastTrainedDate,
  intensity,
  userAge = 25
) => {
  if (!lastTrainedDate) return 100;

  const now = new Date();
  const trainedDate = new Date(lastTrainedDate);
  const daysSinceTraining = differenceInHours(now, trainedDate) / 24;

  // Base recovery time for muscle group
  const baseRecoveryDays = BaseRecoveryDays[muscleGroup] || 2;

  // Intensity multiplier (higher intensity = longer recovery)
  const intensityMultiplier = 1 + (intensity / 100) * 0.5;

  // Age multiplier (older = longer recovery)
  let ageMultiplier = 1;
  if (userAge > 40) ageMultiplier = 1.2;
  else if (userAge > 30) ageMultiplier = 1.1;

  // Calculate required recovery days
  const requiredRecoveryDays = baseRecoveryDays * intensityMultiplier * ageMultiplier;

  // Calculate recovery percentage (0-100)
  const recoveryPercentage = Math.min(100, (daysSinceTraining / requiredRecoveryDays) * 100);

  return Math.round(recoveryPercentage);
};

/**
 * Calculate workout intensity from exercise logs
 * Based on volume comparison to user baseline
 */
export const calculateIntensity = (exerciseLogs, userBaseline = {}) => {
  if (!exerciseLogs || exerciseLogs.length === 0) return 50;

  let totalVolumeScore = 0;
  let exerciseCount = 0;

  for (const log of exerciseLogs) {
    const baseline = userBaseline[log.exerciseId];

    // Calculate volume (sets x reps x weight)
    const totalVolume = log.sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
    const totalSets = log.sets.length;

    if (baseline && baseline.typicalVolume > 0) {
      // Compare to user's typical volume
      const volumeRatio = totalVolume / baseline.typicalVolume;
      const setsRatio = totalSets / (baseline.typicalSets || totalSets);

      // Factor in RPE if provided
      const avgRPE = log.sets.reduce((sum, set) => sum + (set.rpe || 7), 0) / log.sets.length;
      const rpeMultiplier = avgRPE / 7;

      totalVolumeScore += volumeRatio * setsRatio * rpeMultiplier;
    } else {
      // No baseline, assume moderate intensity
      totalVolumeScore += 1;
    }
    exerciseCount++;
  }

  // Normalize to 0-100 scale
  const avgScore = exerciseCount > 0 ? totalVolumeScore / exerciseCount : 0.5;
  return Math.min(100, Math.max(0, avgScore * 50));
};

/**
 * Calculate current streak from workout history
 */
export const calculateStreak = (workoutLogs) => {
  if (!workoutLogs || workoutLogs.length === 0) return 0;

  // Sort by date descending
  const sortedLogs = [...workoutLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const today = startOfDay(new Date());
  let streak = 0;
  let currentDate = today;

  // Check if there's a workout today or yesterday to start the streak
  const mostRecentWorkout = new Date(sortedLogs[0].date);
  if (!isToday(mostRecentWorkout) && !isYesterday(mostRecentWorkout)) {
    return 0;
  }

  // Get unique workout dates
  const workoutDates = new Set(
    sortedLogs.map(log => startOfDay(new Date(log.date)).toISOString())
  );

  // Count consecutive days
  while (true) {
    const dateStr = currentDate.toISOString();
    if (workoutDates.has(dateStr)) {
      streak++;
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (streak === 0) {
      // Check yesterday if no workout today
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() - 1);
      if (!workoutDates.has(currentDate.toISOString())) {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Check if streak is at risk (no workout today and had one yesterday)
 */
export const isStreakAtRisk = (lastWorkoutDate) => {
  if (!lastWorkoutDate) return false;
  const lastWorkout = new Date(lastWorkoutDate);
  return isYesterday(lastWorkout) && !isToday(lastWorkout);
};

/**
 * Calculate XP earned from a workout
 */
export const calculateWorkoutXP = (workout, streakDays = 0, bonuses = {}) => {
  let totalXP = 0;
  const breakdown = [];

  // Base XP for completing workout
  const baseXP = 100;
  totalXP += baseXP;
  breakdown.push({ label: 'Workout Complete', xp: baseXP });

  // XP per exercise
  const exerciseCount = workout.exercises?.length || 0;
  const exerciseXP = exerciseCount * 15;
  totalXP += exerciseXP;
  breakdown.push({ label: `${exerciseCount} Exercises`, xp: exerciseXP });

  // XP per set completed
  const totalSets = workout.exercises?.reduce(
    (sum, ex) => sum + (ex.sets?.filter(s => s.completed)?.length || 0),
    0
  ) || 0;
  const setXP = totalSets * 5;
  totalXP += setXP;
  breakdown.push({ label: `${totalSets} Sets`, xp: setXP });

  // Streak bonus (capped at 50)
  const streakBonus = Math.min(streakDays * 5, 50);
  if (streakBonus > 0) {
    totalXP += streakBonus;
    breakdown.push({ label: `${streakDays} Day Streak`, xp: streakBonus });
  }

  // Personal records bonus
  if (bonuses.newPRs && bonuses.newPRs > 0) {
    const prXP = bonuses.newPRs * 25;
    totalXP += prXP;
    breakdown.push({ label: `${bonuses.newPRs} New PR${bonuses.newPRs > 1 ? 's' : ''}`, xp: prXP });
  }

  return { total: totalXP, breakdown };
};

/**
 * Calculate level from total XP
 */
export const calculateLevel = (totalXP) => {
  // Each level requires progressively more XP
  // Level 1: 0 XP, Level 2: 500 XP, Level 3: 1200 XP, etc.
  let level = 1;
  let xpRequired = 0;

  while (totalXP >= xpRequired) {
    level++;
    xpRequired += level * 250;
  }

  return level - 1;
};

/**
 * Get XP required for next level
 */
export const getXPForNextLevel = (currentLevel) => {
  let totalXP = 0;
  for (let i = 2; i <= currentLevel + 1; i++) {
    totalXP += i * 250;
  }
  return totalXP;
};

/**
 * Get XP progress towards next level
 */
export const getLevelProgress = (totalXP) => {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = getXPForNextLevel(currentLevel - 1) || 0;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;

  return {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForLevel,
    progressPercent: (xpInCurrentLevel / xpNeededForLevel) * 100,
  };
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format weight with unit
 */
export const formatWeight = (weight, unit = 'kg') => {
  return `${weight} ${unit}`;
};

/**
 * Convert weight between units
 */
export const convertWeight = (weight, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === 'kg' && toUnit === 'lbs') return Math.round(weight * 2.205);
  if (fromUnit === 'lbs' && toUnit === 'kg') return Math.round(weight / 2.205);
  return weight;
};
