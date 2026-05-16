"use client";

import { Apple, Beef, Flame, Wheat } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { addTotals, todayEntries } from "@/utils/nutrition";

const cards = [
  {
    key: "calories",
    label: "Calories",
    icon: Flame,
    suffix: "kcal",
    color: "text-rose-500",
  },
  {
    key: "protein",
    label: "Protein",
    icon: Beef,
    suffix: "g",
    color: "text-emerald-500",
  },
  {
    key: "carbs",
    label: "Carbs",
    icon: Wheat,
    suffix: "g",
    color: "text-sky-500",
  },
  {
    key: "fiber",
    label: "Fiber",
    icon: Apple,
    suffix: "g",
    color: "text-violet-500",
  },
] as const;

export function DashboardCards() {
  const entries = useNutritionStore((state) => state.entries);
  const totals = addTotals(todayEntries(entries));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <Icon className={`size-5 ${card.color}`} />
            </div>

            <p className="mt-4 text-3xl font-black tracking-tight">
              {Math.round(totals[card.key])}
              <span className="ml-1 text-sm font-bold text-slate-400">
                {card.suffix}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
