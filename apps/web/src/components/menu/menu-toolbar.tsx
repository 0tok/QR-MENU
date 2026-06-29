"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Coins } from "lucide-react";
import { useMenu } from "./menu-context";

export function MenuToolbar() {
  const { menu, lang, currency, setLang, setCurrency, tableNumber, t, tx } = useMenu();

  return (
    <div className="sticky top-14 z-30 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="flex h-12 items-center justify-between gap-2 px-4">
        <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
          <SelectTrigger
            aria-label="Currency"
            className="h-8 w-auto gap-1.5 rounded-full border-0 bg-muted px-3 text-xs font-medium shadow-none hover:bg-muted/70"
          >
            <Coins className="size-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {menu.settings.currencies.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} {c.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {tableNumber && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {tx("table", "label", "Table")} {tableNumber}
          </span>
        )}

        <Select value={lang} onValueChange={(v) => v && setLang(v)}>
          <SelectTrigger
            aria-label="Language"
            className="h-8 w-auto gap-1.5 rounded-full border-0 bg-muted px-3 text-xs font-medium shadow-none hover:bg-muted/70"
          >
            <Languages className="size-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {menu.settings.languages.map((l) => (
              <SelectItem key={l.code} value={l.code}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currency !== "GEL" && menu.settings.fxNote && (
        <p className="border-t border-border/50 bg-muted/30 px-4 py-1 text-center text-[0.65rem] text-muted-foreground">
          {t(menu.settings.fxNote)}
        </p>
      )}
    </div>
  );
}
