// ProgressScreen
// Stats, achievements, and progress visualization

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

// Components
import XPCounter, { LevelDisplay, XPRing } from '../components/XPCounter';
import { StatCard } from '../components/Card';

// Storage & Data
import storage from '../storage/asyncStorage';
import { ACHIEVEMENTS, getAchievementsByCategory, ACHIEVEMENT_CATEGORIES } from '../data/achievements';
import { xpProgressToNextLevel, levelFromXP } from '../utils/calculations';
import { formatNumber, formatCount } from '../utils/formatters';

const ProgressScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [personalRecords, setPersonalRecords] = useState({});
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [userData, workoutData, prData, achievementData] = await Promise.all([
        storage.getUser(),
        storage.getWorkouts(),
        storage.getPersonalRecords(),
        storage.getUnlockedAchievements(),
      ]);

      setUser(userData);
      setWorkouts(workoutData || []);
      setPersonalRecords(prData || {});
      setUnlockedAchievements(achievementData || []);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = user?.stats || {};
  const totalXP = stats.totalXP || 0;
  const level = levelFromXP(totalXP);
  const xpProgress = xpProgressToNextLevel(totalXP);

  // Get top PRs
  const topPRs = Object.entries(personalRecords)
    .map(([exerciseId, pr]) => ({
      exerciseId,
      ...pr,
      display: `${pr.weight} lbs × ${pr.reps} reps`,
    }))
    .sort((a, b) => (b.weight * b.reps) - (a.weight * a.reps))
    .slice(0, 5);

  // Achievement progress
  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const unlockedCount = unlockedAchievements.length;
  const achievementProgress = Math.round((unlockedCount / totalAchievements) * 100);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Progress</Text>

        {/* Level & XP Section */}
        <View style={styles.levelSection}>
          <View style={styles.levelCard}>
            <XPRing totalXP={totalXP} size={100} />
            <View style={styles.levelInfo}>
              <LevelDisplay totalXP={totalXP} />
              <View style={styles.xpProgressContainer}>
                <View style={styles.xpProgressBar}>
                  <View
                    style={[styles.xpProgressFill, { width: `${xpProgress.progress}%` }]}
                  />
                </View>
                <Text style={styles.xpProgressText}>
                  {formatNumber(xpProgress.currentXP)} / {formatNumber(xpProgress.neededXP)} XP
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>All-Time Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Workouts"
              value={formatNumber(stats.totalWorkouts || 0)}
              icon={<Text style={styles.statIcon}>💪</Text>}
              style={styles.statCard}
            />
            <StatCard
              label="Current Streak"
              value={stats.currentStreak || 0}
              icon={<Text style={styles.statIcon}>🔥</Text>}
              style={styles.statCard}
            />
            <StatCard
              label="Best Streak"
              value={stats.longestStreak || 0}
              icon={<Text style={styles.statIcon}>🏆</Text>}
              style={styles.statCard}
            />
            <StatCard
              label="Total Reps"
              value={formatNumber(stats.totalReps || 0)}
              icon={<Text style={styles.statIcon}>📊</Text>}
              style={styles.statCard}
            />
            <StatCard
              label="PRs Hit"
              value={stats.totalPRs || 0}
              icon={<Text style={styles.statIcon}>⭐</Text>}
              style={styles.statCard}
            />
            <StatCard
              label="Exercises Tried"
              value={stats.uniqueExercises || 0}
              icon={<Text style={styles.statIcon}>🎯</Text>}
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Personal Records */}
        {topPRs.length > 0 && (
          <View style={styles.prSection}>
            <Text style={styles.sectionTitle}>Personal Records</Text>
            <View style={styles.prList}>
              {topPRs.map((pr, index) => (
                <View key={pr.exerciseId} style={styles.prItem}>
                  <View style={styles.prRank}>
                    <Text style={styles.prRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.prInfo}>
                    <Text style={styles.prExercise}>
                      {pr.exerciseId.replace(/_/g, ' ')}
                    </Text>
                    <Text style={styles.prValue}>{pr.display}</Text>
                  </View>
                  <Text style={styles.prEmoji}>🏅</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.achievementProgress}>
              {unlockedCount}/{totalAchievements} ({achievementProgress}%)
            </Text>
          </View>

          {/* Achievement categories */}
          {Object.values(ACHIEVEMENT_CATEGORIES).map(category => {
            const categoryAchievements = getAchievementsByCategory(category.id);
            const unlockedInCategory = categoryAchievements.filter(
              a => unlockedAchievements.includes(a.id)
            );

            return (
              <View key={category.id} style={styles.achievementCategory}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {unlockedInCategory.length}/{categoryAchievements.length}
                  </Text>
                </View>

                <View style={styles.achievementGrid}>
                  {categoryAchievements.slice(0, 6).map(achievement => {
                    const isUnlocked = unlockedAchievements.includes(achievement.id);

                    return (
                      <View
                        key={achievement.id}
                        style={[
                          styles.achievementBadge,
                          !isUnlocked && styles.achievementBadgeLocked,
                        ]}
                      >
                        <Text style={styles.achievementIcon}>
                          {isUnlocked ? '🏆' : '🔒'}
                        </Text>
                        <Text
                          style={[
                            styles.achievementName,
                            !isUnlocked && styles.achievementNameLocked,
                          ]}
                          numberOfLines={1}
                        >
                          {achievement.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  headerTitle: {
    ...typography.styles.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  levelSection: {
    marginBottom: spacing.lg,
  },
  levelCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  levelInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  xpProgressContainer: {
    marginTop: spacing.sm,
  },
  xpProgressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: colors.xp,
    borderRadius: borderRadius.full,
  },
  xpProgressText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  statsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    width: '31%',
  },
  statIcon: {
    fontSize: 20,
  },

  prSection: {
    marginBottom: spacing.lg,
  },
  prList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  prItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  prRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  prRankText: {
    ...typography.styles.labelSmall,
    color: colors.primary,
    fontWeight: '600',
  },
  prInfo: {
    flex: 1,
  },
  prExercise: {
    ...typography.styles.body,
    color: colors.text,
    textTransform: 'capitalize',
  },
  prValue: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  prEmoji: {
    fontSize: 20,
  },

  achievementsSection: {
    marginBottom: spacing.lg,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  achievementProgress: {
    ...typography.styles.label,
    color: colors.primary,
  },
  achievementCategory: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    ...typography.styles.h6,
    color: colors.text,
  },
  categoryCount: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achievementBadge: {
    width: '30%',
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  achievementBadgeLocked: {
    backgroundColor: colors.gray100,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  achievementName: {
    ...typography.styles.caption,
    color: colors.text,
    textAlign: 'center',
  },
  achievementNameLocked: {
    color: colors.textMuted,
  },
});

export default ProgressScreen;
