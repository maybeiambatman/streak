// GainStreak History Screen
// Displays workout history and statistics

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore } from '../hooks/useStore';
import { colors } from '../utils/colors';
import { formatDuration, getLevelProgress } from '../utils/calculations';
import { WorkoutSummaryCard } from '../components/WorkoutCard';

const HistoryScreen = ({ navigation }) => {
  const { workouts, userProfile, streakData } = useAppStore();

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const thisWeekWorkouts = workouts.filter(w => {
      const date = new Date(w.date || w.completedAt);
      return date >= weekAgo;
    });

    const thisMonthWorkouts = workouts.filter(w => {
      const date = new Date(w.date || w.completedAt);
      return date >= monthAgo;
    });

    const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    return {
      totalWorkouts: workouts.length,
      thisWeek: thisWeekWorkouts.length,
      thisMonth: thisMonthWorkouts.length,
      totalVolume: Math.round(totalVolume / 1000), // In tons
      totalDuration: totalDuration,
      avgDuration: workouts.length > 0 ? Math.round(totalDuration / workouts.length) : 0,
    };
  }, [workouts]);

  // Group workouts by month
  const groupedWorkouts = useMemo(() => {
    const groups = {};

    workouts
      .sort((a, b) => new Date(b.date || b.completedAt) - new Date(a.date || a.completedAt))
      .forEach(workout => {
        const date = new Date(workout.date || workout.completedAt);
        const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (!groups[monthKey]) {
          groups[monthKey] = [];
        }
        groups[monthKey].push(workout);
      });

    return groups;
  }, [workouts]);

  const levelProgress = getLevelProgress(userProfile?.totalXP || 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Progress</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.thisWeek}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakData?.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakData?.longestStreak || 0}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.statsRow}>
            <View style={styles.statItemWide}>
              <Text style={styles.statEmoji}>🏋️</Text>
              <View>
                <Text style={styles.statValueSmall}>{stats.totalVolume}k kg</Text>
                <Text style={styles.statLabelSmall}>Total Volume</Text>
              </View>
            </View>
            <View style={styles.statItemWide}>
              <Text style={styles.statEmoji}>⏱️</Text>
              <View>
                <Text style={styles.statValueSmall}>{formatDuration(stats.totalDuration)}</Text>
                <Text style={styles.statLabelSmall}>Time Spent</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level {levelProgress.currentLevel}</Text>
            <Text style={styles.xpText}>
              {levelProgress.xpInCurrentLevel} / {levelProgress.xpNeededForLevel} XP
            </Text>
          </View>
          <View style={styles.levelBarContainer}>
            <View
              style={[
                styles.levelBarFill,
                { width: `${levelProgress.progressPercent}%` },
              ]}
            />
          </View>
        </View>

        {/* Workout History */}
        {Object.keys(groupedWorkouts).length > 0 ? (
          Object.entries(groupedWorkouts).map(([month, monthWorkouts]) => (
            <View key={month} style={styles.monthSection}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>{month}</Text>
                <Text style={styles.monthCount}>
                  {monthWorkouts.length} workout{monthWorkouts.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {monthWorkouts.map((workout) => (
                <WorkoutSummaryCard
                  key={workout.id}
                  workout={workout}
                  onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}
                />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💪</Text>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptyText}>
              Complete your first workout to see your history here
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },

  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItemWide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  statValueSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabelSmall: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  levelCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  xpText: {
    fontSize: 14,
    color: colors.text,
  },
  levelBarContainer: {
    height: 8,
    backgroundColor: colors.primary + '30',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },

  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  monthCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },
});

export default HistoryScreen;
