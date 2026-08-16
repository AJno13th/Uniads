"use client";

import Link from "next/link";
import { useFitness } from "@/lib/fitness/context";
import { macroTargets, goalLabel, bmi, bmiCategory } from "@/lib/fitness/calculations";
import {
  recommendExercises,
  recommendMeals,
  todaysMeals,
  todaysSets,
} from "@/lib/fitness/recommendations";
import { MacroBars } from "@/components/MacroBars";

export default function AppHomePage() {
  const { state, hydrated } = useFitness();

  if (!hydrated) {
    return <p className="text-muted">Loading your forge…</p>;
  }

  if (!state.profile) {
    return (
      <div className="mx-auto max-w-lg border border-line bg-white/80 p-8 text-center">
        <p className="font-display text-4xl text-ink">FORGE</p>
        <h1 className="mt-3 text-xl">Build your body file first</h1>
        <p className="mt-2 text-sm text-muted">
          Free reading unlocks BMI, macros, and personalized training.
        </p>
        <Link
          href="/free-reading"
          className="mt-6 inline-block bg-signal px-5 py-3 font-semibold text-white hover:bg-signal-deep"
        >
          Free body reading
        </Link>
      </div>
    );
  }

  const profile = state.profile;
  const targets = macroTargets(profile);
  const meals = todaysMeals(state.meals);
  const sets = todaysSets(state.sets);
  const eaten = meals.reduce(
    (a, m) => ({
      calories: a.calories + m.calories,
      proteinG: a.proteinG + m.proteinG,
      carbsG: a.carbsG + m.carbsG,
      fatG: a.fatG + m.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
  const mealRecs = recommendMeals(state);
  const exRecs = recommendExercises(state);
  const b = bmi(profile.weightKg, profile.heightCm);

  return (
    <div className="space-y-10">
      <header className="animate-rise">
        <p className="text-sm uppercase tracking-widest text-teal">Today</p>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-muted">
          {goalLabel(profile.weightGoal)} · BMI {b.toFixed(1)} ({bmiCategory(b)}) ·{" "}
          {sets.length} continuous sets logged
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-line bg-white/80 p-5 animate-rise">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Fuel budget</h2>
            <Link href="/app/nutrition" className="text-sm text-signal underline-offset-2 hover:underline">
              Log food
            </Link>
          </div>
          <MacroBars targets={targets} current={eaten} />
        </section>

        <section className="border border-line bg-white/80 p-5 animate-rise-delay">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Next lifts</h2>
            <Link href="/app/train" className="text-sm text-signal underline-offset-2 hover:underline">
              Train
            </Link>
          </div>
          <ul className="space-y-3">
            {exRecs.map((r) => (
              <li key={r.exercise.id} className="border-b border-line pb-3 last:border-0">
                <p className="font-medium text-ink">{r.exercise.name}</p>
                <p className="text-sm text-muted">
                  {r.suggestedWeightKg}kg · {r.targetContinuousReps} continuous reps —{" "}
                  {r.reason}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border border-line bg-white/80 p-5">
        <h2 className="font-display text-2xl">Recommended next meals</h2>
        <p className="mt-1 text-sm text-muted">
          Based on previous meal nutrition, today&apos;s training volume, and your{" "}
          {goalLabel(profile.weightGoal).toLowerCase()} target.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mealRecs.length === 0 ? (
            <li className="text-sm text-muted">Log a meal or train to sharpen recommendations.</li>
          ) : (
            mealRecs.map((r) => (
              <li key={r.food.id} className="border border-line bg-fog px-3 py-3">
                <p className="font-medium">{r.food.name}</p>
                <p className="text-xs text-muted">
                  {r.food.calories} kcal · P{r.food.proteinG} C{r.food.carbsG} F{r.food.fatG}
                </p>
                <p className="mt-1 text-xs text-teal">{r.reason}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
