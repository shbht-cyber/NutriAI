import { z } from "zod";

export const nutritionTotalsSchema = z.object({
  calories: z.coerce.number().nonnegative().finite(),
  protein: z.coerce.number().nonnegative().finite(),
  carbs: z.coerce.number().nonnegative().finite(),
  fat: z.coerce.number().nonnegative().finite(),
  fiber: z.coerce.number().nonnegative().finite(),
});

export const nutritionItemSchema = nutritionTotalsSchema.extend({
  name: z.string().min(1).max(80),
  quantity: z.union([
    z.coerce.number().nonnegative(),
    z.string().min(1).max(60),
  ]),
});

export const geminiNutritionSchema = z.object({
  items: z.array(nutritionItemSchema).min(1),
  totals: nutritionTotalsSchema,
});

export const foodInputSchema = z.object({
  text: z.string().trim().min(2, "Describe at least one food.").max(500),
  meal: z.enum(["breakfast", "lunch", "dinner", "snacks"]),
});

export const foodEntryInputSchema = foodInputSchema.extend({
  items: z.array(nutritionItemSchema).min(1),
  totals: nutritionTotalsSchema,
});

export const foodEntryUpdateSchema = foodEntryInputSchema.extend({
  id: z.string().min(1),
});

export const foodEntryDuplicateSchema = z.object({
  duplicateId: z.string().min(1),
});

export const settingsUpdateSchema = z.object({
  goals: nutritionTotalsSchema
    .extend({
      waterGlasses: z.coerce.number().int().positive(),
      weightKg: z.coerce.number().positive(),
    })
    .partial()
    .optional(),
  water: z.coerce.number().int().nonnegative().optional(),
  weightKg: z.coerce.number().positive().optional(),
});

export type GeminiNutritionResponse = z.infer<typeof geminiNutritionSchema>;
