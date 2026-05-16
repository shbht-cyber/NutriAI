import { NextRequest, NextResponse } from "next/server";
import { buildNutritionPrompt } from "@/lib/geminiPrompt";
import { geminiNutritionSchema } from "@/validations/nutrition";

export const runtime = "nodejs";

function extractJson(text: string) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Gemini returned an empty response.");
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start)
    throw new Error("Gemini did not return JSON.");
  return withoutFence.slice(start, end + 1);
}

function localEstimate(text: string) {
  const catalog = [
    {
      key: "egg white",
      calories: 17,
      protein: 3.6,
      carbs: 0.2,
      fat: 0,
      fiber: 0,
    },
    { key: "egg", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0 },
    {
      key: "banana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
    },
    { key: "milk", calories: 122, protein: 8, carbs: 12, fat: 4.8, fiber: 0 },
    { key: "oats", calories: 154, protein: 6, carbs: 27, fat: 3, fiber: 4 },
    {
      key: "rice",
      calories: 206,
      protein: 4.3,
      carbs: 45,
      fat: 0.4,
      fiber: 0.6,
    },
    {
      key: "chicken",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
    },
    { key: "paneer", calories: 265, protein: 18, carbs: 6, fat: 20, fiber: 0 },
    { key: "dal", calories: 198, protein: 12, carbs: 30, fat: 4, fiber: 8 },
  ];
  const parts = text
    .split(/\+|,| and /i)
    .map((part) => part.trim())
    .filter(Boolean);
  const items = parts.map((part) => {
    const normalized = part.toLowerCase().replace("whit", "white");
    const match =
      catalog.find((food) => normalized.includes(food.key)) ?? catalog[0];
    const quantity = Number(normalized.match(/\d+(\.\d+)?/)?.[0] ?? 1);
    return {
      name: match.key.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      quantity,
      calories: Math.round(match.calories * quantity),
      protein: Number((match.protein * quantity).toFixed(1)),
      carbs: Number((match.carbs * quantity).toFixed(1)),
      fat: Number((match.fat * quantity).toFixed(1)),
      fiber: Number((match.fiber * quantity).toFixed(1)),
    };
  });
  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: Number((acc.protein + item.protein).toFixed(1)),
      carbs: Number((acc.carbs + item.carbs).toFixed(1)),
      fat: Number((acc.fat + item.fat).toFixed(1)),
      fiber: Number((acc.fiber + item.fiber).toFixed(1)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
  return { items, totals };
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (typeof text !== "string" || text.trim().length < 2) {
      return NextResponse.json(
        { error: "Food text is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const data = geminiNutritionSchema.parse(localEstimate(text));
      return NextResponse.json({ data, source: "local-demo" });
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: buildNutritionPrompt(text) }] },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Gemini request failed." },
        { status: response.status },
      );
    }

    const payload = await response.json();
    const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof rawText !== "string")
      throw new Error("Gemini response was empty.");

    const parsed = JSON.parse(extractJson(rawText));
    const data = geminiNutritionSchema.parse(parsed);
    return NextResponse.json({ data, source: "gemini" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to analyze food.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
