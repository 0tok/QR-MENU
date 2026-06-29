import { NextResponse } from "next/server";
import { z } from "zod";
import { submitFeedback } from "@/lib/menu";

const bodySchema = z.object({
  orgSlug: z.string().min(1),
  locationSlug: z.string().min(1),
  text: z.string().min(1).max(1000),
  tableNumber: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { orgSlug, locationSlug, text, tableNumber } = parsed.data;
  const result = await submitFeedback(orgSlug, locationSlug, text, tableNumber);

  if (!result) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
