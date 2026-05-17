"use client";

import { useMemo } from "react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { filterEntries } from "@/utils/nutrition";

export function useFilteredEntries() {
  const entries = useNutritionStore((state) => state.entries);
  const filters = useNutritionStore((state) => state.filters);

  return useMemo(() => filterEntries(entries, filters), [entries, filters]);
}
