"use client";

import { useMemo } from "react";
import { isAfter, isSameDay, parseISO, subDays } from "date-fns";
import { useNutritionStore } from "@/store/useNutritionStore";

export function useFilteredEntries() {
  const entries = useNutritionStore((state) => state.entries);
  const filters = useNutritionStore((state) => state.filters);

  return useMemo(() => {
    const now = new Date();
    return entries.filter((entry) => {
      const createdAt = parseISO(entry.createdAt);
      const queryHit =
        !filters.query ||
        entry.text.toLowerCase().includes(filters.query.toLowerCase()) ||
        entry.items.some((item) =>
          item.name.toLowerCase().includes(filters.query.toLowerCase()),
        );
      const mealHit = filters.meal === "all" || entry.meal === filters.meal;
      const modeHit =
        filters.mode === "all" ||
        (filters.mode === "highProtein" && entry.totals.protein >= 25) ||
        (filters.mode === "lowCarb" && entry.totals.carbs <= 25);
      const dateHit =
        filters.date === "all" ||
        (filters.date === "today" && isSameDay(createdAt, now)) ||
        (filters.date === "yesterday" &&
          isSameDay(createdAt, subDays(now, 1))) ||
        (filters.date === "week" && isAfter(createdAt, subDays(now, 7)));

      return queryHit && mealHit && modeHit && dateHit;
    });
  }, [entries, filters]);
}
