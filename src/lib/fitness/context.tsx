"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { AppState, BodyProfile, ContinuousSet, MealLog } from "@/lib/fitness/types";
import { defaultState } from "@/lib/fitness/types";
import {
  addMeal as addMealToState,
  addSet as addSetToState,
  loadState,
  saveProfile as saveProfileToState,
  saveState,
} from "@/lib/fitness/storage";

interface FitnessContextValue {
  state: AppState;
  hydrated: boolean;
  saveProfile: (profile: BodyProfile) => void;
  logSet: (set: ContinuousSet) => void;
  logMeal: (meal: MealLog) => void;
  resetAll: () => void;
}

const FitnessContext = createContext<FitnessContextValue | null>(null);

type Listener = () => void;

let memoryState: AppState = defaultState();
let hydratedFlag = false;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function write(next: AppState) {
  memoryState = next;
  if (typeof window !== "undefined") saveState(next);
  emit();
}

function hydrateFromStorage() {
  if (hydratedFlag || typeof window === "undefined") return;
  memoryState = loadState();
  hydratedFlag = true;
  emit();
}

export function FitnessProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const state = useSyncExternalStore(
    subscribe,
    () => memoryState,
    () => defaultState(),
  );

  const hydrated = useSyncExternalStore(
    subscribe,
    () => hydratedFlag,
    () => false,
  );

  const saveProfile = useCallback((profile: BodyProfile) => {
    write(saveProfileToState(memoryState, profile));
  }, []);

  const logSet = useCallback((set: ContinuousSet) => {
    write(addSetToState(memoryState, set));
  }, []);

  const logMeal = useCallback((meal: MealLog) => {
    write(addMealToState(memoryState, meal));
  }, []);

  const resetAll = useCallback(() => {
    write(defaultState());
  }, []);

  return (
    <FitnessContext.Provider
      value={{ state, hydrated, saveProfile, logSet, logMeal, resetAll }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness(): FitnessContextValue {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error("useFitness must be used within FitnessProvider");
  return ctx;
}
