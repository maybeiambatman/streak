// RestTimer Component
// Full-screen countdown timer for rest between sets

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Vibration,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const RestTimer = ({
  visible = false,
  duration = 90,
  nextExercise,
  onComplete,
  onSkip,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeLeft(duration);
      setIsPaused(false);
    }
  }, [visible, duration]);

  useEffect(() => {
    if (visible && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            Vibration.vibrate([0, 500, 200, 500]);
            onComplete && onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visible, isPaused, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTime = (seconds) => {
    setTimeLeft(prev => prev + seconds);
  };

  const handleSubtractTime = (seconds) => {
    setTimeLeft(prev => Math.max(0, prev - seconds));
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onSkip && onSkip();
  };

  const progressPercent = ((duration - timeLeft) / duration) * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Progress bar at top */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.title}>Rest</Text>

          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

          {/* Time adjustment buttons */}
          <View style={styles.adjustButtons}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleSubtractTime(15)}
            >
              <Text style={styles.adjustButtonText}>-15s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleAddTime(15)}
            >
              <Text style={styles.adjustButtonText}>+15s</Text>
            </TouchableOpacity>
          </View>

          {/* Pause/Resume button */}
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={handleTogglePause}
          >
            <Text style={styles.pauseButtonText}>
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next exercise preview */}
        {nextExercise && (
          <View style={styles.nextExercise}>
            <Text style={styles.nextLabel}>Up Next</Text>
            <Text style={styles.nextName}>{nextExercise.name}</Text>
            <Text style={styles.nextDetail}>
              {nextExercise.suggestedSets} × {nextExercise.suggestedReps}
            </Text>
          </View>
        )}

        {/* Skip button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Rest</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Compact inline timer
export const MiniTimer = ({
  duration = 90,
  onComplete,
  autoStart = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete && onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsRunning(!isRunning);
  };

  return (
    <TouchableOpacity style={styles.miniContainer} onPress={handleToggle}>
      <Text style={styles.miniTime}>{formatTime(timeLeft)}</Text>
      <Text style={styles.miniLabel}>
        {isRunning ? 'tap to pause' : 'tap to start'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray900,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.gray700,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  content: {
    alignItems: 'center',
  },
  title: {
    ...typography.styles.h3,
    color: colors.gray400,
    marginBottom: spacing.md,
  },
  timer: {
    fontSize: 96,
    fontWeight: '800',
    color: colors.white,
    fontVariant: ['tabular-nums'],
  },

  adjustButtons: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  adjustButton: {
    backgroundColor: colors.gray700,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
  },
  adjustButtonText: {
    ...typography.styles.button,
    color: colors.white,
  },

  pauseButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.gray800,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
  },
  pauseButtonText: {
    ...typography.styles.button,
    color: colors.white,
  },

  nextExercise: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    backgroundColor: colors.gray800,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  nextLabel: {
    ...typography.styles.caption,
    color: colors.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextName: {
    ...typography.styles.h5,
    color: colors.white,
    marginTop: spacing.xs,
  },
  nextDetail: {
    ...typography.styles.bodySmall,
    color: colors.gray400,
  },

  skipButton: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    ...typography.styles.button,
    color: colors.primary,
  },

  // Mini timer
  miniContainer: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  miniTime: {
    ...typography.styles.h4,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  miniLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },
});

export default RestTimer;
