"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FoodCard } from "@/components/food/FoodCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FoodEntry, MealType } from "@/types/nutrition";
import { addTotals, meals } from "@/utils/nutrition";

export function MealSection({ meal, entries }: { meal: MealType; entries: FoodEntry[] }) {
  const label = meals.find((item) => item.id === meal)?.label ?? meal;
  const totals = addTotals(entries);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">{label}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{entries.length} entries</p>
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{Math.round(totals.calories)} kcal</p>
      </div>
      {entries.length ? (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -12 }}>
                <FoodCard entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState title={`No ${label.toLowerCase()} yet`} description="Add food above and it will appear in this meal section." />
      )}
    </section>
  );
}
