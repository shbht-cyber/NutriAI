import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { buildNutritionPrompt } from "@/lib/geminiPrompt";
import { geminiNutritionSchema } from "@/validations/nutrition";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { error: 'Use POST with JSON body: { "text": "4 egg whites + milk" }' },
    { status: 405 },
  );
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body?.text;
    if (typeof text !== "string" || text.trim().length < 2) {
      return NextResponse.json(
        { error: "Food text is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: buildNutritionPrompt(text),
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const rawText = response.text;
    if (typeof rawText !== "string" || !rawText.trim()) {
      throw new Error("Gemini response was empty.");
    }

    const parsed = JSON.parse(extractJson(rawText));
    const data = geminiNutritionSchema.parse(parsed);
    return NextResponse.json({ data, source: "gemini" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to analyze food.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
