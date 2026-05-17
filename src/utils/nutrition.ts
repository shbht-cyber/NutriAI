import { format, isSameDay, parseISO, subDays } from "date-fns";
import type {
  EntryFilters,
  FoodEntry,
  MealType,
  NutritionTotals,
} from "@/types/nutrition";

export const emptyTotals: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

export const meals: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
];

export function addTotals(entries: FoodEntry[]): NutritionTotals {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.totals.calories,
      protein: acc.protein + entry.totals.protein,
      carbs: acc.carbs + entry.totals.carbs,
      fat: acc.fat + entry.totals.fat,
      fiber: acc.fiber + entry.totals.fiber,
    }),
    emptyTotals,
  );
}

export function todayEntries(entries: FoodEntry[]) {
  const now = new Date();
  return entries.filter((entry) => isSameDay(parseISO(entry.createdAt), now));
}

export function entriesForDay(entries: FoodEntry[], offset: number) {
  const date = subDays(new Date(), offset);
  return entries.filter((entry) => isSameDay(parseISO(entry.createdAt), date));
}

export function filterEntries(
  entries: FoodEntry[],
  filters: EntryFilters,
  now = new Date(),
) {
  return entries.filter((entry) => {
    const createdAt = parseISO(entry.createdAt);
    const query = filters.query.toLowerCase();
    const queryHit =
      !query ||
      entry.text.toLowerCase().includes(query) ||
      entry.items.some((item) => item.name.toLowerCase().includes(query));
    const mealHit = filters.meal === "all" || entry.meal === filters.meal;
    const modeHit =
      filters.mode === "all" ||
      (filters.mode === "highProtein" && entry.totals.protein >= 25) ||
      (filters.mode === "lowCarb" && entry.totals.carbs <= 25);
    const dateHit =
      filters.date === "all" ||
      (filters.date === "today" && isSameDay(createdAt, now)) ||
      (filters.date === "yesterday" && isSameDay(createdAt, subDays(now, 1))) ||
      (filters.date === "week" && createdAt >= subDays(now, 7));

    return queryHit && mealHit && modeHit && dateHit;
  });
}

export function weeklyChartData(entries: FoodEntry[]) {
  return Array.from({ length: 7 }, (_, index) => {
    const offset = 6 - index;
    const date = subDays(new Date(), offset);
    const dayEntries = entries.filter((entry) =>
      isSameDay(parseISO(entry.createdAt), date),
    );
    const totals = addTotals(dayEntries);
    return {
      day: format(date, "EEE"),
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      fiber: Math.round(totals.fiber),
    };
  });
}

export function weeklyStepsData(stepLogs: { date: string; steps: number }[]) {
  return Array.from({ length: 7 }, (_, index) => {
    const offset = 6 - index;
    const date = subDays(new Date(), offset);
    const dateKey = format(date, "yyyy-MM-dd");
    return {
      day: format(date, "EEE"),
      steps: stepLogs.find((entry) => entry.date === dateKey)?.steps ?? 0,
    };
  });
}

export function clampPercent(value: number, goal: number) {
  if (!goal) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
