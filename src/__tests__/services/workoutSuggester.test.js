// Unit tests for workout suggester service

import {
  suggestNextWorkout,
  suggestQuickWorkout,
  buildCustomWorkout,
  WORKOUT_TEMPLATES,
} from '../../services/workoutSuggester';

import { MuscleGroups, Equipment } from '../../types';

describe('WORKOUT_TEMPLATES', () => {
  it('has required templates', () => {
    const templateNames = WORKOUT_TEMPLATES.map(t => t.name);

    expect(templateNames).toContain('Push Day');
    expect(templateNames).toContain('Pull Day');
    expect(templateNames).toContain('Leg Day');
  });

  it('each template has required properties', () => {
    WORKOUT_TEMPLATES.forEach(template => {
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('muscles');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('estimatedDuration');
      expect(Array.isArray(template.muscles)).toBe(true);
      expect(template.muscles.length).toBeGreaterThan(0);
    });
  });
});

describe('suggestNextWorkout', () => {
  const createFullyRecoveredState = () => {
    const state = {};
    Object.values(MuscleGroups).forEach(muscle => {
      state[muscle] = {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      };
    });
    return state;
  };

  it('suggests workout when muscles are recovered', () => {
    const muscleState = createFullyRecoveredState();
    const userProfile = {
      age: 25,
      fitnessLevel: 'intermediate',
      availableEquipment: Object.values(Equipment),
    };

    const result = suggestNextWorkout(muscleState, userProfile, {});

    expect(result.shouldRest).toBe(false);
    expect(result.workout).toBeDefined();
    expect(result.workout.name).toBeDefined();
    expect(result.workout.exercises).toBeDefined();
  });

  it('includes reason for suggestion', () => {
    const muscleState = createFullyRecoveredState();
    const userProfile = {
      age: 25,
      availableEquipment: Object.values(Equipment),
    };

    const result = suggestNextWorkout(muscleState, userProfile, {});

    expect(result.reason).toBeDefined();
    expect(typeof result.reason).toBe('string');
  });

  it('provides alternatives', () => {
    const muscleState = createFullyRecoveredState();
    const userProfile = {
      age: 25,
      availableEquipment: Object.values(Equipment),
    };

    const result = suggestNextWorkout(muscleState, userProfile, {});

    expect(result.alternatives).toBeDefined();
    expect(Array.isArray(result.alternatives)).toBe(true);
  });

  it('suggests rest when muscles are fatigued', () => {
    const muscleState = {};
    Object.values(MuscleGroups).forEach(muscle => {
      muscleState[muscle] = {
        lastTrainedDate: new Date().toISOString(),
        lastTrainedIntensity: 90,
        recoveryScore: 10,
      };
    });

    const userProfile = {
      age: 25,
      availableEquipment: Object.values(Equipment),
    };

    const result = suggestNextWorkout(muscleState, userProfile, {});

    expect(result.shouldRest).toBe(true);
  });

  it('respects available equipment', () => {
    const muscleState = createFullyRecoveredState();
    const userProfile = {
      age: 25,
      fitnessLevel: 'intermediate',
      availableEquipment: [Equipment.BODYWEIGHT], // Only bodyweight
    };

    const result = suggestNextWorkout(muscleState, userProfile, {});

    if (!result.shouldRest && result.workout) {
      result.workout.exercises.forEach(exercise => {
        const hasBodyweight = exercise.equipment.includes(Equipment.BODYWEIGHT);
        expect(hasBodyweight).toBe(true);
      });
    }
  });
});

describe('suggestQuickWorkout', () => {
  it('returns shorter workout', () => {
    const muscleState = {};
    Object.values(MuscleGroups).forEach(muscle => {
      muscleState[muscle] = {
        lastTrainedDate: null,
        lastTrainedIntensity: 0,
        recoveryScore: 100,
      };
    });

    const userProfile = {
      age: 25,
      availableEquipment: Object.values(Equipment),
    };

    const result = suggestQuickWorkout(muscleState, userProfile, 20);

    if (!result.shouldRest) {
      expect(result.workout.estimatedDuration).toBeLessThanOrEqual(25);
      expect(result.workout.exercises.length).toBeLessThanOrEqual(5);
    }
  });

  it('targets most recovered muscles', () => {
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

    const userProfile = {
      age: 25,
      availableEquipment: Object.values(Equipment),
    };

    const result = suggestQuickWorkout(muscleState, userProfile, 20);

    if (!result.shouldRest) {
      // Should focus on chest (recovered) not back (fatigued)
      expect(result.workout.focusMuscleGroups).toContain(MuscleGroups.CHEST);
    }
  });
});

describe('buildCustomWorkout', () => {
  it('creates workout with specified muscle groups', () => {
    const targetMuscles = [MuscleGroups.CHEST, MuscleGroups.TRICEPS];
    const equipment = Object.values(Equipment);

    const workout = buildCustomWorkout(targetMuscles, equipment, 'intermediate', {});

    expect(workout.focusMuscleGroups).toEqual(targetMuscles);
    expect(workout.exercises.length).toBeGreaterThan(0);
  });

  it('filters exercises by equipment', () => {
    const targetMuscles = [MuscleGroups.CHEST];
    const equipment = [Equipment.BODYWEIGHT];

    const workout = buildCustomWorkout(targetMuscles, equipment, 'beginner', {});

    workout.exercises.forEach(exercise => {
      const hasEquipment = exercise.equipment.some(e => equipment.includes(e));
      expect(hasEquipment).toBe(true);
    });
  });

  it('includes suggested sets and reps', () => {
    const targetMuscles = [MuscleGroups.BACK];
    const equipment = Object.values(Equipment);

    const workout = buildCustomWorkout(targetMuscles, equipment, 'intermediate', {});

    workout.exercises.forEach(exercise => {
      expect(exercise.suggestedSets).toBeDefined();
      expect(exercise.suggestedReps).toBeDefined();
    });
  });

  it('adjusts for fitness level', () => {
    const targetMuscles = [MuscleGroups.CHEST];
    const equipment = Object.values(Equipment);

    const beginnerWorkout = buildCustomWorkout(targetMuscles, equipment, 'beginner', {});
    const advancedWorkout = buildCustomWorkout(targetMuscles, equipment, 'advanced', {});

    // Beginner should have fewer sets
    const beginnerSets = beginnerWorkout.exercises[0]?.suggestedSets || 0;
    const advancedSets = advancedWorkout.exercises[0]?.suggestedSets || 0;

    expect(beginnerSets).toBeLessThanOrEqual(advancedSets);
  });

  it('uses baseline data for weight suggestions', () => {
    const targetMuscles = [MuscleGroups.CHEST];
    const equipment = Object.values(Equipment);
    const baselines = {
      barbell_bench_press: {
        typicalWeight: 100,
        personalBest: { weight: 120, reps: 5 },
      },
    };

    const workout = buildCustomWorkout(targetMuscles, equipment, 'intermediate', baselines);

    const benchPress = workout.exercises.find(e => e.id === 'barbell_bench_press');
    if (benchPress) {
      expect(benchPress.suggestedWeight).toBe(100);
      expect(benchPress.previousBest).toBeDefined();
    }
  });
});
