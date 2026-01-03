// WorkoutScreen
// Active workout with exercise logging

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

// Components
import ExerciseCard from '../components/ExerciseCard';
import RestTimer from '../components/RestTimer';
import Button from '../components/Button';
import { WorkoutComplete } from '../components/WorkoutSummary';

// Engine & Storage
import dataManager from '../storage/dataManager';
import { calculateWorkoutXP } from '../engine/xpCalculator';
import { formatDuration } from '../utils/formatters';

const WorkoutScreen = ({ route, navigation }) => {
  const { workout: initialWorkout } = route.params;

  const [workout, setWorkout] = useState(() => ({
    ...initialWorkout,
    exercises: initialWorkout.exercises.map(ex => ({
      ...ex,
      sets: Array(ex.suggestedSets || 3).fill(null).map(() => ({
        weight: ex.suggestedWeight || 0,
        reps: parseInt(ex.suggestedReps) || 10,
        completed: false,
      })),
    })),
  }));

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  const scrollViewRef = useRef(null);

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((new Date() - startTime) / 1000 / 60));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Handle set completion
  const handleSetComplete = (exerciseIndex, setIndex, setData) => {
    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      const exercise = { ...newExercises[exerciseIndex] };
      exercise.sets = [...exercise.sets];
      exercise.sets[setIndex] = {
        ...exercise.sets[setIndex],
        ...setData,
        completed: true,
      };
      newExercises[exerciseIndex] = exercise;

      return { ...prev, exercises: newExercises };
    });

    // Show rest timer if not the last set
    const exercise = workout.exercises[exerciseIndex];
    const isLastSet = setIndex === exercise.sets.length - 1;

    if (!isLastSet) {
      setIsResting(true);
    }
  };

  // Handle set update (before completion)
  const handleSetUpdate = (exerciseIndex, setIndex, setData) => {
    setWorkout(prev => {
      const newExercises = [...prev.exercises];
      const exercise = { ...newExercises[exerciseIndex] };
      exercise.sets = [...exercise.sets];
      exercise.sets[setIndex] = {
        ...exercise.sets[setIndex],
        ...setData,
      };
      newExercises[exerciseIndex] = exercise;

      return { ...prev, exercises: newExercises };
    });
  };

  // Navigate to next exercise
  const handleNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);

      // Scroll to the exercise
      // In a real app, you'd scroll to the specific exercise
    }
  };

  // Navigate to previous exercise
  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  // Complete workout
  const handleCompleteWorkout = async () => {
    const duration = Math.floor((new Date() - startTime) / 1000 / 60);

    try {
      const result = await dataManager.completeWorkout({
        ...workout,
        duration,
        intensity: 'moderate',
      });

      // Calculate XP earned
      const xpResult = calculateWorkoutXP(workout, result.user.stats.currentStreak, {
        newPRs: result.newPRs.length,
      });

      setCompletionData({
        workout: result.workout,
        stats: {
          duration,
          exercises: workout.exercises.length,
          sets: workout.exercises.reduce(
            (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
            0
          ),
        },
        xpEarned: result.xpEarned,
        xpBreakdown: xpResult.breakdown,
        newPRs: result.newPRs,
        streakInfo: {
          currentStreak: result.user.stats.currentStreak,
          isNewRecord: result.user.stats.currentStreak >= result.user.stats.longestStreak,
        },
        levelUp: result.levelUp,
        newLevel: result.newLevel,
      });

      setShowComplete(true);
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  // Confirm exit
  const handleExit = () => {
    Alert.alert(
      'End Workout?',
      'Your progress will be lost if you exit now.',
      [
        { text: 'Continue Workout', style: 'cancel' },
        {
          text: 'End Without Saving',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Save & Exit',
          onPress: handleCompleteWorkout,
        },
      ]
    );
  };

  // Check if all exercises have at least one completed set
  const canComplete = workout.exercises.every(
    ex => ex.sets.some(s => s.completed)
  );

  // Calculate progress
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + (ex.suggestedSets || ex.sets.length),
    0
  );
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
    0
  );
  const progressPercent = (completedSets / totalSets) * 100;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const nextExercise = workout.exercises[currentExerciseIndex + 1];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <Text style={styles.workoutTime}>{elapsedTime} min</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.progressText}>
            {completedSets}/{totalSets} sets
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Exercise list */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.exerciseId}
            exercise={exercise}
            exerciseIndex={index}
            isActive={index === currentExerciseIndex}
            onSetComplete={(setIndex, data) => handleSetComplete(index, setIndex, data)}
            onUpdateSet={(setIndex, data) => handleSetUpdate(index, setIndex, data)}
            onPress={() => setCurrentExerciseIndex(index)}
          />
        ))}

        {/* Complete button */}
        {canComplete && (
          <Button
            title="Complete Workout"
            onPress={handleCompleteWorkout}
            variant="primary"
            size="large"
            fullWidth
            style={styles.completeButton}
          />
        )}
      </ScrollView>

      {/* Exercise navigation */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePreviousExercise}
          disabled={currentExerciseIndex === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <Text style={styles.navIndicator}>
          {currentExerciseIndex + 1} / {workout.exercises.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentExerciseIndex === workout.exercises.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextExercise}
          disabled={currentExerciseIndex === workout.exercises.length - 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Rest timer */}
      <RestTimer
        visible={isResting}
        duration={currentExercise?.restTime || 90}
        nextExercise={nextExercise}
        onComplete={() => setIsResting(false)}
        onSkip={() => setIsResting(false)}
      />

      {/* Completion modal */}
      <Modal
        visible={showComplete}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.completeModal}>
          {completionData && (
            <WorkoutComplete
              workout={completionData.workout}
              stats={completionData.stats}
              xpEarned={completionData.xpEarned}
              xpBreakdown={completionData.xpBreakdown}
              newPRs={completionData.newPRs}
              streakInfo={completionData.streakInfo}
              onDone={() => {
                setShowComplete(false);
                navigation.goBack();
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
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
    ...typography.styles.h5,
    color: colors.text,
  },
  workoutTime: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  headerRight: {},
  progressText: {
    ...typography.styles.label,
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
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  completeButton: {
    marginTop: spacing.lg,
  },

  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  navButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    ...typography.styles.button,
    color: colors.primary,
  },
  navIndicator: {
    ...typography.styles.label,
    color: colors.textSecondary,
  },

  completeModal: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    padding: spacing.md,
  },
});

export default WorkoutScreen;
