"use client";

import { Brain, Lightbulb } from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { addTotals, todayEntries } from "@/utils/nutrition";

export function AICoach() {
  const entries = useNutritionStore((state) => state.entries);
  const goals = useNutritionStore((state) => state.goals);
  const totals = addTotals(todayEntries(entries));

  const suggestions = [
    totals.protein < goals.protein * 0.55
      ? "You need more protein today. Add Greek yogurt, tofu, eggs, paneer, or lean chicken."
      : "Protein is on track. Keep your next meal balanced.",
    totals.fiber < goals.fiber * 0.45
      ? "Fiber intake is low. Add fruit, dal, oats, beans, or vegetables."
      : "Fiber looks healthy for this point in the day.",
    totals.calories > goals.calories * 0.85
      ? "You are close to your calorie goal. Choose a lighter, protein-forward next meal."
      : "You have room for a nutrient-dense meal later.",
  ];

  return (
    <section className="glass rounded-[2rem] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-500">
          <Brain className="size-5" />
        </div>
        <div>
          <h2 className="font-black">AI Nutrition Coach</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Smart nudges from your daily totals
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion}
            className="muted-panel flex gap-3 rounded-2xl p-3 text-sm leading-6"
          >
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
            {suggestion}
          </div>
        ))}
      </div>
    </section>
  );
}
