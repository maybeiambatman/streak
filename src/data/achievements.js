// FitStreak Achievements System
// Celebrating consistency, progress, and dedication

export const ACHIEVEMENT_CATEGORIES = {
  streak: { id: 'streak', name: 'Streak Achievements', icon: 'flame' },
  strength: { id: 'strength', name: 'Strength Achievements', icon: 'trophy' },
  volume: { id: 'volume', name: 'Volume Achievements', icon: 'chart' },
  variety: { id: 'variety', name: 'Variety Achievements', icon: 'shuffle' },
  balance: { id: 'balance', name: 'Balance Achievements', icon: 'scale' },
  dedication: { id: 'dedication', name: 'Dedication Achievements', icon: 'medal' },
  special: { id: 'special', name: 'Special Achievements', icon: 'star' },
};

export const ACHIEVEMENTS = {
  // ==================== STREAK ACHIEVEMENTS ====================
  first_workout: {
    id: 'first_workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    category: 'streak',
    icon: 'footsteps',
    xpReward: 50,
    requirement: { type: 'total_workouts', value: 1 },
  },
  getting_started: {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    icon: 'flame',
    xpReward: 100,
    requirement: { type: 'streak', value: 3 },
  },
  week_warrior: {
    id: 'week_warrior',
    name: 'One Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    icon: 'flame',
    xpReward: 200,
    requirement: { type: 'streak', value: 7 },
  },
  two_week_champion: {
    id: 'two_week_champion',
    name: 'Two Week Champion',
    description: 'Maintain a 14-day streak',
    category: 'streak',
    icon: 'flame',
    xpReward: 350,
    requirement: { type: 'streak', value: 14 },
  },
  monthly_master: {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    category: 'streak',
    icon: 'crown',
    xpReward: 500,
    requirement: { type: 'streak', value: 30 },
  },
  habit_formed: {
    id: 'habit_formed',
    name: 'Habit Formed',
    description: 'Maintain a 60-day streak',
    category: 'streak',
    icon: 'brain',
    xpReward: 800,
    requirement: { type: 'streak', value: 60 },
  },
  quarterly_quest: {
    id: 'quarterly_quest',
    name: 'Quarterly Quest Complete',
    description: 'Maintain a 90-day streak',
    category: 'streak',
    icon: 'shield',
    xpReward: 1200,
    requirement: { type: 'streak', value: 90 },
  },
  half_year_hero: {
    id: 'half_year_hero',
    name: 'Half Year Hero',
    description: 'Maintain a 180-day streak',
    category: 'streak',
    icon: 'lightning',
    xpReward: 2000,
    requirement: { type: 'streak', value: 180 },
  },
  year_of_gains: {
    id: 'year_of_gains',
    name: 'Year of Gains',
    description: 'Maintain a 365-day streak - Legendary!',
    category: 'streak',
    icon: 'diamond',
    legendary: true,
    xpReward: 5000,
    requirement: { type: 'streak', value: 365 },
  },

  // ==================== VOLUME ACHIEVEMENTS ====================
  first_hundred_reps: {
    id: 'first_hundred_reps',
    name: 'First Hundred',
    description: 'Complete 100 total reps',
    category: 'volume',
    icon: 'counter',
    xpReward: 50,
    requirement: { type: 'total_reps', value: 100 },
  },
  thousand_reps: {
    id: 'thousand_reps',
    name: 'Thousand Club',
    description: 'Complete 1,000 total reps',
    category: 'volume',
    icon: 'counter',
    xpReward: 200,
    requirement: { type: 'total_reps', value: 1000 },
  },
  ten_thousand_reps: {
    id: 'ten_thousand_reps',
    name: 'Ten Thousand Strong',
    description: 'Complete 10,000 total reps',
    category: 'volume',
    icon: 'muscles',
    xpReward: 500,
    requirement: { type: 'total_reps', value: 10000 },
  },
  fifty_workouts: {
    id: 'fifty_workouts',
    name: 'Fifty and Counting',
    description: 'Complete 50 workouts',
    category: 'volume',
    icon: 'calendar',
    xpReward: 300,
    requirement: { type: 'total_workouts', value: 50 },
  },
  hundred_workouts: {
    id: 'hundred_workouts',
    name: 'Century Club',
    description: 'Complete 100 workouts',
    category: 'volume',
    icon: 'trophy',
    xpReward: 600,
    requirement: { type: 'total_workouts', value: 100 },
  },

  // ==================== VARIETY ACHIEVEMENTS ====================
  try_ten_exercises: {
    id: 'try_ten_exercises',
    name: 'Explorer',
    description: 'Try 10 different exercises',
    category: 'variety',
    icon: 'compass',
    xpReward: 100,
    requirement: { type: 'unique_exercises', value: 10 },
  },
  try_twenty_exercises: {
    id: 'try_twenty_exercises',
    name: 'Adventurer',
    description: 'Try 20 different exercises',
    category: 'variety',
    icon: 'map',
    xpReward: 200,
    requirement: { type: 'unique_exercises', value: 20 },
  },
  try_thirty_exercises: {
    id: 'try_thirty_exercises',
    name: 'Exercise Master',
    description: 'Try 30 different exercises',
    category: 'variety',
    icon: 'book',
    xpReward: 400,
    requirement: { type: 'unique_exercises', value: 30 },
  },
  push_pull_legs: {
    id: 'push_pull_legs',
    name: 'Well Rounded',
    description: 'Complete push, pull, and leg exercises in one week',
    category: 'variety',
    icon: 'sync',
    xpReward: 150,
    requirement: { type: 'weekly_categories', value: ['push', 'pull', 'legs'] },
  },

  // ==================== BALANCE ACHIEVEMENTS ====================
  upper_lower_balance: {
    id: 'upper_lower_balance',
    name: 'Balanced Builder',
    description: 'Train upper and lower body equally for a week',
    category: 'balance',
    icon: 'scale',
    xpReward: 200,
    requirement: { type: 'weekly_balance', value: 'upper_lower' },
  },
  all_muscles_week: {
    id: 'all_muscles_week',
    name: 'Complete Package',
    description: 'Train all major muscle groups in a week',
    category: 'balance',
    icon: 'body',
    xpReward: 250,
    requirement: { type: 'weekly_all_muscles', value: true },
  },

  // ==================== DEDICATION ACHIEVEMENTS ====================
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete 10 workouts before 8 AM',
    category: 'dedication',
    icon: 'sunrise',
    xpReward: 150,
    requirement: { type: 'morning_workouts', value: 10 },
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete 10 workouts after 8 PM',
    category: 'dedication',
    icon: 'moon',
    xpReward: 150,
    requirement: { type: 'evening_workouts', value: 10 },
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Work out every weekend for a month',
    category: 'dedication',
    icon: 'sun',
    xpReward: 300,
    requirement: { type: 'weekend_streak', value: 4 },
  },
  no_excuses: {
    id: 'no_excuses',
    name: 'No Excuses',
    description: 'Work out 5+ days in a single week',
    category: 'dedication',
    icon: 'fire',
    xpReward: 200,
    requirement: { type: 'weekly_workouts', value: 5 },
  },

  // ==================== STRENGTH ACHIEVEMENTS ====================
  first_pr: {
    id: 'first_pr',
    name: 'Personal Best',
    description: 'Set your first personal record',
    category: 'strength',
    icon: 'medal',
    xpReward: 100,
    requirement: { type: 'total_prs', value: 1 },
  },
  five_prs: {
    id: 'five_prs',
    name: 'Record Breaker',
    description: 'Set 5 personal records',
    category: 'strength',
    icon: 'trophy',
    xpReward: 250,
    requirement: { type: 'total_prs', value: 5 },
  },
  ten_prs: {
    id: 'ten_prs',
    name: 'Personal Record Machine',
    description: 'Set 10 personal records',
    category: 'strength',
    icon: 'rocket',
    xpReward: 500,
    requirement: { type: 'total_prs', value: 10 },
  },

  // ==================== SPECIAL ACHIEVEMENTS ====================
  comeback_kid: {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Return after a 7+ day break and complete a workout',
    category: 'special',
    icon: 'return',
    xpReward: 100,
    requirement: { type: 'comeback', value: 7 },
  },
  shield_saver: {
    id: 'shield_saver',
    name: 'Shield Saver',
    description: 'Use a streak shield to protect your streak',
    category: 'special',
    icon: 'shield',
    xpReward: 50,
    requirement: { type: 'shield_used', value: 1 },
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete workouts on all 7 days of a week',
    category: 'special',
    icon: 'sparkle',
    xpReward: 400,
    requirement: { type: 'weekly_workouts', value: 7 },
  },
  level_ten: {
    id: 'level_ten',
    name: 'Level 10 Legend',
    description: 'Reach level 10',
    category: 'special',
    icon: 'star',
    xpReward: 300,
    requirement: { type: 'level', value: 10 },
  },
  level_twenty: {
    id: 'level_twenty',
    name: 'Level 20 Champion',
    description: 'Reach level 20',
    category: 'special',
    icon: 'crown',
    xpReward: 500,
    requirement: { type: 'level', value: 20 },
  },
};

