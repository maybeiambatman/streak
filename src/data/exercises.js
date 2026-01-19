// GainStreak Exercise Library
// Proven, compound movements organized by muscle group

import { MuscleGroups, Equipment, Difficulty } from '../types';

export const EXERCISES = {
  // ==================== CHEST ====================
  barbell_bench_press: {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS, MuscleGroups.SHOULDERS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Lie flat on bench with eyes under the bar',
      'Grip bar slightly wider than shoulder width',
      'Unrack and lower bar to mid-chest',
      'Press bar up until arms are extended',
    ],
    tips: [
      'Keep shoulder blades pinched together',
      'Maintain slight arch in lower back',
      'Keep feet flat on floor for stability',
    ],
  },

  incline_barbell_bench_press: {
    id: 'incline_barbell_bench_press',
    name: 'Incline Barbell Bench Press',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS, MuscleGroups.SHOULDERS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Set bench to 30-45 degree incline',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to upper chest',
      'Press up and slightly back',
    ],
    tips: [
      'Focus on upper chest activation',
      'Dont set incline too high or shoulders take over',
    ],
  },

  dumbbell_bench_press: {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS, MuscleGroups.SHOULDERS],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Lie flat on bench with dumbbells at chest level',
      'Press dumbbells up, bringing them together at top',
      'Lower with control to chest level',
    ],
    tips: [
      'Greater range of motion than barbell',
      'Good for fixing strength imbalances',
    ],
  },

  incline_dumbbell_press: {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS, MuscleGroups.SHOULDERS],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Set bench to 30-45 degree incline',
      'Press dumbbells up from shoulder level',
      'Bring weights together at top',
      'Lower with control',
    ],
    tips: [
      'Targets upper chest',
      'Allows natural arm path',
    ],
  },

  dumbbell_fly: {
    id: 'dumbbell_fly',
    name: 'Dumbbell Fly',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.SHOULDERS],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Lie flat with dumbbells above chest, palms facing',
      'Lower weights in wide arc with slight elbow bend',
      'Stop when you feel chest stretch',
      'Squeeze chest to bring weights back up',
    ],
    tips: [
      'Keep slight bend in elbows throughout',
      'Focus on chest squeeze, not arm movement',
    ],
  },

  push_ups: {
    id: 'push_ups',
    name: 'Push-ups',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS, MuscleGroups.SHOULDERS, MuscleGroups.CORE],
    equipment: [Equipment.BODYWEIGHT],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower chest to ground keeping body straight',
      'Push back up to starting position',
    ],
    tips: [
      'Keep core tight throughout',
      'Dont let hips sag or pike up',
    ],
  },

  cable_crossover: {
    id: 'cable_crossover',
    name: 'Cable Crossover',
    primaryMuscleGroup: MuscleGroups.CHEST,
    secondaryMuscleGroups: [MuscleGroups.SHOULDERS],
    equipment: [Equipment.CABLE],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Stand between cable stations with handles at high position',
      'Step forward with slight lean',
      'Bring handles down and together in arc motion',
      'Squeeze chest at bottom, return with control',
    ],
    tips: [
      'Keep slight bend in elbows',
      'Focus on chest contraction',
    ],
  },

  // ==================== BACK ====================
  pull_ups: {
    id: 'pull_ups',
    name: 'Pull-ups',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.BICEPS],
    equipment: [Equipment.BODYWEIGHT],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Grip bar wider than shoulder width, palms away',
      'Hang with arms fully extended',
      'Pull up until chin clears bar',
      'Lower with control',
    ],
    tips: [
      'Initiate pull by squeezing shoulder blades',
      'Avoid swinging or kipping',
    ],
  },

  lat_pulldown: {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.BICEPS],
    equipment: [Equipment.CABLE, Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit with thighs secured under pad',
      'Grip bar wider than shoulder width',
      'Pull bar down to upper chest',
      'Let bar up with control, fully extending arms',
    ],
    tips: [
      'Lean back slightly',
      'Pull elbows down and back',
    ],
  },

  barbell_row: {
    id: 'barbell_row',
    name: 'Barbell Row',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.BICEPS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Hinge at hips with slight knee bend',
      'Grip bar shoulder width, arms hanging',
      'Pull bar to lower chest/upper abs',
      'Lower with control',
    ],
    tips: [
      'Keep back flat, dont round',
      'Pull elbows past torso',
    ],
  },

  dumbbell_row: {
    id: 'dumbbell_row',
    name: 'Dumbbell Row',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.BICEPS],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Place one hand and knee on bench',
      'Hold dumbbell with other hand, arm extended',
      'Pull dumbbell to hip',
      'Lower with control',
    ],
    tips: [
      'Keep back flat and parallel to ground',
      'Pull elbow past torso',
    ],
  },

  seated_cable_row: {
    id: 'seated_cable_row',
    name: 'Seated Cable Row',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.BICEPS],
    equipment: [Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit with feet on platform, knees slightly bent',
      'Grip handle with arms extended',
      'Pull handle to midsection',
      'Squeeze shoulder blades, return with control',
    ],
    tips: [
      'Keep torso upright, minimal swinging',
      'Full stretch at extension',
    ],
  },

  t_bar_row: {
    id: 't_bar_row',
    name: 'T-Bar Row',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.BICEPS],
    equipment: [Equipment.BARBELL, Equipment.MACHINE],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Straddle the bar with handle attachment',
      'Hinge at hips, grip handle',
      'Pull to chest keeping elbows close',
      'Lower with control',
    ],
    tips: [
      'Great for mid-back thickness',
      'Keep lower back neutral',
    ],
  },

  // ==================== BACK (Lower) / POSTERIOR CHAIN ====================
  deadlift: {
    id: 'deadlift',
    name: 'Deadlift (Conventional)',
    primaryMuscleGroup: MuscleGroups.BACK,
    secondaryMuscleGroups: [MuscleGroups.HAMSTRINGS, MuscleGroups.GLUTES, MuscleGroups.CORE],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Stand with feet hip-width, bar over mid-foot',
      'Hinge and grip bar just outside legs',
      'Drive through floor, keeping bar close',
      'Stand tall at top, reverse to lower',
    ],
    tips: [
      'Keep back flat throughout',
      'Push floor away rather than pulling bar up',
    ],
  },

  romanian_deadlift: {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscleGroup: MuscleGroups.HAMSTRINGS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.BACK],
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Stand holding weight at hips',
      'Push hips back with slight knee bend',
      'Lower until hamstring stretch',
      'Drive hips forward to stand',
    ],
    tips: [
      'Keep bar/dumbbells close to legs',
      'Feel stretch in hamstrings at bottom',
    ],
  },

  good_mornings: {
    id: 'good_mornings',
    name: 'Good Mornings',
    primaryMuscleGroup: MuscleGroups.HAMSTRINGS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.BACK],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Bar on upper back like squat position',
      'Push hips back, hinging at waist',
      'Lower until torso near parallel',
      'Drive hips forward to stand',
    ],
    tips: [
      'Start light to learn movement',
      'Keep slight knee bend',
    ],
  },

  // ==================== SHOULDERS ====================
  overhead_press: {
    id: 'overhead_press',
    name: 'Overhead Press (Barbell)',
    primaryMuscleGroup: MuscleGroups.SHOULDERS,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS, MuscleGroups.CORE],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Hold bar at shoulder level, grip just outside shoulders',
      'Brace core and press bar overhead',
      'Lock out at top with bar over mid-foot',
      'Lower with control to shoulders',
    ],
    tips: [
      'Move head back slightly as bar passes',
      'Keep core tight, no excessive lean back',
    ],
  },

  dumbbell_shoulder_press: {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    primaryMuscleGroup: MuscleGroups.SHOULDERS,
    secondaryMuscleGroups: [MuscleGroups.TRICEPS],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit or stand with dumbbells at shoulder height',
      'Press dumbbells overhead',
      'Touch weights lightly at top',
      'Lower with control',
    ],
    tips: [
      'Can be done seated or standing',
      'Dont flare elbows too wide',
    ],
  },

  lateral_raises: {
    id: 'lateral_raises',
    name: 'Lateral Raises',
    primaryMuscleGroup: MuscleGroups.SHOULDERS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.DUMBBELL, Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand with dumbbells at sides',
      'Raise arms out to sides until shoulder height',
      'Lead with elbows, slight bend',
      'Lower with control',
    ],
    tips: [
      'Dont swing or use momentum',
      'Slight forward lean can help',
    ],
  },

  front_raises: {
    id: 'front_raises',
    name: 'Front Raises',
    primaryMuscleGroup: MuscleGroups.SHOULDERS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.DUMBBELL, Equipment.BARBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand with weight in front of thighs',
      'Raise arms in front to shoulder height',
      'Keep slight elbow bend',
      'Lower with control',
    ],
    tips: [
      'Alternate arms or both together',
      'Dont swing body',
    ],
  },

  face_pulls: {
    id: 'face_pulls',
    name: 'Face Pulls',
    primaryMuscleGroup: MuscleGroups.SHOULDERS,
    secondaryMuscleGroups: [MuscleGroups.BACK],
    equipment: [Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Set cable at face height with rope attachment',
      'Pull rope toward face, separating hands',
      'Externally rotate shoulders at end',
      'Return with control',
    ],
    tips: [
      'Great for rear delts and posture',
      'Pull to ears, not chest',
    ],
  },

  reverse_fly: {
    id: 'reverse_fly',
    name: 'Reverse Fly',
    primaryMuscleGroup: MuscleGroups.SHOULDERS,
    secondaryMuscleGroups: [MuscleGroups.BACK],
    equipment: [Equipment.DUMBBELL, Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Bend over or use machine',
      'Start with arms hanging or extended forward',
      'Raise arms out to sides, squeezing rear delts',
      'Lower with control',
    ],
    tips: [
      'Focus on rear delt contraction',
      'Use lighter weight with control',
    ],
  },

  // ==================== BICEPS ====================
  barbell_curl: {
    id: 'barbell_curl',
    name: 'Barbell Curl',
    primaryMuscleGroup: MuscleGroups.BICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand with barbell, arms extended, palms up',
      'Curl bar up toward shoulders',
      'Keep elbows at sides',
      'Lower with control',
    ],
    tips: [
      'Dont swing or use body momentum',
      'Full range of motion',
    ],
  },

  dumbbell_curl: {
    id: 'dumbbell_curl',
    name: 'Dumbbell Curl',
    primaryMuscleGroup: MuscleGroups.BICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand or sit with dumbbells at sides',
      'Curl weights up, rotating palms up',
      'Squeeze at top',
      'Lower with control',
    ],
    tips: [
      'Can alternate arms or curl together',
      'Supinate (rotate) wrist as you curl',
    ],
  },

  hammer_curl: {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    primaryMuscleGroup: MuscleGroups.BICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand with dumbbells at sides, palms facing in',
      'Curl weights up keeping neutral grip',
      'Squeeze at top',
      'Lower with control',
    ],
    tips: [
      'Works brachialis and forearms too',
      'Keep palms facing each other throughout',
    ],
  },

  preacher_curl: {
    id: 'preacher_curl',
    name: 'Preacher Curl',
    primaryMuscleGroup: MuscleGroups.BICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL, Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit at preacher bench with arms over pad',
      'Curl weight up toward shoulders',
      'Squeeze at top',
      'Lower with control, full extension',
    ],
    tips: [
      'Eliminates momentum',
      'Dont let elbows flare',
    ],
  },

  // ==================== TRICEPS ====================
  tricep_pushdown: {
    id: 'tricep_pushdown',
    name: 'Tricep Pushdown',
    primaryMuscleGroup: MuscleGroups.TRICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand at cable machine with bar/rope at chest height',
      'Push weight down until arms fully extended',
      'Keep elbows at sides',
      'Return with control',
    ],
    tips: [
      'Squeeze triceps at bottom',
      'Dont let elbows move forward',
    ],
  },

  skull_crushers: {
    id: 'skull_crushers',
    name: 'Skull Crushers',
    primaryMuscleGroup: MuscleGroups.TRICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Lie on bench holding weight over chest',
      'Bend elbows, lowering weight toward forehead',
      'Keep upper arms stationary',
      'Extend arms back to start',
    ],
    tips: [
      'Control the descent',
      'Keep elbows pointed up',
    ],
  },

  close_grip_bench_press: {
    id: 'close_grip_bench_press',
    name: 'Close-Grip Bench Press',
    primaryMuscleGroup: MuscleGroups.TRICEPS,
    secondaryMuscleGroups: [MuscleGroups.CHEST],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Lie on bench, grip bar shoulder-width or narrower',
      'Lower bar to lower chest',
      'Press up keeping elbows closer to body',
      'Lock out at top',
    ],
    tips: [
      'Great compound tricep movement',
      'Grip doesnt need to be super close',
    ],
  },

  overhead_tricep_extension: {
    id: 'overhead_tricep_extension',
    name: 'Overhead Tricep Extension',
    primaryMuscleGroup: MuscleGroups.TRICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.DUMBBELL, Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Hold dumbbell overhead with both hands',
      'Lower weight behind head by bending elbows',
      'Keep upper arms close to head',
      'Extend arms back up',
    ],
    tips: [
      'Stretches long head of triceps',
      'Keep elbows pointed forward',
    ],
  },

  dips: {
    id: 'dips',
    name: 'Dips',
    primaryMuscleGroup: MuscleGroups.TRICEPS,
    secondaryMuscleGroups: [MuscleGroups.CHEST, MuscleGroups.SHOULDERS],
    equipment: [Equipment.BODYWEIGHT],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Support yourself on parallel bars',
      'Lower body by bending elbows',
      'Lean forward for chest, upright for triceps',
      'Push back up to start',
    ],
    tips: [
      'Dont go too deep if shoulder issues',
      'Add weight when bodyweight is easy',
    ],
  },

  // ==================== QUADRICEPS ====================
  barbell_back_squat: {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    primaryMuscleGroup: MuscleGroups.QUADRICEPS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.HAMSTRINGS, MuscleGroups.CORE],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Bar on upper back, feet shoulder-width',
      'Brace core and descend by breaking at hips and knees',
      'Go to at least parallel',
      'Drive through feet to stand',
    ],
    tips: [
      'Knees track over toes',
      'Keep chest up throughout',
    ],
  },

  front_squat: {
    id: 'front_squat',
    name: 'Front Squat',
    primaryMuscleGroup: MuscleGroups.QUADRICEPS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.CORE],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.ADVANCED,
    instructions: [
      'Bar on front delts, elbows high',
      'Descend keeping torso upright',
      'Go to depth',
      'Drive up keeping elbows high',
    ],
    tips: [
      'More quad dominant than back squat',
      'Requires good mobility',
    ],
  },

  leg_press: {
    id: 'leg_press',
    name: 'Leg Press',
    primaryMuscleGroup: MuscleGroups.QUADRICEPS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.HAMSTRINGS],
    equipment: [Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit in machine with feet shoulder-width on platform',
      'Release safety and lower weight',
      'Press through feet to extend legs',
      'Dont lock knees at top',
    ],
    tips: [
      'Foot placement affects muscle emphasis',
      'Keep lower back pressed into seat',
    ],
  },

  lunges: {
    id: 'lunges',
    name: 'Lunges',
    primaryMuscleGroup: MuscleGroups.QUADRICEPS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.HAMSTRINGS],
    equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL, Equipment.BARBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Step forward into lunge position',
      'Lower back knee toward ground',
      'Front knee stays over ankle',
      'Push through front foot to return',
    ],
    tips: [
      'Walking or stationary variations',
      'Keep torso upright',
    ],
  },

  bulgarian_split_squat: {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    primaryMuscleGroup: MuscleGroups.QUADRICEPS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.HAMSTRINGS],
    equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Rear foot elevated on bench behind you',
      'Lower until back knee nearly touches ground',
      'Keep front knee over ankle',
      'Drive through front foot to stand',
    ],
    tips: [
      'Great for single leg strength',
      'Find right distance from bench',
    ],
  },

  leg_extension: {
    id: 'leg_extension',
    name: 'Leg Extension',
    primaryMuscleGroup: MuscleGroups.QUADRICEPS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit in machine with pad on lower shins',
      'Extend legs until straight',
      'Squeeze quads at top',
      'Lower with control',
    ],
    tips: [
      'Isolation exercise for quads',
      'Dont use momentum',
    ],
  },

  // ==================== HAMSTRINGS ====================
  lying_leg_curl: {
    id: 'lying_leg_curl',
    name: 'Lying Leg Curl',
    primaryMuscleGroup: MuscleGroups.HAMSTRINGS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Lie face down with pad above heels',
      'Curl heels toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control',
    ],
    tips: [
      'Dont lift hips off pad',
      'Full range of motion',
    ],
  },

  seated_leg_curl: {
    id: 'seated_leg_curl',
    name: 'Seated Leg Curl',
    primaryMuscleGroup: MuscleGroups.HAMSTRINGS,
    secondaryMuscleGroups: [],
    equipment: [Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit with pad above heels, thighs secured',
      'Curl heels under seat',
      'Squeeze at bottom',
      'Return with control',
    ],
    tips: [
      'Slightly different hamstring activation than lying',
      'Keep back against pad',
    ],
  },

  stiff_leg_deadlift: {
    id: 'stiff_leg_deadlift',
    name: 'Stiff-Leg Deadlift',
    primaryMuscleGroup: MuscleGroups.HAMSTRINGS,
    secondaryMuscleGroups: [MuscleGroups.GLUTES, MuscleGroups.BACK],
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Stand with weight, legs nearly straight',
      'Hinge forward keeping legs straight',
      'Lower until hamstring stretch',
      'Drive hips forward to stand',
    ],
    tips: [
      'Less knee bend than RDL',
      'Excellent hamstring stretch',
    ],
  },

  // ==================== GLUTES ====================
  hip_thrust: {
    id: 'hip_thrust',
    name: 'Hip Thrust',
    primaryMuscleGroup: MuscleGroups.GLUTES,
    secondaryMuscleGroups: [MuscleGroups.HAMSTRINGS],
    equipment: [Equipment.BARBELL, Equipment.BODYWEIGHT],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Upper back on bench, feet flat on floor',
      'Bar across hips (padded)',
      'Drive hips up, squeezing glutes at top',
      'Lower with control',
    ],
    tips: [
      'Chin tucked at top',
      'Dont hyperextend lower back',
    ],
  },

  glute_bridge: {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    primaryMuscleGroup: MuscleGroups.GLUTES,
    secondaryMuscleGroups: [MuscleGroups.HAMSTRINGS],
    equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Lie on back, knees bent, feet flat',
      'Drive hips up squeezing glutes',
      'Hold at top',
      'Lower with control',
    ],
    tips: [
      'Great activation exercise',
      'Add weight for progression',
    ],
  },

  // ==================== CALVES ====================
  standing_calf_raise: {
    id: 'standing_calf_raise',
    name: 'Standing Calf Raise',
    primaryMuscleGroup: MuscleGroups.CALVES,
    secondaryMuscleGroups: [],
    equipment: [Equipment.MACHINE, Equipment.BODYWEIGHT, Equipment.DUMBBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Stand on platform with heels hanging off',
      'Lower heels below platform',
      'Rise up on toes as high as possible',
      'Lower with control',
    ],
    tips: [
      'Full range of motion',
      'Pause at top and bottom',
    ],
  },

  seated_calf_raise: {
    id: 'seated_calf_raise',
    name: 'Seated Calf Raise',
    primaryMuscleGroup: MuscleGroups.CALVES,
    secondaryMuscleGroups: [],
    equipment: [Equipment.MACHINE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit with pad on lower thighs',
      'Lower heels as far as possible',
      'Press up through toes',
      'Squeeze at top',
    ],
    tips: [
      'Targets soleus more',
      'Use full range of motion',
    ],
  },

  // ==================== CORE ====================
  plank: {
    id: 'plank',
    name: 'Plank',
    primaryMuscleGroup: MuscleGroups.CORE,
    secondaryMuscleGroups: [MuscleGroups.SHOULDERS],
    equipment: [Equipment.BODYWEIGHT],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Support body on forearms and toes',
      'Keep body in straight line',
      'Hold position, breathing steadily',
    ],
    tips: [
      'Dont let hips sag or pike',
      'Squeeze glutes for stability',
    ],
  },

  hanging_leg_raise: {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg Raise',
    primaryMuscleGroup: MuscleGroups.CORE,
    secondaryMuscleGroups: [],
    equipment: [Equipment.BODYWEIGHT],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Hang from bar with arms extended',
      'Raise legs until parallel or higher',
      'Lower with control',
      'Minimize swinging',
    ],
    tips: [
      'Bend knees if straight legs too hard',
      'Focus on using abs, not hip flexors',
    ],
  },

  cable_crunch: {
    id: 'cable_crunch',
    name: 'Cable Crunch',
    primaryMuscleGroup: MuscleGroups.CORE,
    secondaryMuscleGroups: [],
    equipment: [Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Kneel facing cable with rope behind head',
      'Crunch down bringing elbows toward knees',
      'Focus on ab contraction',
      'Return with control',
    ],
    tips: [
      'Dont pull with arms',
      'Round spine, dont just bend at hips',
    ],
  },

  ab_wheel_rollout: {
    id: 'ab_wheel_rollout',
    name: 'Ab Wheel Rollout',
    primaryMuscleGroup: MuscleGroups.CORE,
    secondaryMuscleGroups: [MuscleGroups.SHOULDERS],
    equipment: [Equipment.BODYWEIGHT],
    difficulty: Difficulty.INTERMEDIATE,
    instructions: [
      'Kneel with hands on ab wheel',
      'Roll forward extending body',
      'Go as far as you can control',
      'Pull back to start using abs',
    ],
    tips: [
      'Keep core tight throughout',
      'Dont let lower back sag',
    ],
  },

  russian_twist: {
    id: 'russian_twist',
    name: 'Russian Twist',
    primaryMuscleGroup: MuscleGroups.CORE,
    secondaryMuscleGroups: [],
    equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL, Equipment.KETTLEBELL],
    difficulty: Difficulty.BEGINNER,
    instructions: [
      'Sit with knees bent, lean back slightly',
      'Hold weight at chest or arms extended',
      'Rotate torso side to side',
      'Touch weight to ground each side',
    ],
    tips: [
      'Lift feet for more challenge',
      'Rotate from core, not just arms',
    ],
  },
};

// Helper functions
export const getExerciseById = (id) => EXERCISES[id];

export const getExercisesByMuscleGroup = (muscleGroup, type = 'primary') => {
  return Object.values(EXERCISES).filter(exercise => {
    if (type === 'primary') {
      return exercise.primaryMuscleGroup === muscleGroup;
    }
    if (type === 'secondary') {
      return exercise.secondaryMuscleGroups.includes(muscleGroup);
    }
    return exercise.primaryMuscleGroup === muscleGroup ||
           exercise.secondaryMuscleGroups.includes(muscleGroup);
  });
};

export const getExercisesByEquipment = (equipmentList) => {
  return Object.values(EXERCISES).filter(exercise =>
    exercise.equipment.some(eq => equipmentList.includes(eq))
  );
};

export const getExercisesByDifficulty = (difficulty) => {
  return Object.values(EXERCISES).filter(exercise => exercise.difficulty === difficulty);
};

export const filterExercisesByEquipment = (exercises, availableEquipment) => {
  return exercises.filter(exercise =>
    exercise.equipment.some(eq => availableEquipment.includes(eq))
  );
};

export const getAllExercises = () => Object.values(EXERCISES);

export default EXERCISES;
