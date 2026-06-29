"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuPayload, MenuProduct } from "@/lib/menu";
import { isSectionEnabled } from "@/lib/theme";
import { MenuProvider, useMenu } from "./menu-context";
import { MenuHeader } from "./menu-header";
import { MenuToolbar } from "./menu-toolbar";
import { HomeView } from "./home-view";
import { SavedView } from "./saved-view";
import { FeedbackView } from "./feedback-view";
import { BottomNav, type MenuView } from "./bottom-nav";
import { ProductSheet } from "./product-sheet";
import { MoreSheet } from "./more-sheet";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function MenuApp({ menu, tableNumber }: { menu: MenuPayload; tableNumber?: string }) {
  return (
    <MenuProvider menu={menu} tableNumber={tableNumber}>
      <TooltipProvider>
        <MenuShell />
      </TooltipProvider>
    </MenuProvider>
  );
}

function MenuShell() {
  const { menu, rtl } = useMenu();

  const [view, setView] = useState<MenuView>("home");
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const sections = useMemo(() => {
    const s = menu.theme?.sections;
    return {
      header: isSectionEnabled(s, "header"),
      toolbar: isSectionEnabled(s, "selectors"),
      banners: isSectionEnabled(s, "banners"),
      categoryNav: isSectionEnabled(s, "category-nav"),
      productGrid: isSectionEnabled(s, "product-grid"),
    };
  }, [menu.theme?.sections]);

  // Reflect language direction at the document level for RTL languages.
  useEffect(() => {
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [rtl]);

  const openProduct = (product: MenuProduct) => setSelectedProduct(product);

  return (
    <div className="flex min-h-dvh flex-col pb-[4.5rem]">
      {sections.header && <MenuHeader onOpenMore={() => setMoreOpen(true)} />}
      {sections.toolbar && <MenuToolbar />}

      <div className="flex-1">
        {view === "home" && <HomeView sections={sections} onOpenProduct={openProduct} />}
        {view === "saved" && <SavedView onOpenProduct={openProduct} />}
        {view === "feedback" && <FeedbackView onSubmitted={() => setView("home")} />}
      </div>

      <BottomNav view={view} onChange={setView} />
      <ProductSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <Toaster position="bottom-center" offset={88} mobileOffset={88} />
    </div>
  );
}
