"use client";

import { useState, type FormEvent } from "react";
import type { ActivityLevel, BodyProfile, Sex, WeightGoal } from "@/lib/fitness/types";

const defaultForm: BodyProfile = {
  name: "",
  sex: "male",
  age: 28,
  heightCm: 175,
  weightKg: 78,
  bodyFatPct: null,
  activity: "moderate",
  weightGoal: "lose",
  weeklyChangeKg: 0.4,
  exerciseGoal: "Build strength and muscle",
};

interface ProfileFormProps {
  initial?: BodyProfile | null;
  submitLabel?: string;
  onSubmit: (profile: BodyProfile) => void;
}

export function ProfileForm({ initial, submitLabel = "Save body", onSubmit }: ProfileFormProps) {
  const [form, setForm] = useState<BodyProfile>(initial ?? defaultForm);
  const [bfKnown, setBfKnown] = useState(initial?.bodyFatPct != null);

  function update<K extends keyof BodyProfile>(key: K, value: BodyProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      bodyFatPct: bfKnown ? form.bodyFatPct : null,
      name: form.name.trim() || "Athlete",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Name</span>
          <input
            className="w-full border border-line bg-white px-3 py-2"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Sex</span>
          <select
            className="w-full border border-line bg-white px-3 py-2"
            value={form.sex}
            onChange={(e) => update("sex", e.target.value as Sex)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / prefer not to say</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Age</span>
          <input
            type="number"
            min={14}
            max={90}
            className="w-full border border-line bg-white px-3 py-2"
            value={form.age}
            onChange={(e) => update("age", Number(e.target.value))}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Height (cm)</span>
          <input
            type="number"
            min={120}
            max={230}
            step={0.5}
            className="w-full border border-line bg-white px-3 py-2"
            value={form.heightCm}
            onChange={(e) => update("heightCm", Number(e.target.value))}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Weight (kg)</span>
          <input
            type="number"
            min={35}
            max={250}
            step={0.1}
            className="w-full border border-line bg-white px-3 py-2"
            value={form.weightKg}
            onChange={(e) => update("weightKg", Number(e.target.value))}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Activity</span>
          <select
            className="w-full border border-line bg-white px-3 py-2"
            value={form.activity}
            onChange={(e) => update("activity", e.target.value as ActivityLevel)}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light (1–3 days)</option>
            <option value="moderate">Moderate (3–5 days)</option>
            <option value="active">Active (6–7 days)</option>
            <option value="athlete">Athlete</option>
          </select>
        </label>
      </div>

      <div className="border border-line bg-white/80 p-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bfKnown}
            onChange={(e) => setBfKnown(e.target.checked)}
          />
          I know my body fat %
        </label>
        {bfKnown && (
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-muted">Body fat %</span>
            <input
              type="number"
              min={3}
              max={60}
              step={0.1}
              className="w-full border border-line bg-white px-3 py-2"
              value={form.bodyFatPct ?? 18}
              onChange={(e) => update("bodyFatPct", Number(e.target.value))}
            />
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Weight goal</span>
          <select
            className="w-full border border-line bg-white px-3 py-2"
            value={form.weightGoal}
            onChange={(e) => update("weightGoal", e.target.value as WeightGoal)}
          >
            <option value="lose">Lose fat</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain muscle / weight</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Weekly change (kg)</span>
          <input
            type="number"
            min={0}
            max={1.5}
            step={0.1}
            className="w-full border border-line bg-white px-3 py-2"
            value={form.weeklyChangeKg}
            onChange={(e) => update("weeklyChangeKg", Number(e.target.value))}
            disabled={form.weightGoal === "maintain"}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block text-muted">Exercise goal</span>
          <input
            className="w-full border border-line bg-white px-3 py-2"
            value={form.exerciseGoal}
            onChange={(e) => update("exerciseGoal", e.target.value)}
            placeholder="e.g. Get stronger on bench, build legs"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-ink px-4 py-3 font-semibold text-fog transition hover:bg-ink-soft sm:w-auto"
      >
        {submitLabel}
      </button>
    </form>
  );
}
