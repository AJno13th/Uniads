import { EXERCISES, getExercise } from "./exercises";
import { FOODS } from "./foods";
import { macroTargets } from "./calculations";
import type {
  AppState,
  BodyProfile,
  ContinuousSet,
  ExerciseDef,
  FoodItem,
  MacroTargets,
  MealLog,
} from "./types";

export interface MealRecommendation {
  food: FoodItem;
  reason: string;
  priority: number;
}

export interface ExerciseRecommendation {
  exercise: ExerciseDef;
  suggestedWeightKg: number;
  targetContinuousReps: number;
  reason: string;
}

function sumMeals(meals: MealLog[]): MacroTargets {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
      fiberG: acc.fiberG + m.fiberG,
      sodiumMg: acc.sodiumMg + m.sodiumMg,
      potassiumMg: acc.potassiumMg + m.potassiumMg,
      calciumMg: acc.calciumMg + m.calciumMg,
      ironMg: acc.ironMg + m.ironMg,
      magnesiumMg: acc.magnesiumMg + m.magnesiumMg,
    }),
    {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
      sodiumMg: 0,
      potassiumMg: 0,
      calciumMg: 0,
      ironMg: 0,
      magnesiumMg: 0,
    },
  );
}

export function todaysMeals(meals: MealLog[], now = new Date()): MealLog[] {
  const day = now.toDateString();
  return meals.filter((m) => new Date(m.loggedAt).toDateString() === day);
}

export function todaysSets(sets: ContinuousSet[], now = new Date()): ContinuousSet[] {
  const day = now.toDateString();
  return sets.filter((s) => new Date(s.completedAt).toDateString() === day);
}

export function recommendMeals(state: AppState): MealRecommendation[] {
  if (!state.profile) return [];
  const targets = macroTargets(state.profile);
  const today = todaysMeals(state.meals);
  const eaten = sumMeals(today);
  const remain = {
    calories: targets.calories - eaten.calories,
    proteinG: targets.proteinG - eaten.proteinG,
    carbsG: targets.carbsG - eaten.carbsG,
    fatG: targets.fatG - eaten.fatG,
    fiberG: targets.fiberG - eaten.fiberG,
    potassiumMg: targets.potassiumMg - eaten.potassiumMg,
    ironMg: targets.ironMg - eaten.ironMg,
    magnesiumMg: targets.magnesiumMg - eaten.magnesiumMg,
  };

  const workoutVolume = todaysSets(state.sets).reduce(
    (n, s) => n + s.weightKg * s.continuousReps,
    0,
  );

  const lastMeal = today[0];
  const scored = FOODS.map((food) => {
    let priority = 0;
    const reasons: string[] = [];

    if (remain.proteinG > 25 && food.proteinG >= 20) {
      priority += 40;
      reasons.push("covers remaining protein");
    }
    if (remain.carbsG > 40 && food.carbsG >= 25) {
      priority += 25;
      reasons.push("refills carbs after training demand");
    }
    if (workoutVolume > 2000 && food.tags.includes("postworkout")) {
      priority += 30;
      reasons.push("matches today’s training load");
    }
    if (remain.calories < 250 && food.calories <= 200) {
      priority += 20;
      reasons.push("fits remaining calorie budget");
    }
    if (remain.fiberG > 8 && food.fiberG >= 4) {
      priority += 15;
      reasons.push("adds fiber");
    }
    if (remain.potassiumMg > 800 && food.potassiumMg >= 300) {
      priority += 12;
      reasons.push("boosts potassium");
    }
    if (remain.ironMg > 4 && food.ironMg >= 2) {
      priority += 12;
      reasons.push("raises iron");
    }
    if (remain.magnesiumMg > 100 && food.magnesiumMg >= 40) {
      priority += 10;
      reasons.push("supports magnesium");
    }
    if (state.profile!.weightGoal === "lose" && food.tags.includes("indulgent")) {
      priority -= 35;
    }
    if (state.profile!.weightGoal === "gain" && food.calories >= 300) {
      priority += 10;
      reasons.push("supports surplus");
    }
    if (lastMeal && lastMeal.proteinG < 15 && food.proteinG >= 20) {
      priority += 18;
      reasons.push("balances a low-protein previous meal");
    }
    if (lastMeal && lastMeal.carbsG > 50 && food.proteinG >= 20 && food.carbsG < 20) {
      priority += 14;
      reasons.push("offsets a carb-heavy previous meal");
    }

    return {
      food,
      priority,
      reason: reasons[0] ?? "solid option for your remaining macros",
    };
  });

  return scored
    .filter((s) => s.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);
}

