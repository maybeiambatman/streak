// FitStreak Calculation Utilities
// Formulas for 1RM, volume, and other fitness calculations

// Estimated 1RM using Brzycki formula
// Most accurate for reps under 10
export const calculate1RM = (weight, reps) => {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;

  // Brzycki formula: 1RM = weight × (36 / (37 - reps))
  const oneRM = weight * (36 / (37 - reps));
  return Math.round(oneRM * 10) / 10; // Round to 1 decimal
};

// Calculate weight for target reps based on 1RM
export const calculateWeightForReps = (oneRM, targetReps) => {
  if (targetReps <= 0 || oneRM <= 0) return 0;
  if (targetReps === 1) return oneRM;

  // Inverse Brzycki: weight = 1RM × ((37 - reps) / 36)
  const weight = oneRM * ((37 - targetReps) / 36);
  return Math.round(weight / 2.5) * 2.5; // Round to nearest 2.5
};

// Calculate workout volume (sets × reps × weight)
export const calculateVolume = (sets) => {
  return sets.reduce((total, set) => {
    if (set.completed) {
      return total + (set.weight * set.reps);
    }
    return total;
  }, 0);
};

// Calculate total reps from sets
export const calculateTotalReps = (sets) => {
  return sets.reduce((total, set) => {
    return total + (set.completed ? set.reps : 0);
  }, 0);
};

// Calculate total sets completed
export const calculateCompletedSets = (sets) => {
  return sets.filter(set => set.completed).length;
};

// Calculate workout intensity (average percentage of 1RM)
export const calculateIntensity = (exerciseSets, oneRM) => {
  if (!oneRM || oneRM <= 0) return 0;

  const completedSets = exerciseSets.filter(s => s.completed);
  if (completedSets.length === 0) return 0;

  const avgWeight = completedSets.reduce((sum, s) => sum + s.weight, 0) / completedSets.length;
  return Math.round((avgWeight / oneRM) * 100);
};

// Determine intensity level from percentage
export const getIntensityLevel = (intensityPercent) => {
  if (intensityPercent < 60) return 'light';
  if (intensityPercent < 75) return 'moderate';
  if (intensityPercent < 85) return 'heavy';
  return 'extreme';
};

// Calculate progressive overload suggestion
export const suggestProgression = (lastWorkout, targetReps = 8) => {
  if (!lastWorkout || !lastWorkout.sets || lastWorkout.sets.length === 0) {
    return { type: 'start', message: 'Start with a comfortable weight' };
  }

  const completedSets = lastWorkout.sets.filter(s => s.completed);
  if (completedSets.length === 0) {
    return { type: 'same', message: 'Try the same weight again' };
  }

  const lastWeight = completedSets[completedSets.length - 1].weight;
  const lastReps = completedSets[completedSets.length - 1].reps;
  const allSetsHitTarget = completedSets.every(s => s.reps >= targetReps);

  if (allSetsHitTarget) {
    // Successful - suggest increase
    const increase = lastWeight < 50 ? 2.5 : 5;
    return {
      type: 'increase',
      weight: lastWeight + increase,
      message: `Great job! Try ${lastWeight + increase} lbs this time`,
    };
  } else if (lastReps < targetReps - 2) {
    // Struggled significantly - suggest decrease
    const decrease = lastWeight < 50 ? 2.5 : 5;
    return {
      type: 'decrease',
      weight: Math.max(0, lastWeight - decrease),
      message: `Let's build up. Try ${lastWeight - decrease} lbs`,
    };
  } else {
    // Close - stay the same
    return {
      type: 'same',
      weight: lastWeight,
      message: `Stay at ${lastWeight} lbs until you hit all reps`,
    };
  }
};

// Calculate consistency score (0-100)
export const calculateConsistencyScore = (workouts, targetDays = 4, periodDays = 14) => {
  const expectedWorkouts = Math.round((periodDays / 7) * targetDays);
  const actualWorkouts = workouts.length;
  return Math.min(100, Math.round((actualWorkouts / expectedWorkouts) * 100));
};

// Calculate streak from workout dates
export const calculateStreak = (workouts, currentDate = new Date()) => {
  if (!workouts || workouts.length === 0) return 0;

  // Sort workouts by date descending
  const sorted = [...workouts].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // Get unique workout dates
  const workoutDates = [...new Set(sorted.map(w => {
    const date = new Date(w.date);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }))];

  if (workoutDates.length === 0) return 0;

  // Check if most recent workout was today or yesterday
  const today = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  if (workoutDates[0] !== today && workoutDates[0] !== yesterdayStr) {
    return 0; // Streak broken
  }

  let streak = 1;
  let checkDate = new Date(currentDate);

  // If today has no workout, start from yesterday
  if (workoutDates[0] !== today) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count consecutive days
  for (let i = 1; i < 366; i++) { // Max 1 year
    checkDate.setDate(checkDate.getDate() - 1);
    const dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;

    if (workoutDates.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Calculate XP for level
export const xpForLevel = (level) => {
  if (level <= 1) return 0;
  // Exponential growth: each level needs more XP
  // Level 2: 500, Level 3: 1200, Level 4: 2100, Level 5: 3300...
  return Math.floor(200 * level * (level + 0.5));
};

// Calculate level from XP
export const levelFromXP = (totalXP) => {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
};

// Calculate XP progress to next level
export const xpProgressToNextLevel = (totalXP) => {
  const currentLevel = levelFromXP(totalXP);
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);

  const xpIntoLevel = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return {
    currentXP: xpIntoLevel,
    neededXP: xpNeeded,
    progress: Math.round((xpIntoLevel / xpNeeded) * 100),
  };
};

// Round weight to standard increment
export const roundToIncrement = (weight, increment = 2.5) => {
  return Math.round(weight / increment) * increment;
};

// Calculate BMI (for optional tracking)
export const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

// Calculate calories burned estimate (very rough)
export const estimateCaloriesBurned = (durationMinutes, intensity = 'moderate') => {
  const caloriesPerMinute = {
    light: 4,
    moderate: 6,
    heavy: 8,
    extreme: 10,
  };
  return Math.round(durationMinutes * (caloriesPerMinute[intensity] || 6));
};

export default {
  calculate1RM,
  calculateWeightForReps,
  calculateVolume,
  calculateTotalReps,
  calculateCompletedSets,
  calculateIntensity,
  getIntensityLevel,
  suggestProgression,
  calculateConsistencyScore,
  calculateStreak,
  xpForLevel,
  levelFromXP,
  xpProgressToNextLevel,
  roundToIncrement,
  calculateBMI,
  estimateCaloriesBurned,
};
