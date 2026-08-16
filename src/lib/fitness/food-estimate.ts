import { FOODS } from "./foods";
import type { FoodItem } from "./types";

const COLOR_HINTS: { keywords: string[]; foods: string[] }[] = [
  { keywords: ["chicken", "grill", "white"], foods: ["chicken-breast"] },
  { keywords: ["salmon", "fish", "pink"], foods: ["salmon"] },
  { keywords: ["egg", "omelet", "scramble"], foods: ["eggs"] },
  { keywords: ["oat", "porridge", "cereal"], foods: ["oats"] },
  { keywords: ["rice", "bowl"], foods: ["rice-bowl", "quinoa-bowl"] },
  { keywords: ["potato", "yam", "orange"], foods: ["sweet-potato"] },
  { keywords: ["yogurt", "yoghurt"], foods: ["greek-yogurt"] },
  { keywords: ["avocado", "toast", "green"], foods: ["avocado-toast", "salad-bowl"] },
  { keywords: ["salad", "leaf", "lettuce"], foods: ["salad-bowl"] },
  { keywords: ["steak", "beef", "meat"], foods: ["steak", "burger"] },
  { keywords: ["banana", "fruit"], foods: ["banana"] },
  { keywords: ["shake", "protein", "whey"], foods: ["whey"] },
  { keywords: ["almond", "nuts"], foods: ["almonds"] },
  { keywords: ["burger", "fries"], foods: ["burger"] },
  { keywords: ["pasta", "noodle", "spaghetti"], foods: ["pasta"] },
];

export interface PhotoEstimate {
  candidates: FoodItem[];
  confidence: number;
  note: string;
  detectedSignals: string[];
}

function scoreFromName(name: string): FoodItem[] {
  const lower = name.toLowerCase();
  const hits = new Map<string, number>();
  for (const hint of COLOR_HINTS) {
    for (const kw of hint.keywords) {
      if (lower.includes(kw)) {
        for (const id of hint.foods) {
          hits.set(id, (hits.get(id) ?? 0) + 2);
        }
      }
    }
  }
  const ranked = [...hits.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => FOODS.find((f) => f.id === id))
    .filter((f): f is FoodItem => Boolean(f));
  return ranked;
}

/** Heuristic “vision” estimate from filename + optional average color bias. */
export async function estimateFoodFromImage(file: File): Promise<PhotoEstimate> {
  const fromName = scoreFromName(file.name);
  const signals: string[] = [];

  let colorBias: FoodItem[] = [];
  try {
    const avg = await averageColor(file);
    if (avg) {
      const { r, g, b } = avg;
      signals.push(`tone rgb(${r},${g},${b})`);
      if (g > r && g > b) {
        colorBias = pick(["salad-bowl", "avocado-toast", "quinoa-bowl"]);
        signals.push("green-dominant → produce");
      } else if (r > g + 20 && r > b) {
        colorBias = pick(["steak", "salmon", "sweet-potato", "burger"]);
        signals.push("warm-red → meat / root veg");
      } else if (r > 200 && g > 180 && b > 120) {
        colorBias = pick(["pasta", "oats", "rice-bowl"]);
        signals.push("pale-warm → grains");
      } else if (b > r && b > g) {
        colorBias = pick(["greek-yogurt", "whey", "eggs"]);
        signals.push("cool tone → dairy / protein");
      }
    }
  } catch {
    // canvas may fail; filename path still works
  }

  const merged: FoodItem[] = [];
  const seen = new Set<string>();
  for (const f of [...fromName, ...colorBias, ...FOODS]) {
    if (seen.has(f.id)) continue;
    seen.add(f.id);
    merged.push(f);
  }

  const candidates = merged.slice(0, 4);
  const confidence = fromName.length ? 0.72 : colorBias.length ? 0.55 : 0.35;

  return {
    candidates,
    confidence,
    note:
      confidence > 0.6
        ? "Strong match from your photo cues. Confirm the closest plate."
        : "Best-effort plate reading — pick the food that matches, or browse the library.",
    detectedSignals: signals,
  };
}

function pick(ids: string[]): FoodItem[] {
  return ids
    .map((id) => FOODS.find((f) => f.id === id))
    .filter((f): f is FoodItem => Boolean(f));
}

async function averageColor(
  file: File,
): Promise<{ r: number; g: number; b: number } | null> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const size = 24;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  bitmap.close();
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}
