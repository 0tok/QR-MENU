"use client";

import Image from "next/image";
import { MapPin, MoreHorizontal } from "lucide-react";
import { safeHttpUrl } from "@/lib/utils";
import { useMenu } from "./menu-context";

export function MenuHeader({ onOpenMore }: { onOpenMore: () => void }) {
  const { menu, t, tx } = useMenu();
  const { organization } = menu;
  const mapsUrl = safeHttpUrl(menu.location.mapsUrl ?? menu.settings.location.mapsUrl);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {organization.logoUrl && (
            <Image
              src={organization.logoUrl}
              alt={t(organization.name)}
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-semibold leading-tight tracking-tight">
              {t(organization.name)}
            </p>
            {organization.tagline && (
              <p className="truncate text-[0.7rem] leading-tight text-muted-foreground">
                {t(organization.tagline)}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tx("more", "location", "Location")}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MapPin className="size-[1.05rem]" />
            </a>
          )}
          <button
            type="button"
            onClick={onOpenMore}
            aria-label={tx("more", "title", "More")}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-[1.15rem]" />
          </button>
        </div>
      </div>
    </header>
  );
}
