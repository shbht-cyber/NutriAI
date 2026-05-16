import type {
  FoodEntry,
  MealType,
  NutritionItem,
  NutritionTotals,
  ThemeMode,
  UserGoals,
} from "@/types/nutrition";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const defaultGoals: UserGoals = {
  calories: 2200,
  protein: 140,
  carbs: 220,
  fat: 70,
  fiber: 30,
  waterGlasses: 8,
  weightKg: 72,
  steps: 10000,
};

type DbFoodEntry = {
  id: string;
  text: string;
  meal: MealType;
  items: NutritionItem[];
  totals: NutritionTotals;
  created_at: string;
  updated_at: string;
};

type DbSettings = {
  goals: UserGoals;
  water: number;
  theme: ThemeMode;
};

type DbWeightLog = {
  created_at: string;
  weight_kg: number;
};

type DbStepLog = {
  log_date: string;
  steps: number;
};

type MemoryState = {
  entries: FoodEntry[];
  goals: UserGoals;
  water: number;
  steps: number;
  theme: ThemeMode;
  weightLogs: { date: string; weightKg: number }[];
  stepLogs: { date: string; steps: number }[];
};

const memory: MemoryState = {
  entries: [],
  goals: defaultGoals,
  water: 0,
  steps: 0,
  theme: "dark",
  weightLogs: [],
  stepLogs: [],
};

function toFoodEntry(row: DbFoodEntry): FoodEntry {
  return {
    id: row.id,
    text: row.text,
    meal: row.meal,
    items: row.items,
    totals: row.totals,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createMemoryId() {
  return crypto.randomUUID();
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function getNutritionSnapshot(appUserId: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      entries: memory.entries,
      goals: memory.goals,
      water: memory.water,
      steps: memory.steps,
      theme: memory.theme,
      weightLogs: memory.weightLogs,
      stepLogs: memory.stepLogs,
      source: "memory",
    };
  }

  const [entriesResult, settingsResult, weightsResult, stepsResult] =
    await Promise.all([
      supabase
        .from("food_entries")
        .select("id,text,meal,items,totals,created_at,updated_at")
        .eq("app_user_id", appUserId)
        .order("created_at", { ascending: false }),
      supabase
        .from("user_settings")
        .select("goals,water,theme")
        .eq("app_user_id", appUserId)
        .maybeSingle(),
      supabase
        .from("weight_logs")
        .select("created_at,weight_kg")
        .eq("app_user_id", appUserId)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("step_logs")
        .select("log_date,steps")
        .eq("app_user_id", appUserId)
        .order("log_date", { ascending: false })
        .limit(30),
    ]);

  if (entriesResult.error) throw entriesResult.error;
  if (settingsResult.error) throw settingsResult.error;
  if (weightsResult.error) throw weightsResult.error;
  if (stepsResult.error) throw stepsResult.error;

  const settings = settingsResult.data as DbSettings | null;
  const stepLogs = ((stepsResult.data ?? []) as DbStepLog[]).map((row) => ({
    date: row.log_date,
    steps: Number(row.steps),
  }));
  const todaySteps =
    stepLogs.find((row) => row.date === todayDateKey())?.steps ?? 0;

  return {
    entries: ((entriesResult.data ?? []) as DbFoodEntry[]).map(toFoodEntry),
    goals: { ...defaultGoals, ...(settings?.goals ?? {}) },
    water: settings?.water ?? 0,
    steps: todaySteps,
    theme: settings?.theme ?? "dark",
    weightLogs: ((weightsResult.data ?? []) as DbWeightLog[]).map((row) => ({
      date: row.created_at,
      weightKg: Number(row.weight_kg),
    })),
    stepLogs,
    source: "supabase",
  };
}

export async function createEntry(
  appUserId: string,
  input: Omit<FoodEntry, "id" | "createdAt" | "updatedAt">,
) {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  if (!supabase) {
    const entry = {
      ...input,
      id: createMemoryId(),
      createdAt: now,
      updatedAt: now,
    };
    memory.entries = [entry, ...memory.entries];
    return entry;
  }

  const { data, error } = await supabase
    .from("food_entries")
    .insert({
      app_user_id: appUserId,
      text: input.text,
      meal: input.meal,
      items: input.items,
      totals: input.totals,
    })
    .select("id,text,meal,items,totals,created_at,updated_at")
    .single();

  if (error) throw error;
  return toFoodEntry(data as DbFoodEntry);
}

export async function updateEntry(
  appUserId: string,
  id: string,
  input: Omit<FoodEntry, "id" | "createdAt" | "updatedAt">,
) {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  if (!supabase) {
    const existing = memory.entries.find((entry) => entry.id === id);
    if (!existing) throw new Error("Food entry not found.");
    const updated = { ...existing, ...input, updatedAt: now };
    memory.entries = memory.entries.map((entry) =>
      entry.id === id ? updated : entry,
    );
    return updated;
  }

  const { data, error } = await supabase
    .from("food_entries")
    .update({
      text: input.text,
      meal: input.meal,
      items: input.items,
      totals: input.totals,
      updated_at: now,
    })
    .eq("id", id)
    .eq("app_user_id", appUserId)
    .select("id,text,meal,items,totals,created_at,updated_at")
    .single();

  if (error) throw error;
  return toFoodEntry(data as DbFoodEntry);
}

export async function deleteEntry(appUserId: string, id: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    memory.entries = memory.entries.filter((entry) => entry.id !== id);
    return { id };
  }

  const { error } = await supabase
    .from("food_entries")
    .delete()
    .eq("id", id)
    .eq("app_user_id", appUserId);
  if (error) throw error;
  return { id };
}

