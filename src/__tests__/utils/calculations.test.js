// Unit tests for calculation utilities

import {
  calculateRecoveryScore,
  calculateIntensity,
  calculateStreak,
  isStreakAtRisk,
  calculateWorkoutXP,
  calculateLevel,
  getXPForNextLevel,
  getLevelProgress,
  formatDuration,
  formatWeight,
  convertWeight,
} from '../../utils/calculations';

describe('calculateRecoveryScore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns 100 for muscle never trained', () => {
    const score = calculateRecoveryScore('chest', null, 50, 25);
    expect(score).toBe(100);
  });

  it('returns 0 for muscle just trained', () => {
    const now = new Date();
    jest.setSystemTime(now);
    const score = calculateRecoveryScore('chest', now.toISOString(), 50, 25);
    expect(score).toBe(0);
  });

  it('returns partial recovery after some time', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    // 24 hours ago, moderate intensity
    const trainedDate = new Date('2024-01-14T12:00:00Z').toISOString();
    const score = calculateRecoveryScore('chest', trainedDate, 50, 25);

    // Chest base recovery is 2 days, with 50% intensity multiplier of 1.25
    // After 1 day, should be about 40% recovered
    expect(score).toBeGreaterThan(30);
    expect(score).toBeLessThan(60);
  });

  it('recovers slower for older users', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);
    const trainedDate = new Date('2024-01-14T12:00:00Z').toISOString();

    const scoreYoung = calculateRecoveryScore('chest', trainedDate, 50, 25);
    const scoreOld = calculateRecoveryScore('chest', trainedDate, 50, 45);

    expect(scoreYoung).toBeGreaterThan(scoreOld);
  });

  it('recovers slower for higher intensity', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);
    const trainedDate = new Date('2024-01-14T12:00:00Z').toISOString();

    const scoreLow = calculateRecoveryScore('chest', trainedDate, 30, 25);
    const scoreHigh = calculateRecoveryScore('chest', trainedDate, 90, 25);

    expect(scoreLow).toBeGreaterThan(scoreHigh);
  });

  it('larger muscles recover slower', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);
    const trainedDate = new Date('2024-01-14T12:00:00Z').toISOString();

    const scoreQuads = calculateRecoveryScore('quadriceps', trainedDate, 50, 25);
    const scoreBiceps = calculateRecoveryScore('biceps', trainedDate, 50, 25);

    // Biceps recover faster than quads
    expect(scoreBiceps).toBeGreaterThan(scoreQuads);
  });
});

describe('calculateIntensity', () => {
  it('returns 50 for empty exercise logs', () => {
    expect(calculateIntensity([])).toBe(50);
    expect(calculateIntensity(null)).toBe(50);
  });

  it('returns moderate intensity for typical workout', () => {
    const exerciseLogs = [
      {
        exerciseId: 'bench_press',
        sets: [
          { reps: 10, weight: 100, rpe: 7 },
          { reps: 10, weight: 100, rpe: 7 },
          { reps: 10, weight: 100, rpe: 7 },
        ],
      },
    ];

    const intensity = calculateIntensity(exerciseLogs, {});
    expect(intensity).toBeGreaterThanOrEqual(0);
    expect(intensity).toBeLessThanOrEqual(100);
  });

  it('returns higher intensity when exceeding baseline', () => {
    const exerciseLogs = [
      {
        exerciseId: 'bench_press',
        sets: [
          { reps: 10, weight: 100 },
          { reps: 10, weight: 100 },
          { reps: 10, weight: 100 },
        ],
      },
    ];

    const baseline = {
      bench_press: {
        typicalVolume: 2000, // Less than current
        typicalSets: 2,
      },
    };

    const intensity = calculateIntensity(exerciseLogs, baseline);
    expect(intensity).toBeGreaterThan(50);
  });
});

describe('calculateStreak', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns 0 for empty workout logs', () => {
    expect(calculateStreak([])).toBe(0);
    expect(calculateStreak(null)).toBe(0);
  });

  it('returns 1 for workout today', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    const workoutLogs = [
      { date: '2024-01-15T10:00:00Z' },
    ];

    expect(calculateStreak(workoutLogs)).toBe(1);
  });

  it('returns correct streak for consecutive days', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    const workoutLogs = [
      { date: '2024-01-15T10:00:00Z' },
      { date: '2024-01-14T10:00:00Z' },
      { date: '2024-01-13T10:00:00Z' },
    ];

    expect(calculateStreak(workoutLogs)).toBe(3);
  });

  it('returns 0 when last workout was more than 1 day ago', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    const workoutLogs = [
      { date: '2024-01-13T10:00:00Z' }, // 2 days ago
    ];

    expect(calculateStreak(workoutLogs)).toBe(0);
  });

  it('handles multiple workouts on same day', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    const workoutLogs = [
      { date: '2024-01-15T10:00:00Z' },
      { date: '2024-01-15T08:00:00Z' },
      { date: '2024-01-14T10:00:00Z' },
    ];

    expect(calculateStreak(workoutLogs)).toBe(2);
  });
});

