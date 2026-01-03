// FitStreak Progression Engine
// Handles progressive overload suggestions and PR tracking

import { calculate1RM, calculateWeightForReps, roundToIncrement } from '../utils/calculations';
import { EXERCISES } from '../data/exercises';

// Progression strategies
export const PROGRESSION_STRATEGIES = {
  weight: {
    name: 'Add Weight',
    description: 'Increase weight while maintaining reps',
    increments: {
      light: 2.5, // For weights under 50
      moderate: 5, // For weights 50-100
      heavy: 10, // For weights over 100
    },
  },
  reps: {
    name: 'Add Reps',
    description: 'Increase reps before adding weight',
    increment: 1,
    maxBeforeWeightIncrease: 12,
  },
  sets: {
    name: 'Add Sets',
    description: 'Increase total volume with more sets',
    increment: 1,
    maxSets: 5,
  },
  double: {
    name: 'Double Progression',
    description: 'Add reps until ceiling, then add weight and reset reps',
    repRange: { min: 8, max: 12 },
    weightIncrement: 5,
  },
};

// Get exercise history for a specific exercise
export const getExerciseHistory = (workouts, exerciseId) => {
  const history = [];

  workouts.forEach(workout => {
    const exercise = workout.exercises?.find(e => e.exerciseId === exerciseId);
    if (exercise && exercise.sets?.length > 0) {
      const completedSets = exercise.sets.filter(s => s.completed);
      if (completedSets.length > 0) {
        history.push({
          date: workout.date,
          sets: completedSets,
          bestSet: getBestSet(completedSets),
          totalVolume: calculateSetVolume(completedSets),
        });
      }
    }
  });

  // Sort by date descending
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get best set from a list (highest weight × reps)
export const getBestSet = (sets) => {
  if (!sets || sets.length === 0) return null;

  return sets.reduce((best, set) => {
    const setScore = set.weight * set.reps;
    const bestScore = best.weight * best.reps;
    return setScore > bestScore ? set : best;
  });
};

// Calculate total volume from sets
export const calculateSetVolume = (sets) => {
  return sets.reduce((total, set) => {
    return total + (set.weight * set.reps);
  }, 0);
};

// Suggest progression for next workout
export const suggestProgression = (exerciseId, workoutHistory, personalRecords) => {
  const history = getExerciseHistory(workoutHistory, exerciseId);
  const exercise = EXERCISES[exerciseId];
  const currentPR = personalRecords?.[exerciseId];

  // Not enough history
  if (history.length === 0) {
    return {
      strategy: 'start',
      message: 'Start with a weight you can control for 8-10 reps',
      suggestedWeight: 0,
      suggestedReps: exercise?.defaultReps || '8-10',
      suggestedSets: exercise?.defaultSets || 3,
    };
  }

  const lastSession = history[0];
  const lastBest = lastSession.bestSet;

  // Check if all sets hit target reps
  const targetReps = parseInt(exercise?.defaultReps) || 10;
  const allSetsHitTarget = lastSession.sets.every(s => s.reps >= targetReps);
  const avgReps = lastSession.sets.reduce((sum, s) => sum + s.reps, 0) / lastSession.sets.length;

  // Use double progression strategy
  if (allSetsHitTarget) {
    // Ready to increase weight
    const increment = lastBest.weight < 50 ? 2.5 : 5;
    const newWeight = roundToIncrement(lastBest.weight + increment, increment);

    return {
      strategy: 'increase_weight',
      message: `Great progress! Increase to ${newWeight} lbs`,
      suggestedWeight: newWeight,
      suggestedReps: PROGRESSION_STRATEGIES.double.repRange.min,
      suggestedSets: exercise?.defaultSets || 3,
      previousWeight: lastBest.weight,
      previousReps: lastBest.reps,
    };
  }

  if (avgReps < targetReps - 2) {
    // Struggling - consider decreasing weight
    const decrement = lastBest.weight < 50 ? 2.5 : 5;
    const newWeight = Math.max(0, roundToIncrement(lastBest.weight - decrement, decrement));

    return {
      strategy: 'decrease_weight',
      message: `Let's build up. Try ${newWeight} lbs`,
      suggestedWeight: newWeight,
      suggestedReps: targetReps,
      suggestedSets: exercise?.defaultSets || 3,
      previousWeight: lastBest.weight,
      previousReps: lastBest.reps,
    };
  }

  // Stay the same - aim for more reps
  return {
    strategy: 'same_weight',
    message: `Stay at ${lastBest.weight} lbs, aim for ${targetReps} reps`,
    suggestedWeight: lastBest.weight,
    suggestedReps: targetReps,
    suggestedSets: exercise?.defaultSets || 3,
    previousWeight: lastBest.weight,
    previousReps: lastBest.reps,
  };
};

// Check if a set is a new PR
export const checkForPR = (exerciseId, set, personalRecords) => {
  const currentPR = personalRecords?.[exerciseId];

  if (!currentPR) {
    // First time - it's a PR!
    return {
      isPR: true,
      type: 'first',
      message: 'First PR for this exercise!',
    };
  }

  const currentVolume = currentPR.weight * currentPR.reps;
  const newVolume = set.weight * set.reps;

  if (newVolume > currentVolume) {
    return {
      isPR: true,
      type: 'volume',
      message: 'New volume PR!',
      improvement: ((newVolume - currentVolume) / currentVolume * 100).toFixed(1),
    };
  }

  if (set.weight > currentPR.weight) {
    return {
      isPR: true,
      type: 'weight',
      message: 'New weight PR!',
      improvement: set.weight - currentPR.weight,
    };
  }

  if (set.weight === currentPR.weight && set.reps > currentPR.reps) {
    return {
      isPR: true,
      type: 'reps',
      message: 'New rep PR at this weight!',
      improvement: set.reps - currentPR.reps,
    };
  }

  return { isPR: false };
};

// Calculate estimated 1RM from set
export const getEstimated1RM = (weight, reps) => {
  return calculate1RM(weight, reps);
};

// Get strength level comparison
export const getStrengthLevel = (exerciseId, oneRM, bodyweight = 150) => {
  // Simplified strength standards (relative to bodyweight)
  const standards = {
    bench_press: { beginner: 0.5, intermediate: 1.0, advanced: 1.5, elite: 2.0 },
    squat: { beginner: 0.75, intermediate: 1.25, advanced: 1.75, elite: 2.5 },
    deadlifts: { beginner: 1.0, intermediate: 1.5, advanced: 2.0, elite: 3.0 },
    overhead_press: { beginner: 0.35, intermediate: 0.65, advanced: 1.0, elite: 1.35 },
  };

  const exerciseStandards = standards[exerciseId];
  if (!exerciseStandards) return null;

  const ratio = oneRM / bodyweight;

  if (ratio >= exerciseStandards.elite) return 'Elite';
  if (ratio >= exerciseStandards.advanced) return 'Advanced';
  if (ratio >= exerciseStandards.intermediate) return 'Intermediate';
  if (ratio >= exerciseStandards.beginner) return 'Beginner';
  return 'Novice';
};

// Get progression timeline (estimated weeks to reach goal)
export const estimateProgressionTimeline = (currentWeight, goalWeight, weeklyIncrease = 2.5) => {
  if (currentWeight >= goalWeight) return 0;

  const totalIncrease = goalWeight - currentWeight;
  const weeks = Math.ceil(totalIncrease / weeklyIncrease);

  return weeks;
};

// Analyze exercise trends
export const analyzeExerciseTrends = (workouts, exerciseId) => {
  const history = getExerciseHistory(workouts, exerciseId);

  if (history.length < 3) {
    return { hasEnoughData: false };
  }

  // Get best weights over time
  const progression = history.map(session => ({
    date: session.date,
    bestWeight: session.bestSet.weight,
    bestVolume: session.bestSet.weight * session.bestSet.reps,
    estimated1RM: calculate1RM(session.bestSet.weight, session.bestSet.reps),
  }));

  // Calculate trends
  const recentAvg = progression.slice(0, 3).reduce((sum, p) => sum + p.bestWeight, 0) / 3;
  const olderAvg = progression.slice(-3).reduce((sum, p) => sum + p.bestWeight, 0) / 3;

  const trend = recentAvg > olderAvg ? 'increasing' : recentAvg < olderAvg ? 'decreasing' : 'stable';
  const changePercent = ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1);

  return {
    hasEnoughData: true,
    progression,
    trend,
    changePercent,
    sessions: history.length,
    bestEver: Math.max(...progression.map(p => p.bestWeight)),
    currentBest: progression[0].bestWeight,
  };
};

export default {
  PROGRESSION_STRATEGIES,
  getExerciseHistory,
  getBestSet,
  calculateSetVolume,
  suggestProgression,
  checkForPR,
  getEstimated1RM,
  getStrengthLevel,
  estimateProgressionTimeline,
  analyzeExerciseTrends,
};
