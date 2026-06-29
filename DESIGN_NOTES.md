# Design notes

Living document for UX decisions and agent learnings.

## User preferences (confirmed)

| Topic | Preference |
|-------|------------|
| Visual style | shadcn-inspired light UI — clean borders, muted palette, no dark mode |
| Typography | Apple system fonts (`-apple-system`, SF Pro stack) |
| UX reference | [TableQR demo](https://demo.tableqr.co/) — sticky categories, mobile-native feel |
| Motion | Subtle micro-interactions; respect `prefers-reduced-motion` |
| Stack | **Next.js + PostgreSQL** (HTML prototype removed) |
| URL pattern | `/{restaurant-slug}/{venue-id}?table={n}` |

## Feature decisions (customer v1)

- **Saved items**: `localStorage` only — no accounts
- **Feedback**: single textarea → PostgreSQL via API
- **Currency**: GEL + USD; fixed rate until live FX API
- **Languages**: EN, KA, AR (Arabic enables RTL)
- **Share**: Web Share API + clipboard fallback
- **Product tap**: bottom sheet
- **Banners**: configurable left/right image layout
- **Theme**: DB tokens applied as CSS variables (primary, radius)

## Aesthetic direction

- Primary accent: teal `#0f766e` (theme-overridable per org)
- Cards: 1px border, light shadow, `0.75rem` radius
- Product image: ~20% width column on each row card

## Rejected / avoid

- Dark mode, fancy fonts, star ratings, heavy parallax/carousels

## Open questions (next iteration)

- Admin dashboard (products, categories, locations, branding)
- Shared table lists (`?table=3&join=hash`)
- Subdomain multi-tenant routing
- Live FX rates API

## Agent mistakes to avoid

- GEL is default currency, not USD
- Restaurant maps link only — not user GPS
- `IntersectionObserver` `rootMargin` must use `px`/`%`, not CSS `rem` variables
- Validate outbound URLs from DB before rendering in `<a href>`
