"use client";

import { CheckCircle2, Save, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNutritionStore } from "@/store/useNutritionStore";
import type { UserGoals } from "@/types/nutrition";

const goalFields: [keyof UserGoals, string, string][] = [
  ["calories", "Calories", "kcal"],
  ["protein", "Protein", "g"],
  ["carbs", "Carbs", "g"],
  ["fat", "Fat", "g"],
  ["fiber", "Fiber", "g"],
  ["waterGlasses", "Water", "glasses"],
  ["steps", "Steps", "steps"],
  ["weightKg", "Weight", "kg"],
];

function normalizeNumberInput(value: string) {
  const numeric = value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");

  if (numeric === "") return "";
  if (numeric.startsWith(".")) return `0${numeric}`;
  return numeric.replace(/^0+(?=\d)/, "");
}

export default function SettingsPage() {
  const goals = useNutritionStore((state) => state.goals);
  const setGoals = useNutritionStore((state) => state.setGoals);
  const addWeightLog = useNutritionStore((state) => state.addWeightLog);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [draft, setDraft] = useState<Record<keyof UserGoals, string>>(
    Object.fromEntries(
      goalFields.map(([key]) => [key, String(goals[key])]),
    ) as Record<keyof UserGoals, string>,
  );

  useEffect(() => {
    setDraft(
      Object.fromEntries(
        goalFields.map(([key]) => [key, String(goals[key])]),
      ) as Record<keyof UserGoals, string>,
    );
  }, [goals]);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function save() {
    setIsSaving(true);
    setToast(null);

    const nextGoals = Object.fromEntries(
      goalFields.map(([key]) => [key, Number(draft[key] || 0)]),
    ) as UserGoals;

    try {
      await setGoals(nextGoals);
      await addWeightLog(nextGoals.weightKg);
      setToast({ type: "success", message: "Goals saved successfully." });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save goals.",
      });
    } finally {
      setIsSaving(false);
    }
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
          {goalFields.map(([key, label, suffix]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
                <input
                  type="text"
                  inputMode="decimal"
                  value={draft[key]}
                  onChange={(event) => {
                    const cleanedValue = normalizeNumberInput(
                      event.target.value,
                    );
                    setDraft((current) => ({
                      ...current,
                      [key]: cleanedValue,
                    }));
                  }}
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
          disabled={isSaving}
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 font-bold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="size-5" />
          {isSaving ? "Saving..." : "Save goals"}
        </button>
      </section>

      {toast ? (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-soft ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <XCircle className="size-5 shrink-0" />
          )}
          {toast.message}
        </div>
      ) : null}

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
