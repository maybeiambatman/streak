// Unit tests for exercise library

import {
  EXERCISES,
  getExerciseById,
  getExercisesByMuscleGroup,
  getExercisesByEquipment,
  getExercisesByDifficulty,
  filterExercisesByEquipment,
  getAllExercises,
} from '../../data/exercises';

import { MuscleGroups, Equipment, Difficulty } from '../../types';

describe('EXERCISES', () => {
  it('has exercises defined', () => {
    expect(Object.keys(EXERCISES).length).toBeGreaterThan(0);
  });

  it('each exercise has required properties', () => {
    Object.values(EXERCISES).forEach(exercise => {
      expect(exercise).toHaveProperty('id');
      expect(exercise).toHaveProperty('name');
      expect(exercise).toHaveProperty('primaryMuscleGroup');
      expect(exercise).toHaveProperty('secondaryMuscleGroups');
      expect(exercise).toHaveProperty('equipment');
      expect(exercise).toHaveProperty('difficulty');
      expect(exercise).toHaveProperty('instructions');
      expect(exercise).toHaveProperty('tips');

      expect(typeof exercise.id).toBe('string');
      expect(typeof exercise.name).toBe('string');
      expect(Array.isArray(exercise.equipment)).toBe(true);
      expect(Array.isArray(exercise.instructions)).toBe(true);
      expect(Array.isArray(exercise.tips)).toBe(true);
    });
  });

  it('has valid muscle groups', () => {
    const validMuscles = Object.values(MuscleGroups);

    Object.values(EXERCISES).forEach(exercise => {
      expect(validMuscles).toContain(exercise.primaryMuscleGroup);

      exercise.secondaryMuscleGroups.forEach(muscle => {
        expect(validMuscles).toContain(muscle);
      });
    });
  });

  it('has valid equipment types', () => {
    const validEquipment = Object.values(Equipment);

    Object.values(EXERCISES).forEach(exercise => {
      exercise.equipment.forEach(eq => {
        expect(validEquipment).toContain(eq);
      });
    });
  });

  it('has valid difficulty levels', () => {
    const validDifficulties = Object.values(Difficulty);

    Object.values(EXERCISES).forEach(exercise => {
      expect(validDifficulties).toContain(exercise.difficulty);
    });
  });
});

describe('Required exercises by muscle group', () => {
  it('has chest exercises', () => {
    const chestExercises = getExercisesByMuscleGroup(MuscleGroups.CHEST);
    expect(chestExercises.length).toBeGreaterThanOrEqual(5);

    const names = chestExercises.map(e => e.name.toLowerCase());
    expect(names.some(n => n.includes('bench press'))).toBe(true);
    expect(names.some(n => n.includes('push'))).toBe(true);
  });

  it('has back exercises', () => {
    const backExercises = getExercisesByMuscleGroup(MuscleGroups.BACK);
    expect(backExercises.length).toBeGreaterThanOrEqual(5);

    const names = backExercises.map(e => e.name.toLowerCase());
    expect(names.some(n => n.includes('row') || n.includes('pull'))).toBe(true);
  });

  it('has shoulder exercises', () => {
    const shoulderExercises = getExercisesByMuscleGroup(MuscleGroups.SHOULDERS);
    expect(shoulderExercises.length).toBeGreaterThanOrEqual(4);
  });

  it('has leg exercises', () => {
    const quadExercises = getExercisesByMuscleGroup(MuscleGroups.QUADRICEPS);
    const hamstringExercises = getExercisesByMuscleGroup(MuscleGroups.HAMSTRINGS);

    expect(quadExercises.length).toBeGreaterThanOrEqual(4);
    expect(hamstringExercises.length).toBeGreaterThanOrEqual(2);
  });

  it('has arm exercises', () => {
    const bicepExercises = getExercisesByMuscleGroup(MuscleGroups.BICEPS);
    const tricepExercises = getExercisesByMuscleGroup(MuscleGroups.TRICEPS);

    expect(bicepExercises.length).toBeGreaterThanOrEqual(3);
    expect(tricepExercises.length).toBeGreaterThanOrEqual(4);
  });

  it('has core exercises', () => {
    const coreExercises = getExercisesByMuscleGroup(MuscleGroups.CORE);
    expect(coreExercises.length).toBeGreaterThanOrEqual(4);
  });
});

