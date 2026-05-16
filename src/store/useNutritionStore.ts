"use client";

import { create } from "zustand";
import type {
  FoodEntry,
  MealType,
  ThemeMode,
  UserGoals,
} from "@/types/nutrition";
import {
  copyFoodEntry,
  createFoodEntry,
  fetchNutritionSnapshot,
  removeFoodEntry,
  saveFoodEntry,
  saveSettings,
} from "@/services/nutritionData";

type Filters = {
  query: string;
  meal: MealType | "all";
  mode: "all" | "highProtein" | "lowCarb";
  date: "today" | "yesterday" | "week" | "all";
};

type NutritionStore = {
  entries: FoodEntry[];
  goals: UserGoals;
  water: number;
  steps: number;
  weightLogs: { date: string; weightKg: number }[];
  stepLogs: { date: string; steps: number }[];
  theme: ThemeMode;
  filters: Filters;
  isLoading: boolean;
  error: string;
  loadSnapshot: () => Promise<void>;
  resetData: () => void;
  addEntry: (
    input: Omit<FoodEntry, "id" | "createdAt" | "updatedAt">,
  ) => Promise<FoodEntry>;
  updateEntry: (
    id: string,
    input: Omit<FoodEntry, "id" | "createdAt" | "updatedAt">,
  ) => Promise<FoodEntry>;
  deleteEntry: (id: string) => Promise<void>;
  duplicateEntry: (id: string) => Promise<FoodEntry>;
  setFilters: (filters: Partial<Filters>) => void;
  setGoals: (goals: Partial<UserGoals>) => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  setWater: (water: number) => Promise<void>;
  setSteps: (steps: number) => Promise<void>;
  addWeightLog: (weightKg: number) => Promise<void>;
};

const defaultGoals: UserGoals = {
  calories: 2200,
  protein: 140,
  carbs: 220,
  fat: 70,
  fiber: 30,
  waterGlasses: 8,
  weightKg: 72,
  steps: 10000,
};

export const useNutritionStore = create<NutritionStore>()((set, get) => ({
  entries: [],
  goals: defaultGoals,
  water: 0,
  steps: 0,
  weightLogs: [],
  stepLogs: [],
  theme: "dark",
  filters: {
    query: "",
    meal: "all",
    mode: "all",
    date: "today",
  },
  isLoading: false,
  error: "",
  loadSnapshot: async () => {
    set({ isLoading: true, error: "" });
    try {
      const snapshot = await fetchNutritionSnapshot();
      set({
        entries: snapshot.entries,
        goals: snapshot.goals,
        water: snapshot.water,
        steps: snapshot.steps,
        weightLogs: snapshot.weightLogs,
        stepLogs: snapshot.stepLogs,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unable to load data.",
      });
    }
  },
  resetData: () =>
    set({
      entries: [],
      goals: defaultGoals,
      water: 0,
      steps: 0,
      weightLogs: [],
      stepLogs: [],
      error: "",
    }),
  addEntry: async (input) => {
    const entry = await createFoodEntry(input);
    set((state) => ({ entries: [entry, ...state.entries] }));
    return entry;
  },
  updateEntry: async (id, input) => {
    const entry = await saveFoodEntry(id, input);
    set((state) => ({
      entries: state.entries.map((item) => (item.id === id ? entry : item)),
    }));
    return entry;
  },
  deleteEntry: async (id) => {
    await removeFoodEntry(id);
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    }));
  },
  duplicateEntry: async (id) => {
    const entry = await copyFoodEntry(id);
    set((state) => ({ entries: [entry, ...state.entries] }));
    return entry;
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setGoals: async (goals) => {
    const snapshot = await saveSettings({ goals });
    set({
      goals: snapshot.goals,
      water: snapshot.water,
      steps: snapshot.steps,
      weightLogs: snapshot.weightLogs,
      stepLogs: snapshot.stepLogs,
    });
  },
  setTheme: (theme) => set({ theme }),
  setWater: async (water) => {
    const current = get();
    set({ water });
    try {
      const snapshot = await saveSettings({ water });
      set({
        goals: snapshot.goals,
        water: snapshot.water,
        steps: snapshot.steps,
        weightLogs: snapshot.weightLogs,
        stepLogs: snapshot.stepLogs,
      });
    } catch (error) {
      set({
        water: current.water,
        error: error instanceof Error ? error.message : "Unable to save water.",
      });
    }
  },
  setSteps: async (steps) => {
    const current = get();
    set({ steps });
    try {
      const snapshot = await saveSettings({ steps });
      set({
        goals: snapshot.goals,
        water: snapshot.water,
        steps: snapshot.steps,
        weightLogs: snapshot.weightLogs,
        stepLogs: snapshot.stepLogs,
      });
    } catch (error) {
      set({
        steps: current.steps,
        error: error instanceof Error ? error.message : "Unable to save steps.",
      });
    }
  },
  addWeightLog: async (weightKg) => {
    const snapshot = await saveSettings({ weightKg });
    set({
      goals: snapshot.goals,
      water: snapshot.water,
      steps: snapshot.steps,
      weightLogs: snapshot.weightLogs,
      stepLogs: snapshot.stepLogs,
    });
  },
}));
