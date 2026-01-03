// MuscleStatusScreen
// Detailed muscle recovery status with body map visualization

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
import { colors, getRecoveryColor, getRecoveryStatus } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

// Components
import MuscleBar from '../components/MuscleBar';

// Data & Storage
import storage from '../storage/asyncStorage';
import dataManager from '../storage/dataManager';
import { MUSCLE_GROUPS, MUSCLE_CATEGORIES } from '../data/muscles';
import { calculateAllMuscleRecovery, getTimeUntilRecovered } from '../engine/recoveryCalculator';
import { formatMuscleName, formatHoursMinutes } from '../utils/formatters';
import { getRelativeTime } from '../utils/dateHelpers';

const MuscleStatusScreen = ({ navigation, route }) => {
  const { muscleId: initialMuscle } = route.params || {};

  const [muscleStatus, setMuscleStatus] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(initialMuscle);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'body'
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const updated = await dataManager.updateMuscleRecovery();
      setMuscleStatus(updated);
    } catch (error) {
      console.error('Error loading muscle status:', error);
    } finally {
      setLoading(false);
    }
  };

  const recoveryData = muscleStatus ? calculateAllMuscleRecovery(muscleStatus) : {};

  // Get selected muscle details
  const selectedMuscleData = selectedMuscle && muscleStatus?.muscles[selectedMuscle];
  const selectedMuscleConfig = selectedMuscle && MUSCLE_GROUPS[selectedMuscle];
  const selectedRecovery = selectedMuscle && recoveryData[selectedMuscle];

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Muscle Status</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Fresh (70-100%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Recovered (40-69%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.caution }]} />
            <Text style={styles.legendText}>Recovering (20-39%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Needs Rest (0-19%)</Text>
          </View>
        </View>

        {/* Muscle Groups by Category */}
        {MUSCLE_CATEGORIES.map(category => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <View style={styles.muscleList}>
              {category.muscles.map(muscleId => {
                const muscle = muscleStatus?.muscles[muscleId];
                const recovery = recoveryData[muscleId] || 100;
                const muscleConfig = MUSCLE_GROUPS[muscleId];
                const isSelected = selectedMuscle === muscleId;

                return (
                  <TouchableOpacity
                    key={muscleId}
                    style={[styles.muscleCard, isSelected && styles.muscleCardSelected]}
                    onPress={() => setSelectedMuscle(muscleId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.muscleCardHeader}>
                      <Text style={styles.muscleCardName}>
                        {formatMuscleName(muscleId)}
                      </Text>
                      <Text style={[styles.muscleCardStatus, { color: getRecoveryColor(recovery) }]}>
                        {getRecoveryStatus(recovery)}
                      </Text>
                    </View>

                    <MuscleBar
                      muscleId={muscleId}
                      recovery={recovery}
                      showLabel={false}
                      size="small"
                    />

                    <View style={styles.muscleCardFooter}>
                      <Text style={styles.muscleCardPercent}>{Math.round(recovery)}%</Text>
                      {muscle?.lastTrained && (
                        <Text style={styles.muscleCardLast}>
                          Last: {getRelativeTime(muscle.lastTrained)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Selected Muscle Detail */}
        {selectedMuscle && selectedMuscleData && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>
              {formatMuscleName(selectedMuscle)} Details
            </Text>

            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Recovery Status</Text>
                <Text style={[styles.detailValue, { color: getRecoveryColor(selectedRecovery) }]}>
                  {getRecoveryStatus(selectedRecovery)} ({Math.round(selectedRecovery)}%)
                </Text>
              </View>

              {selectedMuscleData.lastTrained && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Trained</Text>
                    <Text style={styles.detailValue}>
                      {getRelativeTime(selectedMuscleData.lastTrained)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Intensity</Text>
                    <Text style={styles.detailValue}>
                      {selectedMuscleData.lastIntensity || 'Moderate'}
                    </Text>
                  </View>

                  {selectedRecovery < 100 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Full Recovery In</Text>
                      <Text style={styles.detailValue}>
                        ~{formatHoursMinutes(
                          getTimeUntilRecovered(selectedMuscleData, selectedMuscle, 100) * 60
                        )}
                      </Text>
                    </View>
                  )}

                  {selectedMuscleData.lastExercises?.length > 0 && (
                    <View style={styles.detailExercises}>
                      <Text style={styles.detailLabel}>Last Exercises</Text>
                      <View style={styles.exerciseChips}>
                        {selectedMuscleData.lastExercises.map((ex, index) => (
                          <View key={index} style={styles.exerciseChip}>
                            <Text style={styles.exerciseChipText}>
                              {ex.replace(/_/g, ' ')}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              )}

              {!selectedMuscleData.lastTrained && (
                <View style={styles.neverTrained}>
                  <Text style={styles.neverTrainedText}>
                    This muscle hasn't been trained yet. It's ready to go!
                  </Text>
                </View>
              )}
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    ...typography.styles.h5,
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  legend: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  legendText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },

  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    ...typography.styles.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  muscleList: {
    gap: spacing.sm,
  },
  muscleCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  muscleCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  muscleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  muscleCardName: {
    ...typography.styles.h6,
    color: colors.text,
  },
  muscleCardStatus: {
    ...typography.styles.labelSmall,
  },
  muscleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  muscleCardPercent: {
    ...typography.styles.label,
    color: colors.textSecondary,
  },
  muscleCardLast: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  detailSection: {
    marginTop: spacing.md,
  },
  detailTitle: {
    ...typography.styles.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  detailCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  detailLabel: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.styles.body,
    color: colors.text,
    fontWeight: '500',
  },
  detailExercises: {
    paddingTop: spacing.sm,
  },
  exerciseChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  exerciseChip: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  exerciseChipText: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  neverTrained: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  neverTrainedText: {
    ...typography.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MuscleStatusScreen;
