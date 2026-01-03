// FitStreak Formatting Utilities
// Consistent number and string formatting

// Format weight with units
export const formatWeight = (weight, unit = 'lbs') => {
  if (weight === null || weight === undefined) return '-';
  return `${weight} ${unit}`;
};

// Format reps (handles ranges like "8-12")
export const formatReps = (reps) => {
  if (typeof reps === 'string') return reps;
  if (typeof reps === 'number') return String(reps);
  return '-';
};

// Format sets x reps
export const formatSetsReps = (sets, reps) => {
  return `${sets} × ${formatReps(reps)}`;
};

// Format full exercise prescription
export const formatPrescription = (sets, reps, weight, unit = 'lbs') => {
  const base = formatSetsReps(sets, reps);
  if (weight && weight > 0) {
    return `${base} @ ${formatWeight(weight, unit)}`;
  }
  return base;
};

// Format large numbers with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// Format streak number with flame
export const formatStreak = (streak) => {
  if (!streak || streak <= 0) return '0';
  return String(streak);
};

// Format XP with suffix
export const formatXP = (xp) => {
  if (xp === null || xp === undefined) return '0 XP';
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M XP`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K XP`;
  }
  return `${formatNumber(xp)} XP`;
};

// Format level
export const formatLevel = (level) => {
  return `Level ${level}`;
};

// Format recovery percentage
export const formatRecovery = (percentage) => {
  return `${Math.round(percentage)}%`;
};

// Format time in hours and minutes
export const formatHoursMinutes = (totalMinutes) => {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

// Format rest time in seconds
export const formatRestTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${minutes}m`;
  return `${minutes}m ${secs}s`;
};

// Format compact number (1.2K, 3.4M)
export const formatCompact = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(num);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Title case
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Format muscle name (convert camelCase to Title Case)
export const formatMuscleName = (muscleId) => {
  if (!muscleId) return '';
  // Handle camelCase like "lowerBack" -> "Lower Back"
  return muscleId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Format exercise name (convert snake_case to Title Case)
export const formatExerciseName = (exerciseId) => {
  if (!exerciseId) return '';
  return exerciseId
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

// Format difficulty level
export const formatDifficulty = (difficulty) => {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return labels[difficulty] || capitalize(difficulty);
};

// Format workout type
export const formatWorkoutType = (type) => {
  const labels = {
    full_body: 'Full Body',
    upper_body: 'Upper Body',
    lower_body: 'Lower Body',
    push: 'Push Day',
    pull: 'Pull Day',
    legs: 'Leg Day',
    core: 'Core',
    quick: 'Quick Workout',
  };
  return labels[type] || titleCase(type?.replace(/_/g, ' ') || '');
};

// Pluralize word
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

// Format count with label (e.g., "3 workouts")
export const formatCount = (count, singular, plural = null) => {
  return `${count} ${pluralize(count, singular, plural)}`;
};

// Truncate string with ellipsis
export const truncate = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
};

// Format ordinal (1st, 2nd, 3rd, etc.)
export const formatOrdinal = (num) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
};

export default {
  formatWeight,
  formatReps,
  formatSetsReps,
  formatPrescription,
  formatNumber,
  formatPercentage,
  formatStreak,
  formatXP,
  formatLevel,
  formatRecovery,
  formatHoursMinutes,
  formatRestTime,
  formatCompact,
  capitalize,
  titleCase,
  formatMuscleName,
  formatExerciseName,
  formatDifficulty,
  formatWorkoutType,
  pluralize,
  formatCount,
  truncate,
  formatOrdinal,
};
