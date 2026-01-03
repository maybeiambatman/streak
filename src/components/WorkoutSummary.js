// WorkoutSummary Component
// Displays workout overview before and after completion

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { formatMuscleName, formatDuration, formatWorkoutType } from '../utils/formatters';

// Pre-workout summary card
export const WorkoutPreview = ({
  workout,
  onStart,
  onModify,
  style,
}) => {
  const {
    type,
    name,
    targetMuscles = [],
    exercises = [],
    estimatedDuration,
    difficultyLevel,
  } = workout;

  return (
    <View style={[styles.previewContainer, style]}>
      <View style={styles.previewHeader}>
        <View>
          <Text style={styles.previewType}>{formatWorkoutType(type)}</Text>
          <Text style={styles.previewDuration}>
            ~{formatDuration(estimatedDuration)}
          </Text>
        </View>
        {difficultyLevel && (
          <View style={[styles.difficultyBadge, styles[`${difficultyLevel}Badge`]]}>
            <Text style={styles.difficultyText}>{difficultyLevel}</Text>
          </View>
        )}
      </View>

      <View style={styles.muscleList}>
        <Text style={styles.sectionLabel}>Target Muscles</Text>
        <View style={styles.muscleChips}>
          {targetMuscles.map(muscle => (
            <View key={muscle} style={styles.muscleChip}>
              <Text style={styles.muscleChipText}>{formatMuscleName(muscle)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.exerciseList}>
        <Text style={styles.sectionLabel}>Exercises ({exercises.length})</Text>
        {exercises.slice(0, 4).map((exercise, index) => (
          <View key={exercise.exerciseId} style={styles.exerciseRow}>
            <Text style={styles.exerciseNumber}>{index + 1}</Text>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseSets}>
              {exercise.suggestedSets}×{exercise.suggestedReps}
            </Text>
          </View>
        ))}
        {exercises.length > 4 && (
          <Text style={styles.moreExercises}>
            +{exercises.length - 4} more exercises
          </Text>
        )}
      </View>

      <View style={styles.previewActions}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          activeOpacity={0.9}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
        {onModify && (
          <TouchableOpacity
            style={styles.modifyButton}
            onPress={onModify}
            activeOpacity={0.7}
          >
            <Text style={styles.modifyButtonText}>Modify</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Post-workout summary card
export const WorkoutComplete = ({
  workout,
  stats,
  xpEarned,
  xpBreakdown = [],
  newPRs = [],
  streakInfo,
  onDone,
  style,
}) => {
  return (
    <View style={[styles.completeContainer, style]}>
      {/* Celebration header */}
      <View style={styles.celebrationHeader}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
        <Text style={styles.celebrationTitle}>Workout Complete!</Text>
        <Text style={styles.celebrationSubtitle}>
          You're one step closer to your goals
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats?.duration || 0}</Text>
          <Text style={styles.statLabel}>minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats?.exercises || 0}</Text>
          <Text style={styles.statLabel}>exercises</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats?.sets || 0}</Text>
          <Text style={styles.statLabel}>sets</Text>
        </View>
      </View>

      {/* XP earned */}
      <View style={styles.xpSection}>
        <Text style={styles.xpTotal}>+{xpEarned} XP</Text>
        {xpBreakdown.length > 0 && (
          <View style={styles.xpBreakdown}>
            {xpBreakdown.map((item, index) => (
              <View key={index} style={styles.xpRow}>
                <Text style={styles.xpLabel}>{item.label}</Text>
                <Text style={styles.xpValue}>+{item.xp}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* PRs hit */}
      {newPRs.length > 0 && (
        <View style={styles.prSection}>
          <Text style={styles.prTitle}>🏆 New Personal Records</Text>
          {newPRs.map((pr, index) => (
            <Text key={index} style={styles.prItem}>{pr}</Text>
          ))}
        </View>
      )}

      {/* Streak info */}
      {streakInfo && (
        <View style={styles.streakSection}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakValue}>{streakInfo.currentStreak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
          {streakInfo.isNewRecord && (
            <View style={styles.newRecordBadge}>
              <Text style={styles.newRecordText}>New Record!</Text>
            </View>
          )}
        </View>
      )}

      {/* Done button */}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={onDone}
        activeOpacity={0.9}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

// Workout history item
export const WorkoutHistoryItem = ({
  workout,
  onPress,
}) => {
  const {
    date,
    type,
    duration,
    exercises = [],
    xpEarned,
    prsHit = [],
  } = workout;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.historyLeft}>
        <Text style={styles.historyDate}>{formattedDate}</Text>
        <Text style={styles.historyType}>{formatWorkoutType(type)}</Text>
        <Text style={styles.historyDetail}>
          {exercises.length} exercises • {duration} min
        </Text>
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyXP}>+{xpEarned} XP</Text>
        {prsHit.length > 0 && (
          <Text style={styles.historyPR}>🏆 {prsHit.length} PR</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Preview styles
  previewContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  previewType: {
    ...typography.styles.h3,
    color: colors.text,
  },
  previewDuration: {
    ...typography.styles.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  strugglingBadge: {
    backgroundColor: colors.warning + '20',
  },
  buildingBadge: {
    backgroundColor: colors.caution + '20',
  },
  consistentBadge: {
    backgroundColor: colors.success + '20',
  },
  crushingBadge: {
    backgroundColor: colors.primary + '20',
  },
  difficultyText: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },

  sectionLabel: {
    ...typography.styles.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  muscleList: {
    marginBottom: spacing.md,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  muscleChip: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  muscleChipText: {
    ...typography.styles.labelSmall,
    color: colors.primary,
  },

  exerciseList: {
    marginBottom: spacing.lg,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  exerciseNumber: {
    ...typography.styles.label,
    color: colors.textMuted,
    width: 24,
  },
  exerciseName: {
    ...typography.styles.body,
    color: colors.text,
    flex: 1,
  },
  exerciseSets: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  moreExercises: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  previewActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    alignItems: 'center',
  },
  startButtonText: {
    ...typography.styles.button,
    color: colors.white,
  },
  modifyButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  modifyButtonText: {
    ...typography.styles.button,
    color: colors.textSecondary,
  },

  // Complete styles
  completeContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  celebrationTitle: {
    ...typography.styles.h2,
    color: colors.text,
  },
  celebrationSubtitle: {
    ...typography.styles.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.styles.stat,
    color: colors.text,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  xpSection: {
    backgroundColor: colors.xp + '10',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
    marginBottom: spacing.md,
  },
  xpTotal: {
    ...typography.styles.h3,
    color: colors.xp,
    textAlign: 'center',
  },
  xpBreakdown: {
    marginTop: spacing.sm,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  xpLabel: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  xpValue: {
    ...typography.styles.label,
    color: colors.xp,
  },

  prSection: {
    backgroundColor: colors.warning + '10',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
    marginBottom: spacing.md,
  },
  prTitle: {
    ...typography.styles.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  prItem: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    paddingVertical: 2,
  },

  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakValue: {
    ...typography.styles.h3,
    color: colors.primary,
  },
  streakLabel: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
  newRecordBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  newRecordText: {
    ...typography.styles.labelSmall,
    color: colors.white,
  },

  doneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl * 2,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
  },
  doneButtonText: {
    ...typography.styles.button,
    color: colors.white,
  },

  // History item
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },
  historyType: {
    ...typography.styles.h6,
    color: colors.text,
    marginTop: 2,
  },
  historyDetail: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyXP: {
    ...typography.styles.label,
    color: colors.xp,
  },
  historyPR: {
    ...typography.styles.caption,
    color: colors.warning,
    marginTop: 2,
  },
});

export default WorkoutPreview;
