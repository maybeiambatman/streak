// FitStreak Adaptive Difficulty Engine
// Adjusts workout difficulty based on user consistency and performance

import { calculateConsistencyScore } from '../utils/calculations';
import { getDaysAgo, getDateKey, getDaysBetween } from '../utils/dateHelpers';

// Difficulty levels with their configurations
export const DIFFICULTY_LEVELS = {
  struggling: {
    name: 'Struggling',
    description: 'Focus on building the habit',
    setMultiplier: 0.6,
    exerciseLimit: 4,
    durationTarget: 15,
    message: 'Just showing up is winning. Keep it simple!',
    color: '#FFC107', // Yellow
  },
  building: {
    name: 'Building',
    description: 'Developing consistency',
    setMultiplier: 0.8,
    exerciseLimit: 5,
    durationTarget: 25,
    message: 'You\'re building momentum. Stay steady!',
    color: '#FF9800', // Orange
  },
  consistent: {
    name: 'Consistent',
    description: 'On track for results',
    setMultiplier: 1.0,
    exerciseLimit: 7,
    durationTarget: 35,
    message: 'Great consistency! Time to push harder.',
    color: '#4CAF50', // Green
  },
  crushing: {
    name: 'Crushing It',
    description: 'Peak performance mode',
    setMultiplier: 1.2,
    exerciseLimit: 8,
    durationTarget: 45,
    message: 'Beast mode unlocked! Let\'s go!',
    color: '#FF6B35', // Primary orange
  },
};

// Calculate user's difficulty level based on recent performance
export const calculateDifficultyLevel = (workouts, periodDays = 14) => {
  const recentWorkouts = getRecentWorkouts(workouts, periodDays);
  const consistencyScore = calculateConsistencyScore(recentWorkouts, 4, periodDays);

  return getDifficultyFromScore(consistencyScore);
};

// Get difficulty level from consistency score
export const getDifficultyFromScore = (consistencyScore) => {
  if (consistencyScore < 50) return 'struggling';
  if (consistencyScore < 75) return 'building';
  if (consistencyScore < 90) return 'consistent';
  return 'crushing';
};

// Get configuration for difficulty level
export const getDifficultyConfig = (level) => {
  return DIFFICULTY_LEVELS[level] || DIFFICULTY_LEVELS.building;
};

// Filter workouts from recent period
export const getRecentWorkouts = (workouts, days = 14) => {
  const cutoff = getDaysAgo(days);

  return workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= cutoff;
  });
};

// Analyze workout completion patterns
export const analyzeCompletionPatterns = (workouts) => {
  if (workouts.length < 5) {
    return { hasEnoughData: false };
  }

  const recentWorkouts = getRecentWorkouts(workouts, 30);

  // Analyze workout rating patterns
  const ratings = recentWorkouts
    .filter(w => w.rating)
    .map(w => w.rating);

  const tooHardCount = ratings.filter(r => r === 'too_hard').length;
  const tooEasyCount = ratings.filter(r => r === 'too_easy').length;
  const justRightCount = ratings.filter(r => r === 'just_right').length;

  // Analyze exercise completion
  const completionRates = recentWorkouts.map(workout => {
    const totalSets = workout.exercises.reduce((sum, ex) =>
      sum + (ex.suggestedSets || ex.sets?.length || 0), 0);
    const completedSets = workout.exercises.reduce((sum, ex) =>
      sum + (ex.sets?.filter(s => s.completed)?.length || 0), 0);

    return totalSets > 0 ? completedSets / totalSets : 1;
  });

  const avgCompletionRate = completionRates.reduce((a, b) => a + b, 0) / completionRates.length;

  // Analyze skipped exercises
  const skippedExercises = recentWorkouts.reduce((count, workout) => {
    return count + workout.exercises.filter(ex =>
      !ex.sets || ex.sets.length === 0 || ex.sets.every(s => !s.completed)
    ).length;
  }, 0);

  return {
    hasEnoughData: true,
    tooHardRate: tooHardCount / ratings.length || 0,
    tooEasyRate: tooEasyCount / ratings.length || 0,
    justRightRate: justRightCount / ratings.length || 0,
    avgCompletionRate,
    totalSkippedExercises: skippedExercises,
    avgSkippedPerWorkout: skippedExercises / recentWorkouts.length,
  };
};

