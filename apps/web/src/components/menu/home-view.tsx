"use client";

import { useMemo } from "react";
import type { MenuProduct } from "@/lib/menu";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useMenu } from "./menu-context";
import { CategoryNav } from "./category-nav";
import { MenuBanners } from "./menu-banners";
import { ProductCard } from "./product-card";

export function HomeView({
  sections,
  onOpenProduct,
}: {
  sections: { banners: boolean; categoryNav: boolean; productGrid: boolean; header: boolean };
  onOpenProduct: (product: MenuProduct) => void;
}) {
  const { menu, t } = useMenu();
  const slugs = useMemo(() => menu.categories.map((c) => c.slug), [menu.categories]);
  const { activeId, register, setActiveId } = useScrollSpy(slugs, sections.productGrid);

  const scrollTo = (slug: string) => {
    setActiveId(slug);
    document
      .getElementById(`category-${slug}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {sections.categoryNav && (
        <CategoryNav activeSlug={activeId} onSelect={scrollTo} hasHeader={sections.header} />
      )}

      {sections.banners && <MenuBanners />}

      {sections.productGrid &&
        menu.categories.map((cat) => (
          <section
            key={cat.slug}
            id={`category-${cat.slug}`}
            ref={register(cat.slug)}
            className="scroll-mt-32 px-4 pb-5 pt-2"
          >
            <div className="mb-2.5">
              <h2 className="text-[1.05rem] font-bold tracking-tight">{t(cat.name)}</h2>
              {cat.description && (
                <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{t(cat.description)}</p>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {cat.products.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
              ))}
            </div>
          </section>
        ))}
    </>
  );
}
