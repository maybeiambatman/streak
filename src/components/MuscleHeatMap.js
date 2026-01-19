// GainStreak Muscle Heat Map Component
// Visual body representation with recovery status

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, getRecoveryColor } from '../utils/colors';
import { MuscleGroups } from '../types';
import { getMuscleDisplayName, formatRecoveryTime } from '../services/recoveryCalculator';

const MuscleHeatMap = ({
  recoveryData = {},
  onMusclePress,
  showDetails = true,
  style,
}) => {
  const muscles = Object.values(MuscleGroups);

  const getMuscleData = (muscle) => {
    return recoveryData[muscle] || {
      recoveryScore: 100,
      color: getRecoveryColor(100),
      hoursUntilRecovered: 0,
    };
  };

  return (
    <View style={[styles.container, style]}>
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.recoveryFull }]} />
          <Text style={styles.legendText}>Ready</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.recoveryMedium }]} />
          <Text style={styles.legendText}>Recovering</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.recoveryNone }]} />
          <Text style={styles.legendText}>Rest</Text>
        </View>
      </View>

      {/* Muscle Grid - Front and Back View Simplified */}
      <View style={styles.bodyContainer}>
        {/* Upper Body Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upper Body</Text>
          <View style={styles.muscleRow}>
            <MuscleButton
              muscle={MuscleGroups.CHEST}
              data={getMuscleData(MuscleGroups.CHEST)}
              onPress={onMusclePress}
            />
            <MuscleButton
              muscle={MuscleGroups.BACK}
              data={getMuscleData(MuscleGroups.BACK)}
              onPress={onMusclePress}
            />
            <MuscleButton
              muscle={MuscleGroups.SHOULDERS}
              data={getMuscleData(MuscleGroups.SHOULDERS)}
              onPress={onMusclePress}
            />
          </View>
          <View style={styles.muscleRow}>
            <MuscleButton
              muscle={MuscleGroups.BICEPS}
              data={getMuscleData(MuscleGroups.BICEPS)}
              onPress={onMusclePress}
            />
            <MuscleButton
              muscle={MuscleGroups.TRICEPS}
              data={getMuscleData(MuscleGroups.TRICEPS)}
              onPress={onMusclePress}
            />
          </View>
        </View>

        {/* Core Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core</Text>
          <View style={styles.muscleRow}>
            <MuscleButton
              muscle={MuscleGroups.CORE}
              data={getMuscleData(MuscleGroups.CORE)}
              onPress={onMusclePress}
              wide
            />
          </View>
        </View>

        {/* Lower Body Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lower Body</Text>
          <View style={styles.muscleRow}>
            <MuscleButton
              muscle={MuscleGroups.QUADRICEPS}
              data={getMuscleData(MuscleGroups.QUADRICEPS)}
              onPress={onMusclePress}
            />
            <MuscleButton
              muscle={MuscleGroups.HAMSTRINGS}
              data={getMuscleData(MuscleGroups.HAMSTRINGS)}
              onPress={onMusclePress}
            />
          </View>
          <View style={styles.muscleRow}>
            <MuscleButton
              muscle={MuscleGroups.GLUTES}
              data={getMuscleData(MuscleGroups.GLUTES)}
              onPress={onMusclePress}
            />
            <MuscleButton
              muscle={MuscleGroups.CALVES}
              data={getMuscleData(MuscleGroups.CALVES)}
              onPress={onMusclePress}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

// Individual muscle button component
const MuscleButton = ({ muscle, data, onPress, wide = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.muscleButton,
        wide && styles.muscleButtonWide,
        { borderColor: data.color },
      ]}
      onPress={() => onPress?.(muscle)}
      activeOpacity={0.7}
    >
      <View style={[styles.recoveryIndicator, { backgroundColor: data.color }]}>
        <Text style={styles.recoveryPercent}>{Math.round(data.recoveryScore)}%</Text>
      </View>
      <Text style={styles.muscleName}>{getMuscleDisplayName(muscle)}</Text>
      {data.hoursUntilRecovered > 0 && (
        <Text style={styles.recoveryTime}>
          {formatRecoveryTime(data.hoursUntilRecovered)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Compact list view
export const MuscleRecoveryList = ({
  recoveryData = {},
  onMusclePress,
  style,
}) => {
  const sortedMuscles = Object.entries(recoveryData)
    .sort(([, a], [, b]) => b.recoveryScore - a.recoveryScore);

  return (
    <View style={[styles.listContainer, style]}>
      {sortedMuscles.map(([muscle, data]) => (
        <TouchableOpacity
          key={muscle}
          style={styles.listItem}
          onPress={() => onMusclePress?.(muscle)}
        >
          <View style={styles.listLeft}>
            <View
              style={[
                styles.listIndicator,
                { backgroundColor: data.color },
              ]}
            />
            <Text style={styles.listMuscleName}>
              {getMuscleDisplayName(muscle)}
            </Text>
          </View>
          <View style={styles.listRight}>
            <Text style={[styles.listPercent, { color: data.color }]}>
              {Math.round(data.recoveryScore)}%
            </Text>
            {data.hoursUntilRecovered > 0 && (
              <Text style={styles.listTime}>
                {formatRecoveryTime(data.hoursUntilRecovered)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Recovery bar for a single muscle (compact)
export const RecoveryBar = ({ muscle, recoveryScore, style }) => {
  const color = getRecoveryColor(recoveryScore);

  return (
    <View style={[styles.recoveryBarContainer, style]}>
      <View style={styles.recoveryBarHeader}>
        <Text style={styles.recoveryBarLabel}>
          {getMuscleDisplayName(muscle)}
        </Text>
        <Text style={[styles.recoveryBarPercent, { color }]}>
          {Math.round(recoveryScore)}%
        </Text>
      </View>
      <View style={styles.recoveryBarTrack}>
        <View
          style={[
            styles.recoveryBarFill,
            { width: `${recoveryScore}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bodyContainer: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  muscleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  muscleButton: {
    flex: 1,
    maxWidth: 110,
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  muscleButtonWide: {
    maxWidth: 200,
  },
  recoveryIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  recoveryPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
  muscleName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  recoveryTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // List styles
  listContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  listMuscleName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  listRight: {
    alignItems: 'flex-end',
  },
  listPercent: {
    fontSize: 15,
    fontWeight: '700',
  },
  listTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Recovery bar styles
  recoveryBarContainer: {
    marginBottom: 12,
  },
  recoveryBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recoveryBarLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  recoveryBarPercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  recoveryBarTrack: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  recoveryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default MuscleHeatMap;
