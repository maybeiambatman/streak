// GainStreak Home Screen
// Main dashboard with streak, recovery status, and workout suggestions

import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useAppStore } from '../hooks/useStore';
import { colors } from '../utils/colors';
import { isStreakAtRisk, getLevelProgress } from '../utils/calculations';

import StreakDisplay from '../components/StreakDisplay';
import MuscleHeatMap, { MuscleRecoveryList } from '../components/MuscleHeatMap';
import WorkoutCard, { RestDayCard } from '../components/WorkoutCard';

const HomeScreen = ({ navigation }) => {
  const {
    isLoading,
    userProfile,
    streakData,
    recoveryData,
    suggestedWorkout,
    workouts,
    refreshRecovery,
    initialize,
  } = useAppStore();

  const [refreshing, setRefreshing] = React.useState(false);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      refreshRecovery();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRecovery();
    setRefreshing(false);
  };

  const handleStartWorkout = () => {
    if (suggestedWorkout) {
      navigation.navigate('Workout', { workout: suggestedWorkout });
    }
  };

  // Calculate stats
  const thisWeekWorkouts = workouts.filter(w => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.date || w.completedAt) >= weekAgo;
  }).length;

  const levelProgress = getLevelProgress(userProfile?.totalXP || 0);
  const streakAtRisk = isStreakAtRisk(streakData?.lastWorkoutDate);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hey, {userProfile?.name || 'Athlete'}!
            </Text>
            <Text style={styles.subtitle}>
              {getMotivationalMessage(streakData?.currentStreak || 0, thisWeekWorkouts)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.levelBadge}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.levelText}>Lvl {levelProgress.currentLevel}</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Display */}
        <StreakDisplay
          currentStreak={streakData?.currentStreak || 0}
          longestStreak={streakData?.longestStreak || 0}
          streakFreezesRemaining={streakData?.streakFreezesRemaining || 0}
          isAtRisk={streakAtRisk}
          style={styles.streakCard}
        />

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="This Week"
            value={thisWeekWorkouts}
            icon="📅"
          />
          <StatCard
            label="Total"
            value={workouts.length}
            icon="💪"
          />
          <StatCard
            label="XP"
            value={userProfile?.totalXP || 0}
            icon="⭐"
          />
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          {suggestedWorkout ? (
            <WorkoutCard
              workout={suggestedWorkout}
              onStart={handleStartWorkout}
              onCustomize={() => {}}
            />
          ) : (
            <RestDayCard />
          )}
        </View>

        {/* Muscle Recovery Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recovery Status</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>
          {recoveryData && (
            <MuscleHeatMap
              recoveryData={recoveryData}
              onMusclePress={(muscle) => {
                navigation.navigate('Recovery', { selectedMuscle: muscle });
              }}
            />
          )}
        </View>

        {/* Recent Activity */}
        {workouts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>
            {workouts.slice(0, 3).map((workout, index) => (
              <RecentWorkoutItem key={workout.id || index} workout={workout} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Stat card component
const StatCard = ({ label, value, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Recent workout item
const RecentWorkoutItem = ({ workout }) => {
  const date = new Date(workout.date || workout.completedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.recentItem}>
      <View style={styles.recentLeft}>
        <Text style={styles.recentDate}>{formattedDate}</Text>
        <Text style={styles.recentName}>{workout.name}</Text>
      </View>
      {workout.xpEarned && (
        <View style={styles.recentXP}>
          <Text style={styles.recentXPText}>+{workout.xpEarned} XP</Text>
        </View>
      )}
    </View>
  );
};

// Motivational message based on streak and activity
const getMotivationalMessage = (streak, thisWeek) => {
  if (streak >= 30) return "You're on fire! Keep that momentum going.";
  if (streak >= 14) return "Two weeks strong! You're building a habit.";
  if (streak >= 7) return "One week down! Consistency is key.";
  if (streak >= 3) return "Great start! Keep showing up.";
  if (thisWeek >= 3) return "Solid week so far!";
  if (thisWeek >= 1) return "Good to see you back!";
  return "Ready to get stronger?";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },

  streakCard: {
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentLeft: {
    flex: 1,
  },
  recentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recentName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  recentXP: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  recentXPText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default HomeScreen;
