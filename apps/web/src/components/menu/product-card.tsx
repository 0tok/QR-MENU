"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MenuProduct } from "@/lib/menu";
import { useMenu } from "./menu-context";

export function ProductCard({
  product,
  onOpen,
}: {
  product: MenuProduct;
  onOpen: (product: MenuProduct) => void;
}) {
  const { t, formatPrice, badgeLabel, saved } = useMenu();
  const isSaved = saved.has(product.id);
  const unavailable = product.availability === "UNAVAILABLE";

  return (
    <article
      className={cn(
        "group relative flex gap-3 rounded-2xl border border-border/70 bg-card p-2.5 transition-all",
        unavailable ? "opacity-55" : "hover:border-border hover:shadow-sm"
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        disabled={unavailable}
        aria-label={t(product.name)}
        className="flex min-w-0 flex-1 items-start gap-3 text-start outline-none disabled:cursor-not-allowed"
      >
        {product.imageUrl && (
          <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.imageUrl}
              alt={t(product.name)}
              fill
              sizes="72px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="truncate text-[0.9rem] font-semibold leading-snug tracking-tight">
            {t(product.name)}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[0.78rem] leading-snug text-muted-foreground">
            {t(product.description)}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[0.85rem] font-semibold text-foreground">
              {formatPrice(product.priceGel)}
            </span>
            {product.badges.slice(0, 2).map((b) => (
              <Badge
                key={b}
                variant="secondary"
                className="h-4 px-1.5 text-[0.6rem] font-medium uppercase tracking-wide"
              >
                {badgeLabel(b)}
              </Badge>
            ))}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => saved.toggle(product.id)}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove from saved" : "Save"}
        className={cn(
          "absolute end-2 top-2 inline-flex size-8 items-center justify-center rounded-full transition-colors",
          isSaved ? "text-rose-500" : "text-muted-foreground/60 hover:bg-muted hover:text-foreground"
        )}
      >
        <Heart className={cn("size-[1.05rem] transition-transform active:scale-90", isSaved && "fill-current")} />
      </button>
    </article>
  );
}
