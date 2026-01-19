// GainStreak Workout Card Component
// Displays workout suggestion and workout summary

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/colors';
import { getMuscleDisplayName } from '../services/recoveryCalculator';
import { formatDuration } from '../utils/calculations';

const WorkoutCard = ({
  workout,
  onStart,
  onCustomize,
  showDetails = true,
  style,
}) => {
  if (!workout) return null;

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription}>
            {workout.description || `${workout.exercises?.length || 0} exercises`}
          </Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            ~{workout.estimatedDuration || 45}min
          </Text>
        </View>
      </View>

      {/* Target muscles */}
      {workout.focusMuscleGroups && (
        <View style={styles.muscleChips}>
          {workout.focusMuscleGroups.slice(0, 4).map((muscle) => (
            <View key={muscle} style={styles.muscleChip}>
              <Text style={styles.muscleChipText}>
                {getMuscleDisplayName(muscle)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Exercise preview */}
      {showDetails && workout.exercises && (
        <View style={styles.exerciseList}>
          {workout.exercises.slice(0, 4).map((exercise, index) => (
            <View key={exercise.id || index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseSets}>
                {exercise.suggestedSets || 3} × {exercise.suggestedReps || '10'}
              </Text>
            </View>
          ))}
          {workout.exercises.length > 4 && (
            <Text style={styles.moreExercises}>
              +{workout.exercises.length - 4} more exercises
            </Text>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {onCustomize && (
          <TouchableOpacity
            style={styles.customizeButton}
            onPress={onCustomize}
          >
            <Text style={styles.customizeButtonText}>Customize</Text>
          </TouchableOpacity>
        )}
        {onStart && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={onStart}
          >
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Rest day card
export const RestDayCard = ({ hoursUntilReady, nextWorkout, style }) => {
  return (
    <View style={[styles.restContainer, style]}>
      <Text style={styles.restEmoji}>😴</Text>
      <Text style={styles.restTitle}>Rest Day Recommended</Text>
      <Text style={styles.restDescription}>
        Your muscles need more recovery time.
        {hoursUntilReady > 0 && ` Try again in ${formatDuration(Math.round(hoursUntilReady / 60))}.`}
      </Text>
      {nextWorkout && (
        <Text style={styles.nextWorkoutText}>
          Next suggested: {nextWorkout.name}
        </Text>
      )}
    </View>
  );
};

// Workout summary card (for history)
export const WorkoutSummaryCard = ({
  workout,
  onPress,
  style,
}) => {
  const date = new Date(workout.date || workout.completedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const totalSets = workout.exercises?.reduce(
    (sum, ex) => sum + (ex.sets?.length || 0),
    0
  ) || 0;

  return (
    <TouchableOpacity
      style={[styles.summaryContainer, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.summaryLeft}>
        <Text style={styles.summaryDate}>{formattedDate}</Text>
        <Text style={styles.summaryName}>{workout.name}</Text>
        <Text style={styles.summaryStats}>
          {workout.exercises?.length || 0} exercises · {totalSets} sets · {workout.duration || 0}min
        </Text>
      </View>
      {workout.xpEarned && (
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{workout.xpEarned} XP</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Compact workout preview
export const WorkoutPreview = ({
  name,
  duration,
  exerciseCount,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.previewContainer, style]}
      onPress={onPress}
    >
      <View style={styles.previewIcon}>
        <Text style={styles.previewEmoji}>💪</Text>
      </View>
      <View style={styles.previewInfo}>
        <Text style={styles.previewName}>{name}</Text>
        <Text style={styles.previewStats}>
          {exerciseCount} exercises · ~{duration}min
        </Text>
      </View>
      <Text style={styles.previewArrow}>→</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  workoutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  durationBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  muscleChip: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  exerciseList: {
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  exerciseName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  exerciseSets: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  moreExercises: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  customizeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.gray100,
    alignItems: 'center',
  },
  customizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  startButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },

  // Rest day styles
  restContainer: {
    backgroundColor: colors.gray100,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  restEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  restTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  restDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nextWorkoutText: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 12,
  },

  // Summary styles
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  summaryStats: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  // Preview styles
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewEmoji: {
    fontSize: 20,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  previewStats: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  previewArrow: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

export default WorkoutCard;
