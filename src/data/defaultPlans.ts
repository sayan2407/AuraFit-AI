import { DailyMealPlan, DailyWorkoutPlan, UserProfile } from '../types';

export function calculateMacros(profile: UserProfile) {
  // BMR calculation using Mifflin-St Jeor
  let weightKg = profile.weightUnit === 'lbs' ? profile.weight * 0.453592 : profile.weight;
  let heightCm = profile.heightUnit === 'ft' ? profile.height * 30.48 : profile.height;
  
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age;
  bmr += profile.gender === 'M' ? 5 : -161;

  // Activity factor
  let activityMultiplier = profile.location === 'gym' ? 1.45 : 1.30;
  let tdee = Math.round(bmr * activityMultiplier);

  let targetCalories = tdee;
  if (profile.goal === 'bulking') {
    targetCalories = Math.round(tdee + 350);
  } else if (profile.goal === 'cutting') {
    targetCalories = Math.round(tdee - 450);
  }

  // Protein calculation: ~1.8g to 2.2g per kg bodyweight
  let proteinGrams = Math.round(weightKg * (profile.goal === 'bulking' ? 2.0 : 2.2));
  let proteinCal = proteinGrams * 4;

  // Fat calculation: ~25% of calories
  let fatGrams = Math.round((targetCalories * 0.25) / 9);
  let fatCal = fatGrams * 9;

  // Carbs calculation: remainder
  let carbCal = targetCalories - (proteinCal + fatCal);
  let carbGrams = Math.max(80, Math.round(carbCal / 4));

  return {
    tdee,
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    bmi: Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1))
  };
}

