import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/authServer";
import {
  createEntry,
  deleteEntry,
  duplicateEntry,
  getNutritionSnapshot,
  updateEntry,
} from "@/lib/nutritionRepository";
import {
  foodEntryDuplicateSchema,
  foodEntryInputSchema,
  foodEntryUpdateSchema,
} from "@/validations/nutrition";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const appUserId = await getAuthenticatedUserId(request);
    const data = await getNutritionSnapshot(appUserId);
    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load nutrition data.";
    const status =
      message.includes("Authentication") || message.includes("session")
        ? 401
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const appUserId = await getAuthenticatedUserId(request);
    const body = await request.json();
    if ("duplicateId" in body) {
      const parsed = foodEntryDuplicateSchema.parse(body);
      const data = await duplicateEntry(appUserId, parsed.duplicateId);
      return NextResponse.json({ data });
    }

    const parsed = foodEntryInputSchema.parse(body);
    const data = await createEntry(appUserId, parsed);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create food entry.";
    const status =
      message.includes("Authentication") || message.includes("session")
        ? 401
        : 422;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const appUserId = await getAuthenticatedUserId(request);
    const parsed = foodEntryUpdateSchema.parse(await request.json());
    const data = await updateEntry(appUserId, parsed.id, parsed);
    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update food entry.";
    const status =
      message.includes("Authentication") || message.includes("session")
        ? 401
        : 422;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const appUserId = await getAuthenticatedUserId(request);
    const body = await request.json();
    if (typeof body.id !== "string" || !body.id) {
      return NextResponse.json(
        { error: "Food entry id is required." },
        { status: 400 },
      );
    }

    const data = await deleteEntry(appUserId, body.id);
    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete food entry.";
    const status =
      message.includes("Authentication") || message.includes("session")
        ? 401
        : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
