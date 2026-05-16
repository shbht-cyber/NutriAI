"use client";

import { useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { Copy, Pencil, Save, Trash2, X } from "lucide-react";
import { analyzeFood } from "@/services/nutritionApi";
import { useNutritionStore } from "@/store/useNutritionStore";
import type { FoodEntry } from "@/types/nutrition";
import { meals } from "@/utils/nutrition";

export function FoodCard({ entry }: { entry: FoodEntry }) {
  const updateEntry = useNutritionStore((state) => state.updateEntry);
  const deleteEntry = useNutritionStore((state) => state.deleteEntry);
  const duplicateEntry = useNutritionStore((state) => state.duplicateEntry);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.text);
  const [meal, setMeal] = useState(entry.meal);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    setError("");
    startTransition(async () => {
      try {
        const data = await analyzeFood(text);
        await updateEntry(entry.id, {
          text,
          meal,
          items: data.items,
          totals: data.totals,
        });
        setEditing(false);
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : "Unable to update food.",
        );
      }
    });
  }

  return (
    <article className="glass rounded-3xl p-4 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="grid gap-2 sm:grid-cols-[1fr_150px]">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900"
              />
              <select
                value={meal}
                onChange={(event) =>
                  setMeal(event.target.value as FoodEntry["meal"])
                }
                className="focus-ring rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-white/10 dark:bg-slate-900"
              >
                {meals.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <h3 className="truncate text-lg font-black">
                {entry.items.map((item) => item.name).join(" + ")}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {entry.text}
              </p>
            </>
          )}
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {meals.find((item) => item.id === entry.meal)?.label} •{" "}
            {format(parseISO(entry.createdAt), "h:mm a")}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {editing ? (
            <>
              <button
                onClick={save}
                disabled={isPending}
                className="focus-ring grid size-9 place-items-center rounded-xl bg-teal-500 text-white"
                aria-label="Save entry"
              >
                <Save className="size-4" />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="focus-ring grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-white/10"
                aria-label="Cancel edit"
              >
                <X className="size-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="focus-ring grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-white/10"
                aria-label="Edit entry"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => void duplicateEntry(entry.id)}
                className="focus-ring grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-white/10"
                aria-label="Duplicate entry"
              >
                <Copy className="size-4" />
              </button>
              <button
                onClick={() => void deleteEntry(entry.id)}
                className="focus-ring grid size-9 place-items-center rounded-xl bg-rose-500/10 text-rose-500"
                aria-label="Delete entry"
              >
                <Trash2 className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        {[
          ["Calories", entry.totals.calories, "kcal"],
          ["Protein", entry.totals.protein, "g"],
          ["Carbs", entry.totals.carbs, "g"],
          ["Fat", entry.totals.fat, "g"],
          ["Fiber", entry.totals.fiber, "g"],
        ].map(([label, value, suffix]) => (
          <div key={label} className="muted-panel rounded-2xl p-2">
            <p className="text-sm font-black">{Math.round(Number(value))}</p>
            <p className="truncate text-[11px] text-slate-500">
              {label} {suffix}
            </p>
          </div>
        ))}
      </div>
      {error ? (
        <p className="mt-3 rounded-2xl bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
          {error}
        </p>
      ) : null}
    </article>
  );
}
