"use client";

import Link from "next/link";
import { useFitness } from "@/lib/fitness/context";
import { getExercise } from "@/lib/fitness/exercises";
import { volumeLoad } from "@/lib/fitness/calculations";

export default function RecordsPage() {
  const { state, hydrated } = useFitness();

  if (!hydrated) return <p className="text-muted">Loading…</p>;

  if (!state.profile) {
    return (
      <div className="text-center">
        <p className="text-muted">Ranks unlock after your free reading.</p>
        <Link href="/free-reading" className="mt-4 inline-block text-signal underline">
          Free reading
        </Link>
      </div>
    );
  }

  const ranks = [...state.ranks].sort((a, b) => {
    const volA = a.weightKg * a.bestContinuousReps;
    const volB = b.weightKg * b.bestContinuousReps;
    return volB - volA;
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-ink">Ranks & records</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Ranked by weight × best continuous reps — how much load you moved in one
          unbroken go.
        </p>
      </header>

      <section className="overflow-x-auto border border-line bg-white/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-fog text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Exercise</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Best continuous</th>
              <th className="px-4 py-3">Peak volume</th>
              <th className="px-4 py-3">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {ranks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted">
                  No ranks yet. Log a continuous set on Train.
                </td>
              </tr>
            ) : (
              ranks.map((r) => {
                const ex = getExercise(r.exerciseId);
                return (
                  <tr key={`${r.exerciseId}-${r.weightKg}`} className="border-b border-line">
                    <td className="px-4 py-3 font-medium">{ex?.name ?? r.exerciseId}</td>
                    <td className="px-4 py-3">{r.weightKg} kg</td>
                    <td className="px-4 py-3 text-teal">{r.bestContinuousReps} reps</td>
                    <td className="px-4 py-3">
                      {volumeLoad(r.weightKg, r.bestContinuousReps).toLocaleString()} kg
                    </td>
                    <td className="px-4 py-3 text-muted">{r.sessions}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-display text-2xl">Recent continuous sets</h2>
        <ul className="mt-3 divide-y divide-line border border-line bg-white/80">
          {state.sets.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No sets logged.</li>
          ) : (
            state.sets.slice(0, 25).map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{s.exerciseName}</p>
                  <p className="text-xs text-muted">
                    {new Date(s.completedAt).toLocaleString()}
                  </p>
                </div>
                <p>
                  <span className="font-display text-lg">{s.weightKg}kg</span>
                  <span className="text-muted">
                    {" "}
                    · {s.continuousReps}/{s.expectedReps} continuous
                  </span>
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
