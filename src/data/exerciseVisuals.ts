export interface ExerciseVisualDefinition {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  bodyPart: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core';
  description: string;
  setupInstructions: string[];
  executionSteps: string[];
  commonMistakes: string[];
  youtubeVideoId: string;
  videoTitle: string;
  // Keyframes preserved for data completeness
  animationFrames?: {
    label: string;
    jointAngles: Record<string, number>;
    activeMuscleGroups: string[];
  }[];
  gifUrl?: string;
}

export const EXERCISE_VISUALS_DATABASE: Record<string, ExerciseVisualDefinition> = {
  push_ups: {
    id: 'push_ups',
    name: 'Push-Up',
    primaryMuscles: ['Chest (Pectoralis Major)', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids', 'Core / Abs'],
    bodyPart: 'chest',
    description: 'Fundamental bodyweight horizontal push exercise for building chest density, shoulder stability, and core strength.',
    youtubeVideoId: 'IODxDxX7oi4',
    videoTitle: 'How to Do a Push Up with Proper Form',
    setupInstructions: [
      'Place hands slightly wider than shoulder-width apart on the floor.',
      'Form a straight line from ankles to shoulders with glutes and core tight.',
      'Look slightly ahead of your fingertips to maintain neutral neck alignment.'
    ],
    executionSteps: [
      'Inhale as you lower your body until chest is about an inch off the floor.',
      'Keep elbows flared at a 45-degree angle relative to torso (not 90 degrees).',
      'Exhale and press powerfully through your palms back to starting plank position.'
    ],
    commonMistakes: [
      'Sagging lower back or hips dropping.',
      'Flaring elbows out to 90 degrees (strains shoulders).',
      'Half reps (not lowering all the way).'
    ]
  },
  bench_press: {
    id: 'bench_press',
    name: 'Barbell / Dumbbell Bench Press',
    primaryMuscles: ['Chest (Pectoralis Major)', 'Triceps'],
    secondaryMuscles: ['Front Deltoids', 'Serratus Anterior'],
    bodyPart: 'chest',
    description: 'King of chest exercises for maximal muscle hypertrophy and pressing power.',
    youtubeVideoId: 'vcBig73ojpE',
    videoTitle: 'How To Bench Press Properly (Form Tutorial)',
    setupInstructions: [
      'Lie flat on bench with feet firm on the ground and shoulder blades retracted into bench.',
      'Grip the bar slightly wider than shoulder width.',
      'Unrack bar with arms fully extended directly over mid-chest.'
    ],
    executionSteps: [
      'Lower bar with control to lower-sternum while maintaining shoulder blade pinch.',
      'Pause for a fraction of a second when touching chest lightly.',
      'Drive feet into floor and press bar up in a slight J-curve.'
    ],
    commonMistakes: [
      'Bouncing bar off chest.',
      'Flaring elbows outward excessively.',
      'Lifting glutes off the bench.'
    ]
  },
  squats: {
    id: 'squats',
    name: 'Barbell / Goblet / Bodyweight Squat',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae'],
    bodyPart: 'legs',
    description: 'The compound cornerstone for lower body strength, leg mass, and hip mobility.',
    youtubeVideoId: 'gcNh17Ckjgg',
    videoTitle: 'How To Squat with Perfect Form',
    setupInstructions: [
      'Stand with feet shoulder-width apart, toes turned slightly out (15–30 degrees).',
      'Brace core firmly as if expecting a push.',
      'Keep chest up and gaze forward.'
    ],
    executionSteps: [
      'Initiate movement by bending at hips and knees simultaneously.',
      'Lower until thighs are at least parallel to floor while knees track over toes.',
      'Push through mid-foot and heel to return upright, squeezing glutes at top.'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse).',
      'Heels lifting off ground.',
      'Rounding lower back (butt wink).'
    ]
  },
  deadlifts: {
    id: 'deadlifts',
    name: 'Barbell / Dumbbell Deadlift',
    primaryMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae'],
    secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearms / Grip'],
    bodyPart: 'back',
    description: 'Ultimate total-body posterior chain pull for thick back development and functional power.',
    youtubeVideoId: 'op9kVnSso6Q',
    videoTitle: 'How to Deadlift with Proper Form & Technique',
    setupInstructions: [
      'Stand with feet hip-width apart, bar over mid-foot.',
      'Hinge hips back and grip bar just outside knees.',
      'Pull chest up, flatten lower back, and engage lats ("squeeze armpits").'
    ],
    executionSteps: [
      'Drive through floor with legs to push ground away.',
      'Keep bar dragging close to shins and thighs as you extend hips and knees.',
      'Stand tall at top lockout without hyper-extending lower back.'
    ],
    commonMistakes: [
      'Rounding lower back while lifting.',
      'Jerking bar off floor instead of building tension.',
      'Bar drifting far forward away from body.'
    ]
  },
  pull_ups: {
    id: 'pull_ups',
    name: 'Pull-Up / Lat Pull',
    primaryMuscles: ['Latissimus Dorsi', 'Biceps Brachii'],
    secondaryMuscles: ['Rhomboids', 'Rear Deltoids', 'Core'],
    bodyPart: 'back',
    description: 'Premier upper-body vertical pulling exercise for a wide V-taper back.',
    youtubeVideoId: 'eGo4IYlbE5g',
    videoTitle: 'How To Pull Up (Technique Guide)',
    setupInstructions: [
      'Grip bar overhead with palms facing away (overhand) slightly wider than shoulders.',
      'Dead hang with arms fully extended and shoulders packed down.'
    ],
    executionSteps: [
      'Pull elbows down towards ribcage, driving chest up towards bar.',
      'Continue pulling until chin clears the bar cleanly.',
      'Lower back down under full control over 2-3 seconds.'
    ],
    commonMistakes: [
      'Kicking legs or swinging (using momentum).',
      'Incomplete range of motion (not getting chin over bar or fully extending at bottom).',
      'Shrugging shoulders up to ears.'
    ]
  },
  dumbbell_rows: {
    id: 'dumbbell_rows',
    name: 'One-Arm Dumbbell Row / Inverted Row',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    bodyPart: 'back',
    description: 'Unilateral back exercise to correct strength imbalances and thicken upper back.',
    youtubeVideoId: 'pYcpY20QaE8',
    videoTitle: 'How to Do One-Arm Dumbbell Rows Properly',
    setupInstructions: [
      'Place one knee and hand on a bench (or hinge forward supporting on chair/table).',
      'Keep back flat parallel to ground.',
      'Hold dumbbell hanging straight down.'
    ],
    executionSteps: [
      'Pull dumbbell toward your hip/waist keeping elbow close to side.',
      'Squeeze shoulder blade inward at top of movement.',
      'Lower dumbbell stretch downward slowly.'
    ],
    commonMistakes: [
      'Twisting torso to yank weight up.',
      'Pulling dumbbell to chest instead of hip.',
      'Rounding spine.'
    ]
  },
  shoulder_press: {
    id: 'shoulder_press',
    name: 'Overhead Shoulder Press (Dumbbell/Barbell)',
    primaryMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps', 'Upper Pectorals', 'Core'],
    bodyPart: 'shoulders',
    description: 'Essential vertical press for boulder shoulders and upper body pressing power.',
    youtubeVideoId: '2yjwXTZQDDI',
    videoTitle: 'How to Overhead Dumbbell Shoulder Press with Proper Form',
    setupInstructions: [
      'Sit or stand upright holding weights at shoulder level with palms facing forward or neutral.',
      'Core engaged, glutes squeezed.'
    ],
    executionSteps: [
      'Press weights straight overhead until arms are extended above head.',
      'Avoid arching lower back excessively.',
      'Lower weights smoothly back to ear/chin height.'
    ],
    commonMistakes: [
      'Excessive backward lean / arching spine.',
      'Flaring wrists.',
      'Shortening range of motion.'
    ]
  },
  bicep_curls: {
    id: 'bicep_curls',
    name: 'Dumbbell / Barbell Bicep Curl',
    primaryMuscles: ['Biceps Brachii', 'Brachialis'],
    secondaryMuscles: ['Forearms (Brachioradialis)'],
    bodyPart: 'arms',
    description: 'Isolated arm exercise targeting front arm peak and pulling strength.',
    youtubeVideoId: 'ykJmrZ5v0Oo',
    videoTitle: 'How To Do Bicep Curls Correctly (Form Tutorial)',
    setupInstructions: [
      'Stand tall with weights at sides, palms facing forward, elbows pinned near ribcage.'
    ],
    executionSteps: [
      'Curl weights upward while keeping upper arms strictly motionless.',
      'Squeeze biceps hard at top contraction.',
      'Lower weights slowly under tension.'
    ],
    commonMistakes: [
      'Swinging torso for momentum.',
      'Drifting elbows forward.',
      'Dropping weight rapidly on eccentric.'
    ]
  },
  planks: {
    id: 'planks',
    name: 'Forearm Plank / Core Hold',
    primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondaryMuscles: ['Obliques', 'Glutes', 'Quadriceps'],
    bodyPart: 'core',
    description: 'Isometric core stability builder for spinal health and abdominal definition.',
    youtubeVideoId: 'pvIjsG5Svck',
    videoTitle: 'How to Plank with Perfect Form (Avoid Back Pain)',
    setupInstructions: [
      'Place forearms on floor with elbows beneath shoulders.',
      'Extend legs back with toes tucked under.'
    ],
    executionSteps: [
      'Tighten abs, squeeze glutes, and tuck pelvis slightly under.',
      'Maintain a continuous straight line from crown of head to heels.',
      'Breathe steadily into belly while holding tension.'
    ],
    commonMistakes: [
      'Hips sagging toward floor.',
      'Piking glutes high into air.',
      'Holding breath.'
    ]
  },
  lunges: {
    id: 'lunges',
    name: 'Forward / Reverse Lunge',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core Balance'],
    bodyPart: 'legs',
    description: 'Unilateral leg builder for balance, knee stability, and quad/glute development.',
    youtubeVideoId: 'QOVaHwm-Q6U',
    videoTitle: 'How to Do Lunges Properly (Form & Technique)',
    setupInstructions: [
      'Stand tall with hands on hips or holding dumbbells at sides.'
    ],
    executionSteps: [
      'Step forward or backward with one foot.',
      'Lower back knee toward floor until both front and back knees form 90-degree angles.',
      'Push off front heel to return to standing position.'
    ],
    commonMistakes: [
      'Front knee extending far past toes.',
      'Torso leaning excessively forward.',
      'Knee collapsing inward.'
    ]
  },
  incline_bench_press: {
    id: 'incline_bench_press',
    name: 'Incline Dumbbell / Barbell Press',
    primaryMuscles: ['Upper Chest (Clavicular Head)', 'Front Deltoids'],
    secondaryMuscles: ['Triceps'],
    bodyPart: 'chest',
    description: 'Focuses on building the upper chest shelf and front shoulder thickness.',
    youtubeVideoId: '8iPEnn-ltC8',
    videoTitle: 'How to Incline Dumbbell Bench Press with Proper Form',
    setupInstructions: [
      'Set bench angle to 30 degrees (avoid higher incline to minimize shoulder overload).',
      'Keep shoulder blades pinched together into the bench.'
    ],
    executionSteps: [
      'Press dumbbells upward directly over upper chest with controlled elbow angle.',
      'Lower dumbbells slowly until you feel a deep upper chest stretch.'
    ],
    commonMistakes: ['Bench angled too high (>45 deg)', 'Bouncing weights', 'Elbows flared straight out 90 deg']
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Dumbbell Lateral Raise',
    primaryMuscles: ['Lateral Deltoids (Side Shoulders)'],
    secondaryMuscles: ['Traps', 'Front Delts'],
    bodyPart: 'shoulders',
    description: 'The golden exercise to broaden shoulders and build a classic V-taper silhouette.',
    youtubeVideoId: '3VcKaXpzqRo',
    videoTitle: 'How to Lateral Raise for Wider Shoulders',
    setupInstructions: ['Stand with slight forward torso lean, weights held in front of thighs.'],
    executionSteps: [
      'Raise dumbbells out to sides leading with elbows until parallel with floor.',
      'Pause briefly and control the descent.'
    ],
    commonMistakes: ['Using heavy momentum / swinging body', 'Shrugging traps up to neck']
  },
  tricep_dips: {
    id: 'tricep_dips',
    name: 'Parallel Bar / Bench Dips',
    primaryMuscles: ['Triceps Brachii', 'Lower Chest'],
    secondaryMuscles: ['Front Deltoids'],
    bodyPart: 'arms',
    description: 'High-leverage mass builder for horseshoe triceps and pushing power.',
    youtubeVideoId: '0326dy_-CzM',
    videoTitle: 'How to Do Dips Correctly (Build Chest & Triceps)',
    setupInstructions: ['Grip parallel bars or bench, lock out arms with shoulders depressed.'],
    executionSteps: [
      'Lower body until elbows reach 90 degrees.',
      'Press through palms to extend elbows back to lockout.'
    ],
    commonMistakes: ['Going too deep if shoulder mobility is restricted', 'Flaring elbows outward']
  },
  lat_pulldown: {
    id: 'lat_pulldown',
    name: 'Cable Lat Pulldown',
    primaryMuscles: ['Latissimus Dorsi', 'Upper Back'],
    secondaryMuscles: ['Biceps', 'Rhomboids'],
    bodyPart: 'back',
    description: 'Premier machine vertical pull for full back width and posture correction.',
    youtubeVideoId: 'CAwf7n6Luuc',
    videoTitle: 'How to Lat Pulldown with Proper Form (Stop Doing This!)',
    setupInstructions: ['Adjust thigh pad snugly, grip bar slightly wider than shoulders.'],
    executionSteps: [
      'Lean back very slightly (10–15 degrees), pull bar down towards upper chest.',
      'Squeeze shoulder blades together and release slowly.'
    ],
    commonMistakes: ['Pulling behind the neck', 'Swinging whole body back and forth']
  },
  romanian_deadlift: {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lower Back', 'Lats'],
    bodyPart: 'legs',
    description: 'Pure hip-hinge hypertrophy exercise for building resilient hamstrings and glutes.',
    youtubeVideoId: 'JCXUYuzwNrM',
    videoTitle: 'How To Romanian Deadlift (RDL Form Guide)',
    setupInstructions: ['Hold barbell or dumbbells at hips with soft knees and straight spine.'],
    executionSteps: [
      'Push hips back toward the wall behind you while keeping bar against thighs/shins.',
      'Stop when hamstrings are fully stretched and drive hips forward to stand tall.'
    ],
    commonMistakes: ['Bending knees into a regular squat', 'Rounding lower back']
  },
  bulgarian_split_squat: {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Core Balance'],
    bodyPart: 'legs',
    description: 'Unilateral leg strength builder that eliminates imbalances and enhances mobility.',
    youtubeVideoId: '2C-uNgKwPLE',
    videoTitle: 'Bulgarian Split Squats (How To Do Them Properly)',
    setupInstructions: ['Place rear foot laces down on bench or chair, step front foot forward.'],
    executionSteps: [
      'Lower back knee down toward the floor keeping front knee tracking in line with foot.',
      'Drive up through front heel to return to top.'
    ],
    commonMistakes: ['Front foot placed too close to bench', 'Pushing off back foot']
  },
  crunches: {
    id: 'crunches',
    name: 'Abdominal Crunches / Hanging Leg Raises',
    primaryMuscles: ['Rectus Abdominis'],
    secondaryMuscles: ['Obliques'],
    bodyPart: 'core',
    description: 'Targeted abdominal isolation for core contraction and six-pack definition.',
    youtubeVideoId: 'Xyd_fa5zoEU',
    videoTitle: 'How to Do Crunches Correctly for Stronger Abs',
    setupInstructions: ['Lie on floor with knees bent and feet flat, fingers resting lightly at ears.'],
    executionSteps: [
      'Contract abs to curl shoulders off floor toward hips while exhaling.',
      'Lower shoulders under control without letting abdominal tension drop.'
    ],
    commonMistakes: ['Pulling neck with hands', 'Using hip flexors to sit all the way up']
  }
};

