import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/authServer";
import { updateSettings } from "@/lib/nutritionRepository";
import { settingsUpdateSchema } from "@/validations/nutrition";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const appUserId = await getAuthenticatedUserId(request);
    const parsed = settingsUpdateSchema.parse(await request.json());
    const data = await updateSettings(appUserId, parsed);
    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save settings.";
    const status =
      message.includes("Authentication") || message.includes("session")
        ? 401
        : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
