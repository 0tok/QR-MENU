"use client";

import type { MenuPayload, MenuProduct } from "@/lib/menu";
import { isSectionEnabled, themeStyle } from "@/lib/theme";
import { cn, isRtlLanguage, t, type I18nMap } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Heart,
  Home,
  Link2,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type View = "home" | "saved" | "feedback";

type Props = {
  menu: MenuPayload;
  tableNumber?: string;
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tripadvisor: "TripAdvisor",
  tiktok: "TikTok",
};

function formatPrice(priceGel: number, currencyCode: string, menu: MenuPayload) {
  const currency = menu.settings.currencies.find((c) => c.code === currencyCode);
  const value = priceGel * (currency?.rate ?? 1);
  const symbol = currency?.symbol ?? "";
  return currencyCode === "GEL" ? `${symbol}${value.toFixed(0)}` : `${symbol}${value.toFixed(2)}`;
}

function usePersistedSet(key: string) {
  const [items, setItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        localStorage.setItem(key, JSON.stringify([...next]));
        return next;
      });
    },
    [key]
  );

  return { items, toggle, has: (id: string) => items.has(id) };
}

export function MenuApp({ menu, tableNumber }: Props) {
  const storageKey = `qr-menu:saved:${menu.organization.slug}:${menu.location.slug}`;
  const { items: savedIds, toggle: toggleSaved, has: isSaved } = usePersistedSet(storageKey);

  const [lang, setLang] = useState(menu.settings.defaultLanguage);
  const [currency, setCurrency] = useState(menu.settings.defaultCurrency);
  const [view, setView] = useState<View>("home");
  const [activeCategory, setActiveCategory] = useState(menu.categories[0]?.slug ?? "");
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [toast, setToast] = useState("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const rtl = isRtlLanguage(lang, menu.settings.languages);
  // Use venue-level mapsUrl first, fall back to org-level settings
  const mapsUrl = menu.location.mapsUrl ?? menu.settings.location.mapsUrl;
  const themeSections = menu.theme?.sections;

  const showHeader = isSectionEnabled(themeSections, "header");
  const showSelectors = isSectionEnabled(themeSections, "selectors");
  const showBanners = isSectionEnabled(themeSections, "banners");
  const showCategoryNav = isSectionEnabled(themeSections, "category-nav");
  const showProductGrid = isSectionEnabled(themeSections, "product-grid");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(`${storageKey}:lang`);
      const savedCurrency = localStorage.getItem(`${storageKey}:currency`);
      if (savedLang) setLang(savedLang);
      if (savedCurrency) setCurrency(savedCurrency);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // Auto-dismiss toast after 2.2 s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const ui = menu.ui as Record<string, Record<string, I18nMap>>;
  const savedProducts = useMemo(
    () => menu.categories.flatMap((c) => c.products).filter((p) => savedIds.has(p.id)),
    [menu.categories, savedIds]
  );

  const scrollToCategory = (slug: string) => {
    sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll-spy: highlight category nav pill matching the visible section
  useEffect(() => {
    if (view !== "home") return;

    const categorySections = menu.categories
      .map((c) => sectionRefs.current[c.slug])
      .filter(Boolean) as HTMLElement[];
    if (!categorySections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveCategory(visible.target.id.replace("category-", ""));
        }
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    categorySections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [menu.categories, view]);

  // Share via Web Share API; fall back to clipboard
  const shareMenu = async () => {
    const url = window.location.href;
    const shareUi = ui.share;
    try {
      if (navigator.share) {
        await navigator.share({
          title: t(menu.organization.name, lang),
          text: t(shareUi?.text, lang),
          url,
        });
        setMoreOpen(false);
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(t(shareUi?.copied, lang, "Link copied"));
    } catch {
      /* user cancelled */
    }
    setMoreOpen(false);
  };

  // Copy link — separate from share so both actions are always visible
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast(t(ui.share?.copied, lang, "Link copied"));
    } catch {
      setToast(window.location.href);
    }
    setMoreOpen(false);
  };

  const submitFeedback = async () => {
    const text = feedback.trim();
    if (!text || feedbackLoading) return;

    setFeedbackLoading(true);
    setFeedbackError(false);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgSlug: menu.organization.slug,
          locationSlug: menu.location.slug,
          text,
          tableNumber,
        }),
      });

      if (res.ok) {
        setFeedback("");
        setToast(t(ui.feedback?.success, lang, "Feedback sent!"));
        setView("home");
      } else {
        setFeedbackError(true);
      }
    } catch {
      setFeedbackError(true);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const badgeLabel = (key: string) => t(menu.badgeLabels[key], lang, key);
  const saveLabel = (saved: boolean) =>
    saved ? t(ui.nav?.saved, lang, "Saved") : t(ui.product?.save, lang, "Save");

  return (
    // Apply theme tokens (primary color, border-radius) as CSS custom properties
    <div style={themeStyle(menu.theme?.tokens)} className="pb-20">
      {showHeader && (
        <header className="sticky top-0 z-40 flex h-13 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src={menu.organization.logoUrl ?? "/logo.svg"}
              alt={t(menu.organization.name, lang)}
              width={32}
              height={32}
              className="shrink-0"
            />
            <div className="min-w-0">
              <span className="block truncate text-[0.9375rem] font-semibold tracking-tight">
                {t(menu.organization.name, lang)}
              </span>
              {menu.organization.tagline && (
                <span className="block truncate text-[0.6875rem] text-muted-foreground">
                  {t(menu.organization.tagline, lang)}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            {Object.entries(menu.organization.social ?? {}).map(([key, url]) =>
              url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
                  aria-label={SOCIAL_LABELS[key] ?? key}
                >
                  <Link2 className="size-4.5" />
                </a>
              ) : null
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
                aria-label={t(ui.more?.location, lang, "Location")}
              >
                <MapPin className="size-4.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
              aria-label={t(ui.more?.title, lang, "More")}
            >
              <MoreHorizontal className="size-4.5" />
            </button>
          </div>
        </header>
      )}

      {showSelectors && (
        <>
          <div className="flex h-11 items-center justify-between gap-2 border-b px-4">
            <Select
              value={currency}
              onValueChange={(v) => {
                if (!v) return;
                setCurrency(v);
                localStorage.setItem(`${storageKey}:currency`, v);
              }}
            >
              <SelectTrigger className="h-8 w-auto gap-1 border-0 bg-muted px-2.5 text-xs font-medium shadow-none">
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
              <Badge variant="secondary" className="text-xs font-medium">
                {t(ui.table?.label, lang, "Table")} {tableNumber}
              </Badge>
            )}

            <Select
              value={lang}
              onValueChange={(v) => {
                if (!v) return;
                setLang(v);
                localStorage.setItem(`${storageKey}:lang`, v);
              }}
            >
              <SelectTrigger className="h-8 w-auto gap-1 border-0 bg-muted px-2.5 text-xs font-medium shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {menu.settings.languages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currency !== "GEL" && menu.settings.fxNote && (
            <p className="border-b px-4 py-1.5 text-center text-[0.625rem] text-muted-foreground">
              {t(menu.settings.fxNote, lang)}
            </p>
          )}
        </>
      )}

      {view === "home" && (
        <>
          {showCategoryNav && (
            <nav
              className={cn(
                "sticky z-30 border-b bg-background/95 backdrop-blur-md",
                showHeader ? "top-13" : "top-0"
              )}
            >
              <div className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none]">
                {menu.categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => scrollToCategory(cat.slug)}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      activeCategory === cat.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {t(cat.name, lang)}
                  </button>
                ))}
              </div>
            </nav>
          )}

          {showBanners && menu.banners.length > 0 && (
            <div className="space-y-3 p-4">
              {menu.banners.map((banner) => (
                <article
                  key={banner.slug}
                  className={cn(
                    "grid gap-3.5 overflow-hidden rounded-xl border bg-card p-3.5 shadow-sm",
                    banner.layout === "image-right" ? "grid-cols-[1fr_7.5rem]" : "grid-cols-[7.5rem_1fr]"
                  )}
                >
                  <div
                    className={cn(
                      "relative h-22 overflow-hidden rounded-lg",
                      banner.layout === "image-right" && "order-2"
                    )}
                  >
                    <Image src={banner.imageUrl} alt="" fill className="object-cover" sizes="120px" />
                  </div>
                  <div className={banner.layout === "image-right" ? "order-1" : ""}>
                    {banner.subheading && (
                      <p className="mb-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-primary">
                        {t(banner.subheading, lang)}
                      </p>
                    )}
                    <h2 className="text-base font-semibold tracking-tight">{t(banner.heading, lang)}</h2>
                    {banner.text && (
                      <p className="mt-1 text-xs leading-snug text-muted-foreground">{t(banner.text, lang)}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {showProductGrid &&
            menu.categories.map((cat) => (
              <section
                key={cat.slug}
                id={`category-${cat.slug}`}
                ref={(el) => {
                  sectionRefs.current[cat.slug] = el;
                }}
                className="scroll-mt-28 px-4 pb-4"
              >
                <div className="mb-3">
                  <h2 className="text-lg font-semibold tracking-tight">{t(cat.name, lang)}</h2>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground">{t(cat.description, lang)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  {cat.products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      lang={lang}
                      saved={isSaved(product.id)}
                      unavailable={product.availability === "UNAVAILABLE"}
                      price={formatPrice(product.priceGel, currency, menu)}
                      badgeLabel={badgeLabel}
                      saveLabel={saveLabel(isSaved(product.id))}
                      onOpen={() => setSelectedProduct(product)}
                      onToggleSave={() => toggleSaved(product.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
        </>
      )}

      {view === "saved" && (
        <div className="p-4">
          <h1 className="mb-4 text-xl font-semibold">{t(ui.saved?.title, lang, "Saved")}</h1>
          {savedProducts.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-muted p-8 text-center text-sm text-muted-foreground">
              {t(ui.saved?.empty, lang)}
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {savedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  lang={lang}
                  saved
                  unavailable={product.availability === "UNAVAILABLE"}
                  price={formatPrice(product.priceGel, currency, menu)}
                  badgeLabel={badgeLabel}
                  saveLabel={saveLabel(true)}
                  onOpen={() => setSelectedProduct(product)}
                  onToggleSave={() => toggleSaved(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === "feedback" && (
        <div className="p-4">
          <h1 className="mb-4 text-xl font-semibold">{t(ui.feedback?.title, lang, "Feedback")}</h1>
          <div className="flex flex-col gap-3">
            <textarea
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setFeedbackError(false);
              }}
              placeholder={t(ui.feedback?.placeholder, lang)}
              className="min-h-36 w-full rounded-xl border bg-background p-3 text-sm outline-none ring-primary focus:ring-2"
              maxLength={1000}
              disabled={feedbackLoading}
            />
            {feedbackError && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {t(ui.feedback?.error, lang, "Could not send feedback. Please try again.")}
              </p>
            )}
            <Button
              onClick={submitFeedback}
              disabled={!feedback.trim() || feedbackLoading}
              className="h-11"
            >
              {feedbackLoading
                ? t(ui.feedback?.sending, lang, "Sending…")
                : t(ui.feedback?.submit, lang, "Send")}
            </Button>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto grid max-w-[430px] grid-cols-3 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        {(["home", "saved", "feedback"] as const).map((tab) => {
          const icons = { home: Home, saved: Heart, feedback: MessageSquare };
          const Icon = icons[tab];
          const labels = ui.nav;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-2 text-[0.6875rem] font-medium",
                view === tab ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {t(labels?.[tab], lang, tab)}
              {tab === "saved" && savedIds.size > 0 && (
                <span className="absolute top-1 ms-5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.625rem] font-bold text-primary-foreground">
                  {savedIds.size > 9 ? "9+" : savedIds.size}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Product detail sheet */}
      <Sheet open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <SheetContent side="bottom" className="max-h-[88dvh] rounded-t-2xl px-4 pb-8">
          {selectedProduct && (
            <>
              <SheetHeader className="px-0">
                <SheetTitle>{t(selectedProduct.name, lang)}</SheetTitle>
              </SheetHeader>
              {selectedProduct.imageUrl && (
                <div className="relative mt-3 h-44 w-full overflow-hidden rounded-xl">
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={t(selectedProduct.name, lang)}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedProduct.badges.map((b) => (
                  <Badge key={b} variant="secondary" className="text-[0.625rem] uppercase">
                    {badgeLabel(b)}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(selectedProduct.description, lang)}
              </p>
              {selectedProduct.fields.length > 0 && (
                <dl className="mt-4 space-y-2 rounded-xl bg-muted/50 p-3 text-sm">
                  {selectedProduct.fields.map((f) => (
                    <div key={f.key} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{t(f.label, lang)}</dt>
                      <dd className="font-medium text-end">
                        {Array.isArray(f.value) ? f.value.join(", ") : String(f.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="mt-4 text-lg font-semibold">
                {formatPrice(selectedProduct.priceGel, currency, menu)}
              </p>
              <Button
                className="mt-4 h-11 w-full"
                variant={isSaved(selectedProduct.id) ? "secondary" : "default"}
                onClick={() => toggleSaved(selectedProduct.id)}
              >
                <Heart className={cn("me-2 size-4", isSaved(selectedProduct.id) && "fill-current")} />
                {saveLabel(isSaved(selectedProduct.id))}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* More options sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle>{t(ui.more?.title, lang, "More")}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-1">
            {/* Share via native share sheet (device share) */}
            <Button variant="ghost" className="h-12 justify-start gap-3" onClick={shareMenu}>
              <Share2 className="size-4.5 text-muted-foreground" />
              {t(ui.more?.share, lang, "Share")}
            </Button>
            {/* Copy link to clipboard — distinct from share */}
            <Button variant="ghost" className="h-12 justify-start gap-3" onClick={copyLink}>
              <Link2 className="size-4.5 text-muted-foreground" />
              {t(ui.share?.copy, lang, "Copy link")}
            </Button>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-md px-3 text-sm hover:bg-muted"
              >
                <MapPin className="size-4.5 text-muted-foreground" />
                {t(ui.more?.location, lang, "Location")}
              </a>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Toast — auto-dismissed after 2.2 s */}
      {toast && (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-[400px] rounded-xl border bg-background p-3 text-center text-sm font-medium shadow-md">
          {toast}
        </div>
      )}
    </div>
  );
}

/**
 * Product card with independent save (heart) button.
 *
 * Layout: flex row — [main button: image + text] [heart button]
 * The heart button is a sibling of the main button, never nested inside it,
 * which keeps the DOM valid and prevents event conflicts.
 */
function ProductRow({
  product,
  lang,
  saved,
  unavailable,
  price,
  badgeLabel,
  saveLabel,
  onOpen,
  onToggleSave,
}: {
  product: MenuProduct;
  lang: string;
  saved: boolean;
  unavailable: boolean;
  price: string;
  badgeLabel: (key: string) => string;
  saveLabel: string;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  return (
    <article
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-card p-2.5 shadow-sm transition-shadow",
        unavailable && "opacity-50",
        !unavailable && "hover:shadow-md"
      )}
    >
      {/* Main tap area: image + text. Opens product detail sheet. */}
      <button
        type="button"
        onClick={onOpen}
        disabled={unavailable}
        aria-label={t(product.name, lang)}
        className="flex min-w-0 flex-1 items-start gap-3 text-start"
      >
        <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={t(product.name, lang)}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.9375rem] font-semibold leading-snug tracking-tight">
            {t(product.name, lang)}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {t(product.description, lang)}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold">{price}</span>
            {product.badges.map((b) => (
              <Badge key={b} variant="secondary" className="px-1.5 py-0 text-[0.625rem] uppercase">
                {badgeLabel(b)}
              </Badge>
            ))}
          </div>
        </div>
      </button>

      {/* Heart save button — sibling of the main button, never nested inside it */}
      <button
        type="button"
        onClick={onToggleSave}
        aria-label={saveLabel}
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted",
          saved && "text-rose-600"
        )}
      >
        <Heart className={cn("size-4.5", saved && "fill-current")} />
      </button>
    </article>
  );
}
