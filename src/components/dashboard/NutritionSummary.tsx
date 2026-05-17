"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Flame,
  Footprints,
  GlassWater,
  Minus,
  Plus,
  Scale,
  XCircle,
} from "lucide-react";
import { useNutritionStore } from "@/store/useNutritionStore";
import { addTotals, clampPercent, todayEntries } from "@/utils/nutrition";
import { MacroProgress } from "@/components/dashboard/MacroProgress";

function normalizeStepDraft(value: string) {
  return value.replace(/^0+(?=\d)/, "");
}

export function NutritionSummary() {
  const entries = useNutritionStore((state) => state.entries);
  const goals = useNutritionStore((state) => state.goals);
  const water = useNutritionStore((state) => state.water);
  const steps = useNutritionStore((state) => state.steps);
  const setWater = useNutritionStore((state) => state.setWater);
  const setSteps = useNutritionStore((state) => state.setSteps);
  const [stepDraft, setStepDraft] = useState(String(steps));
  const [isSavingSteps, setIsSavingSteps] = useState(false);
  const [stepToast, setStepToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const totals = addTotals(todayEntries(entries));
  const caloriePercent = clampPercent(totals.calories, goals.calories);
  const stepsPercent = clampPercent(steps, goals.steps);

  useEffect(() => {
    setStepDraft(String(steps));
  }, [steps]);

  useEffect(() => {
    if (!stepToast) return;

    const timeout = window.setTimeout(() => setStepToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [stepToast]);

  async function saveSteps() {
    setIsSavingSteps(true);
    setStepToast(null);

    const numericStepDraft = Number(stepDraft);
    const nextSteps = Number.isFinite(numericStepDraft)
      ? Math.max(0, Math.round(numericStepDraft))
      : 0;

    try {
      await setSteps(nextSteps);
      setStepToast({ type: "success", message: "Steps saved successfully." });
    } catch (error) {
      setStepToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save steps.",
      });
    } finally {
      setIsSavingSteps(false);
    }
  }

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

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="muted-panel rounded-2xl p-3">
          <Flame className="mb-2 size-4 text-rose-500" />
          <p className="text-lg font-black">{goals.calories}</p>
          <p className="text-xs text-slate-500">Goal</p>
        </div>

        <div className="muted-panel rounded-2xl p-3">
          <div className="mb-2 flex items-center justify-between">
            <GlassWater className="size-4 text-sky-500" />
            <div className="flex gap-1">
              <button
                onClick={() => void setWater(Math.max(0, water - 1))}
                disabled={water <= 0}
                className="focus-ring grid size-7 place-items-center rounded-lg bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Decrease water intake"
              >
                <Minus className="size-3.5" />
              </button>
              <button
                onClick={() =>
                  void setWater(Math.min(goals.waterGlasses, water + 1))
                }
                className="focus-ring grid size-7 place-items-center rounded-lg bg-sky-500 text-white"
                aria-label="Increase water intake"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
          <p className="text-lg font-black">
            {water}/{goals.waterGlasses}
          </p>
          <p className="text-xs text-slate-500">Water</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void saveSteps();
          }}
          className="muted-panel rounded-2xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <Footprints className="size-4 text-emerald-500" />
            <span className="text-xs font-black text-slate-500">
              {stepsPercent}%
            </span>
          </div>
          <input
            type="number"
            min={0}
            value={stepDraft}
            onChange={(event) =>
              setStepDraft(normalizeStepDraft(event.target.value))
            }
            className="focus-ring mb-2 h-9 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm font-black dark:border-white/10 dark:bg-slate-900"
            aria-label="Steps covered today"
          />
          <button
            disabled={isSavingSteps}
            className="focus-ring w-full rounded-xl bg-emerald-500 px-2 py-1.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingSteps ? "Saving..." : "Save steps"}
          </button>
        </form>

        <div className="muted-panel rounded-2xl p-3">
          <Scale className="mb-2 size-4 text-teal-500" />
          <p className="text-lg font-black">{goals.weightKg}</p>
          <p className="text-xs text-slate-500">Weight kg</p>
        </div>
      </div>

      {stepToast ? (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-soft ${
            stepToast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-200"
          }`}
        >
          {stepToast.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <XCircle className="size-5 shrink-0" />
          )}
          {stepToast.message}
        </div>
      ) : null}
    </section>
  );
}
