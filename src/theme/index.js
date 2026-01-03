// FitStreak Theme - Central export
export { colors, getRecoveryColor, getRecoveryStatus, recoveryColors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows, hitSlop } from './spacing';

// Combined theme object for convenience
import { colors, getRecoveryColor, getRecoveryStatus, recoveryColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows, hitSlop } from './spacing';

const theme = {
  colors,
  recoveryColors,
  getRecoveryColor,
  getRecoveryStatus,
  typography,
  spacing,
  borderRadius,
  shadows,
  hitSlop,
};

export default theme;
