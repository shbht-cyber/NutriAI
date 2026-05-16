import type { FoodEntry, UserGoals } from "@/types/nutrition";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export type NutritionSnapshot = {
  entries: FoodEntry[];
  goals: UserGoals;
  water: number;
  weightLogs: { date: string; weightKg: number }[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const supabase = getSupabaseBrowserClient();
  const session = supabase
    ? (await supabase.auth.getSession()).data.session
    : null;
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...init?.headers,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error ?? "Database request failed.");
  }
  return payload.data;
}

export function fetchNutritionSnapshot() {
  return request<NutritionSnapshot>("/api/nutrition");
}

export function createFoodEntry(
  input: Omit<FoodEntry, "id" | "createdAt" | "updatedAt">,
) {
  return request<FoodEntry>("/api/nutrition", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function saveFoodEntry(
  id: string,
  input: Omit<FoodEntry, "id" | "createdAt" | "updatedAt">,
) {
  return request<FoodEntry>("/api/nutrition", {
    method: "PUT",
    body: JSON.stringify({ id, ...input }),
  });
}

export function removeFoodEntry(id: string) {
  return request<{ id: string }>("/api/nutrition", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export function copyFoodEntry(id: string) {
  return request<FoodEntry>("/api/nutrition", {
    method: "POST",
    body: JSON.stringify({ duplicateId: id }),
  });
}

export function saveSettings(input: {
  goals?: Partial<UserGoals>;
  water?: number;
  weightKg?: number;
}) {
  return request<NutritionSnapshot>("/api/nutrition/settings", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
