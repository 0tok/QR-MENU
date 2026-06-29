"use client";

import { Home, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMenu } from "./menu-context";

export type MenuView = "home" | "saved" | "feedback";

const TABS: { id: MenuView; icon: typeof Home }[] = [
  { id: "home", icon: Home },
  { id: "saved", icon: Heart },
  { id: "feedback", icon: MessageSquare },
];

export function BottomNav({
  view,
  onChange,
}: {
  view: MenuView;
  onChange: (view: MenuView) => void;
}) {
  const { tx, saved } = useMenu();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[28rem] border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
      <div className="grid grid-cols-3">
        {TABS.map(({ id, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2.5 text-[0.65rem] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative">
                <Icon className={cn("size-[1.3rem] transition-transform", active && "scale-105")} />
                {id === "saved" && saved.count > 0 && (
                  <span className="absolute -end-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">
                    {saved.count > 9 ? "9+" : saved.count}
                  </span>
                )}
              </span>
              {tx("nav", id, id)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
