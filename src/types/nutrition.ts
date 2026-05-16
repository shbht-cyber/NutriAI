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

export type UserGoals = NutritionTotals & {
  waterGlasses: number;
  weightKg: number;
};

export type ThemeMode = "light" | "dark";
