import { notFound } from "next/navigation";
import { getMenuBySlug } from "@/lib/menu";
import { MenuApp } from "@/components/menu/menu-app";

type PageProps = {
  params: Promise<{ slug: string; venue: string }>;
  searchParams: Promise<{ table?: string; join?: string }>;
};

export default async function MenuPage({ params, searchParams }: PageProps) {
  const { slug, venue } = await params;
  const { table, join } = await searchParams;
  const menu = await getMenuBySlug(slug, venue);

  if (!menu) notFound();

  return (
    <main className="mx-auto min-h-dvh max-w-[430px] bg-background shadow-[0_0_0_1px_var(--border)]">
      <MenuApp menu={menu} tableNumber={table} joinToken={join} />
    </main>
  );
}
