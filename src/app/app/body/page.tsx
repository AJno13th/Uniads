"use client";

import Link from "next/link";
import { ProfileForm } from "@/components/ProfileForm";
import { useFitness } from "@/lib/fitness/context";
import {
  bmi,
  bmiCategory,
  estimateBodyFatFromBmi,
  goalLabel,
  leanMassKg,
  macroTargets,
} from "@/lib/fitness/calculations";

export default function BodyPage() {
  const { state, hydrated, saveProfile, resetAll } = useFitness();

  if (!hydrated) return <p className="text-muted">Loading…</p>;

  const profile = state.profile;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-ink">Body</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Build yourself by entering weight, height, and body fat when known. Goals
          drive calorie and mineral targets across the app.
        </p>
      </header>

      {profile ? (
        <section className="grid gap-3 sm:grid-cols-4 border border-line bg-white/80 p-5">
          {(() => {
            const b = bmi(profile.weightKg, profile.heightCm);
            const bf =
              profile.bodyFatPct ??
              estimateBodyFatFromBmi(profile.sex, profile.age, b);
            const t = macroTargets(profile);
            return (
              <>
                <div>
                  <p className="text-xs uppercase text-muted">BMI</p>
                  <p className="font-display text-2xl">{b.toFixed(1)}</p>
                  <p className="text-xs text-muted">{bmiCategory(b)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted">Body fat</p>
                  <p className="font-display text-2xl">{bf.toFixed(1)}%</p>
                  <p className="text-xs text-muted">
                    {profile.bodyFatPct == null ? "estimated" : "known"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted">Lean mass</p>
                  <p className="font-display text-2xl">
                    {leanMassKg(profile.weightKg, bf).toFixed(1)} kg
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted">Goal</p>
                  <p className="font-display text-2xl">{goalLabel(profile.weightGoal)}</p>
                  <p className="text-xs text-muted">{t.calories} kcal/day</p>
                </div>
              </>
            );
          })()}
        </section>
      ) : (
        <p className="text-sm text-muted">
          No profile yet.{" "}
          <Link href="/free-reading" className="text-signal underline">
            Start with a free reading
          </Link>
          .
        </p>
      )}

      <section className="border border-line bg-white/80 p-6">
        <h2 className="font-display text-2xl">
          {profile ? "Update profile" : "Create profile"}
        </h2>
        <div className="mt-6">
          <ProfileForm
            initial={profile}
            onSubmit={(p) => saveProfile(p)}
            submitLabel="Save body profile"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          if (confirm("Clear all local FORGE data on this device?")) resetAll();
        }}
        className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        Reset local data
      </button>
    </div>
  );
}