// Get achievements by category
export const getAchievementsByCategory = (category) => {
  return Object.values(ACHIEVEMENTS).filter(a => a.category === category);
};

// Get locked/unlocked achievements
export const getUnlockedAchievements = (unlockedIds) => {
  return Object.values(ACHIEVEMENTS).filter(a => unlockedIds.includes(a.id));
};

export const getLockedAchievements = (unlockedIds) => {
  return Object.values(ACHIEVEMENTS).filter(a => !unlockedIds.includes(a.id));
};

// Get next achievement to unlock (closest to completing)
export const getNextAchievements = (userStats, unlockedIds, limit = 3) => {
  const locked = getLockedAchievements(unlockedIds);

  // Calculate progress for each locked achievement
  const withProgress = locked.map(achievement => {
    const progress = calculateAchievementProgress(achievement, userStats);
    return { ...achievement, progress };
  });

  // Sort by progress descending and return top ones
  return withProgress
    .sort((a, b) => b.progress - a.progress)
    .slice(0, limit);
};

// Calculate progress toward an achievement (0-100)
export const calculateAchievementProgress = (achievement, userStats) => {
  const { requirement } = achievement;

  switch (requirement.type) {
    case 'streak':
      return Math.min(100, (userStats.currentStreak / requirement.value) * 100);
    case 'total_workouts':
      return Math.min(100, (userStats.totalWorkouts / requirement.value) * 100);
    case 'total_reps':
      return Math.min(100, ((userStats.totalReps || 0) / requirement.value) * 100);
    case 'unique_exercises':
      return Math.min(100, ((userStats.uniqueExercises || 0) / requirement.value) * 100);
    case 'total_prs':
      return Math.min(100, ((userStats.totalPRs || 0) / requirement.value) * 100);
    case 'level':
      return Math.min(100, (userStats.level / requirement.value) * 100);
    default:
      return 0;
  }
};

