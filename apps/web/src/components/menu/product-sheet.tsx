"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { MenuProduct } from "@/lib/menu";
import { useMenu } from "./menu-context";

export function ProductSheet({
  product,
  onClose,
}: {
  product: MenuProduct | null;
  onClose: () => void;
}) {
  const { t, formatPrice, badgeLabel, saved, tx } = useMenu();
  const isSaved = product ? saved.has(product.id) : false;

  return (
    <Drawer open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="mx-auto max-w-[28rem]">
        {product && (
          <div className="overflow-y-auto">
            {product.imageUrl && (
              <div className="relative h-52 w-full shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={t(product.name)}
                  fill
                  sizes="(max-width: 448px) 100vw, 448px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            <div className="px-5 pb-7 pt-4">
              <DrawerHeader className="p-0 text-start md:text-start">
                <DrawerTitle className="text-xl font-bold tracking-tight">
                  {t(product.name)}
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                  {t(product.description)}
                </DrawerDescription>
              </DrawerHeader>

              {product.badges.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {product.badges.map((b) => (
                    <Badge
                      key={b}
                      variant="secondary"
                      className="text-[0.62rem] font-medium uppercase tracking-wide"
                    >
                      {badgeLabel(b)}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                {t(product.description)}
              </p>

              {product.fields.length > 0 && (
                <dl className="mt-4 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70">
                  {product.fields.map((f) => (
                    <div key={f.key} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
                      <dt className="text-[0.8rem] text-muted-foreground">{t(f.label)}</dt>
                      <dd className="text-end text-[0.85rem] font-medium">
                        {Array.isArray(f.value) ? f.value.join(", ") : String(f.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-5 flex items-center gap-3">
                <span className="text-2xl font-bold tracking-tight">
                  {formatPrice(product.priceGel)}
                </span>
                <Button
                  variant={isSaved ? "secondary" : "default"}
                  size="lg"
                  className="ms-auto h-11 px-5"
                  onClick={() => saved.toggle(product.id)}
                >
                  <Heart className={cn("size-4", isSaved && "fill-current text-rose-500")} />
                  {isSaved ? tx("nav", "saved", "Saved") : tx("product", "save", "Save")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
