// GainStreak Workout Screen
// Active workout session with exercise logging

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore, useWorkoutStore } from '../hooks/useStore';
import { colors } from '../utils/colors';
import { formatDuration } from '../utils/calculations';

import { ExerciseCard } from '../components/ExerciseList';
import SetLogger from '../components/SetLogger';
import CelebrationModal from '../components/CelebrationModal';

const WorkoutScreen = ({ route, navigation }) => {
  const { workout: initialWorkout } = route.params || {};

  const { completeWorkout: saveWorkout, settings } = useAppStore();
  const {
    isActive,
    workout,
    exerciseLogs,
    currentExerciseIndex,
    startWorkout,
    updateSet,
    completeSet,
    addSet,
    setCurrentExercise,
    finishWorkout,
    cancelWorkout,
    getWorkoutSummary,
  } = useWorkoutStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);

  // Initialize workout
  useEffect(() => {
    if (initialWorkout && !isActive) {
      startWorkout(initialWorkout);
    }
  }, [initialWorkout]);

  // Timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isActive]);

  // Handle set completion
  const handleCompleteSet = (exerciseIndex, setIndex) => {
    completeSet(exerciseIndex, setIndex);
  };

  // Handle set update
  const handleUpdateSet = (exerciseIndex, setIndex, data) => {
    updateSet(exerciseIndex, setIndex, data);
  };

  // Complete workout
  const handleCompleteWorkout = async () => {
    const completedWorkout = finishWorkout();

    try {
      const result = await saveWorkout(completedWorkout);

      setCompletionData({
        workoutStats: {
          duration: completedWorkout.duration,
          exercises: completedWorkout.exercises.length,
          completedSets: completedWorkout.exercises.reduce(
            (sum, ex) => sum + ex.sets.length,
            0
          ),
          totalVolume: completedWorkout.totalVolume,
        },
        xpEarned: result.xpEarned || 150,
        xpBreakdown: [
          { label: 'Workout Complete', xp: 100 },
          { label: 'Exercises', xp: completedWorkout.exercises.length * 15 },
          { label: 'Streak Bonus', xp: Math.min(result.streakData?.currentStreak * 5 || 0, 50) },
        ],
        newPRs: result.newPRs || [],
        streakInfo: {
          currentStreak: result.streakData?.currentStreak || 0,
          isNewRecord: result.streakData?.currentStreak >= result.streakData?.longestStreak,
        },
      });

      setShowCelebration(true);
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  // Handle exit
  const handleExit = () => {
    Alert.alert(
      'End Workout?',
      'Your progress will be lost if you exit now.',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'Save & Exit',
          onPress: handleCompleteWorkout,
        },
        {
          text: 'Exit Without Saving',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Handle celebration close
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    navigation.goBack();
  };

  if (!isActive || !workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No workout loaded</Text>
      </SafeAreaView>
    );
  }

  // Calculate progress
  const totalSets = exerciseLogs.reduce(
    (sum, ex) => sum + ex.sets.length,
    0
  );
  const completedSets = exerciseLogs.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const canComplete = exerciseLogs.every(ex => ex.sets.some(s => s.completed));

  const weightUnit = settings?.weightUnit || 'kg';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <Text style={styles.workoutTime}>{elapsedTime} min</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.progressText}>{completedSets}/{totalSets}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Exercise list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exerciseLogs.map((exercise, exerciseIndex) => {
          const isCurrentExercise = exerciseIndex === currentExerciseIndex;
          const isExpanded = expandedExercise === exerciseIndex;
          const allSetsCompleted = exercise.sets.every(s => s.completed);

          return (
            <ExerciseCard
              key={exercise.exerciseId || exerciseIndex}
              exercise={exercise}
              isActive={isCurrentExercise}
              isExpanded={isExpanded}
              onPress={() => setCurrentExercise(exerciseIndex)}
              onExpand={() => setExpandedExercise(isExpanded ? null : exerciseIndex)}
            >
              {/* Set loggers */}
              {exercise.sets.map((set, setIndex) => (
                <SetLogger
                  key={setIndex}
                  setNumber={setIndex + 1}
                  weight={set.weight}
                  reps={set.reps}
                  isCompleted={set.completed}
                  weightUnit={weightUnit}
                  onUpdate={(data) => handleUpdateSet(exerciseIndex, setIndex, data)}
                  onComplete={() => handleCompleteSet(exerciseIndex, setIndex)}
                />
              ))}

              {/* Add set button */}
              {!allSetsCompleted && (
                <TouchableOpacity
                  style={styles.addSetButton}
                  onPress={() => addSet(exerciseIndex)}
                >
                  <Text style={styles.addSetText}>+ Add Set</Text>
                </TouchableOpacity>
              )}
            </ExerciseCard>
          );
        })}

        {/* Complete workout button */}
        {canComplete && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteWorkout}
          >
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Exercise navigation */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
          onPress={() => setCurrentExercise(Math.max(0, currentExerciseIndex - 1))}
          disabled={currentExerciseIndex === 0}
        >
          <Text style={[styles.navButtonText, currentExerciseIndex === 0 && styles.navButtonTextDisabled]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        <Text style={styles.navIndicator}>
          {currentExerciseIndex + 1} / {exerciseLogs.length}
        </Text>

        <TouchableOpacity
          style={[styles.navButton, currentExerciseIndex === exerciseLogs.length - 1 && styles.navButtonDisabled]}
          onPress={() => setCurrentExercise(Math.min(exerciseLogs.length - 1, currentExerciseIndex + 1))}
          disabled={currentExerciseIndex === exerciseLogs.length - 1}
        >
          <Text style={[styles.navButtonText, currentExerciseIndex === exerciseLogs.length - 1 && styles.navButtonTextDisabled]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Celebration modal */}
      <CelebrationModal
        visible={showCelebration}
        onClose={handleCelebrationClose}
        {...completionData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  headerCenter: {
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  workoutTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerRight: {},
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  progressBar: {
    height: 4,
    backgroundColor: colors.gray200,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  addSetButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    marginTop: 8,
  },
  addSetText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },

  completeButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },

  bottomSpacer: {
    height: 100,
  },

  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
  navIndicator: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

export default WorkoutScreen;
