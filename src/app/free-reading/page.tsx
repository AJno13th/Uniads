"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/AppNav";
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
import { freeReadingTips } from "@/lib/fitness/recommendations";
import type { BodyProfile } from "@/lib/fitness/types";

export default function FreeReadingPage() {
  const { saveProfile } = useFitness();
  const [profile, setProfile] = useState<BodyProfile | null>(null);

  const reading = useMemo(() => {
    if (!profile) return null;
    const b = bmi(profile.weightKg, profile.heightCm);
    const bf =
      profile.bodyFatPct ??
      estimateBodyFatFromBmi(profile.sex, profile.age, b);
    const targets = macroTargets(profile);
    return {
      bmi: b,
      category: bmiCategory(b),
      bf,
      lean: leanMassKg(profile.weightKg, bf),
      targets,
      tips: freeReadingTips(profile),
    };
  }, [profile]);

  function handleSubmit(p: BodyProfile) {
    setProfile(p);
    saveProfile(p);
  }

  return (
    <main className="grain min-h-full flex-1">
      <div className="relative border-b border-line bg-ink text-fog">
        <MarketingNav />
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-28">
          <p className="font-display text-5xl text-signal sm:text-6xl">FORGE</p>
          <h1 className="mt-3 text-2xl font-medium sm:text-3xl">
            Free body reading
          </h1>
          <p className="mt-3 max-w-xl text-white/70">
            Enter weight, height, and body fat if you know it. Get BMI, lean mass,
            macro + mineral targets, and food direction — free.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
        <div className="border border-line bg-white/80 p-6">
          <h2 className="font-display text-2xl text-ink">Your numbers</h2>
          <div className="mt-6">
            <ProfileForm
              initial={profile}
              submitLabel="Generate free reading"
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="border border-line bg-white/80 p-6">
          {!reading ? (
            <p className="text-muted">
              Submit your stats to unlock the reading. This also seeds your FORGE
              profile so training and fuel can adapt.
            </p>
          ) : (
            <div className="animate-rise space-y-6">
              <div>
                <h2 className="font-display text-3xl text-ink">Reading</h2>
                <p className="text-sm text-muted">
                  Goal: {goalLabel(profile!.weightGoal)} · {profile!.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="BMI" value={reading.bmi.toFixed(1)} sub={reading.category} />
                <Stat label="Body fat" value={`${reading.bf.toFixed(1)}%`} sub={profile!.bodyFatPct == null ? "estimated" : "reported"} />
                <Stat label="Lean mass" value={`${reading.lean.toFixed(1)} kg`} />
                <Stat label="Daily calories" value={`${reading.targets.calories}`} />
              </div>
              <div>
                <h3 className="font-display text-xl">Macros & minerals</h3>
                <p className="mt-2 text-sm text-muted">
                  P {reading.targets.proteinG}g · C {reading.targets.carbsG}g · F{" "}
                  {reading.targets.fatG}g · Fiber {reading.targets.fiberG}g
                </p>
                <p className="mt-1 text-sm text-muted">
                  K {reading.targets.potassiumMg}mg · Mg {reading.targets.magnesiumMg}mg ·
                  Fe {reading.targets.ironMg}mg · Ca {reading.targets.calciumMg}mg
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl">Food direction</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  {reading.tips.map((t) => (
                    <li key={t} className="border-l-2 border-teal pl-3">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/app"
                className="inline-block bg-signal px-5 py-3 font-semibold text-white hover:bg-signal-deep"
              >
                Continue into FORGE
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="border border-line bg-fog px-3 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="font-display text-2xl text-ink">{value}</p>
      {sub ? <p className="text-xs text-muted">{sub}</p> : null}
    </div>
  );
}
