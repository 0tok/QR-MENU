"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useMenu } from "./menu-context";

export function MenuBanners() {
  const { menu, t } = useMenu();
  if (!menu.banners.length) return null;

  return (
    <div className="px-4 py-3">
      <Carousel opts={{ align: "start", loop: menu.banners.length > 1 }}>
        <CarouselContent className="-ml-3">
          {menu.banners.map((banner) => (
            <CarouselItem key={banner.slug} className="basis-[88%] pl-3 sm:basis-[20rem]">
              <article className="relative flex aspect-[2/1] w-full overflow-hidden rounded-2xl border border-border/60">
                <Image
                  src={banner.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 88vw, 320px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="relative mt-auto w-full p-3.5 text-white">
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
