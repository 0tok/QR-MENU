# React migration plan

> The current prototype is **HTML + CSS + JS** intentionally. Rewrite after UX sign-off.

## Target stack

- **Next.js** (App Router) or **Vite + React** — recommend Next.js for `/{slug}/{venue}` routing and SEO
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (already configured in repo on `cursor/shadcn-setup-c235` branch — merge before React work)
- **next-intl** or similar for i18n + RTL

## URL contract (preserve)

```text
https://domain.com/{restaurant-slug}/{venue-id}?table={number}

Example:
https://domain.com/demo-restaurant/v1?table=3
```

Next.js route: `app/[slug]/[venue]/page.tsx`

## Component map

| Prototype | React component |
|-----------|-----------------|
| `.header` | `<MenuHeader />` |
| `.selectors` | `<MenuSelectors />` |
| `.category-nav` | `<CategoryNav />` + scroll-spy hook |
| `.banner` | `<PromoBanner />` |
| `.product-card` | `<ProductCard />` |
| `.sheet` | shadcn `<Sheet />` |
| `.bottom-nav` | `<BottomNav />` |
| Saved view | `<SavedView />` |
| Feedback view | `<FeedbackForm />` |

## Data layer migration

1. Copy `data/demo-restaurant.json` → `types/menu.ts` + Zod schema
2. Replace `fetch(json)` with `getMenu(slug, venue)` server function
3. Keep `localStorage` adapters swappable for API-backed saved items later

## State to lift

- `useMenuPreferences()` — currency, language (persisted)
- `useSavedItems(slug)` — local → API later
- `useTableParam()` — read `?table=` from searchParams

## shadcn components to install

```bash
npx shadcn@latest add sheet button badge select tabs separator scroll-area
```

Use shadcn skill + MCP for registry search during implementation.

## GitHub Pages → production

Prototype uses static GitHub Pages. React version will deploy to Vercel/Cloudflare with custom domain and API routes for FX rates + feedback submission.

## Checklist before starting React rewrite

- [ ] Stakeholder approves prototype UX on real phone
- [ ] `DESIGN_NOTES.md` updated with final taste decisions
- [ ] Merge shadcn MCP/skills branch to main
- [ ] API contract drafted for menu + rates endpoints
