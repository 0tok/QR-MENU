# Design notes

Living document for user taste, UX decisions, and agent learnings during the HTML prototype phase.

## User preferences (confirmed)

| Topic | Preference |
|-------|------------|
| Visual style | shadcn-inspired light UI — clean borders, muted palette, no dark mode |
| Typography | Apple system fonts (`-apple-system`, SF Pro stack) — no decorative/fancy fonts |
| UX reference | [TableQR demo](https://demo.tableqr.co/) — sticky categories, clear sections, mobile-native feel |
| Motion | Subtle micro-interactions only (save heart pop, sheet slide) — respect `prefers-reduced-motion` |
| Prototype stack | Plain HTML / CSS / JS — **rewrite in React later** |
| Hosting | GitHub Pages |
| URL pattern | `/{restaurant-slug}/{venue-id}?table={n}` e.g. `/demo-restaurant/v1?table=3` |

## Feature decisions (prototype v1)

- **Saved items**: `localStorage` only — no accounts
- **Feedback**: single textarea — no star ratings
- **Currency**: GEL + USD; fixed rate **2.64** (₾1 = $0.3788) until API provides live rates
- **Languages**: EN, KA, AR (Arabic enables RTL on `<html dir="rtl">`)
- **Location**: static restaurant maps link — not user's GPS position
- **Share**: native Web Share API with clipboard fallback
- **Product tap**: bottom sheet (mobile app pattern)
- **Banners**: multiple, configurable left/right image layout
- **Badges**: popular, vegetarian, vegan, gluten-free, spicy, new, chef-choice

## Aesthetic direction

- Primary accent: teal `#0f766e` (shadcn-compatible, warm-premium without being generic purple-gradient AI slop)
- Cards: 1px border `#e4e4e7`, light shadow, `0.75rem` radius
- Density: comfortable — not cramped like a spreadsheet, not oversized like a marketing landing page
- Product image: ~20% width column on the left of each row card

## Rejected / avoid

- Dark mode
- Display/serif “fancy” fonts
- Star rating on feedback (user explicitly said text only)
- Heavy parallax, carousels, or auto-playing media
- Generic Inter-only bootstrap look without structure

## Open questions for next iteration

- [ ] Custom domain + path routing at scale (many restaurants)
- [ ] Additional RTL languages beyond Arabic
- [ ] Admin preview vs customer theme tokens
- [ ] Product variants (sizes, add-ons) in sheet UI

## Agent mistakes to avoid

_(Add entries as we iterate)_

- Don't assume USD is default — GEL is default for this demo restaurant
- Don't use user geolocation for “location” — restaurant address only
- Don't add star ratings to feedback
- When migrating to React, preserve URL contract: `/{slug}/{venue}?table=`
