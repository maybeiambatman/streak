// Unit tests for recovery calculator service

import {
  calculateAllMuscleRecovery,
  getTrainableMuscles,
  getMuscleDisplayName,
  formatRecoveryTime,
  getRecoveryStatus,
} from '../../services/recoveryCalculator';

import { MuscleGroups } from '../../types';

describe('calculateAllMuscleRecovery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns recovery data for all muscles', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    const muscleState = {
      [MuscleGroups.CHEST]: {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      },
      [MuscleGroups.BACK]: {
        lastTrainedDate: '2024-01-14T12:00:00Z',
        lastTrainedIntensity: 70,
        recoveryScore: 50,
      },
    };

    const result = calculateAllMuscleRecovery(muscleState, 25);

    expect(result).toHaveProperty(MuscleGroups.CHEST);
    expect(result).toHaveProperty(MuscleGroups.BACK);
    expect(result[MuscleGroups.CHEST].recoveryScore).toBe(100);
    expect(result[MuscleGroups.BACK].recoveryScore).toBeLessThan(100);
  });

  it('includes color property for each muscle', () => {
    const muscleState = {
      [MuscleGroups.CHEST]: {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      },
    };

    const result = calculateAllMuscleRecovery(muscleState, 25);

    expect(result[MuscleGroups.CHEST]).toHaveProperty('color');
    expect(typeof result[MuscleGroups.CHEST].color).toBe('string');
  });

  it('includes hoursUntilRecovered property', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.setSystemTime(now);

    const muscleState = {
      [MuscleGroups.CHEST]: {
        lastTrainedDate: '2024-01-15T10:00:00Z',
        lastTrainedIntensity: 70,
        recoveryScore: 10,
      },
    };

    const result = calculateAllMuscleRecovery(muscleState, 25);

    expect(result[MuscleGroups.CHEST]).toHaveProperty('hoursUntilRecovered');
    expect(result[MuscleGroups.CHEST].hoursUntilRecovered).toBeGreaterThan(0);
  });
});

describe('getTrainableMuscles', () => {
  it('returns muscles above recovery threshold', () => {
    const muscleState = {
      [MuscleGroups.CHEST]: {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      },
      [MuscleGroups.BACK]: {
        lastTrainedDate: new Date().toISOString(),
        lastTrainedIntensity: 80,
        recoveryScore: 20,
      },
    };

    const result = getTrainableMuscles(muscleState, 25, 70);

    // Chest should be trainable (100% recovered)
    // Back should not be trainable (just trained)
    expect(result.some(m => m.muscleGroup === MuscleGroups.CHEST)).toBe(true);
  });

  it('sorts by recovery score descending', () => {
    const muscleState = {
      [MuscleGroups.CHEST]: {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      },
      [MuscleGroups.BACK]: {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      },
      [MuscleGroups.BICEPS]: {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      },
    };

    const result = getTrainableMuscles(muscleState, 25, 50);

    // Should be sorted by recovery score (all 100 in this case)
    expect(result.length).toBeGreaterThan(0);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].recoveryScore).toBeGreaterThanOrEqual(result[i].recoveryScore);
    }
  });
});

describe('getMuscleDisplayName', () => {
  it('returns display name for valid muscle', () => {
    expect(getMuscleDisplayName(MuscleGroups.CHEST)).toBe('Chest');
    expect(getMuscleDisplayName(MuscleGroups.QUADRICEPS)).toBe('Quadriceps');
  });

  it('capitalizes first letter', () => {
    const name = getMuscleDisplayName(MuscleGroups.BICEPS);
    expect(name[0]).toBe(name[0].toUpperCase());
  });

  it('handles unknown muscle gracefully', () => {
    const name = getMuscleDisplayName('unknown_muscle');
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});

describe('formatRecoveryTime', () => {
  it('formats hours correctly', () => {
    expect(formatRecoveryTime(2)).toBe('2h');
    expect(formatRecoveryTime(24)).toBe('24h');
  });

  it('formats partial hours', () => {
    const result = formatRecoveryTime(1.5);
    expect(result).toMatch(/1h|1\.5h|1h 30m/);
  });

  it('handles zero hours', () => {
    expect(formatRecoveryTime(0)).toBe('Ready');
  });
});

describe('getRecoveryStatus', () => {
  it('returns "recovered" for high recovery score', () => {
    expect(getRecoveryStatus(100)).toBe('recovered');
    expect(getRecoveryStatus(90)).toBe('recovered');
  });

  it('returns "recovering" for medium recovery score', () => {
    expect(getRecoveryStatus(60)).toBe('recovering');
    expect(getRecoveryStatus(50)).toBe('recovering');
  });

  it('returns "fatigued" for low recovery score', () => {
    expect(getRecoveryStatus(20)).toBe('fatigued');
    expect(getRecoveryStatus(10)).toBe('fatigued');
  });
});
