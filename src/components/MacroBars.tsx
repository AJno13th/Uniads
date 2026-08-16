"use client";

import type { MacroTargets } from "@/lib/fitness/types";

interface MacroBarsProps {
  targets: MacroTargets;
  current: Partial<MacroTargets>;
}

function Bar({
  label,
  current,
  target,
  unit,
  accent,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  accent: string;
}) {
  const pct = target > 0 ? Math.min(120, Math.round((current / target) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted">
          {Math.round(current)}
          {unit} / {Math.round(target)}
          {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-sm bg-stone-deep/60">
        <div
          className="h-full rounded-sm transition-all duration-700"
          style={{
            width: `${Math.min(100, pct)}%`,
            background: accent,
            opacity: pct > 100 ? 0.85 : 1,
          }}
        />
      </div>
    </div>
  );
}

export function MacroBars({ targets, current }: MacroBarsProps) {
  return (
    <div className="space-y-3">
      <Bar
        label="Calories"
        current={current.calories ?? 0}
        target={targets.calories}
        unit=""
        accent="var(--signal)"
      />
      <Bar
        label="Protein"
        current={current.proteinG ?? 0}
        target={targets.proteinG}
        unit="g"
        accent="var(--teal)"
      />
      <Bar
        label="Carbs"
        current={current.carbsG ?? 0}
        target={targets.carbsG}
        unit="g"
        accent="#2f6fed"
      />
      <Bar
        label="Fat"
        current={current.fatG ?? 0}
        target={targets.fatG}
        unit="g"
        accent="#b45309"
      />
    </div>
  );
}

export function MineralGrid({
  targets,
  current,
}: {
  targets: MacroTargets;
  current: Partial<MacroTargets>;
}) {
  const items = [
    { key: "fiberG", label: "Fiber", unit: "g", t: targets.fiberG, c: current.fiberG ?? 0 },
    { key: "sodiumMg", label: "Sodium", unit: "mg", t: targets.sodiumMg, c: current.sodiumMg ?? 0 },
    {
      key: "potassiumMg",
      label: "Potassium",
      unit: "mg",
      t: targets.potassiumMg,
      c: current.potassiumMg ?? 0,
    },
    { key: "calciumMg", label: "Calcium", unit: "mg", t: targets.calciumMg, c: current.calciumMg ?? 0 },
    { key: "ironMg", label: "Iron", unit: "mg", t: targets.ironMg, c: current.ironMg ?? 0 },
    {
      key: "magnesiumMg",
      label: "Magnesium",
      unit: "mg",
      t: targets.magnesiumMg,
      c: current.magnesiumMg ?? 0,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.key} className="border border-line bg-white/70 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
          <p className="font-display text-xl text-ink">
            {Math.round(item.c)}
            <span className="text-sm text-muted">/{item.t}{item.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
