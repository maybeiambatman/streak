// GainStreak Set Logger Component
// Easy-to-use interface for logging workout sets

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../utils/colors';

const SetLogger = ({
  setNumber,
  weight,
  reps,
  previousWeight,
  previousReps,
  isCompleted,
  onUpdate,
  onComplete,
  onRemove,
  weightUnit = 'kg',
  style,
}) => {
  const [localWeight, setLocalWeight] = useState(weight?.toString() || '0');
  const [localReps, setLocalReps] = useState(reps?.toString() || '10');

  const handleWeightChange = (value) => {
    setLocalWeight(value);
    const numValue = parseFloat(value) || 0;
    onUpdate?.({ weight: numValue, reps: parseInt(localReps) || 0 });
  };

  const handleRepsChange = (value) => {
    setLocalReps(value);
    const numValue = parseInt(value) || 0;
    onUpdate?.({ weight: parseFloat(localWeight) || 0, reps: numValue });
  };

  const handleComplete = () => {
    onComplete?.({
      weight: parseFloat(localWeight) || 0,
      reps: parseInt(localReps) || 0,
    });
  };

  const incrementWeight = (amount) => {
    const newWeight = Math.max(0, (parseFloat(localWeight) || 0) + amount);
    setLocalWeight(newWeight.toString());
    onUpdate?.({ weight: newWeight, reps: parseInt(localReps) || 0 });
  };

  const incrementReps = (amount) => {
    const newReps = Math.max(0, (parseInt(localReps) || 0) + amount);
    setLocalReps(newReps.toString());
    onUpdate?.({ weight: parseFloat(localWeight) || 0, reps: newReps });
  };

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer, style]}>
      {/* Set number */}
      <View style={styles.setNumberContainer}>
        <Text style={[styles.setNumber, isCompleted && styles.completedText]}>
          {setNumber}
        </Text>
      </View>

      {/* Previous info */}
      {previousWeight !== undefined && previousReps !== undefined && (
        <View style={styles.previousContainer}>
          <Text style={styles.previousText}>
            Last: {previousWeight}{weightUnit} × {previousReps}
          </Text>
        </View>
      )}

      {/* Weight input */}
      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => incrementWeight(-2.5)}
          disabled={isCompleted}
        >
          <Text style={styles.adjustButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isCompleted && styles.completedInput]}
            value={localWeight}
            onChangeText={handleWeightChange}
            keyboardType="numeric"
            editable={!isCompleted}
            selectTextOnFocus
          />
          <Text style={styles.inputUnit}>{weightUnit}</Text>
        </View>

        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => incrementWeight(2.5)}
          disabled={isCompleted}
        >
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Reps input */}
      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => incrementReps(-1)}
          disabled={isCompleted}
        >
          <Text style={styles.adjustButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isCompleted && styles.completedInput]}
            value={localReps}
            onChangeText={handleRepsChange}
            keyboardType="numeric"
            editable={!isCompleted}
            selectTextOnFocus
          />
          <Text style={styles.inputUnit}>reps</Text>
        </View>

        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => incrementReps(1)}
          disabled={isCompleted}
        >
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Complete/Remove buttons */}
      <View style={styles.actionContainer}>
        {!isCompleted ? (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>✓</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✓</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Compact set row for viewing completed sets
export const CompletedSetRow = ({
  setNumber,
  weight,
  reps,
  rpe,
  weightUnit = 'kg',
  isPersonalBest = false,
  style,
}) => {
  return (
    <View style={[styles.completedRow, style]}>
      <Text style={styles.completedSetNumber}>{setNumber}</Text>
      <Text style={styles.completedWeight}>{weight} {weightUnit}</Text>
      <Text style={styles.completedReps}>{reps} reps</Text>
      {rpe && <Text style={styles.completedRpe}>RPE {rpe}</Text>}
      {isPersonalBest && <Text style={styles.prBadge}>PR!</Text>}
    </View>
  );
};

// Quick weight buttons
export const QuickWeightButtons = ({
  weights = [2.5, 5, 10, 20],
  onSelect,
  weightUnit = 'kg',
  style,
}) => {
  return (
    <View style={[styles.quickButtonsContainer, style]}>
      {weights.map((weight) => (
        <TouchableOpacity
          key={weight}
          style={styles.quickButton}
          onPress={() => onSelect(weight)}
        >
          <Text style={styles.quickButtonText}>+{weight}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  completedContainer: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '40',
  },
  setNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  completedText: {
    color: colors.success,
  },
  previousContainer: {
    position: 'absolute',
    top: -8,
    left: 44,
  },
  previousText: {
    fontSize: 11,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  adjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  inputContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  input: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    minWidth: 50,
    padding: 4,
  },
  completedInput: {
    color: colors.success,
  },
  inputUnit: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionContainer: {
    marginLeft: 'auto',
  },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.surface,
  },
  completedBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.surface,
  },

  // Completed row styles
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  completedSetNumber: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  completedWeight: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  completedReps: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  completedRpe: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  prBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },

  // Quick buttons styles
  quickButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  quickButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.gray100,
    borderRadius: 20,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default SetLogger;
