"use client";

import { Heart } from "lucide-react";
import type { MenuProduct } from "@/lib/menu";
import { useMenu } from "./menu-context";
import { ProductCard } from "./product-card";

export function SavedView({ onOpenProduct }: { onOpenProduct: (product: MenuProduct) => void }) {
  const { saved, tx } = useMenu();

  return (
    <div className="px-4 py-5">
      <h1 className="mb-4 text-xl font-bold tracking-tight">{tx("saved", "title", "Saved")}</h1>
      {saved.products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Heart className="size-5 text-muted-foreground" />
          </span>
          <p className="max-w-[16rem] text-sm text-muted-foreground">
            {tx("saved", "empty", "Tap the heart on any dish to save it for later.")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {saved.products.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
