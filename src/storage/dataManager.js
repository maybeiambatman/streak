// FitStreak Data Manager
// Handles data initialization, migrations, and complex operations

import { v4 as uuidv4 } from 'uuid';
import storage from './asyncStorage';
import { MUSCLE_GROUPS, getAllMuscleIds } from '../data/muscles';
import { calculateStreak, levelFromXP, xpForLevel } from '../utils/calculations';
import { getDateKey, getHoursSince, getDaysAgo } from '../utils/dateHelpers';

// Initialize new user with default data
export const initializeNewUser = async (name = 'Athlete') => {
  const userId = uuidv4();
  const now = new Date().toISOString();

  const user = {
    id: userId,
    name,
    createdAt: now,
    stats: {
      totalWorkouts: 0,
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      streakShields: 0,
      lastWorkoutDate: null,
      totalReps: 0,
      totalVolume: 0,
      uniqueExercises: 0,
      totalPRs: 0,
    },
  };

  const muscleStatus = initializeMuscleStatus(userId);

  await Promise.all([
    storage.setUser(user),
    storage.setMuscleStatus(muscleStatus),
    storage.setWorkouts([]),
    storage.setPersonalRecords({}),
  ]);

  return user;
};

// Initialize muscle status for a user
export const initializeMuscleStatus = (userId) => {
  const muscles = {};

  getAllMuscleIds().forEach(muscleId => {
    muscles[muscleId] = {
      recovery: 100, // Fully recovered initially
      lastTrained: null,
      lastIntensity: null,
      lastExercises: [],
    };
  });

  return {
    userId,
    muscles,
    updatedAt: new Date().toISOString(),
  };
};

// Load all app data
export const loadAppData = async () => {
  const [user, muscleStatus, workouts, personalRecords, achievements, settings] =
    await Promise.all([
      storage.getUser(),
      storage.getMuscleStatus(),
      storage.getWorkouts(),
      storage.getPersonalRecords(),
      storage.getUnlockedAchievements(),
      storage.getSettings(),
    ]);

  return {
    user,
    muscleStatus,
    workouts,
    personalRecords,
    achievements,
    settings,
    isInitialized: !!user,
  };
};

// Update muscle recovery status based on time passed
export const updateMuscleRecovery = async () => {
  const muscleStatus = await storage.getMuscleStatus();
  if (!muscleStatus) return null;

  const now = new Date();
  const updated = { ...muscleStatus };

  Object.keys(updated.muscles).forEach(muscleId => {
    const muscle = updated.muscles[muscleId];
    const muscleConfig = MUSCLE_GROUPS[muscleId];

    if (muscle.lastTrained) {
      const hoursSince = getHoursSince(muscle.lastTrained);
      const baseRecoveryHours = muscleConfig?.baseRecoveryHours || 48;

      // Apply intensity multiplier
      const intensityMultiplier = {
        light: 0.5,
        moderate: 1.0,
        heavy: 1.5,
        extreme: 2.0,
      }[muscle.lastIntensity] || 1.0;

      const recoveryNeeded = baseRecoveryHours * intensityMultiplier;
      const recoveryPercent = Math.min(100, (hoursSince / recoveryNeeded) * 100);

      updated.muscles[muscleId].recovery = Math.round(recoveryPercent);
    }
  });

  updated.updatedAt = now.toISOString();
  await storage.setMuscleStatus(updated);

  return updated;
};

// Record workout completion and update all related data
export const completeWorkout = async (workout) => {
  const workoutId = uuidv4();
  const now = new Date();
  const completeWorkout = {
    ...workout,
    id: workoutId,
    date: now.toISOString(),
    completed: true,
  };

  // Get current data
  const [user, muscleStatus, workouts, personalRecords] = await Promise.all([
    storage.getUser(),
    storage.getMuscleStatus(),
    storage.getWorkouts(),
    storage.getPersonalRecords(),
  ]);

  // Calculate workout stats
  let totalReps = 0;
  let totalVolume = 0;
  const musclesTrained = new Set();
  const exercisesPerformed = new Set();
  const newPRs = [];

  workout.exercises.forEach(exercise => {
    exercisesPerformed.add(exercise.exerciseId);

    // Track muscles
    if (exercise.primaryMuscles) {
      exercise.primaryMuscles.forEach(m => musclesTrained.add(m));
    }
    if (exercise.secondaryMuscles) {
      exercise.secondaryMuscles.forEach(m => musclesTrained.add(m));
    }

    // Calculate volume
    exercise.sets.forEach(set => {
      if (set.completed) {
        totalReps += set.reps;
        totalVolume += set.weight * set.reps;

        // Check for PR
        const currentPR = personalRecords[exercise.exerciseId];
        const setVolume = set.weight * set.reps;

        if (!currentPR || setVolume > (currentPR.weight * currentPR.reps)) {
          personalRecords[exercise.exerciseId] = {
            weight: set.weight,
            reps: set.reps,
            date: now.toISOString(),
          };
          newPRs.push(exercise.exerciseId);
        }
      }
    });
  });

  // Calculate XP earned
  const baseXP = 100;
  const exerciseXP = workout.exercises.length * 20;
  const streakBonus = Math.min(user.stats.currentStreak * 10, 100);
  const prBonus = newPRs.length * 50;
  const fullRecoveryBonus = 25; // If all muscles were recovered

  const xpEarned = baseXP + exerciseXP + streakBonus + prBonus;
  completeWorkout.xpEarned = xpEarned;
  completeWorkout.prsHit = newPRs;

  // Update user stats
  const allWorkouts = [...workouts, completeWorkout];
  const newStreak = calculateStreak(allWorkouts, now);

  const updatedUser = {
    ...user,
    stats: {
      ...user.stats,
      totalWorkouts: user.stats.totalWorkouts + 1,
      totalXP: user.stats.totalXP + xpEarned,
      level: levelFromXP(user.stats.totalXP + xpEarned),
      currentStreak: newStreak,
      longestStreak: Math.max(user.stats.longestStreak, newStreak),
      lastWorkoutDate: now.toISOString(),
      totalReps: (user.stats.totalReps || 0) + totalReps,
      totalVolume: (user.stats.totalVolume || 0) + totalVolume,
      uniqueExercises: Math.max(
        user.stats.uniqueExercises || 0,
        exercisesPerformed.size
      ),
      totalPRs: (user.stats.totalPRs || 0) + newPRs.length,
    },
  };

  // Update muscle status
  const updatedMuscleStatus = { ...muscleStatus };
  musclesTrained.forEach(muscleId => {
    if (updatedMuscleStatus.muscles[muscleId]) {
      updatedMuscleStatus.muscles[muscleId] = {
        recovery: 0, // Reset to needing recovery
        lastTrained: now.toISOString(),
        lastIntensity: workout.intensity || 'moderate',
        lastExercises: workout.exercises
          .filter(e => e.primaryMuscles?.includes(muscleId))
          .map(e => e.exerciseId),
      };
    }
  });
  updatedMuscleStatus.updatedAt = now.toISOString();

  // Save all updates
  await Promise.all([
    storage.setUser(updatedUser),
    storage.setMuscleStatus(updatedMuscleStatus),
    storage.addWorkout(completeWorkout),
    storage.setPersonalRecords(personalRecords),
  ]);

  return {
    workout: completeWorkout,
    user: updatedUser,
    muscleStatus: updatedMuscleStatus,
    xpEarned,
    newPRs,
    levelUp: updatedUser.stats.level > user.stats.level,
    newLevel: updatedUser.stats.level,
  };
};

