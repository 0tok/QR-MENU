"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMenu } from "./menu-context";

export function MenuBanners() {
  const { menu, t } = useMenu();
  if (!menu.banners.length) return null;

  return (
    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {menu.banners.map((banner) => (
        <article
          key={banner.slug}
          className="relative flex aspect-[2/1] w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border/60 sm:w-[20rem]"
        >
          <Image
            src={banner.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 85vw, 320px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className={cn("relative mt-auto w-full p-3.5 text-white")}>
            {banner.subheading && (
              <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white/80">
                {t(banner.subheading)}
              </p>
            )}
            <h2 className="text-[0.95rem] font-semibold leading-tight tracking-tight">
              {t(banner.heading)}
            </h2>
            {banner.text && (
              <p className="mt-0.5 line-clamp-2 text-[0.72rem] leading-snug text-white/85">
                {t(banner.text)}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