export async function duplicateEntry(appUserId: string, id: string) {
  const snapshot = await getNutritionSnapshot(appUserId);
  const entry = snapshot.entries.find((item) => item.id === id);
  if (!entry) throw new Error("Food entry not found.");
  return createEntry(appUserId, {
    text: entry.text,
    meal: entry.meal,
    items: entry.items,
    totals: entry.totals,
  });
}

export async function updateSettings(
  appUserId: string,
  input: {
    goals?: Partial<UserGoals>;
    water?: number;
    weightKg?: number;
    steps?: number;
  },
) {
  const supabase = getSupabaseServerClient();
  const nextGoals = { ...memory.goals, ...input.goals };
  if (typeof input.weightKg === "number") nextGoals.weightKg = input.weightKg;

  if (!supabase) {
    memory.goals = nextGoals;
    if (typeof input.water === "number") memory.water = input.water;
    if (typeof input.steps === "number") {
      const date = todayDateKey();
      memory.steps = input.steps;
      memory.stepLogs = [
        { date, steps: input.steps },
        ...memory.stepLogs.filter((row) => row.date !== date),
      ].slice(0, 30);
    }
    if (typeof input.weightKg === "number") {
      memory.weightLogs = [
        { date: new Date().toISOString(), weightKg: input.weightKg },
        ...memory.weightLogs,
      ].slice(0, 30);
    }
    return getNutritionSnapshot(appUserId);
  }

  const current = await getNutritionSnapshot(appUserId);
  const goals = { ...current.goals, ...input.goals };
  if (typeof input.weightKg === "number") goals.weightKg = input.weightKg;

  const { error } = await supabase.from("user_settings").upsert({
    app_user_id: appUserId,
    goals,
    water: typeof input.water === "number" ? input.water : current.water,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;

  if (typeof input.weightKg === "number") {
    const { error: weightError } = await supabase.from("weight_logs").insert({
      app_user_id: appUserId,
      weight_kg: input.weightKg,
    });
    if (weightError) throw weightError;
  }

  if (typeof input.steps === "number") {
    const { error: stepsError } = await supabase.from("step_logs").upsert(
      {
        app_user_id: appUserId,
        log_date: todayDateKey(),
        steps: input.steps,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "app_user_id,log_date" },
    );
    if (stepsError) throw stepsError;
  }

  return getNutritionSnapshot(appUserId);
}
