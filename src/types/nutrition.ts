export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type NutritionItem = NutritionTotals & {
  name: string;
  quantity: number | string;
};

export type FoodEntry = {
  id: string;
  text: string;
  meal: MealType;
  items: NutritionItem[];
  totals: NutritionTotals;
  createdAt: string;
  updatedAt: string;
};

export type EntryFilters = {
  query: string;
  meal: MealType | "all";
  mode: "all" | "highProtein" | "lowCarb";
  date: "today" | "yesterday" | "week" | "all";
};

export type UserGoals = NutritionTotals & {
  waterGlasses: number;
  weightKg: number;
  steps: number;
};

export type ThemeMode = "light" | "dark";