describe('getExerciseById', () => {
  it('returns exercise for valid id', () => {
    const exercise = getExerciseById('barbell_bench_press');

    expect(exercise).toBeDefined();
    expect(exercise.name).toBe('Barbell Bench Press');
  });

  it('returns undefined for invalid id', () => {
    const exercise = getExerciseById('invalid_exercise_id');
    expect(exercise).toBeUndefined();
  });
});

describe('getExercisesByMuscleGroup', () => {
  it('returns exercises for primary muscle group', () => {
    const exercises = getExercisesByMuscleGroup(MuscleGroups.CHEST, 'primary');

    exercises.forEach(exercise => {
      expect(exercise.primaryMuscleGroup).toBe(MuscleGroups.CHEST);
    });
  });

  it('returns exercises for secondary muscle group', () => {
    const exercises = getExercisesByMuscleGroup(MuscleGroups.TRICEPS, 'secondary');

    exercises.forEach(exercise => {
      expect(exercise.secondaryMuscleGroups).toContain(MuscleGroups.TRICEPS);
    });
  });

  it('returns all exercises when type is "all"', () => {
    const exercises = getExercisesByMuscleGroup(MuscleGroups.TRICEPS, 'all');

    const primaryCount = exercises.filter(
      e => e.primaryMuscleGroup === MuscleGroups.TRICEPS
    ).length;

    const secondaryCount = exercises.filter(
      e => e.secondaryMuscleGroups.includes(MuscleGroups.TRICEPS)
    ).length;

    expect(exercises.length).toBe(primaryCount + secondaryCount);
  });
});

describe('getExercisesByEquipment', () => {
  it('returns exercises for single equipment type', () => {
    const exercises = getExercisesByEquipment([Equipment.BODYWEIGHT]);

    expect(exercises.length).toBeGreaterThan(0);
    exercises.forEach(exercise => {
      expect(exercise.equipment).toContain(Equipment.BODYWEIGHT);
    });
  });

  it('returns exercises for multiple equipment types', () => {
    const exercises = getExercisesByEquipment([
      Equipment.BARBELL,
      Equipment.DUMBBELL,
    ]);

    expect(exercises.length).toBeGreaterThan(0);
    exercises.forEach(exercise => {
      const hasBarbell = exercise.equipment.includes(Equipment.BARBELL);
      const hasDumbbell = exercise.equipment.includes(Equipment.DUMBBELL);
      expect(hasBarbell || hasDumbbell).toBe(true);
    });
  });
});

describe('getExercisesByDifficulty', () => {
  it('returns beginner exercises', () => {
    const exercises = getExercisesByDifficulty(Difficulty.BEGINNER);

    expect(exercises.length).toBeGreaterThan(0);
    exercises.forEach(exercise => {
      expect(exercise.difficulty).toBe(Difficulty.BEGINNER);
    });
  });

  it('returns intermediate exercises', () => {
    const exercises = getExercisesByDifficulty(Difficulty.INTERMEDIATE);

    expect(exercises.length).toBeGreaterThan(0);
    exercises.forEach(exercise => {
      expect(exercise.difficulty).toBe(Difficulty.INTERMEDIATE);
    });
  });

  it('returns advanced exercises', () => {
    const exercises = getExercisesByDifficulty(Difficulty.ADVANCED);

    expect(exercises.length).toBeGreaterThan(0);
    exercises.forEach(exercise => {
      expect(exercise.difficulty).toBe(Difficulty.ADVANCED);
    });
  });
});

describe('filterExercisesByEquipment', () => {
  it('filters exercises to only those with available equipment', () => {
    const allExercises = getAllExercises();
    const availableEquipment = [Equipment.BODYWEIGHT, Equipment.DUMBBELL];

    const filtered = filterExercisesByEquipment(allExercises, availableEquipment);

    filtered.forEach(exercise => {
      const hasAvailable = exercise.equipment.some(eq =>
        availableEquipment.includes(eq)
      );
      expect(hasAvailable).toBe(true);
    });
  });

  it('returns empty array if no equipment matches', () => {
    const exercises = [
      { equipment: [Equipment.CABLE] },
      { equipment: [Equipment.MACHINE] },
    ];

    const filtered = filterExercisesByEquipment(exercises, [Equipment.KETTLEBELL]);
    expect(filtered.length).toBe(0);
  });
});

describe('getAllExercises', () => {
  it('returns array of all exercises', () => {
    const exercises = getAllExercises();

    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises.length).toBe(Object.keys(EXERCISES).length);
  });
});