export function recommendExercises(state: AppState): ExerciseRecommendation[] {
  const profile = state.profile;
  const recent = state.sets.slice(0, 20);
  const recentIds = new Set(recent.map((s) => s.exerciseId));
  const patternCount: Record<string, number> = {};
  for (const s of recent) {
    const ex = getExercise(s.exerciseId);
    if (!ex) continue;
    patternCount[ex.pattern] = (patternCount[ex.pattern] ?? 0) + 1;
  }

  const goal = profile?.exerciseGoal?.toLowerCase() ?? "";
  const wantsStrength = /strength|strong|power|pr/.test(goal);
  const wantsHypertrophy = /muscle|hypertrophy|build|size/.test(goal);
  const wantsEndurance = /endurance|conditioning|stamina/.test(goal);

  const underworked = ["push", "pull", "legs", "core"].sort(
    (a, b) => (patternCount[a] ?? 0) - (patternCount[b] ?? 0),
  );

  const ranked = EXERCISES.map((exercise) => {
    const history = state.ranks
      .filter((r) => r.exerciseId === exercise.id)
      .sort((a, b) => b.weightKg - a.weightKg);
    const best = history[0];
    const last = recent.find((s) => s.exerciseId === exercise.id);

    let suggestedWeightKg =
      last?.weightKg ??
      best?.weightKg ??
      exercise.defaultWeightsKg[Math.floor(exercise.defaultWeightsKg.length / 2)];

    let targetContinuousReps =
      exercise.expectedRepsAtWeight[String(suggestedWeightKg)] ?? 10;

    if (last && last.continuousReps >= last.expectedReps) {
      const idx = exercise.defaultWeightsKg.indexOf(last.weightKg);
      if (idx >= 0 && idx < exercise.defaultWeightsKg.length - 1) {
        suggestedWeightKg = exercise.defaultWeightsKg[idx + 1];
        targetContinuousReps =
          exercise.expectedRepsAtWeight[String(suggestedWeightKg)] ??
          Math.max(3, last.expectedReps - 2);
      } else {
        targetContinuousReps = last.expectedReps + 2;
      }
    } else if (last && last.continuousReps < last.expectedReps * 0.7) {
      const idx = exercise.defaultWeightsKg.indexOf(last.weightKg);
      if (idx > 0) {
        suggestedWeightKg = exercise.defaultWeightsKg[idx - 1];
        targetContinuousReps =
          exercise.expectedRepsAtWeight[String(suggestedWeightKg)] ??
          last.expectedReps + 2;
      }
    }

    let score = 10;
    const reasons: string[] = [];

    if (!recentIds.has(exercise.id)) {
      score += 25;
      reasons.push("not trained recently");
    }
    if (underworked[0] === exercise.pattern) {
      score += 30;
      reasons.push(`balances underworked ${exercise.pattern} pattern`);
    }
    if (wantsStrength && ["bench-press", "squat", "deadlift", "overhead-press"].includes(exercise.id)) {
      score += 20;
      reasons.push("aligns with strength goal");
    }
    if (wantsHypertrophy && ["row", "lunges", "dip", "romanian-deadlift"].includes(exercise.id)) {
      score += 18;
      reasons.push("aligns with hypertrophy goal");
    }
    if (wantsEndurance && targetContinuousReps >= 12) {
      score += 15;
      reasons.push("higher continuous-rep stimulus");
    }
    if (state.preferredExercises.includes(exercise.id)) {
      score += 12;
      reasons.push("on your preferred list");
    }

    return {
      exercise,
      suggestedWeightKg,
      targetContinuousReps,
      reason: reasons[0] ?? "progressive continuous-rep work",
      score,
    };
  });

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ exercise, suggestedWeightKg, targetContinuousReps, reason }) => ({
      exercise,
      suggestedWeightKg,
      targetContinuousReps,
      reason,
    }));
}

export function freeReadingTips(profile: BodyProfile): string[] {
  const targets = macroTargets(profile);
  const tips: string[] = [];
  if (profile.weightGoal === "lose") {
    tips.push(
      `Aim near ${targets.calories} kcal/day with ~${targets.proteinG}g protein to protect muscle while cutting.`,
    );
    tips.push("Prioritize lean proteins, high-volume vegetables, and slow carbs around training.");
  } else if (profile.weightGoal === "gain") {
    tips.push(
      `Build on ~${targets.calories} kcal/day — surplus food should still hit ${targets.proteinG}g protein.`,
    );
    tips.push("Add calorie-dense picks: oats, rice bowls, salmon, almonds, yogurt.");
  } else {
    tips.push(`Hold weight around ${targets.calories} kcal with balanced macros.`);
  }
  tips.push(
    `Mineral focus today: potassium ${targets.potassiumMg}mg, magnesium ${targets.magnesiumMg}mg, iron ${targets.ironMg}mg.`,
  );
  tips.push(
    "Log continuous-rep sets (no rest mid-set) so FORGE can rank you by weight and prescribe the next cylinder target.",
  );
  return tips;
}
