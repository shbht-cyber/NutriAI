"use client";

import { CalendarDays, Filter } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import type { EntryFilters } from "@/types/nutrition";
import { meals } from "@/utils/nutrition";

type FoodFiltersProps = {
  filters?: EntryFilters;
  onFiltersChange?: (filters: Partial<EntryFilters>) => void;
};

export function FoodFilters({ filters, onFiltersChange }: FoodFiltersProps) {
  const storeFilters = useNutritionStore((state) => state.filters);
  const setStoreFilters = useNutritionStore((state) => state.setFilters);
  const activeFilters = filters ?? storeFilters;
  const setFilters = onFiltersChange ?? setStoreFilters;

  return (
    <div className="glass grid gap-3 rounded-3xl p-4 md:grid-cols-3">
      <label className="relative">
        <Filter className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <select
          value={activeFilters.meal}
          onChange={(event) =>
            setFilters({
              meal: event.target.value as EntryFilters["meal"],
            })
          }
          className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 font-semibold dark:border-white/10 dark:bg-slate-900"
        >
          <option value="all">All meals</option>
          {meals.map((meal) => (
            <option key={meal.id} value={meal.id}>
              {meal.label}
            </option>
          ))}
        </select>
      </label>
      <select
        value={activeFilters.mode}
        onChange={(event) =>
          setFilters({ mode: event.target.value as EntryFilters["mode"] })
        }
        className="focus-ring h-12 rounded-2xl border border-slate-200 bg-white px-4 font-semibold dark:border-white/10 dark:bg-slate-900"
      >
        <option value="all">All macros</option>
        <option value="highProtein">High protein</option>
        <option value="lowCarb">Low carb</option>
      </select>
      <label className="relative">
        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <select
          value={activeFilters.date}
          onChange={(event) =>
            setFilters({ date: event.target.value as EntryFilters["date"] })
          }
          className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 font-semibold dark:border-white/10 dark:bg-slate-900"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This week</option>
          <option value="all">All dates</option>
        </select>
      </label>
    </div>
  );
}
