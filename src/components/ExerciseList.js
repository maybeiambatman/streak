// GainStreak Exercise List Component
// Displays list of exercises in a workout

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/colors';
import { getMuscleDisplayName } from '../services/recoveryCalculator';

const ExerciseList = ({
  exercises,
  onExercisePress,
  currentExerciseIndex,
  showProgress = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {exercises.map((exercise, index) => {
        const isActive = index === currentExerciseIndex;
        const isCompleted = exercise.sets?.every(s => s.completed);
        const completedSets = exercise.sets?.filter(s => s.completed).length || 0;
        const totalSets = exercise.sets?.length || exercise.suggestedSets || 3;

        return (
          <TouchableOpacity
            key={exercise.id || index}
            style={[
              styles.exerciseItem,
              isActive && styles.activeItem,
              isCompleted && styles.completedItem,
            ]}
            onPress={() => onExercisePress?.(index)}
          >
            {/* Exercise number/status */}
            <View style={[
              styles.numberContainer,
              isActive && styles.activeNumber,
              isCompleted && styles.completedNumber,
            ]}>
              {isCompleted ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.number,
                  isActive && styles.activeNumberText,
                ]}>
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Exercise info */}
            <View style={styles.exerciseInfo}>
              <Text style={[
                styles.exerciseName,
                isActive && styles.activeText,
                isCompleted && styles.completedText,
              ]}>
                {exercise.name}
              </Text>
              <Text style={styles.exerciseMeta}>
                {getMuscleDisplayName(exercise.primaryMuscleGroup)} · {totalSets} sets
              </Text>
            </View>

            {/* Progress indicator */}
            {showProgress && !isCompleted && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {completedSets}/{totalSets}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Single exercise card with more details
export const ExerciseCard = ({
  exercise,
  isActive,
  isExpanded,
  onPress,
  onExpand,
  children,
  style,
}) => {
  return (
    <View style={[
      styles.cardContainer,
      isActive && styles.activeCard,
      style,
    ]}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardName}>{exercise.name}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>
                {getMuscleDisplayName(exercise.primaryMuscleGroup)}
              </Text>
            </View>
            {exercise.equipment && (
              <Text style={styles.equipmentText}>
                {Array.isArray(exercise.equipment)
                  ? exercise.equipment[0]
                  : exercise.equipment}
              </Text>
            )}
          </View>
        </View>
        {onExpand && (
          <TouchableOpacity onPress={onExpand} style={styles.expandButton}>
            <Text style={styles.expandIcon}>
              {isExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Form cues / tips */}
      {isExpanded && exercise.tips && (
        <View style={styles.tipsContainer}>
          {exercise.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Children (usually set loggers) */}
      {children && (
        <View style={styles.cardContent}>
          {children}
        </View>
      )}
    </View>
  );
};

// Exercise preview for selection
export const ExerciseSelectItem = ({
  exercise,
  isSelected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.selectItem,
        isSelected && styles.selectedItem,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.selectLeft}>
        <Text style={[
          styles.selectName,
          isSelected && styles.selectedText,
        ]}>
          {exercise.name}
        </Text>
        <View style={styles.selectMeta}>
          <Text style={styles.selectMuscle}>
            {getMuscleDisplayName(exercise.primaryMuscleGroup)}
          </Text>
          <Text style={styles.selectDifficulty}>
            · {exercise.difficulty}
          </Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.selectedCheck}>
          <Text style={styles.selectedCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  activeItem: {
    backgroundColor: colors.primary + '10',
  },
  completedItem: {
    opacity: 0.7,
  },
  numberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeNumber: {
    backgroundColor: colors.primary,
  },
  completedNumber: {
    backgroundColor: colors.success,
  },
  number: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  activeNumberText: {
    color: colors.surface,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  activeText: {
    color: colors.primary,
  },
  completedText: {
    color: colors.success,
  },
  exerciseMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Card styles
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCard: {
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  muscleTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  muscleTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  equipmentText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  expandButton: {
    padding: 8,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tipsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.gray50,
  },
  tipItem: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  tipBullet: {
    color: colors.primary,
    marginRight: 8,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  cardContent: {
    padding: 12,
    paddingTop: 0,
  },

  // Select item styles
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  selectedItem: {
    backgroundColor: colors.primary + '10',
  },
  selectLeft: {
    flex: 1,
  },
  selectName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
  },
  selectMeta: {
    flexDirection: 'row',
    marginTop: 2,
  },
  selectMuscle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  selectDifficulty: {
    fontSize: 13,
    color: colors.textLight,
  },
  selectedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
});

export default ExerciseList;
