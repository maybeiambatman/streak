// GainStreak Streak Display Component
// Prominent streak counter with fire animation

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors, getStreakColor } from '../utils/colors';
import { StreakMilestones } from '../types';

const StreakDisplay = ({
  currentStreak = 0,
  longestStreak = 0,
  streakFreezesRemaining = 0,
  isAtRisk = false,
  style,
}) => {
  const streakColor = getStreakColor(currentStreak);

  // Find next milestone
  const nextMilestone = StreakMilestones.find(m => m > currentStreak) || StreakMilestones[StreakMilestones.length - 1];
  const prevMilestone = [...StreakMilestones].reverse().find(m => m <= currentStreak) || 0;
  const progressToMilestone = currentStreak > 0
    ? ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    : 0;

  return (
    <View style={[styles.container, style]}>
      {/* Main streak display */}
      <View style={styles.mainDisplay}>
        <View style={styles.fireContainer}>
          <Text style={styles.fireEmoji}>
            {currentStreak >= 7 ? '🔥' : currentStreak > 0 ? '✨' : '💪'}
          </Text>
        </View>

        <View style={styles.streakInfo}>
          <Text style={[styles.streakNumber, { color: streakColor }]}>
            {currentStreak}
          </Text>
          <Text style={styles.streakLabel}>
            day{currentStreak !== 1 ? 's' : ''} streak
          </Text>
        </View>

        {/* Streak freezes */}
        {streakFreezesRemaining > 0 && (
          <View style={styles.freezeContainer}>
            <Text style={styles.freezeIcon}>🛡️</Text>
            <Text style={styles.freezeCount}>{streakFreezesRemaining}</Text>
          </View>
        )}
      </View>

      {/* Progress to next milestone */}
      {currentStreak > 0 && currentStreak < nextMilestone && (
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${progressToMilestone}%`, backgroundColor: streakColor },
              ]}
            />
          </View>
          <Text style={styles.milestoneText}>
            {nextMilestone - currentStreak} day{nextMilestone - currentStreak !== 1 ? 's' : ''} to {nextMilestone}-day milestone
          </Text>
        </View>
      )}

      {/* At risk warning */}
      {isAtRisk && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Work out today to keep your streak!
          </Text>
        </View>
      )}

      {/* Longest streak */}
      {longestStreak > currentStreak && (
        <Text style={styles.longestStreak}>
          Personal best: {longestStreak} days
        </Text>
      )}
    </View>
  );
};

// Compact version for headers
export const StreakBadge = ({ currentStreak = 0, style }) => {
  const streakColor = getStreakColor(currentStreak);

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeEmoji}>
        {currentStreak >= 7 ? '🔥' : '✨'}
      </Text>
      <Text style={[styles.badgeNumber, { color: streakColor }]}>
        {currentStreak}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireContainer: {
    marginRight: 12,
  },
  fireEmoji: {
    fontSize: 48,
  },
  streakInfo: {
    alignItems: 'flex-start',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
  },
  streakLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  freezeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    backgroundColor: colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freezeIcon: {
    fontSize: 16,
  },
  freezeCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  progressSection: {
    width: '100%',
    marginTop: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  milestoneText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  warningContainer: {
    marginTop: 12,
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
  },
  longestStreak: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Badge styles
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default StreakDisplay;
