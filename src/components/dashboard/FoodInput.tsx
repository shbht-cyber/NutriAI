"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Sparkles, Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { analyzeFood } from "@/services/nutritionApi";
import { useNutritionStore } from "@/store/useNutritionStore";
import { foodInputSchema } from "@/validations/nutrition";
import { meals } from "@/utils/nutrition";
import { cn } from "@/lib/utils";

const suggestions = [
  "4 egg whites + oats + milk",
  "Grilled chicken salad with avocado",
  "2 rotis + dal + curd",
  "Soya chunks with greek yogurt - a high protein dinner",
];

export function FoodInput() {
  const addEntry = useNutritionStore((state) => state.addEntry);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof foodInputSchema>>({
    resolver: zodResolver(foodInputSchema),
    defaultValues: { text: "", meal: "breakfast" },
  });

  const text = form.watch("text");
  const quickSuggestions = suggestions.filter(
    (item) =>
      item.toLowerCase().includes(text.toLowerCase()) || text.length < 3,
  );

  function submit(values: z.infer<typeof foodInputSchema>) {
    setError("");
    startTransition(async () => {
      try {
        const data = await analyzeFood(values.text);
        await addEntry({
          text: values.text,
          meal: values.meal,
          items: data.items,
          totals: data.totals,
        });
        form.reset({ text: "", meal: values.meal });
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to analyze this meal.",
        );
      }
    });
  }

  return (
    <section className="glass rounded-[2rem] p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-300">
            <Sparkles className="size-4" />
            AI Food Input
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            Log food in plain English
          </h1>
        </div>
        {/* <button
          className="focus-ring grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950"
          aria-label="Voice input placeholder"
        >
          <Mic className="size-5" />
        </button> */}
      </div>

      <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
          <textarea
            {...form.register("text")}
            className="focus-ring min-h-28 resize-none rounded-3xl border border-slate-200 bg-white/90 p-5 text-base shadow-inner placeholder:text-slate-400 dark:border-white/10 dark:bg-slate-900/80"
            placeholder='Try "4 egg whites + 1 cup milk + 2 bananas"'
          />
          <select
            {...form.register("meal")}
            className="focus-ring h-14 rounded-2xl border border-slate-200 bg-white px-4 font-semibold dark:border-white/10 dark:bg-slate-900"
          >
            {meals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.label}
              </option>
            ))}
          </select>
          <button
            disabled={isPending}
            className="focus-ring inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 font-bold text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Wand2 className="size-5 animate-spin" />
            ) : (
              <Plus className="size-5" />
            )}
            Analyze
          </button>
        </div>

        {form.formState.errors.text?.message ? (
          <p className="text-sm font-medium text-rose-500">
            {form.formState.errors.text.message}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
            {error}
          </p>
        ) : null}
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {quickSuggestions.slice(0, 4).map((suggestion) => (
          <motion.button
            key={suggestion}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              form.setValue("text", suggestion, { shouldValidate: true })
            }
            className={cn(
              "focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
            )}
          >
            <Wand2 className="size-4 text-teal-500" />
            {suggestion}
          </motion.button>
        ))}

        {/* <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-white/20">
          <Camera className="size-4" />
          Image upload
        </button> */}
      </div>
    </section>
  );
}