export function getDefaultWorkoutPlan(profile: UserProfile): DailyWorkoutPlan[] {
  const isGym = profile.location === 'gym';

  if (isGym) {
    return [
      {
        dayNumber: 1,
        dayName: 'Monday',
        title: 'Push - Chest, Shoulders & Triceps',
        targetArea: 'Chest, Front/Side Shoulders, Triceps',
        exercises: [
          {
            id: 'ex_1',
            name: 'Barbell / Dumbbell Bench Press',
            targetMuscle: 'Chest (Pectoralis Major)',
            why: 'Primary compound movement to overload upper body pushing muscle fibers for strength and muscle size.',
            sets: 4,
            reps: '8 - 10',
            restSeconds: 90,
            formTips: ['Keep shoulder blades retracted', 'Touch lower sternum gently', 'Drive feet into ground'],
            visualKey: 'bench_press'
          },
          {
            id: 'ex_2',
            name: 'Overhead Dumbbell Shoulder Press',
            targetMuscle: 'Anterior & Lateral Deltoids',
            why: 'Builds shoulder width, overhead stability, and core bracing under vertical loads.',
            sets: 3,
            reps: '10 - 12',
            restSeconds: 75,
            formTips: ['Brace core to prevent back arch', 'Press straight overhead', 'Control lowering phase'],
            visualKey: 'shoulder_press'
          },
          {
            id: 'ex_3',
            name: 'Incline Dumbbell Flyes / Cable Crossover',
            targetMuscle: 'Upper Chest & Inner Chest',
            why: 'Isolates chest muscle under deep stretch at bottom of rep.',
            sets: 3,
            reps: '12 - 15',
            restSeconds: 60,
            formTips: ['Maintain slight bend in elbows', 'Squeeze chest hard at top'],
            visualKey: 'push_ups'
          },
          {
            id: 'ex_4',
            name: 'Tricep Rope Pushdowns / Dips',
            targetMuscle: 'Triceps Brachii',
            why: 'Isolates lateral & medial heads of triceps for arm arm thickness.',
            sets: 3,
            reps: '12 - 15',
            restSeconds: 60,
            formTips: ['Lock elbows at sides', 'Spread rope outward at bottom'],
            visualKey: 'bicep_curls'
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        title: 'Pull - Back, Rear Delts & Biceps',
        targetArea: 'Upper & Lower Back, Biceps',
        exercises: [
          {
            id: 'ex_5',
            name: 'Barbell / Dumbbell Deadlift',
            targetMuscle: 'Posterior Chain (Back, Glutes, Hamstrings)',
            why: 'Massive systemic muscle stimulus that strengthens back, spine, and grip strength.',
            sets: 3,
            reps: '5 - 8',
            restSeconds: 120,
            formTips: ['Flat back throughout', 'Bar stays close to legs', 'Engage lats before lift'],
            visualKey: 'deadlifts'
          },
          {
            id: 'ex_6',
            name: 'Lat Pulldown / Pull-Ups',
            targetMuscle: 'Latissimus Dorsi',
            why: 'Crucial vertical pull for building V-taper upper back width.',
            sets: 4,
            reps: '8 - 12',
            restSeconds: 90,
            formTips: ['Pull bar to upper chest', 'Drive elbows straight down'],
            visualKey: 'pull_ups'
          },
          {
            id: 'ex_7',
            name: 'Single Arm Dumbbell Row',
            targetMuscle: 'Rhomboids & Mid-Back',
            why: 'Equalizes left/right back strength and improves posture.',
            sets: 3,
            reps: '10 - 12',
            restSeconds: 60,
            formTips: ['Pull weight toward hip', 'Squeeze shoulder blade at top'],
            visualKey: 'dumbbell_rows'
          },
          {
            id: 'ex_8',
            name: 'Standing Barbell / Dumbbell Bicep Curl',
            targetMuscle: 'Biceps Brachii',
            why: 'Isolated pulling movement to maximize bicep peak and arm hypertrophy.',
            sets: 3,
            reps: '10 - 12',
            restSeconds: 60,
            formTips: ['No swinging body', 'Squeeze biceps hard at peak'],
            visualKey: 'bicep_curls'
          }
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        title: 'Active Recovery & Core',
        targetArea: 'Abdominals, Mobility, Cardio',
        isRestDay: false,
        exercises: [
          {
            id: 'ex_9',
            name: 'Forearm Plank Hold',
            targetMuscle: 'Transverse Abdominis & Core',
            why: 'Protects lower back and tightens core wall.',
            sets: 3,
            reps: '45 - 60 sec',
            restSeconds: 45,
            formTips: ['Squeeze glutes', 'Neutral head position'],
            visualKey: 'planks'
          },
          {
            id: 'ex_10',
            name: 'Bicycle Crunches & Leg Raises',
            targetMuscle: 'Rectus Abdominis & Obliques',
            why: 'Targets lower abs and rotational core stability.',
            sets: 3,
            reps: '15 - 20',
            restSeconds: 45,
            formTips: ['Control lowering phase', 'Don’t pull neck'],
            visualKey: 'planks'
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        title: 'Legs & Lower Body Hypertrophy',
        targetArea: 'Quadriceps, Glutes, Hamstrings, Calves',
        exercises: [
          {
            id: 'ex_11',
            name: 'Barbell Back Squats',
            targetMuscle: 'Quadriceps & Gluteus Maximus',
            why: 'King of leg builders to stimulate overall growth hormones and leg strength.',
            sets: 4,
            reps: '8 - 10',
            restSeconds: 120,
            formTips: ['Knees track over toes', 'Lower to parallel', 'Chest stays upright'],
            visualKey: 'squats'
          },
          {
            id: 'ex_12',
            name: 'Walking Dumbbell Lunges',
            targetMuscle: 'Glutes, Quads & Balance',
            why: 'Strengthens single leg stability and shapes glutes/quads.',
            sets: 3,
            reps: '12 per leg',
            restSeconds: 75,
            formTips: ['Keep torso upright', 'Gently kiss back knee to ground'],
            visualKey: 'lunges'
          },
          {
            id: 'ex_13',
            name: 'Romanian Deadlifts (RDLs)',
            targetMuscle: 'Hamstrings & Glutes',
            why: 'Targets eccentric loaded stretch in hamstrings for knee injury prevention.',
            sets: 3,
            reps: '10 - 12',
            restSeconds: 90,
            formTips: ['Hinge hips backward', 'Slight bend in knees', 'Feel deep stretch in hamstrings'],
            visualKey: 'deadlifts'
          }
        ]
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        title: 'Upper Body Hypertrophy & Arms',
        targetArea: 'Chest, Lats, Shoulders, Arms',
        exercises: [
          {
            id: 'ex_14',
            name: 'Incline Dumbbell Press',
            targetMuscle: 'Upper Chest (Clavicular Head)',
            why: 'Fills out upper chest shelf for balanced torso visual appeal.',
            sets: 4,
            reps: '10 - 12',
            restSeconds: 75,
            formTips: ['Set bench to 30-45 degrees', 'Lower dumbells with control'],
            visualKey: 'bench_press'
          },
          {
            id: 'ex_15',
            name: 'Dumbbell Lateral Raises',
            targetMuscle: 'Lateral Deltoids',
            why: 'Crucial for capping shoulder side width.',
            sets: 4,
            reps: '12 - 15',
            restSeconds: 60,
            formTips: ['Lead with elbows', 'Pour out jugs at top'],
            visualKey: 'shoulder_press'
          },
          {
            id: 'ex_16',
            name: 'Hammer Curls Supersed with Tricep Extensions',
            targetMuscle: 'Brachialis & Triceps',
            why: 'Pushes arm measurement by targeting deeper arm muscle tissue.',
            sets: 3,
            reps: '12 - 15',
            restSeconds: 60,
            formTips: ['Palms face each other', 'Strict form'],
            visualKey: 'bicep_curls'
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        title: 'Full Body Conditioning & Core',
        targetArea: 'Metabolic Fitness & Core',
        exercises: [
          {
            id: 'ex_17',
            name: 'Bodyweight Push-Up Dropset',
            targetMuscle: 'Chest, Core, Shoulders',
            why: 'High reps burn out remaining glycogen and improve endurance.',
            sets: 3,
            reps: 'To Failure',
            restSeconds: 60,
            formTips: ['Keep core plank tight', 'Touch chest'],
            visualKey: 'push_ups'
          },
          {
            id: 'ex_18',
            name: 'Goblet Squats',
            targetMuscle: 'Quads & Glutes',
            why: 'Fast tempo leg conditioning.',
            sets: 3,
            reps: '15 - 20',
            restSeconds: 60,
            formTips: ['Hold weight close to chest', 'Drive knees outward'],
            visualKey: 'squats'
          }
        ]
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        title: 'Rest & Full Body Mobility',
        targetArea: 'Systemic Nervous System Recovery',
        isRestDay: true,
        exercises: [
          {
            id: 'ex_19',
            name: 'Light Walking & Hip Opener Stretches',
            targetMuscle: 'Full Body & Mind',
            why: 'Rest enables muscle protein synthesis and nervous system replenishment for maximum gain.',
            sets: 1,
            reps: '20-30 min walk',
            restSeconds: 0,
            formTips: ['Relax', 'Hydrate well'],
            visualKey: 'planks'
          }
        ]
      }
    ];
  } else {
    // HOME WORKOUT ROUTINE
    return [
      {
        dayNumber: 1,
        dayName: 'Monday',
        title: 'Home Push & Core Blitz',
        targetArea: 'Chest, Shoulders, Triceps & Core',
        exercises: [
          {
            id: 'hex_1',
            name: 'Standard Bodyweight Push-Ups',
            targetMuscle: 'Chest & Triceps',
            why: 'Primary compound upper body push that uses your body weight to stimulate chest fibers.',
            sets: 4,
            reps: '12 - 20',
            restSeconds: 60,
            formTips: ['Hands under shoulders', 'Core tight like a plank', 'Lower till chest almost touches floor'],
            visualKey: 'push_ups'
          },
          {
            id: 'hex_2',
            name: 'Pike Push-Ups (or Chair Decline Push-Ups)',
            targetMuscle: 'Shoulders & Upper Chest',
            why: 'Puts weight bias onto shoulders to simulate overhead shoulder press at home.',
            sets: 3,
            reps: '10 - 12',
            restSeconds: 60,
            formTips: ['Hips high in upside-down V', 'Lower crown of head toward floor'],
            visualKey: 'shoulder_press'
          },
          {
            id: 'hex_3',
            name: 'Chair / Bed Bench Dips',
            targetMuscle: 'Triceps Brachii',
            why: 'Overloads back of arms using household chair or sturdy furniture.',
            sets: 3,
            reps: '12 - 15',
            restSeconds: 60,
            formTips: ['Keep back close to seat', 'Lower till elbows hit 90 degrees'],
            visualKey: 'bicep_curls'
          },
          {
            id: 'hex_4',
            name: 'Forearm Plank to Push-Up Transition',
            targetMuscle: 'Abdominals & Shoulder Stability',
            why: 'Engages entire core isometric wall.',
            sets: 3,
            reps: '10 transitions',
            restSeconds: 45,
            formTips: ['Minimize hip swaying', 'Keep abs braced'],
            visualKey: 'planks'
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        title: 'Home Pull & Back Burner',
        targetArea: 'Upper Back, Lats, Biceps',
        exercises: [
          {
            id: 'hex_5',
            name: 'Doorframe / Table Inverted Row or Towel Rows',
            targetMuscle: 'Latissimus Dorsi & Rhomboids',
            why: 'Essential home pulling exercise to balance pushing movements and protect posture.',
            sets: 4,
            reps: '12 - 15',
            restSeconds: 60,
            formTips: ['Pull chest up to edge', 'Squeeze upper back blades together'],
            visualKey: 'dumbbell_rows'
          },
          {
            id: 'hex_6',
            name: 'Superman Lat Pulls (Floor)',
            targetMuscle: 'Erector Spinae & Lower Back',
            why: 'Strengthens lower back muscles and posture muscles without equipment.',
            sets: 3,
            reps: '15 reps',
            restSeconds: 45,
            formTips: ['Lift chest and thighs off floor', 'Pull elbows back to ribs'],
            visualKey: 'deadlifts'
          },
          {
            id: 'hex_7',
            name: 'Water Bottle / Band Bicep Curls',
            targetMuscle: 'Biceps',
            why: 'Provides resistance curl for arm pulling peak.',
            sets: 3,
            reps: '15 - 20',
            restSeconds: 45,
            formTips: ['Keep upper arms stationary', 'Squeeze hard at top'],
            visualKey: 'bicep_curls'
          }
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        title: 'Home Lower Body & Glutes',
        targetArea: 'Quadriceps, Glutes & Calves',
        exercises: [
          {
            id: 'hex_8',
            name: 'Bodyweight Air Squats',
            targetMuscle: 'Quadriceps & Gluteus',
            why: 'Builds foundational knee stability, quad endurance, and leg blood flow.',
            sets: 4,
            reps: '20 - 25',
            restSeconds: 60,
            formTips: ['Chest tall', 'Sit hips back and down', 'Knees line with toes'],
            visualKey: 'squats'
          },
          {
            id: 'hex_9',
            name: 'Bodyweight Walking Lunges',
            targetMuscle: 'Quads & Glute Shape',
            why: 'Develops single leg coordination and leg tone.',
            sets: 3,
            reps: '15 per leg',
            restSeconds: 60,
            formTips: ['Keep front foot flat', 'Drive back up through front heel'],
            visualKey: 'lunges'
          },
          {
            id: 'hex_10',
            name: 'Single Leg Glute Bridges',
            targetMuscle: 'Glutes & Hamstrings',
            why: 'Isolates glutes to correct hip alignment.',
            sets: 3,
            reps: '12 per leg',
            restSeconds: 45,
            formTips: ['Drive through heel', 'Squeeze glute at top hip extension'],
            visualKey: 'deadlifts'
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        title: 'Rest & Active Mobility Stretches',
        targetArea: 'Joint Flexibility & Mind Reset',
        isRestDay: true,
        exercises: [
          {
            id: 'hex_11',
            name: 'Cobra Stretch, Cat-Cow & Child Pose',
            targetMuscle: 'Spine & Hips',
            why: 'Increases spinal lubrication and relieves muscle stiffness.',
            sets: 2,
            reps: '5 min session',
            restSeconds: 30,
            formTips: ['Breathe deeply in through nose', 'Exhale tension'],
            visualKey: 'planks'
          }
        ]
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        title: 'Home Full Body HIIT & Sculpt',
        targetArea: 'Full Body Fat Burning & Cardio',
        exercises: [
          {
            id: 'hex_12',
            name: 'Jumping Jacks / Mountain Climbers',
            targetMuscle: 'Cardiovascular System & Core',
            why: 'Elevates heart rate for maximum caloric burn and stamina.',
            sets: 4,
            reps: '45 seconds',
            restSeconds: 30,
            formTips: ['Fast feet', 'Maintain quick rhythm'],
            visualKey: 'planks'
          },
          {
            id: 'hex_13',
            name: 'Diamond Push-ups (Hands close)',
            targetMuscle: 'Triceps & Inner Chest',
            why: 'Intense bodyweight focus for triceps.',
            sets: 3,
            reps: '10 - 12',
            restSeconds: 60,
            formTips: ['Form a diamond with thumbs and index fingers'],
            visualKey: 'push_ups'
          },
          {
            id: 'hex_14',
            name: 'Bulgarian Split Squat (Back foot on chair)',
            targetMuscle: 'Quads & Glutes',
            why: 'One of the most effective leg exercises to build leg strength at home.',
            sets: 3,
            reps: '10 - 12 per leg',
            restSeconds: 60,
            formTips: ['Keep front foot stable', 'Lower hips straight down'],
            visualKey: 'lunges'
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        title: 'Core Sculpt & Ab Finisher',
        targetArea: 'Abdominals & Obliques',
        exercises: [
          {
            id: 'hex_15',
            name: 'Hollow Body Hold',
            targetMuscle: 'Upper & Lower Abs',
            why: 'Gymnast core position for deep core compression.',
            sets: 3,
            reps: '30 - 45 sec',
            restSeconds: 45,
            formTips: ['Press lower back flush against floor'],
            visualKey: 'planks'
          },
          {
            id: 'hex_16',
            name: 'Russian Twists',
            targetMuscle: 'Obliques & Waistline',
            why: 'Strengthens side abdominal wall.',
            sets: 3,
            reps: '20 total twists',
            restSeconds: 45,
            formTips: ['Rotate shoulders fully side to side'],
            visualKey: 'planks'
          }
        ]
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        title: 'Rest & Recovery Day',
        targetArea: 'Full Body System Reset',
        isRestDay: true,
        exercises: [
          {
            id: 'hex_17',
            name: 'Hydration & Light Outdoor Walk',
            targetMuscle: 'Recovery',
            why: 'Promotes muscle repair and prepares you for the upcoming week.',
            sets: 1,
            reps: '30 min walk',
            restSeconds: 0,
            formTips: ['Relax', 'Enjoy fresh air'],
            visualKey: 'planks'
          }
        ]
      }
    ];
  }
}

export function getDefaultMealPlan(profile: UserProfile): DailyMealPlan[] {
  const macros = calculateMacros(profile);
  const culture = (profile.culture || 'Bengali').toLowerCase();
  const religion = (profile.religion || 'Hindu').toLowerCase();
  const isVeg = (profile.dietaryType || '').toLowerCase().includes('veg') || religion.includes('jain');

  // Culture-tailored meal templates
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return days.map((dayName, idx) => {
    let breakfastName = 'Oatmeal with Almonds, Chia Seeds, and Protein Powder';
    let breakfastDesc = 'Whole oats cooked in skimmed milk/water topped with crushed almonds, seeds, and protein.';
    let breakfastCal = Math.round(macros.targetCalories * 0.25);
    let breakfastProt = Math.round(macros.proteinGrams * 0.25);
    let breakfastCarb = Math.round(macros.carbGrams * 0.30);
    let breakfastFat = Math.round(macros.fatGrams * 0.20);

    let lunchName = 'Brown Rice with Boiled Dal and Steamed Vegetables';
    let lunchDesc = 'Balanced meal rich in complex carbs, vegetable fiber, and clean protein source.';
    let lunchCal = Math.round(macros.targetCalories * 0.35);
    let lunchProt = Math.round(macros.proteinGrams * 0.35);
    let lunchCarb = Math.round(macros.carbGrams * 0.40);
    let lunchFat = Math.round(macros.fatGrams * 0.30);

    let snackName = 'Boiled Sprouts & Roasted Chana with Lemon Juice';
    let snackDesc = 'Low-calorie high-protein snack to maintain amino acid levels.';
    let snackCal = Math.round(macros.targetCalories * 0.15);
    let snackProt = Math.round(macros.proteinGrams * 0.15);
    let snackCarb = Math.round(macros.carbGrams * 0.15);
    let snackFat = Math.round(macros.fatGrams * 0.15);

    let dinnerName = 'Multigrain Rotis with Paneer / Tofu Tikka & Mixed Salad';
    let dinnerDesc = 'Lean evening dinner to supply slow-digesting casein protein for overnight recovery.';
    let dinnerCal = Math.round(macros.targetCalories * 0.25);
    let dinnerProt = Math.round(macros.proteinGrams * 0.25);
    let dinnerCarb = Math.round(macros.carbGrams * 0.15);
    let dinnerFat = Math.round(macros.fatGrams * 0.35);

    // BENGALI CULTURAL TAILORING
    if (culture.includes('bengali')) {
      if (isVeg) {
        breakfastName = 'Chira Doi & Banana with Soaked Almonds';
        breakfastDesc = 'Traditional Bengali flattened rice (Chira) mixed with high-protein Greek yogurt (Doi), ripe banana, and soaked almonds.';
        lunchName = 'Steamed Gobindobhog / Brown Rice, Musur Dal & Paneer Jhol';
        lunchDesc = 'Bengali home-style light potato-paneer curry cooked with cumin (Jeera Jhol), served with fragrant rice and Musur/Moong Dal.';
        snackName = 'Roasted Muri (Puffed Rice) with Sprouted Chana, Cucumber & Mustard Oil drop';
        snackDesc = 'Healthy Bengali high-fiber evening snack with crunchy boiled chickpea and lemon.';
        dinnerName = '2 Multigrain Whole Wheat Rotis with Chanar Dalna (Cottage Cheese Curry) & Cucumber Salad';
        dinnerDesc = 'Protein-packed homemade cottage cheese cubes simmered in light Bengali spices.';
      } else {
        breakfastName = 'Boiled Egg Whites with Dimer Porota or Oats Chilla & Milk';
        breakfastDesc = '3 Boiled Egg Whites paired with light whole-wheat flatbread or savory oats chilla.';
        lunchName = 'Boiled Rice with Musur Dal, Shorshe Maach (Mustard Fish) or Chicken Jhol & Salad';
        lunchDesc = 'Traditional Bengali fish (Rohu/Katla/Tilapia) or lean chicken cooked in light mustard/cumin gravy with steamed rice & cucumber.';
        snackName = 'Boiled Dim (Egg) or Roasted Chana with Muri & Green Tea';
        snackDesc = 'Bengali tea-time protein snack.';
        dinnerName = '2 Rotis with Macher Matha / Chicken Stew & Green Vegetables';
        dinnerDesc = 'Light high-protein Bengali evening meal for fast digestion before sleep.';
      }
    } 
    // BIHARI CULTURAL TAILORING
    else if (culture.includes('bihari')) {
      breakfastName = 'Sattu Protein Drink (Roasted Gram Flour) with Roasted Seeds';
      breakfastDesc = 'High-protein natural Bihari superfood drink made with Sattu, roasted cumin, black salt, and lemon juice.';
      if (isVeg) {
        lunchName = 'Baked Litti (No fried oil) with Baingan Chokha & Arhar Dal';
        lunchDesc = 'Whole wheat roasted Littis stuffed with spiced Sattu, served with roasted eggplant chokha & yellow dal.';
        snackName = 'Roasted Makhana (Lotus seeds) & Chana';
        snackDesc = 'Low-GI crunchy Bihari snack rich in magnesium and plant protein.';
        dinnerName = '2 Whole Wheat Rotis with Dal Pitthi or Matar Paneer & Cucumber';
        dinnerDesc = 'Nourishing Bihari dinner rich in complex carbs and plant protein.';
      } else {
        lunchName = 'Steamed Rice with Bihari Style Dehati Chicken / Fish Curry & Yellow Dal';
        lunchDesc = 'Lean chicken or fish slow-cooked in traditional Bihari spices served with rice and green salad.';
        snackName = 'Sattu Drink or 2 Boiled Eggs with Salt & Pepper';
        snackDesc = 'Clean muscle recovery snack.';
        dinnerName = '2 Rotis with Bihari Egg Curry or Mutton/Chicken Stew';
        dinnerDesc = 'High protein dinner for overnight muscle synthesis.';
      }
    }
    // ASSAMESE CULTURAL TAILORING
    else if (culture.includes('assamese') || culture.includes('asamees')) {
      breakfastName = 'Jolpan (Komal Saul / Flattened Rice) with Curd & Honey';
      breakfastDesc = 'Nutritious traditional Assamese rice flakes served with fresh curd and natural honey.';
      if (isVeg) {
        lunchName = 'Steamed Rice with Mati Mahor Dal & Aloo Pitika (Boiled Potato Mash) with Mustard';
        lunchDesc = 'Assamese black gram lentils (Mati Mah) cooked with garlic, served with aromatic rice and fresh herb pitika.';
        snackName = 'Boiled Kala Chana with Ginger & Green Chilies';
        snackDesc = 'Assamese style spiced chickpea protein bowl.';
        dinnerName = '2 Rotis with Bilahi Boror Tenga (Tomato & Pulse Dumplings Curry)';
        dinnerDesc = 'Tangy light Assamese sour curry with lentil dumplings.';
      } else {
        lunchName = 'Steamed Rice with Masor Tenga (Assamese Sour Fish Curry with Tomatoes & Lemon)';
        lunchDesc = 'Iconic light sour fish curry cooked with fresh local herbs, tomatoes, and lemon served with rice.';
        snackName = 'Boiled Eggs or Steamed Local Fish Bites with Assam Tea';
        snackDesc = 'Clean lean protein snack.';
        dinnerName = '2 Rotis with Local Chicken Curry cooked with Herbs & Ash Gourd (Lau)';
        dinnerDesc = 'Hydrating and digestible Assamese chicken dish.';
      }
    }
    // NORTH INDIAN / SOUTH INDIAN / GENERAL TAILORING
    else {
      if (isVeg) {
        breakfastName = 'Moong Dal Chilla / Stuffed Paneer Paratha (Dry Tawa) with Curd';
        lunchName = 'Brown Rice / Rotis with Rajma / Chole & Mixed Veg Subzi';
        snackName = 'Roasted Chana / Sprouts Salad with Paneer Cubes';
        dinnerName = '2 Rotis with Palak Paneer or Dal Tadka & Salad';
      } else {
        breakfastName = '3 Egg Omelette with Whole Wheat Toast & Milk';
        lunchName = 'Brown Rice with Chicken Breast Curry & Yellow Dal';
        snackName = 'Grilled Chicken Tikka or Boiled Eggs';
        dinnerName = '2 Rotis with Fish Curry / Grilled Chicken Breast & Broccoli';
      }
    }

    return {
      dayNumber: idx + 1,
      dayName,
      meals: [
        {
          id: `m_${idx}_1`,
          mealType: 'Breakfast',
          name: breakfastName,
          description: breakfastDesc,
          calories: breakfastCal,
          protein: breakfastProt,
          carbs: breakfastCarb,
          fats: breakfastFat,
          fiber: 6
        },
        {
          id: `m_${idx}_2`,
          mealType: 'Lunch',
          name: lunchName,
          description: lunchDesc,
          calories: lunchCal,
          protein: lunchProt,
          carbs: lunchCarb,
          fats: lunchFat,
          fiber: 10
        },
        {
          id: `m_${idx}_3`,
          mealType: 'Evening Snack',
          name: snackName,
          description: snackDesc,
          calories: snackCal,
          protein: snackProt,
          carbs: snackCarb,
          fats: snackFat,
          fiber: 5
        },
        {
          id: `m_${idx}_4`,
          mealType: 'Dinner',
          name: dinnerName,
          description: dinnerDesc,
          calories: dinnerCal,
          protein: dinnerProt,
          carbs: dinnerCarb,
          fats: dinnerFat,
          fiber: 8
        }
      ],
      totalCalories: macros.targetCalories,
      totalProtein: macros.proteinGrams,
      totalCarbs: macros.carbGrams,
      totalFats: macros.fatGrams
    };
  });
}