// Check and update streak (called on app open)
export const checkAndUpdateStreak = async () => {
  const [user, workouts] = await Promise.all([
    storage.getUser(),
    storage.getWorkouts(),
  ]);

  if (!user) return null;

  const now = new Date();
  const currentStreak = calculateStreak(workouts, now);

  // Check if streak was broken and shield is available
  if (currentStreak === 0 && user.stats.currentStreak > 0) {
    // Streak would be broken
    if (user.stats.streakShields > 0) {
      // Use shield
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          streakShields: user.stats.streakShields - 1,
          // Keep streak but mark that shield was used
        },
      };
      await storage.setUser(updatedUser);
      return {
        user: updatedUser,
        shieldUsed: true,
        currentStreak: user.stats.currentStreak,
      };
    } else {
      // Streak broken
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          currentStreak: 0,
        },
      };
      await storage.setUser(updatedUser);
      return {
        user: updatedUser,
        streakBroken: true,
        previousStreak: user.stats.currentStreak,
        currentStreak: 0,
      };
    }
  }

  // Update streak if it increased
  if (currentStreak !== user.stats.currentStreak) {
    const earnedShield = currentStreak > 0 && currentStreak % 7 === 0;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        currentStreak,
        longestStreak: Math.max(user.stats.longestStreak, currentStreak),
        streakShields: earnedShield
          ? Math.min(user.stats.streakShields + 1, 2)
          : user.stats.streakShields,
      },
    };
    await storage.setUser(updatedUser);
    return {
      user: updatedUser,
      currentStreak,
      earnedShield,
    };
  }

  return {
    user,
    currentStreak: user.stats.currentStreak,
  };
};

// Get workout history with optional filters
export const getWorkoutHistory = async (filters = {}) => {
  const workouts = await storage.getWorkouts();

  let filtered = [...workouts];

  // Filter by date range
  if (filters.startDate) {
    filtered = filtered.filter(w => new Date(w.date) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    filtered = filtered.filter(w => new Date(w.date) <= new Date(filters.endDate));
  }

  // Filter by workout type
  if (filters.type) {
    filtered = filtered.filter(w => w.type === filters.type);
  }

  // Sort by date descending (most recent first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Limit results
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
};

// Get workout stats for dashboard
export const getDashboardStats = async () => {
  const [user, workouts] = await Promise.all([
    storage.getUser(),
    storage.getWorkouts(),
  ]);

  if (!user) return null;

  const now = new Date();
  const weekAgo = getDaysAgo(7);
  const monthAgo = getDaysAgo(30);

  const thisWeekWorkouts = workouts.filter(w =>
    new Date(w.date) >= weekAgo
  );
  const thisMonthWorkouts = workouts.filter(w =>
    new Date(w.date) >= monthAgo
  );

  return {
    totalWorkouts: user.stats.totalWorkouts,
    currentStreak: user.stats.currentStreak,
    longestStreak: user.stats.longestStreak,
    level: user.stats.level,
    totalXP: user.stats.totalXP,
    streakShields: user.stats.streakShields,
    thisWeek: thisWeekWorkouts.length,
    thisMonth: thisMonthWorkouts.length,
    lastWorkoutDate: user.stats.lastWorkoutDate,
  };
};

export default {
  initializeNewUser,
  initializeMuscleStatus,
  loadAppData,
  updateMuscleRecovery,
  completeWorkout,
  checkAndUpdateStreak,
  getWorkoutHistory,
  getDashboardStats,
};
