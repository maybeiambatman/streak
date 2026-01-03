// ExerciseCard Component
// Displays exercise information during workout

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { formatMuscleName, formatWeight, formatReps } from '../utils/formatters';
import { MuscleBarMini } from './MuscleBar';

const ExerciseCard = ({
  exercise,
  exerciseIndex,
  onSetComplete,
  onUpdateSet,
  isActive = false,
  previousPerformance,
  onPress,
}) => {
  const {
    exerciseId,
    name,
    primaryMuscles = [],
    suggestedSets,
    suggestedReps,
    suggestedWeight,
    formCues = [],
    sets = [],
    restTime,
  } = exercise;

  const [showFormCues, setShowFormCues] = useState(false);

  const completedSets = sets.filter(s => s.completed).length;
  const totalSets = suggestedSets || sets.length || 3;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.containerActive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.exerciseNumber}>{exerciseIndex + 1}</Text>
          <View>
            <Text style={styles.exerciseName}>{name}</Text>
            <View style={styles.muscleRow}>
              {primaryMuscles.map(muscle => (
                <Text key={muscle} style={styles.muscleTag}>
                  {formatMuscleName(muscle)}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {completedSets}/{totalSets}
          </Text>
        </View>
      </View>

      {/* Suggestion */}
      <View style={styles.suggestion}>
        <Text style={styles.suggestionText}>
          {suggestedSets} × {formatReps(suggestedReps)}
          {suggestedWeight > 0 && ` @ ${formatWeight(suggestedWeight)}`}
        </Text>
        {previousPerformance && (
          <Text style={styles.previousText}>
            Last: {previousPerformance.weight} × {previousPerformance.reps}
          </Text>
        )}
      </View>

      {/* Sets */}
      {isActive && (
        <View style={styles.setsContainer}>
          {Array.from({ length: totalSets }).map((_, index) => (
            <SetRow
              key={index}
              setNumber={index + 1}
              set={sets[index]}
              suggestedWeight={suggestedWeight}
              suggestedReps={suggestedReps}
              onComplete={(data) => onSetComplete(index, data)}
              onUpdate={(data) => onUpdateSet(index, data)}
            />
          ))}
        </View>
      )}

      {/* Form Cues */}
      {isActive && formCues.length > 0 && (
        <TouchableOpacity
          style={styles.formCuesToggle}
          onPress={() => setShowFormCues(!showFormCues)}
        >
          <Text style={styles.formCuesToggleText}>
            {showFormCues ? 'Hide' : 'Show'} Form Tips
          </Text>
        </TouchableOpacity>
      )}

      {isActive && showFormCues && formCues.length > 0 && (
        <View style={styles.formCues}>
          {formCues.map((cue, index) => (
            <View key={index} style={styles.formCue}>
              <Text style={styles.formCueBullet}>•</Text>
              <Text style={styles.formCueText}>{cue}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Individual set row
const SetRow = ({
  setNumber,
  set,
  suggestedWeight,
  suggestedReps,
  onComplete,
  onUpdate,
}) => {
  const [weight, setWeight] = useState(
    set?.weight?.toString() || suggestedWeight?.toString() || ''
  );
  const [reps, setReps] = useState(
    set?.reps?.toString() || suggestedReps?.toString().split('-')[0] || ''
  );
  const isCompleted = set?.completed;

  const handleComplete = () => {
    const weightNum = parseFloat(weight) || 0;
    const repsNum = parseInt(reps) || 0;

    if (repsNum > 0) {
      onComplete({
        weight: weightNum,
        reps: repsNum,
        completed: true,
      });
    }
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    onUpdate({ weight: parseFloat(value) || 0 });
  };

  const handleRepsChange = (value) => {
    setReps(value);
    onUpdate({ reps: parseInt(value) || 0 });
  };

  return (
    <View style={[styles.setRow, isCompleted && styles.setRowCompleted]}>
      <Text style={styles.setNumber}>Set {setNumber}</Text>

      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.setInput, isCompleted && styles.setInputCompleted]}
            value={weight}
            onChangeText={handleWeightChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.gray400}
            editable={!isCompleted}
          />
          <Text style={styles.inputLabel}>lbs</Text>
        </View>

        <Text style={styles.inputSeparator}>×</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.setInput, isCompleted && styles.setInputCompleted]}
            value={reps}
            onChangeText={handleRepsChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.gray400}
            editable={!isCompleted}
          />
          <Text style={styles.inputLabel}>reps</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.completeButton,
          isCompleted && styles.completeButtonDone,
        ]}
        onPress={handleComplete}
        disabled={isCompleted}
      >
        <Text style={[
          styles.completeButtonText,
          isCompleted && styles.completeButtonTextDone,
        ]}>
          {isCompleted ? '✓' : 'Done'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Compact exercise card for lists
export const ExerciseCardCompact = ({
  exercise,
  onPress,
  showProgress = true,
}) => {
  const {
    name,
    primaryMuscles = [],
    suggestedSets,
    suggestedReps,
    sets = [],
  } = exercise;

  const completedSets = sets.filter(s => s.completed).length;
  const totalSets = suggestedSets || 3;

  return (
    <TouchableOpacity
      style={styles.compactContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.compactLeft}>
        <Text style={styles.compactName}>{name}</Text>
        <Text style={styles.compactDetail}>
          {suggestedSets} × {formatReps(suggestedReps)}
        </Text>
      </View>

      {showProgress && (
        <View style={styles.compactProgress}>
          <Text style={styles.compactProgressText}>
            {completedSets}/{totalSets}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  containerActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  exerciseNumber: {
    ...typography.styles.h4,
    color: colors.primary,
    marginRight: spacing.sm,
    minWidth: 24,
  },
  exerciseName: {
    ...typography.styles.h5,
    color: colors.text,
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  muscleTag: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  progressIndicator: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  progressText: {
    ...typography.styles.label,
    color: colors.textSecondary,
  },

  suggestion: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  suggestionText: {
    ...typography.styles.body,
    color: colors.text,
  },
  previousText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  setsContainer: {
    marginTop: spacing.md,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  setRowCompleted: {
    backgroundColor: colors.success + '10',
    borderRadius: borderRadius.sm,
    marginHorizontal: -spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  setNumber: {
    ...typography.styles.label,
    color: colors.textSecondary,
    width: 50,
  },
  setInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setInput: {
    ...typography.styles.body,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: 50,
    textAlign: 'center',
  },
  setInputCompleted: {
    backgroundColor: colors.success + '20',
  },
  inputLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  inputSeparator: {
    ...typography.styles.body,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    marginLeft: spacing.sm,
  },
  completeButtonDone: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    ...typography.styles.buttonSmall,
    color: colors.white,
  },
  completeButtonTextDone: {
    color: colors.white,
  },

  formCuesToggle: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  formCuesToggleText: {
    ...typography.styles.labelSmall,
    color: colors.primary,
  },
  formCues: {
    marginTop: spacing.sm,
    backgroundColor: colors.gray50,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  formCue: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  formCueBullet: {
    ...typography.styles.caption,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  formCueText: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    flex: 1,
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
  },
  compactLeft: {
    flex: 1,
  },
  compactName: {
    ...typography.styles.body,
    color: colors.text,
    fontWeight: '500',
  },
  compactDetail: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  compactProgress: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  compactProgressText: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
  },
});

export default ExerciseCard;
