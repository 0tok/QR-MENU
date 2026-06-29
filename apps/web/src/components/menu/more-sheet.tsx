"use client";

import { Share2, Link2, MapPin, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { safeHttpUrl } from "@/lib/utils";
import { useMenu } from "./menu-context";

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tripadvisor: "TripAdvisor",
  tiktok: "TikTok",
};

export function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { menu, t, tx, showToast } = useMenu();
  const mapsUrl = safeHttpUrl(menu.location.mapsUrl ?? menu.settings.location.mapsUrl);
  const social = Object.entries(menu.organization.social ?? {})
    .map(([key, url]) => ({ key, url: safeHttpUrl(url) }))
    .filter((s): s is { key: string; url: string } => Boolean(s.url));

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: t(menu.organization.name), text: tx("share", "text"), url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast(tx("share", "copied", "Link copied"));
      }
    } catch {
      /* user cancelled */
    }
    onClose();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(tx("share", "copied", "Link copied"));
    } catch {
      showToast(window.location.href);
    }
    onClose();
  };

  const itemClass =
    "flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-7">
        <SheetHeader className="px-1">
          <SheetTitle className="text-base font-bold">{tx("more", "title", "More")}</SheetTitle>
        </SheetHeader>
        <div className="mt-2 flex flex-col gap-0.5">
          <button type="button" onClick={share} className={itemClass}>
            <Share2 className="size-[1.1rem] text-muted-foreground" />
            {tx("more", "share", "Share")}
          </button>
          <button type="button" onClick={copy} className={itemClass}>
            <Link2 className="size-[1.1rem] text-muted-foreground" />
            {tx("share", "copy", "Copy link")}
          </button>
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={itemClass}>
              <MapPin className="size-[1.1rem] text-muted-foreground" />
              {tx("more", "location", "Location")}
            </a>
          )}
          {social.map(({ key, url }) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={itemClass}>
              <Globe className="size-[1.1rem] text-muted-foreground" />
              {SOCIAL_LABELS[key] ?? key}
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
