import { NextResponse } from "next/server";
import { getMenuBySlug } from "@/lib/menu";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; venue: string }> }
) {
  const { slug, venue } = await params;
  const menu = await getMenuBySlug(slug, venue);

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  return NextResponse.json(menu, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
