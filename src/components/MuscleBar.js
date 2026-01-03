// MuscleBar Component
// Displays muscle recovery status as a progress bar

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, getRecoveryColor, getRecoveryStatus } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { formatMuscleName } from '../utils/formatters';

const MuscleBar = ({
  muscleId,
  muscleName,
  recovery = 100,
  lastTrained,
  onPress,
  showLabel = true,
  size = 'medium',
  style,
}) => {
  const recoveryColor = getRecoveryColor(recovery);
  const statusLabel = getRecoveryStatus(recovery);

  const barHeight = size === 'small' ? 8 : size === 'large' ? 16 : 12;
  const displayName = muscleName || formatMuscleName(muscleId);

  const handlePress = () => {
    if (onPress) {
      onPress(muscleId);
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {showLabel && (
        <View style={styles.header}>
          <Text style={styles.muscleLabel}>{displayName}</Text>
          <Text style={[styles.statusLabel, { color: recoveryColor }]}>
            {statusLabel}
          </Text>
        </View>
      )}

      <View style={[styles.barContainer, { height: barHeight }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${recovery}%`,
              backgroundColor: recoveryColor,
              height: barHeight,
            },
          ]}
        />
      </View>

      {showLabel && (
        <View style={styles.footer}>
          <Text style={styles.percentageLabel}>{Math.round(recovery)}%</Text>
          {lastTrained && (
            <Text style={styles.lastTrainedLabel}>Last: {lastTrained}</Text>
          )}
        </View>
      )}
    </Container>
  );
};

// Compact version for lists
export const MuscleBarCompact = ({
  muscleId,
  muscleName,
  recovery = 100,
  onPress,
}) => {
  const recoveryColor = getRecoveryColor(recovery);
  const displayName = muscleName || formatMuscleName(muscleId);

  return (
    <TouchableOpacity
      style={styles.compactContainer}
      onPress={() => onPress && onPress(muscleId)}
      activeOpacity={0.7}
    >
      <Text style={styles.compactLabel}>{displayName}</Text>
      <View style={styles.compactBarContainer}>
        <View
          style={[
            styles.compactBarFill,
            {
              width: `${recovery}%`,
              backgroundColor: recoveryColor,
            },
          ]}
        />
      </View>
      <Text style={[styles.compactPercentage, { color: recoveryColor }]}>
        {Math.round(recovery)}%
      </Text>
    </TouchableOpacity>
  );
};

// Mini version for inline display
export const MuscleBarMini = ({ recovery = 100, width = 40 }) => {
  const recoveryColor = getRecoveryColor(recovery);

  return (
    <View style={[styles.miniContainer, { width }]}>
      <View
        style={[
          styles.miniBarFill,
          {
            width: `${recovery}%`,
            backgroundColor: recoveryColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  muscleLabel: {
    ...typography.styles.label,
    color: colors.text,
  },
  statusLabel: {
    ...typography.styles.labelSmall,
  },
  barContainer: {
    width: '100%',
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: borderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  percentageLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  lastTrainedLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  compactLabel: {
    ...typography.styles.bodySmall,
    color: colors.text,
    width: 80,
  },
  compactBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  compactBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  compactPercentage: {
    ...typography.styles.labelSmall,
    width: 40,
    textAlign: 'right',
  },

  // Mini styles
  miniContainer: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

export default MuscleBar;
