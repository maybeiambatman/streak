// FitStreak Typography System
// Bold headlines for motivation, clear body text for readability

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Font families
  fontFamily: {
    regular: fontFamily,
    medium: fontFamily,
    bold: fontFamily,
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Pre-defined text styles
  styles: {
    // Headlines - Bold and motivating
    h1: {
      fontSize: 36,
      fontWeight: '800',
      lineHeight: 44,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 38,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },

    // Body text - Clear and readable
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },

    // Labels and captions
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },

    // Special styles
    streak: {
      fontSize: 48,
      fontWeight: '800',
      lineHeight: 56,
    },
    stat: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 44,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      letterSpacing: 0.2,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      letterSpacing: 0.2,
    },
  },
};

export default typography;