describe('isStreakAtRisk', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns false for null date', () => {
    expect(isStreakAtRisk(null)).toBe(false);
  });

  it('returns false if last workout was today', () => {
    const now = new Date('2024-01-15T18:00:00Z');
    jest.setSystemTime(now);

    expect(isStreakAtRisk('2024-01-15T10:00:00Z')).toBe(false);
  });

  it('returns true if last workout was yesterday', () => {
    const now = new Date('2024-01-15T18:00:00Z');
    jest.setSystemTime(now);

    expect(isStreakAtRisk('2024-01-14T10:00:00Z')).toBe(true);
  });
});

describe('calculateWorkoutXP', () => {
  it('returns base XP for minimal workout', () => {
    const workout = {
      exercises: [],
    };

    const result = calculateWorkoutXP(workout);
    expect(result.total).toBe(100); // Base XP
    expect(result.breakdown.length).toBeGreaterThan(0);
  });

  it('includes exercise XP', () => {
    const workout = {
      exercises: [
        { sets: [{ completed: true }] },
        { sets: [{ completed: true }] },
      ],
    };

    const result = calculateWorkoutXP(workout);
    expect(result.total).toBeGreaterThan(100);
  });

  it('includes streak bonus', () => {
    const workout = {
      exercises: [{ sets: [{ completed: true }] }],
    };

    const resultNoStreak = calculateWorkoutXP(workout, 0);
    const resultWithStreak = calculateWorkoutXP(workout, 10);

    expect(resultWithStreak.total).toBeGreaterThan(resultNoStreak.total);
  });

  it('includes PR bonus', () => {
    const workout = {
      exercises: [{ sets: [{ completed: true }] }],
    };

    const resultNoPR = calculateWorkoutXP(workout, 0, {});
    const resultWithPR = calculateWorkoutXP(workout, 0, { newPRs: 2 });

    expect(resultWithPR.total).toBeGreaterThan(resultNoPR.total);
  });
});

describe('calculateLevel', () => {
  it('returns level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('returns level 1 for small XP', () => {
    expect(calculateLevel(100)).toBe(1);
  });

  it('returns level 2 after threshold', () => {
    expect(calculateLevel(500)).toBe(2);
  });

  it('increases level with more XP', () => {
    const level1 = calculateLevel(0);
    const level2 = calculateLevel(1000);
    const level3 = calculateLevel(5000);

    expect(level2).toBeGreaterThan(level1);
    expect(level3).toBeGreaterThan(level2);
  });
});

describe('getXPForNextLevel', () => {
  it('returns XP needed for level 2', () => {
    const xp = getXPForNextLevel(1);
    expect(xp).toBeGreaterThan(0);
  });

  it('returns increasing XP for higher levels', () => {
    const xp1 = getXPForNextLevel(1);
    const xp2 = getXPForNextLevel(2);
    const xp3 = getXPForNextLevel(3);

    expect(xp2).toBeGreaterThan(xp1);
    expect(xp3).toBeGreaterThan(xp2);
  });
});

describe('getLevelProgress', () => {
  it('returns correct structure', () => {
    const progress = getLevelProgress(100);

    expect(progress).toHaveProperty('currentLevel');
    expect(progress).toHaveProperty('xpInCurrentLevel');
    expect(progress).toHaveProperty('xpNeededForLevel');
    expect(progress).toHaveProperty('progressPercent');
  });

  it('progress percent is between 0 and 100', () => {
    const progress = getLevelProgress(750);

    expect(progress.progressPercent).toBeGreaterThanOrEqual(0);
    expect(progress.progressPercent).toBeLessThanOrEqual(100);
  });
});

describe('formatDuration', () => {
  it('formats minutes correctly', () => {
    expect(formatDuration(30)).toBe('30m');
    expect(formatDuration(45)).toBe('45m');
  });

  it('formats hours correctly', () => {
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(120)).toBe('2h');
  });

  it('formats hours and minutes correctly', () => {
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(75)).toBe('1h 15m');
  });
});

describe('formatWeight', () => {
  it('formats weight with kg', () => {
    expect(formatWeight(100, 'kg')).toBe('100 kg');
  });

  it('formats weight with lbs', () => {
    expect(formatWeight(225, 'lbs')).toBe('225 lbs');
  });

  it('defaults to kg', () => {
    expect(formatWeight(50)).toBe('50 kg');
  });
});

describe('convertWeight', () => {
  it('returns same value for same unit', () => {
    expect(convertWeight(100, 'kg', 'kg')).toBe(100);
    expect(convertWeight(100, 'lbs', 'lbs')).toBe(100);
  });

  it('converts kg to lbs', () => {
    const result = convertWeight(100, 'kg', 'lbs');
    expect(result).toBeCloseTo(220, 0);
  });

  it('converts lbs to kg', () => {
    const result = convertWeight(220, 'lbs', 'kg');
    expect(result).toBeCloseTo(100, 0);
  });
});