// Determine if difficulty should be adjusted
export const shouldAdjustDifficulty = (patterns, currentLevel) => {
  if (!patterns.hasEnoughData) {
    return { shouldAdjust: false, reason: 'Not enough data' };
  }

  // Too many workouts rated as hard
  if (patterns.tooHardRate > 0.4) {
    return {
      shouldAdjust: true,
      direction: 'decrease',
      reason: 'Workouts are consistently too challenging',
    };
  }

  // Too many workouts rated as easy
  if (patterns.tooEasyRate > 0.5 && currentLevel !== 'crushing') {
    return {
      shouldAdjust: true,
      direction: 'increase',
      reason: 'Ready for more challenge',
    };
  }

  // Low completion rate
  if (patterns.avgCompletionRate < 0.7) {
    return {
      shouldAdjust: true,
      direction: 'decrease',
      reason: 'Exercise completion rate is low',
    };
  }

  // High completion rate with easy ratings
  if (patterns.avgCompletionRate > 0.95 && patterns.tooEasyRate > 0.3) {
    return {
      shouldAdjust: true,
      direction: 'increase',
      reason: 'Completing everything easily',
    };
  }

  return { shouldAdjust: false, reason: 'Difficulty is appropriate' };
};

// Get suggested adjustments based on patterns
export const getSuggestedAdjustments = (workouts, currentSettings) => {
  const patterns = analyzeCompletionPatterns(workouts);
  const difficultyLevel = calculateDifficultyLevel(workouts);
  const adjustment = shouldAdjustDifficulty(patterns, difficultyLevel);

  const suggestions = [];

  if (adjustment.shouldAdjust) {
    if (adjustment.direction === 'decrease') {
      suggestions.push({
        type: 'reduce_volume',
        title: 'Reduce Workout Volume',
        description: 'Try shorter workouts to build consistency',
        action: { workoutDuration: Math.max(15, currentSettings.workoutDuration - 10) },
      });
    } else {
      suggestions.push({
        type: 'increase_volume',
        title: 'Increase Challenge',
        description: 'You\'re ready for more! Let\'s add some volume.',
        action: { workoutDuration: Math.min(60, currentSettings.workoutDuration + 10) },
      });
    }
  }

  // Suggest variety if same muscles are overworked
  if (patterns.hasEnoughData) {
    const recentMuscles = getRecentWorkouts(workouts, 7)
      .flatMap(w => w.targetMuscles || []);

    const muscleCounts = recentMuscles.reduce((acc, muscle) => {
      acc[muscle] = (acc[muscle] || 0) + 1;
      return acc;
    }, {});

    const overworkedMuscles = Object.entries(muscleCounts)
      .filter(([_, count]) => count >= 4)
      .map(([muscle]) => muscle);

    if (overworkedMuscles.length > 0) {
      suggestions.push({
        type: 'balance',
        title: 'Balance Your Training',
        description: `${overworkedMuscles.join(', ')} might need more rest`,
        muscles: overworkedMuscles,
      });
    }
  }

  return {
    currentLevel: difficultyLevel,
    config: getDifficultyConfig(difficultyLevel),
    patterns,
    suggestions,
    adjustment,
  };
};

// Get motivational message based on recent activity
export const getMotivationalMessage = (workouts, streak) => {
  const recentWorkouts = getRecentWorkouts(workouts, 7);
  const difficultyLevel = calculateDifficultyLevel(workouts);

  // Streak-based messages
  if (streak >= 7) {
    return {
      message: `${streak} days strong! You're unstoppable!`,
      type: 'streak',
    };
  }

  // Activity-based messages
  if (recentWorkouts.length === 0) {
    return {
      message: 'Ready to get back at it? A quick workout is waiting!',
      type: 'comeback',
    };
  }

  if (recentWorkouts.length >= 5) {
    return {
      message: 'Incredible week! Your consistency is paying off.',
      type: 'success',
    };
  }

  // Difficulty-based messages
  const config = getDifficultyConfig(difficultyLevel);
  return {
    message: config.message,
    type: difficultyLevel,
  };
};

// Calculate streak shield status
export const getStreakShieldStatus = (currentShields, streak) => {
  const maxShields = 2;
  const daysPerShield = 7;

  // Calculate when next shield is earned
  const daysUntilNextShield = daysPerShield - (streak % daysPerShield);

  return {
    currentShields,
    maxShields,
    daysUntilNextShield: currentShields < maxShields ? daysUntilNextShield : null,
    canEarnMore: currentShields < maxShields,
    message: currentShields > 0
      ? `${currentShields} streak shield${currentShields > 1 ? 's' : ''} available`
      : 'No shields - maintain your streak!',
  };
};

export default {
  DIFFICULTY_LEVELS,
  calculateDifficultyLevel,
  getDifficultyFromScore,
  getDifficultyConfig,
  getRecentWorkouts,
  analyzeCompletionPatterns,
  shouldAdjustDifficulty,
  getSuggestedAdjustments,
  getMotivationalMessage,
  getStreakShieldStatus,
};
