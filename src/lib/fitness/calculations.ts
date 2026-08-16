import type {
  ActivityLevel,
  BodyProfile,
  MacroTargets,
  Sex,
  WeightGoal,
} from "./types";

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function bmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function bmiCategory(value: number): string {
  if (value < 18.5) return "Underweight";
  if (value < 25) return "Healthy range";
  if (value < 30) return "Overweight";
  return "Obese range";
}

export function bmrMifflin(profile: Pick<BodyProfile, "sex" | "age" | "heightCm" | "weightKg">): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  if (profile.sex === "female") return base - 161;
  if (profile.sex === "male") return base + 5;
  return base - 78;
}

export function tdee(profile: BodyProfile): number {
  return bmrMifflin(profile) * ACTIVITY_MULTIPLIER[profile.activity];
}

export function calorieTarget(profile: BodyProfile): number {
  const maintain = tdee(profile);
  const delta = Math.abs(profile.weeklyChangeKg) * 7700 / 7;
  if (profile.weightGoal === "lose") return Math.max(1200, maintain - delta);
  if (profile.weightGoal === "gain") return maintain + delta;
  return maintain;
}

export function estimateBodyFatFromBmi(
  sex: Sex,
  age: number,
  bmiValue: number,
): number {
  // Deurenberg et al. approximation when BF% unknown
  const sexFactor = sex === "female" ? 1 : sex === "male" ? 0 : 0.5;
  return Math.max(5, 1.2 * bmiValue + 0.23 * age - 10.8 * sexFactor - 5.4);
}

export function leanMassKg(weightKg: number, bodyFatPct: number): number {
  return weightKg * (1 - bodyFatPct / 100);
}

export function macroTargets(profile: BodyProfile): MacroTargets {
  const calories = Math.round(calorieTarget(profile));
  const bf =
    profile.bodyFatPct ??
    estimateBodyFatFromBmi(profile.sex, profile.age, bmi(profile.weightKg, profile.heightCm));
  const lm = leanMassKg(profile.weightKg, bf);

  let proteinPerKg = 1.8;
  if (profile.weightGoal === "lose") proteinPerKg = 2.2;
  if (profile.weightGoal === "gain") proteinPerKg = 1.8;

  const proteinG = Math.round(lm * proteinPerKg);
  const fatG = Math.round((calories * 0.25) / 9);
  const proteinCal = proteinG * 4;
  const fatCal = fatG * 9;
  const carbsG = Math.max(0, Math.round((calories - proteinCal - fatCal) / 4));

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    fiberG: Math.round(calories / 1000 * 14),
    sodiumMg: 2300,
    potassiumMg: 3400,
    calciumMg: 1000,
    ironMg: profile.sex === "female" ? 18 : 8,
    magnesiumMg: profile.sex === "female" ? 320 : 420,
  };
}

export function goalLabel(goal: WeightGoal): string {
  if (goal === "lose") return "Cut";
  if (goal === "gain") return "Build";
  return "Maintain";
}

export function expectedRepsForWeight(
  expectedMap: Record<string, number>,
  weightKg: number,
): number {
  const keys = Object.keys(expectedMap)
    .map(Number)
    .sort((a, b) => a - b);
  if (keys.length === 0) return 10;
  if (expectedMap[String(weightKg)] != null) return expectedMap[String(weightKg)];

  let lower = keys[0];
  let upper = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (weightKg >= keys[i] && weightKg <= keys[i + 1]) {
      lower = keys[i];
      upper = keys[i + 1];
      break;
    }
  }
  if (weightKg <= keys[0]) return expectedMap[String(keys[0])];
  if (weightKg >= keys[keys.length - 1]) return expectedMap[String(keys[keys.length - 1])];

  const lo = expectedMap[String(lower)];
  const hi = expectedMap[String(upper)];
  const t = (weightKg - lower) / (upper - lower);
  return Math.max(1, Math.round(lo + (hi - lo) * t));
}

export function volumeLoad(weightKg: number, reps: number): number {
  return weightKg * reps;
}

export function formatKg(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
