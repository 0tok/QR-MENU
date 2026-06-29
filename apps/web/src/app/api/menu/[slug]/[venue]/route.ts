import { NextResponse } from "next/server";
import { getMenuBySlug } from "@/lib/menu";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; venue: string }> }
) {
  try {
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
  } catch (error) {
    console.error("Failed to load menu", error);
    return NextResponse.json(
      { error: "Failed to load menu" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
