import { NextResponse } from "next/server";
import { z } from "zod";
import { submitFeedback } from "@/lib/menu";

const bodySchema = z.object({
  orgSlug: z.string().trim().min(1),
  locationSlug: z.string().trim().min(1),
  text: z.string().trim().min(1).max(1000),
  tableNumber: z.string().trim().max(32).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const { orgSlug, locationSlug, text, tableNumber } = parsed.data;
    const result = await submitFeedback(
      orgSlug,
      locationSlug,
      text,
      tableNumber && tableNumber.length > 0 ? tableNumber : undefined
    );

    if (!result) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
  } catch (error) {
    console.error("Feedback submission failed", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
