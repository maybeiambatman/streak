// GainStreak Color Palette

export const colors = {
  // Primary brand colors
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8C5A',

  // Secondary colors
  secondary: '#4ECDC4',
  secondaryDark: '#3DB8B0',
  secondaryLight: '#6ED9D2',

  // Background colors
  background: '#F8F9FA',
  backgroundDark: '#1A1A2E',
  surface: '#FFFFFF',
  surfaceDark: '#252542',

  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  textOnPrimary: '#FFFFFF',

  // Status colors
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#3B82F6',

  // Recovery indicator colors
  recoveryFull: '#22C55E',      // Green - fully recovered (90%+)
  recoveryHigh: '#84CC16',      // Lime - mostly recovered (70-89%)
  recoveryMedium: '#EAB308',    // Yellow - partially recovered (50-69%)
  recoveryLow: '#F97316',       // Orange - needs more rest (30-49%)
  recoveryNone: '#EF4444',      // Red - not recovered (<30%)

  // Streak colors
  streakFire: '#FF6B35',
  streakGold: '#FFD700',
  streakPlatinum: '#E5E4E2',

  // Gray scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Get recovery color based on percentage
export const getRecoveryColor = (recoveryPercentage) => {
  if (recoveryPercentage >= 90) return colors.recoveryFull;
  if (recoveryPercentage >= 70) return colors.recoveryHigh;
  if (recoveryPercentage >= 50) return colors.recoveryMedium;
  if (recoveryPercentage >= 30) return colors.recoveryLow;
  return colors.recoveryNone;
};

// Get streak color based on streak length
export const getStreakColor = (streakDays) => {
  if (streakDays >= 365) return colors.streakPlatinum;
  if (streakDays >= 30) return colors.streakGold;
  return colors.streakFire;
};

export default colors;
