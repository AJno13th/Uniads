"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MacroBars, MineralGrid } from "@/components/MacroBars";
import { useFitness } from "@/lib/fitness/context";
import { macroTargets } from "@/lib/fitness/calculations";
import { estimateFoodFromImage, type PhotoEstimate } from "@/lib/fitness/food-estimate";
import { FOODS } from "@/lib/fitness/foods";
import {
  recommendMeals,
  todaysMeals,
} from "@/lib/fitness/recommendations";
import { uid } from "@/lib/fitness/storage";
import type { FoodItem, MealLog } from "@/lib/fitness/types";

export default function NutritionPage() {
  const { state, hydrated, logMeal } = useFitness();
  const [servings, setServings] = useState(1);
  const [selectedId, setSelectedId] = useState(FOODS[0].id);
  const [estimate, setEstimate] = useState<PhotoEstimate | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const today = useMemo(() => todaysMeals(state.meals), [state.meals]);

  if (!hydrated) return <p className="text-muted">Loading…</p>;
  if (!state.profile) {
    return (
      <div className="text-center">
        <p className="text-muted">Set your body file to unlock fuel targets.</p>
        <Link href="/free-reading" className="mt-4 inline-block text-signal underline">
          Free reading
        </Link>
      </div>
    );
  }

  const targets = macroTargets(state.profile);
  const current = today.reduce(
    (a, m) => ({
      calories: a.calories + m.calories,
      proteinG: a.proteinG + m.proteinG,
      carbsG: a.carbsG + m.carbsG,
      fatG: a.fatG + m.fatG,
      fiberG: a.fiberG + m.fiberG,
      sodiumMg: a.sodiumMg + m.sodiumMg,
      potassiumMg: a.potassiumMg + m.potassiumMg,
      calciumMg: a.calciumMg + m.calciumMg,
      ironMg: a.ironMg + m.ironMg,
      magnesiumMg: a.magnesiumMg + m.magnesiumMg,
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

  const mealRecs = recommendMeals(state);
  const selected = FOODS.find((f) => f.id === selectedId) ?? FOODS[0];

  function mealFromFood(
    food: FoodItem,
    source: MealLog["source"],
    photo?: string,
  ): MealLog {
    const s = servings;
    return {
      id: uid("meal"),
      foodId: food.id,
      name: food.name,
      servings: s,
      loggedAt: new Date().toISOString(),
      source,
      photoName: photo,
      calories: food.calories * s,
      proteinG: food.proteinG * s,
      carbsG: food.carbsG * s,
      fatG: food.fatG * s,
      fiberG: food.fiberG * s,
      sodiumMg: food.sodiumMg * s,
      potassiumMg: food.potassiumMg * s,
      calciumMg: food.calciumMg * s,
      ironMg: food.ironMg * s,
      magnesiumMg: food.magnesiumMg * s,
    };
  }

  function commit(food: FoodItem, source: MealLog["source"]) {
    logMeal(mealFromFood(food, source, photoName ?? undefined));
    setNote(`Logged ${food.name} (${servings}×). Recommendations refreshed.`);
    setEstimate(null);
    setPhotoName(null);
  }

  async function onPhoto(file: File | null) {
    if (!file) return;
    setScanning(true);
    setPhotoName(file.name);
    setNote(null);
    try {
      const result = await estimateFoodFromImage(file);
      setEstimate(result);
      if (result.candidates[0]) setSelectedId(result.candidates[0].id);
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-ink">Fuel</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Set cut or build on your body file — FORGE calculates calories, carbs,
          protein, fat, and minerals. Log by library or food photo.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-line bg-white/80 p-5">
          <h2 className="font-display text-2xl">Today</h2>
          <div className="mt-4">
            <MacroBars targets={targets} current={current} />
          </div>
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
              Minerals
            </h3>
            <MineralGrid targets={targets} current={current} />
          </div>
        </section>

        <section className="border border-line bg-white/80 p-5">
          <h2 className="font-display text-2xl">Log a meal</h2>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-muted">Food library</span>
            <select
              className="w-full border border-line bg-white px-3 py-2"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {FOODS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} · {f.calories} kcal
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-muted">Servings</span>
            <input
              type="number"
              min={0.5}
              step={0.5}
              className="w-32 border border-line bg-white px-3 py-2"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            {selected.servingLabel} · P{selected.proteinG} C{selected.carbsG} F
            {selected.fatG}
          </p>
          <button
            type="button"
            onClick={() => commit(selected, "manual")}
            className="mt-4 bg-ink px-4 py-2 font-semibold text-fog hover:bg-ink-soft"
          >
            Log from library
          </button>

          <div className="mt-8 border-t border-line pt-6">
            <h3 className="font-display text-xl">Photo of your food</h3>
            <p className="mt-1 text-sm text-muted">
              Upload a plate photo — FORGE estimates candidates from visual cues.
            </p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="mt-3 block w-full text-sm"
              onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
            />
            {scanning ? (
              <p className="mt-3 animate-pulse-soft text-sm text-teal">Scanning plate…</p>
            ) : null}
            {estimate ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-ink-soft">
                  {estimate.note}{" "}
                  <span className="text-muted">
                    ({Math.round(estimate.confidence * 100)}% confidence)
                  </span>
                </p>
                <ul className="space-y-2">
                  {estimate.candidates.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(c.id);
                          commit(c, "photo");
                        }}
                        className="w-full border border-line bg-fog px-3 py-2 text-left text-sm hover:border-teal"
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="text-muted">
                          {" "}
                          · {c.calories} kcal · confirm & log
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          {note ? <p className="mt-4 text-sm text-teal">{note}</p> : null}
        </section>
      </div>

      <section className="border border-line bg-white/80 p-5">
        <h2 className="font-display text-2xl">Future meal decisions</h2>
        <p className="mt-1 text-sm text-muted">
          Ranked from remaining macros, last meal balance, and training volume.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mealRecs.map((r) => (
            <li key={r.food.id} className="border border-line bg-fog p-3">
              <p className="font-medium">{r.food.name}</p>
              <p className="text-xs text-muted">{r.reason}</p>
              <button
                type="button"
                className="mt-2 text-sm text-signal underline-offset-2 hover:underline"
                onClick={() => {
                  setSelectedId(r.food.id);
                  commit(r.food, "recommendation");
                }}
              >
                Log this next
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl">Today&apos;s log</h2>
        <ul className="mt-3 divide-y divide-line border border-line bg-white/80">
          {today.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No meals yet.</li>
          ) : (
            today.map((m) => (
              <li key={m.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted">
                    {m.source}
                    {m.photoName ? ` · ${m.photoName}` : ""} · {m.servings}×
                  </p>
                </div>
                <p className="text-muted">{Math.round(m.calories)} kcal</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
