// FitStreak Exercise Library
// Proven, effective exercises with clear progression paths

export const EQUIPMENT_TYPES = {
  none: { id: 'none', name: 'Bodyweight', icon: 'body' },
  dumbbells: { id: 'dumbbells', name: 'Dumbbells', icon: 'dumbbell' },
  barbell: { id: 'barbell', name: 'Barbell', icon: 'barbell' },
  pullupBar: { id: 'pullupBar', name: 'Pull-up Bar', icon: 'arrow-up' },
  bench: { id: 'bench', name: 'Bench', icon: 'bench' },
  cableMachine: { id: 'cableMachine', name: 'Cable Machine', icon: 'cable' },
  resistanceBands: { id: 'resistanceBands', name: 'Resistance Bands', icon: 'band' },
  dipBars: { id: 'dipBars', name: 'Dip Bars/Bench', icon: 'dip' },
  machine: { id: 'machine', name: 'Machine', icon: 'machine' },
};

export const DIFFICULTY_LEVELS = {
  beginner: { id: 'beginner', name: 'Beginner', order: 1 },
  intermediate: { id: 'intermediate', name: 'Intermediate', order: 2 },
  advanced: { id: 'advanced', name: 'Advanced', order: 3 },
};

export const EXERCISES = {
  // ==================== PUSH MOVEMENTS ====================

  // Chest focused
  push_ups: {
    id: 'push_ups',
    name: 'Push-ups',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-15',
    restTime: 60,
    formCues: [
      'Keep core tight and body straight',
      'Lower chest to the ground',
      'Push through palms, not fingers',
    ],
    progressionTo: 'bench_press',
  },

  bench_press: {
    id: 'bench_press',
    name: 'Bench Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-12',
    restTime: 90,
    formCues: [
      'Keep shoulder blades pinched together',
      'Feet flat on floor',
      'Lower bar to mid-chest',
      'Press up in slight arc',
    ],
    progressionFrom: 'push_ups',
    progressionTo: 'incline_bench_press',
  },

  dumbbell_bench_press: {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-12',
    restTime: 90,
    formCues: [
      'Keep shoulder blades pinched together',
      'Lower dumbbells to chest level',
      'Press up, bringing weights together at top',
    ],
    progressionFrom: 'push_ups',
  },

  incline_bench_press: {
    id: 'incline_bench_press',
    name: 'Incline Bench Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-12',
    restTime: 90,
    formCues: [
      'Set bench to 30-45 degree angle',
      'Lower bar to upper chest',
      'Press up and slightly back',
    ],
    progressionFrom: 'bench_press',
  },

  incline_dumbbell_press: {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-12',
    restTime: 90,
    formCues: [
      'Set bench to 30-45 degree angle',
      'Lower dumbbells to upper chest',
      'Press up, bringing weights together',
    ],
  },

  dumbbell_flyes: {
    id: 'dumbbell_flyes',
    name: 'Dumbbell Flyes',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'Keep slight bend in elbows throughout',
      'Lower weights in wide arc to chest level',
      'Squeeze chest to bring weights together',
    ],
  },

  dips: {
    id: 'dips',
    name: 'Dips',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    equipment: ['dipBars'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-12',
    restTime: 90,
    formCues: [
      'Lean forward slightly for chest emphasis',
      'Keep elbows close for triceps emphasis',
      'Lower until upper arms parallel to floor',
    ],
  },

  // Shoulder focused
  overhead_press: {
    id: 'overhead_press',
    name: 'Overhead Press',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restTime: 90,
    formCues: [
      'Start bar at shoulder height',
      'Press straight up, moving head back slightly',
      'Lock out arms at top',
      'Keep core braced throughout',
    ],
  },

  dumbbell_shoulder_press: {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 75,
    formCues: [
      'Start with dumbbells at shoulder height',
      'Press up and slightly inward',
      'Control the descent',
    ],
  },

  lateral_raises: {
    id: 'lateral_raises',
    name: 'Lateral Raises',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 60,
    formCues: [
      'Slight bend in elbows',
      'Raise to shoulder height',
      'Lead with elbows, not hands',
      'Control the descent',
    ],
  },

  front_raises: {
    id: 'front_raises',
    name: 'Front Raises',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 60,
    formCues: [
      'Raise one arm at a time or both together',
      'Raise to eye level',
      'Keep core engaged',
    ],
  },

  pike_push_ups: {
    id: 'pike_push_ups',
    name: 'Pike Push-ups',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '8-12',
    restTime: 60,
    formCues: [
      'Form inverted V with body',
      'Lower head toward ground',
      'Push back up through shoulders',
    ],
    progressionTo: 'overhead_press',
  },

  // Triceps focused
  tricep_pushdowns: {
    id: 'tricep_pushdowns',
    name: 'Tricep Pushdowns',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['cableMachine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 60,
    formCues: [
      'Keep elbows pinned to sides',
      'Push handle down until arms straight',
      'Squeeze triceps at bottom',
    ],
  },

  skull_crushers: {
    id: 'skull_crushers',
    name: 'Skull Crushers',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'Keep upper arms stationary',
      'Lower weight to forehead',
      'Extend arms fully at top',
    ],
  },

  tricep_dips: {
    id: 'tricep_dips',
    name: 'Bench Tricep Dips',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['shoulders'],
    equipment: ['bench'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 60,
    formCues: [
      'Hands on bench behind you',
      'Lower body by bending elbows',
      'Keep back close to bench',
    ],
  },

  overhead_tricep_extension: {
    id: 'overhead_tricep_extension',
    name: 'Overhead Tricep Extension',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'Hold dumbbell overhead with both hands',
      'Lower behind head by bending elbows',
      'Keep upper arms close to head',
    ],
  },

  // ==================== PULL MOVEMENTS ====================

  // Back focused
  pull_ups: {
    id: 'pull_ups',
    name: 'Pull-ups',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: ['pullupBar'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '6-10',
    restTime: 90,
    formCues: [
      'Grip bar wider than shoulder width',
      'Pull chest to bar',
      'Control the descent',
      'Full extension at bottom',
    ],
  },

  chin_ups: {
    id: 'chin_ups',
    name: 'Chin-ups',
    category: 'pull',
    primaryMuscles: ['biceps', 'back'],
    secondaryMuscles: ['forearms'],
    equipment: ['pullupBar'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '6-10',
    restTime: 90,
    formCues: [
      'Grip bar with palms facing you',
      'Pull chin over bar',
      'Squeeze biceps at top',
    ],
  },

  barbell_rows: {
    id: 'barbell_rows',
    name: 'Barbell Rows',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'lowerBack'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restTime: 90,
    formCues: [
      'Hinge at hips, back flat',
      'Pull bar to lower chest',
      'Squeeze shoulder blades together',
      'Control the descent',
    ],
  },

  dumbbell_rows: {
    id: 'dumbbell_rows',
    name: 'Dumbbell Rows',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'One hand and knee on bench',
      'Pull dumbbell to hip',
      'Keep elbow close to body',
      'Squeeze at top',
    ],
  },

  lat_pulldowns: {
    id: 'lat_pulldowns',
    name: 'Lat Pulldowns',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['cableMachine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 75,
    formCues: [
      'Grip bar wider than shoulder width',
      'Pull bar to upper chest',
      'Lead with elbows',
      'Squeeze lats at bottom',
    ],
    progressionTo: 'pull_ups',
  },

  seated_cable_rows: {
    id: 'seated_cable_rows',
    name: 'Seated Cable Rows',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['cableMachine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 75,
    formCues: [
      'Sit with knees slightly bent',
      'Pull handle to midsection',
      'Squeeze shoulder blades together',
      'Control the release',
    ],
  },

  face_pulls: {
    id: 'face_pulls',
    name: 'Face Pulls',
    category: 'pull',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: [],
    equipment: ['cableMachine', 'resistanceBands'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restTime: 60,
    formCues: [
      'Pull rope to face level',
      'Externally rotate shoulders at end',
      'Squeeze rear delts',
    ],
  },

  inverted_rows: {
    id: 'inverted_rows',
    name: 'Inverted Rows',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['pullupBar'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-15',
    restTime: 60,
    formCues: [
      'Body straight like a reverse plank',
      'Pull chest to bar',
      'Squeeze shoulder blades',
    ],
    progressionTo: 'pull_ups',
  },

  // Biceps focused
  bicep_curls: {
    id: 'bicep_curls',
    name: 'Bicep Curls',
    category: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'Keep elbows at sides',
      'Curl weights to shoulders',
      'Squeeze at top',
      'Control the descent',
    ],
  },

  barbell_curls: {
    id: 'barbell_curls',
    name: 'Barbell Curls',
    category: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: ['barbell'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '8-10',
    restTime: 60,
    formCues: [
      'Grip bar at shoulder width',
      'Keep elbows pinned to sides',
      'Curl bar to shoulders',
      'Lower under control',
    ],
  },

  hammer_curls: {
    id: 'hammer_curls',
    name: 'Hammer Curls',
    category: 'pull',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: [],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'Palms face each other throughout',
      'Keep elbows at sides',
      'Curl to shoulders',
    ],
  },

  concentration_curls: {
    id: 'concentration_curls',
    name: 'Concentration Curls',
    category: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 45,
    formCues: [
      'Elbow braced against inner thigh',
      'Curl weight to shoulder',
      'Maximum squeeze at top',
    ],
  },

  // ==================== LEG MOVEMENTS ====================

  // Quad focused
  squats: {
    id: 'squats',
    name: 'Squats',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'lowerBack'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restTime: 120,
    formCues: [
      'Bar on upper back, not neck',
      'Feet shoulder width apart',
      'Break at hips and knees together',
      'Knees track over toes',
      'Depth: at least parallel',
    ],
    progressionFrom: 'bodyweight_squats',
  },

  bodyweight_squats: {
    id: 'bodyweight_squats',
    name: 'Bodyweight Squats',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restTime: 60,
    formCues: [
      'Feet shoulder width apart',
      'Arms out front for balance',
      'Sit back like into a chair',
      'Go as low as comfortable',
    ],
    progressionTo: 'squats',
  },

  goblet_squats: {
    id: 'goblet_squats',
    name: 'Goblet Squats',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 75,
    formCues: [
      'Hold dumbbell at chest',
      'Elbows inside knees at bottom',
      'Push knees out',
      'Drive through heels',
    ],
    progressionTo: 'squats',
  },

  lunges: {
    id: 'lunges',
    name: 'Lunges',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['none', 'dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12 each',
    restTime: 75,
    formCues: [
      'Big step forward',
      'Lower back knee toward ground',
      'Front knee over ankle',
      'Push through front heel to stand',
    ],
  },

  split_squats: {
    id: 'split_squats',
    name: 'Split Squats',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['none', 'dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12 each',
    restTime: 60,
    formCues: [
      'Staggered stance',
      'Lower straight down',
      'Keep torso upright',
    ],
    progressionTo: 'bulgarian_split_squats',
  },

  bulgarian_split_squats: {
    id: 'bulgarian_split_squats',
    name: 'Bulgarian Split Squats',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['bench', 'dumbbells'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10 each',
    restTime: 90,
    formCues: [
      'Rear foot elevated on bench',
      'Lower until back knee near ground',
      'Keep torso upright',
      'Drive through front heel',
    ],
    progressionFrom: 'split_squats',
  },

  leg_press: {
    id: 'leg_press',
    name: 'Leg Press',
    category: 'legs',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['machine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 90,
    formCues: [
      'Feet shoulder width on platform',
      'Lower until knees at 90 degrees',
      'Press through full foot',
      'Don\'t lock out knees at top',
    ],
  },

  leg_extensions: {
    id: 'leg_extensions',
    name: 'Leg Extensions',
    category: 'legs',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 60,
    formCues: [
      'Adjust pad to just above ankles',
      'Extend legs fully',
      'Squeeze quads at top',
      'Lower under control',
    ],
  },

  // Hamstring/Glute focused
  deadlifts: {
    id: 'deadlifts',
    name: 'Deadlifts',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes', 'back'],
    secondaryMuscles: ['quadriceps', 'lowerBack', 'forearms'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '5-8',
    restTime: 150,
    formCues: [
      'Bar over mid-foot',
      'Hinge at hips, flat back',
      'Grip outside knees',
      'Drive through floor',
      'Stand tall at top',
    ],
  },

  romanian_deadlifts: {
    id: 'romanian_deadlifts',
    name: 'Romanian Deadlifts',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lowerBack'],
    equipment: ['barbell', 'dumbbells'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '8-10',
    restTime: 90,
    formCues: [
      'Slight knee bend throughout',
      'Push hips back',
      'Lower until hamstring stretch',
      'Keep bar close to legs',
    ],
  },

  dumbbell_rdl: {
    id: 'dumbbell_rdl',
    name: 'Dumbbell Romanian Deadlift',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lowerBack'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 75,
    formCues: [
      'Hold dumbbells in front of thighs',
      'Push hips back with slight knee bend',
      'Feel stretch in hamstrings',
      'Squeeze glutes at top',
    ],
    progressionTo: 'romanian_deadlifts',
  },

  leg_curls: {
    id: 'leg_curls',
    name: 'Leg Curls',
    category: 'legs',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 60,
    formCues: [
      'Lie face down on machine',
      'Curl heels toward glutes',
      'Squeeze hamstrings at top',
      'Lower slowly',
    ],
  },

  hip_thrusts: {
    id: 'hip_thrusts',
    name: 'Hip Thrusts',
    category: 'legs',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['bench', 'barbell'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 90,
    formCues: [
      'Upper back on bench',
      'Bar across hips',
      'Feet flat, knees at 90 degrees',
      'Drive hips up, squeeze glutes',
      'Chin tucked at top',
    ],
  },

  glute_bridges: {
    id: 'glute_bridges',
    name: 'Glute Bridges',
    category: 'legs',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restTime: 45,
    formCues: [
      'Lie on back, knees bent',
      'Drive hips up',
      'Squeeze glutes at top',
      'Lower under control',
    ],
    progressionTo: 'hip_thrusts',
  },

  // Calves
  calf_raises: {
    id: 'calf_raises',
    name: 'Standing Calf Raises',
    category: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['none', 'dumbbells', 'machine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restTime: 45,
    formCues: [
      'Rise up on toes',
      'Squeeze at top',
      'Lower heels below platform if possible',
      'Full range of motion',
    ],
  },

  seated_calf_raises: {
    id: 'seated_calf_raises',
    name: 'Seated Calf Raises',
    category: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restTime: 45,
    formCues: [
      'Sit with pad on thighs',
      'Rise up on toes',
      'Squeeze at top',
      'Lower fully',
    ],
  },

  // ==================== CORE MOVEMENTS ====================

  planks: {
    id: 'planks',
    name: 'Planks',
    category: 'core',
    primaryMuscles: ['abs', 'obliques'],
    secondaryMuscles: ['lowerBack'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '30-60 sec',
    restTime: 45,
    formCues: [
      'Forearms and toes on ground',
      'Body in straight line',
      'Engage core, don\'t sag',
      'Breathe steadily',
    ],
  },

  crunches: {
    id: 'crunches',
    name: 'Crunches',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '15-20',
    restTime: 45,
    formCues: [
      'Lie on back, knees bent',
      'Hands behind head (don\'t pull)',
      'Curl shoulders toward hips',
      'Don\'t sit all the way up',
    ],
  },

  leg_raises: {
    id: 'leg_raises',
    name: 'Leg Raises',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 45,
    formCues: [
      'Lie flat, hands under hips',
      'Raise legs to vertical',
      'Lower slowly, don\'t touch ground',
      'Keep lower back pressed down',
    ],
  },

  hanging_leg_raises: {
    id: 'hanging_leg_raises',
    name: 'Hanging Leg Raises',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearms'],
    equipment: ['pullupBar'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: '10-12',
    restTime: 60,
    formCues: [
      'Hang from bar',
      'Raise legs to horizontal or higher',
      'Control the descent',
      'Minimize swinging',
    ],
    progressionFrom: 'leg_raises',
  },

  russian_twists: {
    id: 'russian_twists',
    name: 'Russian Twists',
    category: 'core',
    primaryMuscles: ['obliques'],
    secondaryMuscles: ['abs'],
    equipment: ['none', 'dumbbells'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '20 total',
    restTime: 45,
    formCues: [
      'Sit with knees bent, lean back',
      'Rotate torso side to side',
      'Touch ground each side',
      'Keep feet off ground for harder version',
    ],
  },

  bicycle_crunches: {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    category: 'core',
    primaryMuscles: ['abs', 'obliques'],
    secondaryMuscles: [],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '20 total',
    restTime: 45,
    formCues: [
      'Lie on back, hands behind head',
      'Alternate elbow to opposite knee',
      'Extend other leg out',
      'Controlled, not fast',
    ],
  },

  dead_bugs: {
    id: 'dead_bugs',
    name: 'Dead Bug',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['lowerBack'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10 each side',
    restTime: 45,
    formCues: [
      'Lie on back, arms up, knees at 90',
      'Extend opposite arm and leg',
      'Keep lower back pressed to floor',
      'Return and switch sides',
    ],
  },

  bird_dogs: {
    id: 'bird_dogs',
    name: 'Bird Dog',
    category: 'core',
    primaryMuscles: ['lowerBack'],
    secondaryMuscles: ['abs', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '10 each side',
    restTime: 45,
    formCues: [
      'Start on hands and knees',
      'Extend opposite arm and leg',
      'Keep back flat and stable',
      'Return and switch sides',
    ],
  },

  back_extensions: {
    id: 'back_extensions',
    name: 'Back Extensions',
    category: 'core',
    primaryMuscles: ['lowerBack'],
    secondaryMuscles: ['glutes'],
    equipment: ['bench', 'machine'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '12-15',
    restTime: 45,
    formCues: [
      'Hips on pad, feet secured',
      'Lower torso down',
      'Raise until body is straight',
      'Don\'t hyperextend',
    ],
  },

  mountain_climbers: {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'quadriceps'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '30 sec',
    restTime: 45,
    formCues: [
      'Start in push-up position',
      'Alternate driving knees to chest',
      'Keep hips level',
      'Move quickly but controlled',
    ],
  },

  side_planks: {
    id: 'side_planks',
    name: 'Side Planks',
    category: 'core',
    primaryMuscles: ['obliques'],
    secondaryMuscles: ['abs'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: '30 sec each',
    restTime: 30,
    formCues: [
      'Forearm and feet on ground',
      'Body in straight line from head to feet',
      'Hips lifted',
      'Don\'t let hips drop',
    ],
  },
};

// Get all exercise IDs
export const getAllExerciseIds = () => Object.keys(EXERCISES);

// Get exercises by category
export const getExercisesByCategory = (category) => {
  return Object.values(EXERCISES).filter(e => e.category === category);
};

// Get exercises by muscle
export const getExercisesByMuscle = (muscleId, type = 'primary') => {
  return Object.values(EXERCISES).filter(e => {
    if (type === 'primary') return e.primaryMuscles.includes(muscleId);
    if (type === 'secondary') return e.secondaryMuscles.includes(muscleId);
    return e.primaryMuscles.includes(muscleId) || e.secondaryMuscles.includes(muscleId);
  });
};

// Get exercises by equipment
export const getExercisesByEquipment = (equipmentList) => {
  return Object.values(EXERCISES).filter(e =>
    e.equipment.some(eq => equipmentList.includes(eq))
  );
};

// Filter exercises by available equipment
export const filterByAvailableEquipment = (exercises, availableEquipment) => {
  return exercises.filter(e =>
    e.equipment.some(eq => availableEquipment.includes(eq))
  );
};

// Get exercises by difficulty
export const getExercisesByDifficulty = (difficulty) => {
  return Object.values(EXERCISES).filter(e => e.difficulty === difficulty);
};

export default EXERCISES;
