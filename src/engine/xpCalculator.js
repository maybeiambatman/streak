// FitStreak XP Calculator
// Handles XP earning, leveling, and related rewards

import { xpForLevel, levelFromXP, xpProgressToNextLevel } from '../utils/calculations';

// XP earning rates
export const XP_RATES = {
  workoutComplete: 100,      // Base XP for completing any workout
  perExercise: 20,           // Per exercise completed
  perSet: 5,                 // Per set completed
  personalRecord: 50,        // For hitting a PR
  fullRecovery: 25,          // All muscles were recovered
  streakBonus: 10,           // Per day of streak (caps at 100)
  streakBonusCap: 100,       // Max streak bonus
  weeklyConsistency: 200,    // Bonus for 5+ workouts in a week
  perfectWeek: 400,          // All 7 days
  levelUp: 100,              // Bonus XP for leveling up
  achievementBonus: 50,      // When unlocking achievement (in addition to achievement XP)
};

// Calculate XP earned from a workout
export const calculateWorkoutXP = (workout, streak = 0, options = {}) => {
  const {
    allMusclesRecovered = false,
    newPRs = 0,
    isConsistencyBonus = false,
    isPerfectWeek = false,
  } = options;

  let totalXP = 0;
  const breakdown = [];

  // Base completion XP
  totalXP += XP_RATES.workoutComplete;
  breakdown.push({ label: 'Workout Complete', xp: XP_RATES.workoutComplete });

  // Exercise XP
  const exerciseCount = workout.exercises?.length || 0;
  const exerciseXP = exerciseCount * XP_RATES.perExercise;
  totalXP += exerciseXP;
  breakdown.push({ label: `${exerciseCount} Exercises`, xp: exerciseXP });

  // Set XP
  const totalSets = workout.exercises?.reduce((sum, ex) => {
    return sum + (ex.sets?.filter(s => s.completed)?.length || 0);
  }, 0) || 0;
  const setsXP = totalSets * XP_RATES.perSet;
  totalXP += setsXP;
  breakdown.push({ label: `${totalSets} Sets`, xp: setsXP });

  // Streak bonus
  if (streak > 0) {
    const streakXP = Math.min(streak * XP_RATES.streakBonus, XP_RATES.streakBonusCap);
    totalXP += streakXP;
    breakdown.push({ label: `${streak} Day Streak`, xp: streakXP });
  }

  // PR bonus
  if (newPRs > 0) {
    const prXP = newPRs * XP_RATES.personalRecord;
    totalXP += prXP;
    breakdown.push({ label: `${newPRs} Personal Record${newPRs > 1 ? 's' : ''}`, xp: prXP });
  }

  // Full recovery bonus
  if (allMusclesRecovered) {
    totalXP += XP_RATES.fullRecovery;
    breakdown.push({ label: 'Full Recovery Bonus', xp: XP_RATES.fullRecovery });
  }

  // Weekly consistency bonus
  if (isConsistencyBonus) {
    totalXP += XP_RATES.weeklyConsistency;
    breakdown.push({ label: 'Weekly Consistency', xp: XP_RATES.weeklyConsistency });
  }

  // Perfect week bonus
  if (isPerfectWeek) {
    totalXP += XP_RATES.perfectWeek;
    breakdown.push({ label: 'Perfect Week', xp: XP_RATES.perfectWeek });
  }

  return {
    total: totalXP,
    breakdown,
  };
};

// Check if user leveled up
export const checkLevelUp = (previousXP, newXP) => {
  const previousLevel = levelFromXP(previousXP);
  const newLevel = levelFromXP(newXP);

  if (newLevel > previousLevel) {
    return {
      leveledUp: true,
      previousLevel,
      newLevel,
      levelsGained: newLevel - previousLevel,
    };
  }

  return {
    leveledUp: false,
    currentLevel: previousLevel,
  };
};

// Get XP status for display
export const getXPStatus = (totalXP) => {
  const level = levelFromXP(totalXP);
  const progress = xpProgressToNextLevel(totalXP);

  return {
    level,
    totalXP,
    currentLevelXP: progress.currentXP,
    xpToNextLevel: progress.neededXP,
    progressPercent: progress.progress,
    xpForCurrentLevel: xpForLevel(level),
    xpForNextLevel: xpForLevel(level + 1),
  };
};

// Get level title/rank
export const getLevelTitle = (level) => {
  if (level >= 50) return 'Legendary';
  if (level >= 40) return 'Master';
  if (level >= 30) return 'Expert';
  if (level >= 25) return 'Champion';
  if (level >= 20) return 'Veteran';
  if (level >= 15) return 'Dedicated';
  if (level >= 10) return 'Committed';
  if (level >= 7) return 'Regular';
  if (level >= 5) return 'Active';
  if (level >= 3) return 'Beginner';
  return 'Newcomer';
};

// Get level color
export const getLevelColor = (level) => {
  if (level >= 50) return '#FFD700'; // Gold
  if (level >= 40) return '#9C27B0'; // Purple
  if (level >= 30) return '#FF6B35'; // Orange
  if (level >= 20) return '#2196F3'; // Blue
  if (level >= 10) return '#4CAF50'; // Green
  return '#9E9E9E'; // Gray
};

// Calculate XP needed for specific levels
export const getXPRequirements = (fromLevel, toLevel) => {
  const requirements = [];

  for (let level = fromLevel; level <= toLevel; level++) {
    requirements.push({
      level,
      xpRequired: xpForLevel(level),
      xpToNext: xpForLevel(level + 1) - xpForLevel(level),
    });
  }

  return requirements;
};

// Estimate level based on workout count
export const estimateLevelFromWorkouts = (workoutCount, avgXPPerWorkout = 150) => {
  const estimatedXP = workoutCount * avgXPPerWorkout;
  return levelFromXP(estimatedXP);
};

// Get motivational message based on XP progress
export const getXPMotivation = (progressPercent) => {
  if (progressPercent >= 90) return 'Almost there! One more push!';
  if (progressPercent >= 75) return 'So close to leveling up!';
  if (progressPercent >= 50) return 'Halfway to the next level!';
  if (progressPercent >= 25) return 'Making great progress!';
  return 'Keep going, every workout counts!';
};

export default {
  XP_RATES,
  calculateWorkoutXP,
  checkLevelUp,
  getXPStatus,
  getLevelTitle,
  getLevelColor,
  getXPRequirements,
  estimateLevelFromWorkouts,
  getXPMotivation,
};
