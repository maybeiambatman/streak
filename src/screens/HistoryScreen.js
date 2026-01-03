// HistoryScreen
// Workout history with calendar view

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

// Components
import { WorkoutHistoryItem } from '../components/WorkoutSummary';

// Storage & Utils
import storage from '../storage/asyncStorage';
import { formatDate, getFriendlyDate, getMonthName, getDatesInRange } from '../utils/dateHelpers';
import { formatWorkoutType, formatDuration } from '../utils/formatters';

const HistoryScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const loadWorkouts = async () => {
    try {
      const allWorkouts = await storage.getWorkouts();
      setWorkouts(allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get workouts for selected month
  const getMonthWorkouts = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    return workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.getFullYear() === year && workoutDate.getMonth() === month;
    });
  };

  // Get workout dates for calendar highlighting
  const getWorkoutDates = () => {
    return new Set(workouts.map(w => formatDate(w.date, 'yyyy-MM-dd')));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); // Days to pad at start

    const days = [];

    // Add empty padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push({ empty: true, key: `empty-start-${i}` });
    }

    // Add actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        day: d,
        key: formatDate(date, 'yyyy-MM-dd'),
        hasWorkout: getWorkoutDates().has(formatDate(date, 'yyyy-MM-dd')),
      });
    }

    return days;
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const next = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
    if (next <= new Date()) {
      setSelectedMonth(next);
    }
  };

  const monthWorkouts = getMonthWorkouts();
  const calendarDays = generateCalendarDays();
  const workoutDates = getWorkoutDates();

  // Stats for the month
  const monthStats = {
    workouts: monthWorkouts.length,
    totalDuration: monthWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    totalXP: monthWorkouts.reduce((sum, w) => sum + (w.xpEarned || 0), 0),
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'calendar' && styles.toggleButtonActive]}
            onPress={() => setViewMode('calendar')}
          >
            <Text style={[styles.toggleText, viewMode === 'calendar' && styles.toggleTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'calendar' ? (
          <>
            {/* Month Navigation */}
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthNavButton}>
                <Text style={styles.monthNavText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {getMonthName(selectedMonth)} {selectedMonth.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={goToNextMonth}
                style={[
                  styles.monthNavButton,
                  selectedMonth.getMonth() === new Date().getMonth() &&
                    selectedMonth.getFullYear() === new Date().getFullYear() &&
                    styles.monthNavButtonDisabled,
                ]}
              >
                <Text style={styles.monthNavText}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendar}>
              {/* Week day headers */}
              <View style={styles.weekDays}>
                {weekDays.map(day => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>

              {/* Calendar days */}
              <View style={styles.calendarGrid}>
                {calendarDays.map((item, index) => (
                  <View key={item.key} style={styles.calendarDay}>
                    {!item.empty && (
                      <View
                        style={[
                          styles.dayCircle,
                          item.hasWorkout && styles.dayCircleActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            item.hasWorkout && styles.dayTextActive,
                          ]}
                        >
                          {item.day}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Month Stats */}
            <View style={styles.monthStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{monthStats.workouts}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{monthStats.totalDuration}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{monthStats.totalXP}</Text>
                <Text style={styles.statLabel}>XP Earned</Text>
              </View>
            </View>

            {/* Month Workouts */}
            <View style={styles.monthWorkouts}>
              <Text style={styles.sectionTitle}>
                Workouts in {getMonthName(selectedMonth, true)}
              </Text>
              {monthWorkouts.length > 0 ? (
                monthWorkouts.map(workout => (
                  <WorkoutHistoryItem
                    key={workout.id}
                    workout={workout}
                    onPress={() => {}}
                  />
                ))
              ) : (
                <View style={styles.emptyMonth}>
                  <Text style={styles.emptyText}>No workouts this month</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          /* List View */
          <View style={styles.listView}>
            {workouts.length > 0 ? (
              workouts.map(workout => (
                <WorkoutHistoryItem
                  key={workout.id}
                  workout={workout}
                  onPress={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyList}>
                <Text style={styles.emptyEmoji}>🏋️</Text>
                <Text style={styles.emptyTitle}>No workouts yet</Text>
                <Text style={styles.emptyText}>
                  Complete your first workout to see it here!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  toggleButtonActive: {
    backgroundColor: colors.white,
  },
  toggleText: {
    ...typography.styles.labelSmall,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.text,
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthNavButton: {
    padding: spacing.sm,
  },
  monthNavButtonDisabled: {
    opacity: 0.3,
  },
  monthNavText: {
    fontSize: 24,
    color: colors.primary,
  },
  monthTitle: {
    ...typography.styles.h4,
    color: colors.text,
  },

  calendar: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayText: {
    ...typography.styles.labelSmall,
    color: colors.textMuted,
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.primary,
  },
  dayText: {
    ...typography.styles.body,
    color: colors.text,
  },
  dayTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  monthStats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  monthWorkouts: {},
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyMonth: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },

  listView: {},
  emptyList: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.styles.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});

export default HistoryScreen;
