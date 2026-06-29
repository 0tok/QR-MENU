"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMenu } from "./menu-context";

export function CategoryNav({
  activeSlug,
  onSelect,
  hasHeader,
}: {
  activeSlug: string;
  onSelect: (slug: string) => void;
  hasHeader: boolean;
}) {
  const { menu, t } = useMenu();
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active chip scrolled into view as the user scrolls the page.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>(`[data-slug="${activeSlug}"]`);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeSlug]);

  if (!menu.categories.length) return null;

  return (
    <nav
      className={cn(
        "sticky z-20 border-b border-border/70 bg-background/85 backdrop-blur-lg",
        hasHeader ? "top-26" : "top-0"
      )}
    >
      <div
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {menu.categories.map((cat) => {
          const active = cat.slug === activeSlug;
          return (
            <button
              key={cat.slug}
              data-slug={cat.slug}
              type="button"
              onClick={() => onSelect(cat.slug)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {t(cat.name)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
