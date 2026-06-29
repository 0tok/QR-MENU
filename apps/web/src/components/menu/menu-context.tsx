"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import type { MenuPayload, MenuProduct } from "@/lib/menu";
import { formatPrice as formatPriceRaw } from "@/lib/format";
import { isRtlLanguage, t as translate, type I18nMap } from "@/lib/utils";
import { usePersistedValue } from "@/hooks/use-local-storage";
import { useSavedItems } from "@/hooks/use-saved-items";

type UiLabels = Record<string, Record<string, I18nMap>>;

type MenuContextValue = {
  menu: MenuPayload;
  tableNumber?: string;

  lang: string;
  currency: string;
  rtl: boolean;
  setLang: (lang: string) => void;
  setCurrency: (currency: string) => void;

  /** Translate an i18n map into the active language. */
  t: (map: I18nMap | null | undefined, fallback?: string) => string;
  /** Translate a UI label by section + key, e.g. tx("nav", "home"). */
  tx: (section: string, key: string, fallback?: string) => string;
  /** Human label for a product badge key. */
  badgeLabel: (key: string) => string;
  /** Format a base-GEL price in the active currency. */
  formatPrice: (priceGel: number) => string;

  saved: {
    count: number;
    has: (id: string) => boolean;
    toggle: (id: string) => void;
    products: MenuProduct[];
  };

  showToast: (text: string) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within <MenuProvider>");
  return ctx;
}

export function MenuProvider({
  menu,
  tableNumber,
  children,
}: {
  menu: MenuPayload;
  tableNumber?: string;
  children: ReactNode;
}) {
  const prefsKey = `qr-menu:${menu.organization.slug}:${menu.location.slug}`;

  const [lang, setLang] = usePersistedValue(`${prefsKey}:lang`, menu.settings.defaultLanguage);
  const [currency, setCurrency] = usePersistedValue(
    `${prefsKey}:currency`,
    menu.settings.defaultCurrency
  );

  const savedItems = useSavedItems(`${prefsKey}:saved`);

  const ui = menu.ui as UiLabels;
  const rtl = isRtlLanguage(lang, menu.settings.languages);

  const value = useMemo<MenuContextValue>(() => {
    const t = (map: I18nMap | null | undefined, fallback = "") => translate(map, lang, fallback);

    const savedProducts = menu.categories
      .flatMap((c) => c.products)
      .filter((p) => savedItems.has(p.id));

    return {
      menu,
      tableNumber,
      lang,
      currency,
      rtl,
      setLang,
      setCurrency,
      t,
      tx: (section, key, fallback) => t(ui[section]?.[key], fallback),
      badgeLabel: (key) => t(menu.badgeLabels[key], key),
      formatPrice: (priceGel) => formatPriceRaw(priceGel, currency, menu.settings),
      saved: {
        count: savedItems.count,
        has: savedItems.has,
        toggle: savedItems.toggle,
        products: savedProducts,
      },
      showToast: (text: string) => toast(text),
    };
  }, [menu, tableNumber, lang, currency, rtl, setLang, setCurrency, ui, savedItems]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}
