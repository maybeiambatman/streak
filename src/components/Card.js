// Card Component
// Reusable card container with variants

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

const Card = ({
  children,
  onPress,
  variant = 'default', // default, elevated, outlined, flat
  padding = 'medium', // none, small, medium, large
  style,
}) => {
  const cardStyles = [
    styles.base,
    styles[`${variant}Variant`],
    styles[`${padding}Padding`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

// Card with header
export const CardWithHeader = ({
  title,
  subtitle,
  headerRight,
  children,
  onPress,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.base, styles.elevatedVariant, styles.mediumPadding, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
        {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
      </View>
      {children && <View style={styles.cardContent}>{children}</View>}
    </Container>
  );
};

// Stat card
export const StatCard = ({
  label,
  value,
  icon,
  trend,
  trendValue,
  onPress,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.statCard, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.statHeader}>
        {icon && <View style={styles.statIcon}>{icon}</View>}
        {trend && (
          <View style={[styles.trendBadge, trend === 'up' ? styles.trendUp : styles.trendDown]}>
            <Text style={styles.trendText}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Container>
  );
};

// Action card (with CTA)
export const ActionCard = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  variant = 'primary',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        variant === 'primary' && styles.actionCardPrimary,
        variant === 'secondary' && styles.actionCardSecondary,
        style,
      ]}
      onPress={onAction}
      activeOpacity={0.9}
    >
      <View style={styles.actionContent}>
        {icon && <View style={styles.actionIcon}>{icon}</View>}
        <View style={styles.actionText}>
          <Text style={[
            styles.actionTitle,
            variant === 'primary' && styles.actionTitlePrimary,
          ]}>
            {title}
          </Text>
          {description && (
            <Text style={[
              styles.actionDescription,
              variant === 'primary' && styles.actionDescriptionPrimary,
            ]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actionButton}>
        <Text style={[
          styles.actionButtonText,
          variant === 'primary' && styles.actionButtonTextPrimary,
        ]}>
          {actionLabel} →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Info card (for tips, warnings, etc.)
export const InfoCard = ({
  title,
  message,
  type = 'info', // info, success, warning, error
  icon,
  onDismiss,
  style,
}) => {
  const typeColors = {
    info: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  };

  const color = typeColors[type];

  return (
    <View style={[styles.infoCard, { borderLeftColor: color }, style]}>
      <View style={styles.infoContent}>
        {icon && <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>{icon}</View>}
        <View style={styles.infoText}>
          {title && <Text style={styles.infoTitle}>{title}</Text>}
          <Text style={styles.infoMessage}>{message}</Text>
        </View>
      </View>
      {onDismiss && (
        <TouchableOpacity style={styles.infoDismiss} onPress={onDismiss}>
          <Text style={styles.infoDismissText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Base card
  base: {
    borderRadius: borderRadius.card,
    backgroundColor: colors.card,
  },

  // Variants
  defaultVariant: {
    ...shadows.sm,
  },
  elevatedVariant: {
    ...shadows.md,
  },
  outlinedVariant: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  flatVariant: {
    backgroundColor: colors.gray50,
  },

  // Padding
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: spacing.sm,
  },
  mediumPadding: {
    padding: spacing.md,
  },
  largePadding: {
    padding: spacing.lg,
  },

  // Header card
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: spacing.sm,
  },
  headerTitle: {
    ...typography.styles.h5,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardContent: {
    marginTop: spacing.md,
  },

  // Stat card
  statCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    ...shadows.sm,
    minWidth: 100,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.styles.stat,
    color: colors.text,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  trendBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  trendUp: {
    backgroundColor: colors.success + '15',
  },
  trendDown: {
    backgroundColor: colors.danger + '15',
  },
  trendText: {
    ...typography.styles.caption,
    fontWeight: '600',
  },

  // Action card
  actionCard: {
    borderRadius: borderRadius.card,
    padding: spacing.md,
    ...shadows.md,
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
  },
  actionCardSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionIcon: {
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...typography.styles.h5,
    color: colors.text,
  },
  actionTitlePrimary: {
    color: colors.white,
  },
  actionDescription: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionDescriptionPrimary: {
    color: colors.white + 'CC',
  },
  actionButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    ...typography.styles.button,
    color: colors.primary,
  },
  actionButtonTextPrimary: {
    color: colors.white,
  },

  // Info card
  infoCard: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    ...typography.styles.label,
    color: colors.text,
    marginBottom: 2,
  },
  infoMessage: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  infoDismiss: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  infoDismissText: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: '300',
  },
});

export default Card;
