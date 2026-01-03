// HomeScreen
// Main dashboard with streak, muscle status, and workout suggestion

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

// Components
import { StreakDisplay } from '../components/StreakCounter';
import MuscleBar, { MuscleBarCompact } from '../components/MuscleBar';
import XPCounter from '../components/XPCounter';
import { WorkoutPreview } from '../components/WorkoutSummary';
import { ActionCard, StatCard } from '../components/Card';

// Engine & Storage
import dataManager from '../storage/dataManager';
import storage from '../storage/asyncStorage';
import { generateWorkout, generateQuickWorkout } from '../engine/workoutGenerator';
import { calculateAllMuscleRecovery, getMusclesByPriority } from '../engine/recoveryCalculator';
import { calculateDifficultyLevel, getMotivationalMessage } from '../engine/adaptiveDifficulty';
import { calculateConsistencyScore } from '../utils/calculations';
import { formatMuscleName } from '../utils/formatters';
import { MUSCLE_GROUPS } from '../data/muscles';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [muscleStatus, setMuscleStatus] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [settings, setSettings] = useState({});
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const appData = await dataManager.loadAppData();

      if (!appData.isInitialized) {
        // Initialize new user
        const newUser = await dataManager.initializeNewUser('Athlete');
        setUser(newUser);
        setMuscleStatus(await storage.getMuscleStatus());
        setWorkouts([]);
        setSettings(await storage.getSettings());
      } else {
        setUser(appData.user);
        setWorkouts(appData.workouts || []);
        setSettings(appData.settings || {});

        // Update muscle recovery
        const updatedMuscles = await dataManager.updateMuscleRecovery();
        setMuscleStatus(updatedMuscles);

        // Check streak
        await dataManager.checkAndUpdateStreak();
      }

      // Generate workout suggestion
      generateSuggestion();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestion = async () => {
    const muscleData = await storage.getMuscleStatus();
    const workoutHistory = await storage.getWorkouts();
    const userSettings = await storage.getSettings();
    const records = await storage.getPersonalRecords();

    const consistency = calculateConsistencyScore(workoutHistory, 4, 14);

    const workout = generateWorkout(
      muscleData,
      userSettings,
      workoutHistory,
      records,
      consistency
    );

    setSuggestedWorkout(workout);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartWorkout = () => {
    if (suggestedWorkout) {
      navigation.navigate('Workout', { workout: suggestedWorkout });
    }
  };

  const handleQuickWorkout = async () => {
    const muscleData = await storage.getMuscleStatus();
    const userSettings = await storage.getSettings();
    const quickWorkout = generateQuickWorkout(muscleData, userSettings);
    navigation.navigate('Workout', { workout: quickWorkout });
  };

  const handleMusclePress = (muscleId) => {
    navigation.navigate('MuscleDetail', { muscleId });
  };

  // Get muscle recovery data
  const muscleRecovery = muscleStatus ? calculateAllMuscleRecovery(muscleStatus) : {};
  const priorityMuscles = muscleStatus ? getMusclesByPriority(muscleStatus) : [];

  // Get motivational message
  const motivation = getMotivationalMessage(workouts, user?.stats?.currentStreak || 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name || 'Athlete'}! 👋
            </Text>
            <Text style={styles.subtitle}>{motivation.message}</Text>
          </View>
          <XPCounter totalXP={user?.stats?.totalXP || 0} showProgress={false} size="small" />
        </View>

        {/* Streak Display */}
        <View style={styles.streakContainer}>
          <StreakDisplay
            streak={user?.stats?.currentStreak || 0}
            shields={user?.stats?.streakShields || 0}
            longestStreak={user?.stats?.longestStreak || 0}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="This Week"
            value={workouts.filter(w => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(w.date) >= weekAgo;
            }).length}
            icon={<Text style={styles.statIcon}>📅</Text>}
            style={styles.statCard}
          />
          <StatCard
            label="Total Workouts"
            value={user?.stats?.totalWorkouts || 0}
            icon={<Text style={styles.statIcon}>💪</Text>}
            style={styles.statCard}
          />
          <StatCard
            label="Level"
            value={user?.stats?.level || 1}
            icon={<Text style={styles.statIcon}>⭐</Text>}
            style={styles.statCard}
          />
        </View>

        {/* Muscle Status Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Muscle Status</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MuscleDetail')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.muscleGrid}>
            {priorityMuscles.slice(0, 6).map(({ muscleId, recovery }) => (
              <View key={muscleId} style={styles.muscleItem}>
                <MuscleBarCompact
                  muscleId={muscleId}
                  recovery={recovery}
                  onPress={handleMusclePress}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Workout Suggestion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>

          {suggestedWorkout ? (
            <WorkoutPreview
              workout={suggestedWorkout}
              onStart={handleStartWorkout}
              onModify={() => {}}
              style={styles.workoutCard}
            />
          ) : (
            <View style={styles.restDayCard}>
              <Text style={styles.restDayEmoji}>😴</Text>
              <Text style={styles.restDayTitle}>Rest Day Recommended</Text>
              <Text style={styles.restDayText}>
                Your muscles need recovery. Come back tomorrow!
              </Text>
            </View>
          )}
        </View>

        {/* Quick Workout Option */}
        <ActionCard
          title="Short on time?"
          description="Try a quick 15-minute workout"
          actionLabel="Quick Workout"
          onAction={handleQuickWorkout}
          variant="secondary"
          style={styles.quickWorkoutCard}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greeting: {
    ...typography.styles.h3,
    color: colors.text,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  streakContainer: {
    marginBottom: spacing.lg,
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
  },

  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text,
  },
  seeAllText: {
    ...typography.styles.label,
    color: colors.primary,
  },

  muscleGrid: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  muscleItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },

  workoutCard: {
    marginTop: spacing.sm,
  },

  restDayCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  restDayEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  restDayTitle: {
    ...typography.styles.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  restDayText: {
    ...typography.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  quickWorkoutCard: {
    marginTop: spacing.md,
  },
});

export default HomeScreen;
