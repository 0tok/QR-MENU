import { NextResponse } from "next/server";
import { z } from "zod";
import { submitFeedback } from "@/lib/menu";

const MAX_BODY_BYTES = 4 * 1024;

const bodySchema = z.object({
  orgSlug: z.string().trim().min(1).max(64),
  locationSlug: z.string().trim().min(1).max(64),
  text: z.string().trim().min(1).max(1000),
  tableNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{1,16}$/)
    .optional(),
});

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
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
    const result = await submitFeedback(orgSlug, locationSlug, text, tableNumber);

    if (!result) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
  } catch (error) {
    console.error("Feedback submission failed", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