// Check if achievement is unlocked
export const checkAchievementUnlocked = (achievement, userStats) => {
  const { requirement } = achievement;

  switch (requirement.type) {
    case 'streak':
      return userStats.currentStreak >= requirement.value || userStats.longestStreak >= requirement.value;
    case 'total_workouts':
      return userStats.totalWorkouts >= requirement.value;
    case 'total_reps':
      return (userStats.totalReps || 0) >= requirement.value;
    case 'unique_exercises':
      return (userStats.uniqueExercises || 0) >= requirement.value;
    case 'total_prs':
      return (userStats.totalPRs || 0) >= requirement.value;
    case 'level':
      return userStats.level >= requirement.value;
    case 'weekly_workouts':
      return (userStats.thisWeekWorkouts || 0) >= requirement.value;
    case 'shield_used':
      return (userStats.shieldsUsed || 0) >= requirement.value;
    case 'comeback':
      return userStats.longestBreak >= requirement.value && userStats.totalWorkouts > 0;
    default:
      return false;
  }
};

// Streak milestones for special celebration
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

export const getStreakMilestone = (streak) => {
  for (let i = STREAK_MILESTONES.length - 1; i >= 0; i--) {
    if (streak >= STREAK_MILESTONES[i]) {
      return STREAK_MILESTONES[i];
    }
  }
  return 0;
};

export const getNextStreakMilestone = (streak) => {
  for (const milestone of STREAK_MILESTONES) {
    if (streak < milestone) {
      return milestone;
    }
  }
  return null; // Already at max
};

export default ACHIEVEMENTS;
