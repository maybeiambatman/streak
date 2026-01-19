// GainStreak Celebration Modal Component
// Displayed after completing a workout with satisfying animations

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../utils/colors';
import { formatDuration } from '../utils/calculations';

const CelebrationModal = ({
  visible,
  onClose,
  workoutStats,
  xpEarned,
  xpBreakdown = [],
  newPRs = [],
  streakInfo,
  levelUp,
  newLevel,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header celebration */}
          <View style={styles.header}>
            <Text style={styles.celebrationEmoji}>
              {levelUp ? '🎉' : newPRs.length > 0 ? '🏆' : '💪'}
            </Text>
            <Text style={styles.title}>
              {levelUp ? 'Level Up!' : 'Workout Complete!'}
            </Text>
            {levelUp && (
              <Text style={styles.levelUpText}>
                You've reached Level {newLevel}!
              </Text>
            )}
          </View>

          {/* Workout summary */}
          {workoutStats && (
            <View style={styles.statsCard}>
              <Text style={styles.cardTitle}>Workout Summary</Text>
              <View style={styles.statsGrid}>
                <StatItem
                  label="Duration"
                  value={formatDuration(workoutStats.duration)}
                  emoji="⏱️"
                />
                <StatItem
                  label="Exercises"
                  value={workoutStats.exercises}
                  emoji="🎯"
                />
                <StatItem
                  label="Sets"
                  value={workoutStats.completedSets}
                  emoji="📊"
                />
                <StatItem
                  label="Volume"
                  value={`${Math.round(workoutStats.totalVolume / 1000)}k`}
                  unit="kg"
                  emoji="🏋️"
                />
              </View>
            </View>
          )}

          {/* XP earned */}
          <View style={styles.xpCard}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpEmoji}>⭐</Text>
              <Text style={styles.xpTotal}>+{xpEarned} XP</Text>
            </View>
            {xpBreakdown.length > 0 && (
              <View style={styles.xpBreakdown}>
                {xpBreakdown.map((item, index) => (
                  <View key={index} style={styles.xpItem}>
                    <Text style={styles.xpLabel}>{item.label}</Text>
                    <Text style={styles.xpValue}>+{item.xp}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* New PRs */}
          {newPRs.length > 0 && (
            <View style={styles.prCard}>
              <Text style={styles.cardTitle}>New Personal Records! 🏆</Text>
              {newPRs.map((pr, index) => (
                <View key={index} style={styles.prItem}>
                  <Text style={styles.prExercise}>{pr.exerciseName}</Text>
                  <Text style={styles.prValue}>
                    {pr.weight}kg × {pr.reps} reps
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Streak info */}
          {streakInfo && (
            <View style={styles.streakCard}>
              <View style={styles.streakHeader}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakDays}>
                  {streakInfo.currentStreak} Day Streak
                </Text>
              </View>
              {streakInfo.isNewRecord && (
                <Text style={styles.streakRecord}>
                  New personal record!
                </Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Close button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Stat item component
const StatItem = ({ label, value, unit, emoji }) => (
  <View style={styles.statItem}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>
      {value}{unit && <Text style={styles.statUnit}>{unit}</Text>}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Milestone celebration modal
export const MilestoneModal = ({
  visible,
  onClose,
  milestone,
  streakDays,
}) => {
  const getMilestoneEmoji = (days) => {
    if (days >= 365) return '👑';
    if (days >= 180) return '💎';
    if (days >= 90) return '🏆';
    if (days >= 60) return '🌟';
    if (days >= 30) return '🔥';
    if (days >= 14) return '⚡';
    return '✨';
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.milestoneOverlay}>
        <View style={styles.milestoneContainer}>
          <Text style={styles.milestoneEmoji}>
            {getMilestoneEmoji(milestone)}
          </Text>
          <Text style={styles.milestoneTitle}>
            {milestone}-Day Milestone!
          </Text>
          <Text style={styles.milestoneDescription}>
            You've worked out consistently for {milestone} days!
            Keep up the amazing work!
          </Text>

          {/* Reward info */}
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardEmoji}>🛡️</Text>
            <Text style={styles.rewardText}>
              +1 Streak Freeze Earned
            </Text>
          </View>

          <TouchableOpacity
            style={styles.milestoneButton}
            onPress={onClose}
          >
            <Text style={styles.milestoneButtonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  levelUpText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },

  // Stats card
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
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
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // XP card
  xpCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  xpEmoji: {
    fontSize: 28,
    marginRight: 8,
  },
  xpTotal: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  xpBreakdown: {
    borderTopWidth: 1,
    borderTopColor: colors.primary + '30',
    paddingTop: 12,
  },
  xpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  xpLabel: {
    fontSize: 14,
    color: colors.text,
  },
  xpValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  // PR card
  prCard: {
    backgroundColor: colors.warning + '15',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  prItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.warning + '30',
  },
  prExercise: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  prValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.warning,
  },

  // Streak card
  streakCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  streakDays: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  streakRecord: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },

  // Footer
  footer: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },

  // Milestone modal
  milestoneOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  milestoneContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  milestoneEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  milestoneTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  milestoneDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  rewardEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  rewardText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success,
  },
  milestoneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
  },
  milestoneButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
});

export default CelebrationModal;
