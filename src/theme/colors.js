// FitStreak Color Palette
// Energetic, motivating colors that encourage consistency

export const colors = {
  // Primary brand colors
  primary: '#FF6B35', // Energetic orange - main CTA, streaks
  primaryDark: '#E55A28',
  primaryLight: '#FF8C5A',

  // Success/Recovery states
  success: '#4CAF50', // Green - fresh muscles, completed
  successDark: '#388E3C',
  successLight: '#81C784',

  // Warning states
  warning: '#FFC107', // Yellow - recovering
  warningDark: '#FFA000',
  warningLight: '#FFD54F',

  // Caution states
  caution: '#FF9800', // Orange - still recovering
  cautionDark: '#F57C00',
  cautionLight: '#FFB74D',

  // Danger states
  danger: '#F44336', // Red - needs rest
  dangerDark: '#D32F2F',
  dangerLight: '#E57373',

  // Neutral palette
  white: '#FFFFFF',
  black: '#000000',

  // Grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundDark: '#121212',
  backgroundDarkSecondary: '#1E1E1E',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textMuted: '#9E9E9E',

  // XP and leveling
  xp: '#9C27B0', // Purple for XP
  xpLight: '#BA68C8',

  // Muscle group colors (for body map)
  muscleChest: '#FF6B35',
  muscleBack: '#2196F3',
  muscleShoulders: '#9C27B0',
  muscleBiceps: '#4CAF50',
  muscleTriceps: '#00BCD4',
  muscleAbs: '#FF9800',
  muscleQuads: '#3F51B5',
  muscleHamstrings: '#E91E63',
  muscleGlutes: '#795548',
  muscleCalves: '#607D8B',

  // Streak flame gradient
  streakStart: '#FF6B35',
  streakEnd: '#FFD54F',

  // Card colors
  card: '#FFFFFF',
  cardDark: '#1E1E1E',
  cardBorder: '#E0E0E0',
  cardBorderDark: '#333333',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Recovery status colors
export const recoveryColors = {
  fresh: colors.success,       // 70-100%
  recovered: colors.warning,   // 40-69%
  recovering: colors.caution,  // 20-39%
  needsRest: colors.danger,    // 0-19%
};

// Get recovery color based on percentage
export const getRecoveryColor = (percentage) => {
  if (percentage >= 70) return recoveryColors.fresh;
  if (percentage >= 40) return recoveryColors.recovered;
  if (percentage >= 20) return recoveryColors.recovering;
  return recoveryColors.needsRest;
};

// Get recovery status label
export const getRecoveryStatus = (percentage) => {
  if (percentage >= 70) return 'Fresh';
  if (percentage >= 40) return 'Recovered';
  if (percentage >= 20) return 'Recovering';
  return 'Needs Rest';
};

export default colors;
