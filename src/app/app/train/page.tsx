"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Cylinder } from "@/components/Cylinder";
import { useFitness } from "@/lib/fitness/context";
import { EXERCISES, getExercise } from "@/lib/fitness/exercises";
import { expectedRepsForWeight } from "@/lib/fitness/calculations";
import { recommendExercises } from "@/lib/fitness/recommendations";
import { uid } from "@/lib/fitness/storage";

export default function TrainPage() {
  const { state, hydrated, logSet } = useFitness();
  const [exerciseId, setExerciseId] = useState("bench-press");
  const [weightKg, setWeightKg] = useState(60);
  const [reps, setReps] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const exercise = getExercise(exerciseId) ?? EXERCISES[0];
  const expected = expectedRepsForWeight(exercise.expectedRepsAtWeight, weightKg);

  const bestByWeight = useMemo(() => {
    const map = new Map<number, number>();
    for (const r of state.ranks.filter((x) => x.exerciseId === exercise.id)) {
      map.set(r.weightKg, r.bestContinuousReps);
    }
    return map;
  }, [state.ranks, exercise.id]);

  if (!hydrated) return <p className="text-muted">Loading…</p>;

  if (!state.profile) {
    return (
      <div className="text-center">
        <p className="text-muted">Complete a free reading before training.</p>
        <Link href="/free-reading" className="mt-4 inline-block text-signal underline">
          Free reading
        </Link>
      </div>
    );
  }

  const recs = recommendExercises(state);

  function selectExercise(id: string) {
    const ex = getExercise(id);
    if (!ex) return;
    setExerciseId(id);
    const mid = ex.defaultWeightsKg[Math.floor(ex.defaultWeightsKg.length / 2)];
    setWeightKg(mid);
    setReps(0);
    setRunning(false);
    setMessage(null);
  }

  function startContinuous() {
    setReps(0);
    setRunning(true);
    setMessage("Keep going — continuous reps only. Tap +1 each rep. Stop when you pause.");
  }

  function addRep() {
    if (!running) return;
    setReps((r) => r + 1);
  }

  function stopAndSave() {
    if (!running) return;
    const completedAt = new Date().toISOString();
    logSet({
      id: uid("set"),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weightKg,
      continuousReps: reps,
      expectedReps: expected,
      completedAt,
      stopped: true,
    });
    setRunning(false);
    const beat = reps >= expected;
    setMessage(
      beat
        ? `Cylinder cleared — ${reps} continuous @ ${weightKg}kg. Rank updated.`
        : `Logged ${reps}/${expected} continuous @ ${weightKg}kg. Rank saved.`,
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-ink">Train</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Pick a weight cylinder. Hit continuous reps without stopping. Your rank at
          that weight is the best unbroken set.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => selectExercise(ex.id)}
            className={`px-3 py-2 text-sm transition ${
              exerciseId === ex.id
                ? "bg-ink text-fog"
                : "border border-line bg-white text-ink hover:bg-stone"
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      <section className="border border-line bg-white/80 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">{exercise.name}</h2>
            <p className="text-sm text-muted">
              {exercise.muscle} · {exercise.equipment} · expected {expected} continuous @{" "}
              {weightKg}kg
            </p>
          </div>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Custom weight (kg)</span>
            <input
              type="number"
              min={0}
              step={2.5}
              className="w-28 border border-line bg-white px-2 py-2"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              disabled={running}
            />
          </label>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {exercise.defaultWeightsKg.map((w) => (
            <Cylinder
              key={w}
              label="expected"
              weightKg={w}
              expectedReps={expectedRepsForWeight(exercise.expectedRepsAtWeight, w)}
              bestReps={bestByWeight.get(w)}
              actualReps={weightKg === w && (running || reps > 0) ? reps : undefined}
              active={weightKg === w}
              onSelect={() => {
                if (running) return;
                setWeightKg(w);
                setReps(0);
                setMessage(null);
              }}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={startContinuous}
              className="bg-signal px-5 py-3 font-semibold text-white hover:bg-signal-deep"
            >
              Start continuous set
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={addRep}
                className="bg-teal px-8 py-4 font-display text-3xl text-white hover:bg-teal-bright"
              >
                +1 rep
              </button>
              <button
                type="button"
                onClick={stopAndSave}
                className="border border-ink px-5 py-3 font-semibold text-ink hover:bg-ink hover:text-fog"
              >
                Stop & save
              </button>
              <p className="font-display text-4xl text-ink">
                {reps}
                <span className="text-lg text-muted">/{expected}</span>
              </p>
            </>
          )}
        </div>
        {message ? <p className="mt-4 text-sm text-teal">{message}</p> : null}
      </section>

      <section>
        <h2 className="font-display text-2xl">Recommended from your history</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {recs.map((r) => (
            <li key={r.exercise.id}>
              <button
                type="button"
                onClick={() => {
                  selectExercise(r.exercise.id);
                  setWeightKg(r.suggestedWeightKg);
                }}
                className="w-full border border-line bg-white/80 px-4 py-3 text-left hover:border-teal"
              >
                <p className="font-medium">{r.exercise.name}</p>
                <p className="text-sm text-muted">
                  Try {r.suggestedWeightKg}kg × {r.targetContinuousReps} continuous —{" "}
                  {r.reason}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
