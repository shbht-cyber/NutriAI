"use client";

import { Flame, GlassWater, Scale } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { addTotals, clampPercent, todayEntries } from "@/utils/nutrition";
import { MacroProgress } from "@/components/dashboard/MacroProgress";

export function NutritionSummary() {
  const entries = useNutritionStore((state) => state.entries);
  const goals = useNutritionStore((state) => state.goals);
  const water = useNutritionStore((state) => state.water);
  const setWater = useNutritionStore((state) => state.setWater);
  const totals = addTotals(todayEntries(entries));
  const caloriePercent = clampPercent(totals.calories, goals.calories);

  return (
    <section className="glass rounded-[2rem] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Today
          </p>
          <h2 className="text-2xl font-black tracking-tight">
            {Math.round(totals.calories)} kcal
          </h2>
        </div>
        <div className="relative grid size-24 place-items-center rounded-full bg-slate-100 dark:bg-white/5">
          <svg className="absolute size-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="9"
              fill="none"
              className="text-slate-200 dark:text-white/10"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#calories)"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - caloriePercent / 100)}`}
            />
            <defs>
              <linearGradient id="calories" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#14b8a6" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-sm font-black">{caloriePercent}%</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <MacroProgress
          label="Protein"
          value={totals.protein}
          goal={goals.protein}
          color="#22c55e"
        />
        <MacroProgress
          label="Carbs"
          value={totals.carbs}
          goal={goals.carbs}
          color="#38bdf8"
        />
        <MacroProgress
          label="Fat"
          value={totals.fat}
          goal={goals.fat}
          color="#f59e0b"
        />
        <MacroProgress
          label="Fiber"
          value={totals.fiber}
          goal={goals.fiber}
          color="#a855f7"
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="muted-panel rounded-2xl p-3">
          <Flame className="mb-2 size-4 text-rose-500" />
          <p className="text-lg font-black">{goals.calories}</p>
          <p className="text-xs text-slate-500">Goal</p>
        </div>

        <button
          onClick={() => void setWater(Math.min(goals.waterGlasses, water + 1))}
          className="muted-panel rounded-2xl p-3 text-left"
        >
          <GlassWater className="mb-2 size-4 text-sky-500" />
          <p className="text-lg font-black">
            {water}/{goals.waterGlasses}
          </p>
          <p className="text-xs text-slate-500">Water</p>
        </button>

        <div className="muted-panel rounded-2xl p-3">
          <Scale className="mb-2 size-4 text-teal-500" />
          <p className="text-lg font-black">{goals.weightKg}</p>
          <p className="text-xs text-slate-500">Weight kg</p>
        </div>
      </div>
    </section>
  );
}
