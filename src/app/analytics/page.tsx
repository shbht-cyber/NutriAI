"use client";

import { Charts } from "@/components/charts/Charts";
import { useNutritionStore } from "@/store/useNutritionStore";
import { addTotals, entriesForDay, weeklyStepsData } from "@/utils/nutrition";

export default function AnalyticsPage() {
  const entries = useNutritionStore((state) => state.entries);
  const stepLogs = useNutritionStore((state) => state.stepLogs);
  const weeklySteps = weeklyStepsData(stepLogs).reduce((sum, row) => sum + row.steps, 0);
  const weekTotals = addTotals(
    Array.from({ length: 7 }, (_, index) =>
      entriesForDay(entries, index),
    ).flat(),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-teal-600 dark:text-teal-300">
          Analytics
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Macro and calorie intelligence
        </h1>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {[
          ["Weekly calories", Math.round(weekTotals.calories), "kcal"],
          ["Protein", Math.round(weekTotals.protein), "g"],
          ["Carbs", Math.round(weekTotals.carbs), "g"],
          ["Fat", Math.round(weekTotals.fat), "g"],
          ["Steps", weeklySteps, "steps"],
        ].map(([label, value, suffix]) => (
          <div key={label} className="glass rounded-3xl p-5">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-3 text-3xl font-black">
              {value}
              <span className="ml-1 text-sm text-slate-400">{suffix}</span>
            </p>
          </div>
        ))}
      </div>
      <Charts />
    </div>
  );
}
