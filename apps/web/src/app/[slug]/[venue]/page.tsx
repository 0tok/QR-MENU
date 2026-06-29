import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuBySlug } from "@/lib/menu";
import { MenuApp } from "@/components/menu/menu-app";
import { themeStyle } from "@/lib/theme";
import { t, parseTableNumber } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string; venue: string }>;
  searchParams: Promise<{ table?: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, venue } = await params;
  const menu = await getMenuBySlug(slug, venue);
  if (!menu) return { title: "Menu not found" };

  const lang = menu.settings.defaultLanguage;
  return {
    title: t(menu.organization.name, lang),
    description: menu.organization.tagline ? t(menu.organization.tagline, lang) : undefined,
  };
}

export default async function MenuPage({ params, searchParams }: PageProps) {
  const { slug, venue } = await params;
  const { table: rawTable } = await searchParams;
  const table = parseTableNumber(rawTable);
  const menu = await getMenuBySlug(slug, venue);

  if (!menu) notFound();

  return (
    <main
      className="mx-auto min-h-dvh max-w-[430px] bg-background shadow-[0_0_0_1px_var(--border)]"
      style={themeStyle(menu.theme?.tokens)}
    >
      <MenuApp menu={menu} tableNumber={table} />
    </main>
  );
}