/**
 * Intelligent helper to resolve the best YouTube tutorial video ID and Title for any exercise name
 */
export function getYoutubeVideoForExercise(name: string = '', visualKey?: string): { videoId: string; title: string; defaultVisualKey: string } {
  const normName = name.toLowerCase();

  // Direct match by visualKey
  if (visualKey && EXERCISE_VISUALS_DATABASE[visualKey]) {
    const entry = EXERCISE_VISUALS_DATABASE[visualKey];
    return { videoId: entry.youtubeVideoId, title: entry.videoTitle, defaultVisualKey: visualKey };
  }

  // Keyword matching against known high-quality form tutorials
  if (normName.includes('incline') && (normName.includes('bench') || normName.includes('press') || normName.includes('dumbbell'))) {
    return { videoId: '8iPEnn-ltC8', title: 'How to Incline Dumbbell Bench Press Form', defaultVisualKey: 'incline_bench_press' };
  }
  if (normName.includes('bench') || (normName.includes('chest') && normName.includes('press'))) {
    return { videoId: 'vcBig73ojpE', title: 'How To Bench Press Properly (Form Guide)', defaultVisualKey: 'bench_press' };
  }
  if (normName.includes('push up') || normName.includes('push-up') || normName.includes('pushup')) {
    return { videoId: 'IODxDxX7oi4', title: 'How to Do Pushups with Proper Form', defaultVisualKey: 'push_ups' };
  }
  if (normName.includes('romanian') || normName.includes('rdl') || normName.includes('stiff leg')) {
    return { videoId: 'JCXUYuzwNrM', title: 'How To Romanian Deadlift (RDL Form Tutorial)', defaultVisualKey: 'romanian_deadlift' };
  }
  if (normName.includes('deadlift')) {
    return { videoId: 'op9kVnSso6Q', title: 'How To Deadlift With Perfect Form', defaultVisualKey: 'deadlifts' };
  }
  if (normName.includes('bulgarian') || normName.includes('split squat')) {
    return { videoId: '2C-uNgKwPLE', title: 'Bulgarian Split Squat Form Guide', defaultVisualKey: 'bulgarian_split_squat' };
  }
  if (normName.includes('squat') || normName.includes('goblet')) {
    return { videoId: 'gcNh17Ckjgg', title: 'How To Squat with Perfect Form', defaultVisualKey: 'squats' };
  }
  if (normName.includes('pull up') || normName.includes('pull-up') || normName.includes('pullup') || normName.includes('chin up')) {
    return { videoId: 'eGo4IYlbE5g', title: 'How To Pull Up (Technique Guide)', defaultVisualKey: 'pull_ups' };
  }
  if (normName.includes('lat pull') || normName.includes('pulldown')) {
    return { videoId: 'CAwf7n6Luuc', title: 'How to Lat Pulldown with Proper Form', defaultVisualKey: 'lat_pulldown' };
  }
  if (normName.includes('row')) {
    return { videoId: 'pYcpY20QaE8', title: 'How to Do One-Arm Dumbbell Rows Properly', defaultVisualKey: 'dumbbell_rows' };
  }
  if (normName.includes('lateral raise') || normName.includes('side raise')) {
    return { videoId: '3VcKaXpzqRo', title: 'How to Lateral Raise for Wider Shoulders', defaultVisualKey: 'lateral_raises' };
  }
  if (normName.includes('shoulder press') || normName.includes('overhead press') || normName.includes('military press') || normName.includes('pike')) {
    return { videoId: '2yjwXTZQDDI', title: 'How to Overhead Shoulder Press with Proper Form', defaultVisualKey: 'shoulder_press' };
  }
  if (normName.includes('bicep') || normName.includes('curl') || normName.includes('hammer')) {
    return { videoId: 'ykJmrZ5v0Oo', title: 'How To Do Bicep Curls Correctly', defaultVisualKey: 'bicep_curls' };
  }
  if (normName.includes('dip')) {
    return { videoId: '0326dy_-CzM', title: 'How to Do Dips Correctly', defaultVisualKey: 'tricep_dips' };
  }
  if (normName.includes('plank')) {
    return { videoId: 'pvIjsG5Svck', title: 'How to Plank with Perfect Form', defaultVisualKey: 'planks' };
  }
  if (normName.includes('lunge')) {
    return { videoId: 'QOVaHwm-Q6U', title: 'How to Do Lunges Properly', defaultVisualKey: 'lunges' };
  }
  if (normName.includes('crunch') || normName.includes('ab') || normName.includes('leg raise')) {
    return { videoId: 'Xyd_fa5zoEU', title: 'How to Do Crunches Correctly', defaultVisualKey: 'crunches' };
  }

  // Fallback to push up / general form guide
  return { videoId: 'IODxDxX7oi4', title: `${name || 'Exercise'} Proper Form & Technique`, defaultVisualKey: 'push_ups' };
}
