"use client";

import { format, subDays } from "date-fns";
import { FoodFilters } from "@/components/filters/FoodFilters";
import { FoodCard } from "@/components/food/FoodCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFilteredEntries } from "@/hooks/useFilteredEntries";
import { useNutritionStore } from "@/store/useNutritionStore";
import { addTotals, entriesForDay } from "@/utils/nutrition";

export default function HistoryPage() {
  const entries = useNutritionStore((state) => state.entries);
  const filtered = useFilteredEntries();
  const snapshots = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const dayEntries = entriesForDay(entries, offset);
    return {
      offset,
      date: subDays(new Date(), offset),
      entries: dayEntries,
      totals: addTotals(dayEntries),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-teal-600 dark:text-teal-300">
          Daily History
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Today, yesterday, and your week
        </h1>
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
        {snapshots.map((day) => (
          <div key={day.offset} className="glass rounded-3xl p-4">
            <p className="text-sm font-bold">
              {day.offset === 0
                ? "Today"
                : day.offset === 1
                  ? "Yesterday"
                  : format(day.date, "EEE")}
            </p>
            <p className="mt-2 text-2xl font-black">
              {Math.round(day.totals.calories)}
            </p>
            <p className="text-xs text-slate-500">
              kcal • {day.entries.length} logs
            </p>
          </div>
        ))}
      </div>
      <FoodFilters />
      <section className="space-y-3">
        {filtered.length ? (
          filtered.map((entry) => <FoodCard key={entry.id} entry={entry} />)
        ) : (
          <EmptyState
            title="No history matches"
            description="Try broadening your search or filter settings."
          />
        )}
      </section>
    </div>
  );
}
