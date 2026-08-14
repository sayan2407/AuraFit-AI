export type Gender = 'M' | 'F' | 'Other';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft';
export type FitnessGoal = 'bulking' | 'cutting' | 'maintenance';
export type WorkoutLocation = 'gym' | 'home';

export interface UserProfile {
  gender: Gender;
  age: number;
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  goal: FitnessGoal;
  location: WorkoutLocation;
  equipment: string[];
  culture: string;
  religion: string;
  dietaryType: string; // e.g. Vegetarian, Non-Vegetarian, Eggitarian, Vegan, Jain, Sattvic, Halal Only
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFats?: number;
  tdee?: number;
  bmi?: number;
  createdAt?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  why: string; // Detailed explanation of why to do it & physiological benefits
  sets: number;
  reps: string;
  restSeconds: number;
  formTips: string[];
  visualKey: string; // Visual key for animated form guide
  youtubeVideoId?: string; // YouTube video ID for embedded in-app tutorial
  gifUrl?: string;
  completed?: boolean;
}

export interface DailyWorkoutPlan {
  dayNumber: number; // 1 to 7
  dayName: string; // Monday, Tuesday, etc.
  title: string; // e.g. Push - Chest & Triceps Focus
  targetArea: string;
  exercises: ExerciseItem[];
  isRestDay?: boolean;
}

export interface MealItem {
  id: string;
  mealType: string; // 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner' | custom
  name: string;
  description: string; // Culturally tailored description
  culturalNotes?: string;
  ingredients?: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  completed?: boolean;
  isCustom?: boolean;
}

export interface DailyMealPlan {
  dayNumber: number;
  dayName: string;
  meals: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface FullFitnessPlan {
  profile: UserProfile;
  weeklyWorkouts: DailyWorkoutPlan[];
  weeklyMeals: DailyMealPlan[];
  generatedAt: string;
}

export interface LoggedWorkoutSession {
  id: string;
  date: string;
  dayNumber: number;
  dayTitle: string;
  completedExerciseIds: string[];
  notes?: string;
}

export interface LoggedMealAnalysis {
  id: string;
  date: string;
  foodName: string;
  imageUrl?: string;
  itemsDetected: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  healthRating: number; // 1 to 10
  verdict: string;
  advice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  imageUrl?: string;
  mealAnalysis?: LoggedMealAnalysis;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  glasses: number; // 250ml per glass
}

export interface WeightLogEntry {
  date: string;
  weight: number;
  unit: WeightUnit;
}
