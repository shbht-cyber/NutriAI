"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { useNutritionStore } from "@/store/useNutritionStore";
import type { UserGoals } from "@/types/nutrition";

export default function SettingsPage() {
  const goals = useNutritionStore((state) => state.goals);
  const setGoals = useNutritionStore((state) => state.setGoals);
  const addWeightLog = useNutritionStore((state) => state.addWeightLog);
  const [draft, setDraft] = useState<UserGoals>(goals);

  async function save() {
    await setGoals(draft);
    await addWeightLog(draft.weightKg);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-teal-600 dark:text-teal-300">
          Settings
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Goals and preferences
        </h1>
      </div>

      <section className="glass rounded-[2rem] p-5">
        <h2 className="text-xl font-black">Daily Targets</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["calories", "Calories", "kcal"],
            ["protein", "Protein", "g"],
            ["carbs", "Carbs", "g"],
            ["fat", "Fat", "g"],
            ["fiber", "Fiber", "g"],
            ["waterGlasses", "Water", "glasses"],
            ["weightKg", "Weight", "kg"],
          ].map(([key, label, suffix]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
                <input
                  type="number"
                  value={draft[key as keyof UserGoals]}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: Number(event.target.value),
                    }))
                  }
                  className="focus-ring min-w-0 flex-1 bg-transparent px-4 py-3 font-bold"
                />
                <span className="grid place-items-center px-3 text-sm font-semibold text-slate-400">
                  {suffix}
                </span>
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={save}
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 font-bold text-white shadow-glow"
        >
          <Save className="size-5" />
          Save goals
        </button>
      </section>

      {/* <section className="glass rounded-[2rem] p-5">
        <h2 className="text-xl font-black">Gemini Setup</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Add `GEMINI_API_KEY` to `.env.local` to enable live AI nutrition
          extraction. Without a key, the app uses a small local demo estimator
          so the product remains testable during development.
        </p>
      </section> */}
    </div>
  );
}
