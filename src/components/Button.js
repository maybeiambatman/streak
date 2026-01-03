// Button Component
// Reusable button with multiple variants

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[`${variant}Button`],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Icon button (circular)
export const IconButton = ({
  icon,
  onPress,
  variant = 'ghost',
  size = 'medium',
  disabled = false,
  style,
}) => {
  const sizeMap = {
    small: 32,
    medium: 44,
    large: 56,
  };

  const buttonSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        styles[`${variant}Button`],
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

// Floating action button
export const FAB = ({
  icon,
  onPress,
  variant = 'primary',
  size = 'large',
  style,
}) => {
  const sizeMap = {
    small: 48,
    medium: 56,
    large: 64,
  };

  const buttonSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        styles[`${variant}Button`],
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {icon}
    </TouchableOpacity>
  );
};

// Text link button
export const LinkButton = ({
  title,
  onPress,
  color = colors.primary,
  size = 'medium',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.link, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.linkText, styles[`${size}Text`], { color }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Chip/Tag button
export const ChipButton = ({
  title,
  onPress,
  selected = false,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.chipSelected,
        disabled && styles.chipDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
          disabled && styles.chipTextDisabled,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.button,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  secondaryButton: {
    backgroundColor: colors.gray100,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: colors.danger,
    ...shadows.md,
  },

  // Sizes
  smallSize: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mediumSize: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  largeSize: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md + 4,
  },

  // Text styles
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.text,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.white,
  },

  smallText: {
    ...typography.styles.buttonSmall,
  },
  mediumText: {
    ...typography.styles.button,
  },
  largeText: {
    ...typography.styles.button,
    fontSize: 18,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.gray400,
  },
  fullWidth: {
    width: '100%',
  },

  // Icon button
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // FAB
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    position: 'absolute',
  },

  // Link
  link: {
    padding: spacing.xs,
  },
  linkText: {
    textDecorationLine: 'underline',
  },

  // Chip
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chipSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  chipTextDisabled: {
    color: colors.gray400,
  },
});

export default Button;
