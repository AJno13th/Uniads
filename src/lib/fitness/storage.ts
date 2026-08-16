"use client";

import type {
  AppState,
  BodyProfile,
  ContinuousSet,
  MealLog,
  RankEntry,
} from "./types";
import { defaultState } from "./types";
import { volumeLoad } from "./calculations";

const KEY = "forge-fitness-v1";

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function upsertRank(ranks: RankEntry[], set: ContinuousSet): RankEntry[] {
  const idx = ranks.findIndex(
    (r) => r.exerciseId === set.exerciseId && r.weightKg === set.weightKg,
  );
  const vol = volumeLoad(set.weightKg, set.continuousReps);
  if (idx === -1) {
    return [
      ...ranks,
      {
        exerciseId: set.exerciseId,
        weightKg: set.weightKg,
        bestContinuousReps: set.continuousReps,
        totalVolume: vol,
        sessions: 1,
        lastAt: set.completedAt,
      },
    ];
  }
  const current = ranks[idx];
  const next = [...ranks];
  next[idx] = {
    ...current,
    bestContinuousReps: Math.max(current.bestContinuousReps, set.continuousReps),
    totalVolume: current.totalVolume + vol,
    sessions: current.sessions + 1,
    lastAt: set.completedAt,
  };
  return next;
}

export function addSet(state: AppState, set: ContinuousSet): AppState {
  return {
    ...state,
    sets: [set, ...state.sets].slice(0, 200),
    ranks: upsertRank(state.ranks, set),
  };
}

export function addMeal(state: AppState, meal: MealLog): AppState {
  return {
    ...state,
    meals: [meal, ...state.meals].slice(0, 300),
  };
}

export function saveProfile(state: AppState, profile: BodyProfile): AppState {
  return { ...state, profile, freeReadingDone: true };
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}
