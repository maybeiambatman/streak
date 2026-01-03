// StreakCounter Component
// Displays the user's current streak with flame icon

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { getNextStreakMilestone } from '../data/achievements';

const StreakCounter = ({
  streak = 0,
  shields = 0,
  showMilestone = true,
  size = 'medium',
  style,
}) => {
  const nextMilestone = getNextStreakMilestone(streak);
  const daysToMilestone = nextMilestone ? nextMilestone - streak : null;

  const sizeStyles = {
    small: {
      container: styles.smallContainer,
      number: styles.smallNumber,
      label: styles.smallLabel,
    },
    medium: {
      container: styles.mediumContainer,
      number: styles.mediumNumber,
      label: styles.mediumLabel,
    },
    large: {
      container: styles.largeContainer,
      number: styles.largeNumber,
      label: styles.largeLabel,
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <View style={[styles.container, currentSize.container, style]}>
      <View style={styles.streakRow}>
        <Text style={styles.flameEmoji}>
          {streak > 0 ? '🔥' : '💤'}
        </Text>
        <Text style={[styles.streakNumber, currentSize.number]}>
          {streak}
        </Text>
      </View>

      <Text style={[styles.streakLabel, currentSize.label]}>
        day{streak !== 1 ? 's' : ''} streak
      </Text>

      {shields > 0 && (
        <View style={styles.shieldContainer}>
          <Text style={styles.shieldEmoji}>🛡️</Text>
          <Text style={styles.shieldCount}>{shields}</Text>
        </View>
      )}

      {showMilestone && daysToMilestone && daysToMilestone <= 7 && (
        <View style={styles.milestoneHint}>
          <Text style={styles.milestoneText}>
            {daysToMilestone} day{daysToMilestone !== 1 ? 's' : ''} to {nextMilestone}-day milestone!
          </Text>
        </View>
      )}
    </View>
  );
};

// Compact inline version
export const StreakBadge = ({ streak = 0, size = 'small' }) => {
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeFlame}>🔥</Text>
      <Text style={styles.badgeNumber}>{streak}</Text>
    </View>
  );
};

// Large display version for home screen
export const StreakDisplay = ({ streak = 0, shields = 0, longestStreak = 0 }) => {
  const isNewRecord = streak > 0 && streak >= longestStreak;

  return (
    <View style={styles.displayContainer}>
      <View style={styles.displayMain}>
        <Text style={styles.displayFlame}>
          {streak > 0 ? '🔥' : '💤'}
        </Text>
        <View style={styles.displayTextContainer}>
          <Text style={styles.displayNumber}>{streak}</Text>
          <Text style={styles.displayLabel}>
            day{streak !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {isNewRecord && streak > 1 && (
        <View style={styles.recordBadge}>
          <Text style={styles.recordText}>Personal Best!</Text>
        </View>
      )}

      <View style={styles.displayStats}>
        {shields > 0 && (
          <View style={styles.displayStat}>
            <Text style={styles.statEmoji}>🛡️</Text>
            <Text style={styles.statValue}>{shields}</Text>
            <Text style={styles.statLabel}>shield{shields !== 1 ? 's' : ''}</Text>
          </View>
        )}
        <View style={styles.displayStat}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>best</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameEmoji: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  streakNumber: {
    color: colors.primary,
    fontWeight: '800',
  },
  streakLabel: {
    color: colors.textSecondary,
  },

  // Size variants
  smallContainer: {
    padding: spacing.sm,
  },
  smallNumber: {
    fontSize: 24,
  },
  smallLabel: {
    fontSize: 12,
  },

  mediumContainer: {
    padding: spacing.md,
  },
  mediumNumber: {
    fontSize: 36,
  },
  mediumLabel: {
    fontSize: 14,
  },

  largeContainer: {
    padding: spacing.lg,
  },
  largeNumber: {
    fontSize: 48,
  },
  largeLabel: {
    fontSize: 16,
  },

  // Shield
  shieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  shieldEmoji: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  shieldCount: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
  },

  // Milestone hint
  milestoneHint: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  milestoneText: {
    ...typography.styles.caption,
    color: colors.primary,
  },

  // Badge (compact)
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeFlame: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeNumber: {
    ...typography.styles.label,
    color: colors.primary,
    fontWeight: '700',
  },

  // Display (large)
  displayContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
  },
  displayMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayFlame: {
    fontSize: 48,
    marginRight: spacing.sm,
  },
  displayTextContainer: {
    alignItems: 'flex-start',
  },
  displayNumber: {
    ...typography.styles.streak,
    color: colors.primary,
  },
  displayLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    marginTop: -spacing.xs,
  },
  recordBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  recordText: {
    ...typography.styles.labelSmall,
    color: colors.white,
    fontWeight: '600',
  },
  displayStats: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  displayStat: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    ...typography.styles.h5,
    color: colors.text,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },
});

export default StreakCounter;
