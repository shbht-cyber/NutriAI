"use client";

import { AICoach } from "@/components/dashboard/AICoach";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { FoodInput } from "@/components/dashboard/FoodInput";
import { NutritionSummary } from "@/components/dashboard/NutritionSummary";
import { FoodFilters } from "@/components/filters/FoodFilters";
import { MealSection } from "@/components/food/MealSection";
import { useFilteredEntries } from "@/hooks/useFilteredEntries";
import { meals } from "@/utils/nutrition";

export default function DashboardPage() {
  const entries = useFilteredEntries();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <FoodInput />
          <DashboardCards />
        </div>
        <div className="space-y-6">
          <NutritionSummary />
          <AICoach />
        </div>
      </div>

      <FoodFilters />

      <div className="grid gap-6 xl:grid-cols-2">
        {meals.map((meal) => (
          <MealSection
            key={meal.id}
            meal={meal.id}
            entries={entries.filter((entry) => entry.meal === meal.id)}
          />
        ))}
      </div>
    </div>
  );
}
