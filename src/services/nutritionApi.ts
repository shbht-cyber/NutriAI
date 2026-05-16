import { GeminiNutritionResponse } from "@/validations/nutrition";

export async function analyzeFood(
  text: string,
): Promise<GeminiNutritionResponse> {
  const response = await fetch("/api/analyze-food", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error ?? "Nutrition analysis failed.");
  }

  return payload.data;
}
