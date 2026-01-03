// XPCounter Component
// Displays XP progress and level information

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { getXPStatus, getLevelTitle, getLevelColor } from '../engine/xpCalculator';
import { formatXP, formatNumber } from '../utils/formatters';

const XPCounter = ({
  totalXP = 0,
  showLevel = true,
  showProgress = true,
  size = 'medium',
  style,
}) => {
  const status = getXPStatus(totalXP);
  const levelTitle = getLevelTitle(status.level);
  const levelColor = getLevelColor(status.level);

  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <View style={[styles.container, sizeStyles[size], style]}>
      {showLevel && (
        <View style={styles.levelBadge}>
          <Text style={[styles.levelNumber, { color: levelColor }]}>
            {status.level}
          </Text>
          <Text style={styles.levelLabel}>{levelTitle}</Text>
        </View>
      )}

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${status.progressPercent}%`,
                  backgroundColor: levelColor,
                },
              ]}
            />
          </View>
          <View style={styles.xpLabels}>
            <Text style={styles.xpCurrent}>
              {formatNumber(status.currentLevelXP)} XP
            </Text>
            <Text style={styles.xpNeeded}>
              {formatNumber(status.xpToNextLevel)} XP
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Compact badge version
export const XPBadge = ({ totalXP = 0 }) => {
  const status = getXPStatus(totalXP);
  const levelColor = getLevelColor(status.level);

  return (
    <View style={[styles.badge, { borderColor: levelColor }]}>
      <Text style={[styles.badgeLevel, { color: levelColor }]}>
        Lv.{status.level}
      </Text>
    </View>
  );
};

// Full level display with title
export const LevelDisplay = ({ totalXP = 0, showXP = true }) => {
  const status = getXPStatus(totalXP);
  const levelTitle = getLevelTitle(status.level);
  const levelColor = getLevelColor(status.level);

  return (
    <View style={styles.displayContainer}>
      <View style={[styles.displayLevel, { backgroundColor: levelColor + '20' }]}>
        <Text style={[styles.displayLevelNumber, { color: levelColor }]}>
          {status.level}
        </Text>
      </View>
      <View style={styles.displayInfo}>
        <Text style={styles.displayTitle}>{levelTitle}</Text>
        {showXP && (
          <Text style={styles.displayXP}>
            {formatNumber(status.totalXP)} XP total
          </Text>
        )}
      </View>
    </View>
  );
};

// XP gained animation (for completion screen)
export const XPGained = ({ amount = 0, breakdown = [], style }) => {
  return (
    <View style={[styles.gainedContainer, style]}>
      <Text style={styles.gainedAmount}>+{formatNumber(amount)} XP</Text>
      {breakdown.length > 0 && (
        <View style={styles.gainedBreakdown}>
          {breakdown.map((item, index) => (
            <View key={index} style={styles.gainedItem}>
              <Text style={styles.gainedLabel}>{item.label}</Text>
              <Text style={styles.gainedValue}>+{item.xp}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Level up celebration
export const LevelUpBanner = ({ newLevel, previousLevel }) => {
  const levelTitle = getLevelTitle(newLevel);
  const levelColor = getLevelColor(newLevel);

  return (
    <View style={[styles.levelUpContainer, { borderColor: levelColor }]}>
      <Text style={styles.levelUpEmoji}>🎉</Text>
      <View style={styles.levelUpContent}>
        <Text style={styles.levelUpTitle}>Level Up!</Text>
        <Text style={[styles.levelUpLevel, { color: levelColor }]}>
          Level {previousLevel} → Level {newLevel}
        </Text>
        <Text style={styles.levelUpRank}>{levelTitle}</Text>
      </View>
      <Text style={styles.levelUpEmoji}>🎉</Text>
    </View>
  );
};

// Progress ring (circular progress)
export const XPRing = ({ totalXP = 0, size = 80 }) => {
  const status = getXPStatus(totalXP);
  const levelColor = getLevelColor(status.level);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - status.progressPercent / 100);

  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      {/* Background ring */}
      <View
        style={[
          styles.ringBackground,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
          },
        ]}
      />
      {/* Progress ring (simplified - would need SVG for true circular progress) */}
      <View
        style={[
          styles.ringProgress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: levelColor,
            opacity: status.progressPercent / 100,
          },
        ]}
      />
      {/* Center content */}
      <View style={styles.ringCenter}>
        <Text style={[styles.ringLevel, { color: levelColor }]}>
          {status.level}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  small: {
    padding: spacing.xs,
  },
  medium: {
    padding: spacing.sm,
  },
  large: {
    padding: spacing.md,
  },

  levelBadge: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  levelNumber: {
    ...typography.styles.stat,
    fontWeight: '800',
  },
  levelLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  progressContainer: {
    width: '100%',
    maxWidth: 200,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  xpCurrent: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  xpNeeded: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  // Badge
  badge: {
    borderWidth: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeLevel: {
    ...typography.styles.labelSmall,
    fontWeight: '700',
  },

  // Display
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayLevel: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  displayLevelNumber: {
    ...typography.styles.h4,
    fontWeight: '800',
  },
  displayInfo: {
    flex: 1,
  },
  displayTitle: {
    ...typography.styles.h5,
    color: colors.text,
  },
  displayXP: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  // Gained
  gainedContainer: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.xp + '10',
    borderRadius: borderRadius.lg,
  },
  gainedAmount: {
    ...typography.styles.stat,
    color: colors.xp,
    fontWeight: '800',
  },
  gainedBreakdown: {
    marginTop: spacing.sm,
    width: '100%',
  },
  gainedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.xp + '20',
  },
  gainedLabel: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  gainedValue: {
    ...typography.styles.label,
    color: colors.xp,
  },

  // Level Up
  levelUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 3,
  },
  levelUpEmoji: {
    fontSize: 32,
  },
  levelUpContent: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  levelUpTitle: {
    ...typography.styles.h3,
    color: colors.text,
  },
  levelUpLevel: {
    ...typography.styles.h4,
    marginTop: spacing.xs,
  },
  levelUpRank: {
    ...typography.styles.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },

  // Ring
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBackground: {
    position: 'absolute',
    borderColor: colors.gray200,
  },
  ringProgress: {
    position: 'absolute',
  },
  ringCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringLevel: {
    ...typography.styles.h4,
    fontWeight: '800',
  },
});

export default XPCounter;
