"use client";

interface CylinderProps {
  label: string;
  weightKg: number;
  expectedReps: number;
  actualReps?: number;
  bestReps?: number;
  active?: boolean;
  onSelect?: () => void;
}

export function Cylinder({
  label,
  weightKg,
  expectedReps,
  actualReps,
  bestReps,
  active,
  onSelect,
}: CylinderProps) {
  const done = actualReps ?? bestReps ?? 0;
  const pct = Math.min(100, Math.round((done / Math.max(1, expectedReps)) * 100));
  const overflow = done > expectedReps;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex flex-col items-center gap-3 rounded-sm p-2 transition ${
        active ? "bg-ink/5 ring-2 ring-signal" : "hover:bg-ink/5"
      }`}
      aria-pressed={active}
      aria-label={`${weightKg} kilograms, ${expectedReps} expected continuous reps`}
    >
      <div
        className="relative h-44 w-14"
        style={{ perspective: "600px" }}
      >
        <div
          className="absolute inset-0 origin-center"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(8deg) rotateY(-18deg)",
          }}
        >
          {/* top ellipse */}
          <div
            className="absolute left-1/2 top-0 h-4 w-14 -translate-x-1/2 rounded-[100%] border border-stone-deep"
            style={{
              background: "linear-gradient(180deg, #f8f9fb, #cfd5de)",
              transform: "translateZ(2px)",
            }}
          />
          {/* body */}
          <div
            className="absolute left-1/2 top-2 h-40 w-14 -translate-x-1/2 overflow-hidden border-x border-stone-deep"
            style={{
              background:
                "linear-gradient(90deg, #b8c0cc 0%, #e8ecf1 22%, #f7f8fa 50%, #d2d8e0 78%, #aeb6c2 100%)",
              borderRadius: "0 0 4px 4px",
            }}
          >
            <div
              className="absolute inset-x-0 bottom-0 origin-bottom animate-fill"
              style={{
                height: `${Math.max(4, pct)}%`,
                background: overflow
                  ? "linear-gradient(180deg, var(--cylinder-glow), #c24a00)"
                  : "linear-gradient(180deg, var(--teal-bright), var(--cylinder-fill))",
                boxShadow: overflow
                  ? "0 0 18px rgba(232,93,4,0.45)"
                  : "0 0 14px rgba(15,110,106,0.35)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-[18%] w-px bg-white/50"
              aria-hidden
            />
          </div>
          {/* bottom ellipse */}
          <div
            className="absolute bottom-0 left-1/2 h-4 w-14 -translate-x-1/2 rounded-[100%] border border-stone-deep"
            style={{
              background: "linear-gradient(180deg, #cfd5de, #9aa3b0)",
            }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-ink">{weightKg}<span className="text-sm text-muted">kg</span></p>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1 text-xs font-medium text-teal">
          {done}/{expectedReps} reps
        </p>
      </div>
    </button>
  );
}
