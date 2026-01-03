// Muscle group definitions and recovery rates
// Recovery rates are in hours for full recovery from a moderate session

export const MUSCLE_GROUPS = {
  // Upper Body - Push
  chest: {
    id: 'chest',
    name: 'Chest',
    category: 'upper',
    subcategory: 'push',
    baseRecoveryHours: 48, // Larger muscle, takes longer
    icon: 'chest-outline',
    color: '#FF6B35',
    bodyPosition: { front: { x: 0.5, y: 0.25 } },
  },
  shoulders: {
    id: 'shoulders',
    name: 'Shoulders',
    category: 'upper',
    subcategory: 'push',
    baseRecoveryHours: 36,
    icon: 'shoulder-outline',
    color: '#9C27B0',
    bodyPosition: { front: { x: 0.3, y: 0.2 }, back: { x: 0.3, y: 0.2 } },
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps',
    category: 'upper',
    subcategory: 'push',
    baseRecoveryHours: 36,
    icon: 'arm-outline',
    color: '#00BCD4',
    bodyPosition: { back: { x: 0.25, y: 0.32 } },
  },

  // Upper Body - Pull
  back: {
    id: 'back',
    name: 'Back',
    category: 'upper',
    subcategory: 'pull',
    baseRecoveryHours: 48,
    icon: 'back-outline',
    color: '#2196F3',
    bodyPosition: { back: { x: 0.5, y: 0.28 } },
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps',
    category: 'upper',
    subcategory: 'pull',
    baseRecoveryHours: 36,
    icon: 'arm-flex-outline',
    color: '#4CAF50',
    bodyPosition: { front: { x: 0.25, y: 0.32 } },
  },
  forearms: {
    id: 'forearms',
    name: 'Forearms',
    category: 'upper',
    subcategory: 'pull',
    baseRecoveryHours: 24,
    icon: 'hand-outline',
    color: '#795548',
    bodyPosition: { front: { x: 0.22, y: 0.42 } },
    advanced: true,
  },

  // Core
  abs: {
    id: 'abs',
    name: 'Abs',
    category: 'core',
    subcategory: 'core',
    baseRecoveryHours: 24, // Core recovers faster
    icon: 'abs-outline',
    color: '#FF9800',
    bodyPosition: { front: { x: 0.5, y: 0.38 } },
  },
  obliques: {
    id: 'obliques',
    name: 'Obliques',
    category: 'core',
    subcategory: 'core',
    baseRecoveryHours: 24,
    icon: 'obliques-outline',
    color: '#FFC107',
    bodyPosition: { front: { x: 0.35, y: 0.4 } },
  },
  lowerBack: {
    id: 'lowerBack',
    name: 'Lower Back',
    category: 'core',
    subcategory: 'core',
    baseRecoveryHours: 48, // Lower back needs more rest
    icon: 'spine-outline',
    color: '#607D8B',
    bodyPosition: { back: { x: 0.5, y: 0.42 } },
  },

  // Lower Body
  quadriceps: {
    id: 'quadriceps',
    name: 'Quadriceps',
    category: 'lower',
    subcategory: 'legs',
    baseRecoveryHours: 48,
    icon: 'leg-outline',
    color: '#3F51B5',
    bodyPosition: { front: { x: 0.4, y: 0.58 } },
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Hamstrings',
    category: 'lower',
    subcategory: 'legs',
    baseRecoveryHours: 48,
    icon: 'leg-back-outline',
    color: '#E91E63',
    bodyPosition: { back: { x: 0.4, y: 0.58 } },
  },
  glutes: {
    id: 'glutes',
    name: 'Glutes',
    category: 'lower',
    subcategory: 'legs',
    baseRecoveryHours: 48,
    icon: 'glutes-outline',
    color: '#795548',
    bodyPosition: { back: { x: 0.5, y: 0.48 } },
  },
  calves: {
    id: 'calves',
    name: 'Calves',
    category: 'lower',
    subcategory: 'legs',
    baseRecoveryHours: 24, // Smaller muscle, recovers faster
    icon: 'calf-outline',
    color: '#607D8B',
    bodyPosition: { back: { x: 0.4, y: 0.75 } },
  },
};

// Intensity multipliers for recovery calculation
export const INTENSITY_FACTORS = {
  light: 0.5,    // Quick/easy work
  moderate: 1.0, // Normal training
  heavy: 1.5,    // Hard training, high volume
  extreme: 2.0,  // Max effort, PR attempts
};

// Volume impact on recovery (sets multiplier)
export const VOLUME_FACTORS = {
  low: 0.7,      // 1-2 sets
  moderate: 1.0, // 3 sets
  high: 1.3,     // 4-5 sets
  very_high: 1.6 // 6+ sets
};

// Get all muscle IDs
export const getAllMuscleIds = () => Object.keys(MUSCLE_GROUPS);

// Get muscles by category
export const getMusclesByCategory = (category) => {
  return Object.values(MUSCLE_GROUPS).filter(m => m.category === category);
};

// Get muscles by subcategory
export const getMusclesBySubcategory = (subcategory) => {
  return Object.values(MUSCLE_GROUPS).filter(m => m.subcategory === subcategory);
};

// Get primary muscles only (exclude advanced)
export const getPrimaryMuscles = () => {
  return Object.values(MUSCLE_GROUPS).filter(m => !m.advanced);
};

// Get muscle categories for display
export const MUSCLE_CATEGORIES = [
  {
    id: 'upper',
    name: 'Upper Body',
    muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  },
  {
    id: 'core',
    name: 'Core',
    muscles: ['abs', 'obliques', 'lowerBack'],
  },
  {
    id: 'lower',
    name: 'Lower Body',
    muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  },
];

export default MUSCLE_GROUPS;
