// Unit tests for type definitions

import {
  MuscleGroups,
  Equipment,
  Difficulty,
  FitnessGoals,
  WorkoutTypes,
  StreakMilestones,
  BaseRecoveryDays,
  createDefaultUserProfile,
  createDefaultStreakData,
  createDefaultMuscleRecoveryState,
} from '../../types';

describe('MuscleGroups', () => {
  it('has all major muscle groups', () => {
    expect(MuscleGroups.CHEST).toBeDefined();
    expect(MuscleGroups.BACK).toBeDefined();
    expect(MuscleGroups.SHOULDERS).toBeDefined();
    expect(MuscleGroups.BICEPS).toBeDefined();
    expect(MuscleGroups.TRICEPS).toBeDefined();
    expect(MuscleGroups.QUADRICEPS).toBeDefined();
    expect(MuscleGroups.HAMSTRINGS).toBeDefined();
    expect(MuscleGroups.GLUTES).toBeDefined();
    expect(MuscleGroups.CALVES).toBeDefined();
    expect(MuscleGroups.CORE).toBeDefined();
  });

  it('has 10 muscle groups total', () => {
    expect(Object.keys(MuscleGroups).length).toBe(10);
  });

  it('values are lowercase strings', () => {
    Object.values(MuscleGroups).forEach(value => {
      expect(typeof value).toBe('string');
      expect(value).toBe(value.toLowerCase());
    });
  });
});

describe('Equipment', () => {
  it('has all equipment types', () => {
    expect(Equipment.BARBELL).toBeDefined();
    expect(Equipment.DUMBBELL).toBeDefined();
    expect(Equipment.CABLE).toBeDefined();
    expect(Equipment.MACHINE).toBeDefined();
    expect(Equipment.BODYWEIGHT).toBeDefined();
    expect(Equipment.KETTLEBELL).toBeDefined();
  });

  it('has 6 equipment types total', () => {
    expect(Object.keys(Equipment).length).toBe(6);
  });
});

describe('Difficulty', () => {
  it('has all difficulty levels', () => {
    expect(Difficulty.BEGINNER).toBeDefined();
    expect(Difficulty.INTERMEDIATE).toBeDefined();
    expect(Difficulty.ADVANCED).toBeDefined();
  });

  it('has 3 difficulty levels', () => {
    expect(Object.keys(Difficulty).length).toBe(3);
  });
});

describe('FitnessGoals', () => {
  it('has fitness goals', () => {
    expect(FitnessGoals.BUILD_MUSCLE).toBeDefined();
    expect(FitnessGoals.LOSE_FAT).toBeDefined();
    expect(FitnessGoals.GAIN_STRENGTH).toBeDefined();
  });
});

describe('WorkoutTypes', () => {
  it('has workout types', () => {
    expect(WorkoutTypes.PUSH).toBeDefined();
    expect(WorkoutTypes.PULL).toBeDefined();
    expect(WorkoutTypes.LEGS).toBeDefined();
    expect(WorkoutTypes.UPPER).toBeDefined();
    expect(WorkoutTypes.LOWER).toBeDefined();
    expect(WorkoutTypes.FULL).toBeDefined();
  });
});

describe('StreakMilestones', () => {
  it('is an array', () => {
    expect(Array.isArray(StreakMilestones)).toBe(true);
  });

  it('has expected milestones', () => {
    expect(StreakMilestones).toContain(7);
    expect(StreakMilestones).toContain(14);
    expect(StreakMilestones).toContain(30);
    expect(StreakMilestones).toContain(365);
  });

  it('is sorted ascending', () => {
    for (let i = 1; i < StreakMilestones.length; i++) {
      expect(StreakMilestones[i]).toBeGreaterThan(StreakMilestones[i - 1]);
    }
  });
});

describe('BaseRecoveryDays', () => {
  it('has recovery days for all muscle groups', () => {
    Object.values(MuscleGroups).forEach(muscle => {
      expect(BaseRecoveryDays[muscle]).toBeDefined();
      expect(typeof BaseRecoveryDays[muscle]).toBe('number');
      expect(BaseRecoveryDays[muscle]).toBeGreaterThan(0);
    });
  });

  it('larger muscles have longer recovery', () => {
    expect(BaseRecoveryDays[MuscleGroups.QUADRICEPS]).toBeGreaterThan(
      BaseRecoveryDays[MuscleGroups.BICEPS]
    );
    expect(BaseRecoveryDays[MuscleGroups.BACK]).toBeGreaterThan(
      BaseRecoveryDays[MuscleGroups.CORE]
    );
  });
});

describe('createDefaultUserProfile', () => {
  it('returns object with required fields', () => {
    const profile = createDefaultUserProfile();

    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('age');
    expect(profile).toHaveProperty('weight');
    expect(profile).toHaveProperty('weightUnit');
    expect(profile).toHaveProperty('fitnessLevel');
    expect(profile).toHaveProperty('goals');
    expect(profile).toHaveProperty('availableEquipment');
    expect(profile).toHaveProperty('createdAt');
  });

  it('has sensible default values', () => {
    const profile = createDefaultUserProfile();

    expect(profile.age).toBe(25);
    expect(profile.weightUnit).toBe('kg');
    expect(profile.fitnessLevel).toBe(Difficulty.INTERMEDIATE);
    expect(Array.isArray(profile.goals)).toBe(true);
    expect(Array.isArray(profile.availableEquipment)).toBe(true);
  });

  it('includes all equipment by default', () => {
    const profile = createDefaultUserProfile();
    const allEquipment = Object.values(Equipment);

    allEquipment.forEach(eq => {
      expect(profile.availableEquipment).toContain(eq);
    });
  });
});

describe('createDefaultStreakData', () => {
  it('returns object with required fields', () => {
    const streakData = createDefaultStreakData();

    expect(streakData).toHaveProperty('currentStreak');
    expect(streakData).toHaveProperty('longestStreak');
    expect(streakData).toHaveProperty('lastWorkoutDate');
    expect(streakData).toHaveProperty('streakFreezesRemaining');
  });

  it('starts with zero streak', () => {
    const streakData = createDefaultStreakData();

    expect(streakData.currentStreak).toBe(0);
    expect(streakData.longestStreak).toBe(0);
  });

  it('starts with streak freeze available', () => {
    const streakData = createDefaultStreakData();

    expect(streakData.streakFreezesRemaining).toBeGreaterThan(0);
  });
});

describe('createDefaultMuscleRecoveryState', () => {
  it('returns object with all muscle groups', () => {
    const state = createDefaultMuscleRecoveryState();

    Object.values(MuscleGroups).forEach(muscle => {
      expect(state[muscle]).toBeDefined();
    });
  });

  it('all muscles start fully recovered', () => {
    const state = createDefaultMuscleRecoveryState();

    Object.values(state).forEach(muscleState => {
      expect(muscleState.recoveryScore).toBe(100);
      expect(muscleState.lastTrainedDate).toBeNull();
    });
  });

  it('each muscle has required properties', () => {
    const state = createDefaultMuscleRecoveryState();

    Object.values(state).forEach(muscleState => {
      expect(muscleState).toHaveProperty('lastTrainedDate');
      expect(muscleState).toHaveProperty('lastTrainedIntensity');
      expect(muscleState).toHaveProperty('recoveryScore');
    });
  });
});
