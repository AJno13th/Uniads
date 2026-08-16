export type Sex = "male" | "female" | "other";

export type WeightGoal = "lose" | "maintain" | "gain";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";

export interface BodyProfile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct: number | null;
  activity: ActivityLevel;
  weightGoal: WeightGoal;
  weeklyChangeKg: number;
  exerciseGoal: string;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  potassiumMg: number;
  calciumMg: number;
  ironMg: number;
  magnesiumMg: number;
}

export interface FoodItem {
  id: string;
  name: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  potassiumMg: number;
  calciumMg: number;
  ironMg: number;
  magnesiumMg: number;
  tags: string[];
}

export interface MealLog {
  id: string;
  foodId: string;
  name: string;
  servings: number;
  loggedAt: string;
  source: "manual" | "photo" | "recommendation";
  photoName?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  potassiumMg: number;
  calciumMg: number;
  ironMg: number;
  magnesiumMg: number;
}

export interface ExerciseDef {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  pattern: "push" | "pull" | "legs" | "core" | "full";
  defaultWeightsKg: number[];
  expectedRepsAtWeight: Record<string, number>;
}

export interface ContinuousSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  continuousReps: number;
  expectedReps: number;
  completedAt: string;
  stopped: boolean;
}

export interface RankEntry {
  exerciseId: string;
  weightKg: number;
  bestContinuousReps: number;
  totalVolume: number;
  sessions: number;
  lastAt: string;
}

export interface AppState {
  profile: BodyProfile | null;
  freeReadingDone: boolean;
  meals: MealLog[];
  sets: ContinuousSet[];
  ranks: RankEntry[];
  preferredExercises: string[];
}

export const defaultState = (): AppState => ({
  profile: null,
  freeReadingDone: false,
  meals: [],
  sets: [],
  ranks: [],
  preferredExercises: ["bench-press", "squat", "deadlift", "overhead-press"],
});
