"use client";

import { MapPin, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { safeHttpUrl } from "@/lib/utils";
import { useMenu } from "./menu-context";

export function MenuHeader({ onOpenMore }: { onOpenMore: () => void }) {
  const { menu, t, tx } = useMenu();
  const { organization } = menu;
  const name = t(organization.name);
  const mapsUrl = safeHttpUrl(menu.location.mapsUrl ?? menu.settings.location.mapsUrl);
  const initials = name.slice(0, 2).toUpperCase();

  const iconButton =
    "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar className="size-9 rounded-lg">
            {organization.logoUrl && (
              <AvatarImage src={organization.logoUrl} alt={name} className="rounded-lg" />
            )}
            <AvatarFallback className="rounded-lg text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-semibold leading-tight tracking-tight">{name}</p>
            {organization.tagline && (
              <p className="truncate text-[0.7rem] leading-tight text-muted-foreground">
                {t(organization.tagline)}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {mapsUrl && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tx("more", "location", "Location")}
                    className={iconButton}
                  />
                }
              >
                <MapPin className="size-[1.05rem]" />
              </TooltipTrigger>
              <TooltipContent>{tx("more", "location", "Location")}</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={onOpenMore}
                  aria-label={tx("more", "title", "More")}
                  className={iconButton}
                />
              }
            >
              <MoreHorizontal className="size-[1.15rem]" />
            </TooltipTrigger>
            <TooltipContent>{tx("more", "title", "More")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
