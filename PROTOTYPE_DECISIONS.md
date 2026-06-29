# Prototype decisions log

## 2026-06-29 — Initial HTML prototype

### Chosen approach

- Static site deployable to GitHub Pages (no build step)
- Mock data in `data/demo-restaurant.json`
- Entry URL: `demo-restaurant/v1/index.html` (+ `?table=3` query param)
- State: `localStorage` for saved items, currency, language, feedback drafts

### Why not React yet

User requested fastest prototype path with explicit note to rewrite in React once UX is validated. This avoids premature framework/architecture decisions while still modeling real data shapes for the future API.

### Data model highlights (backend-ready)

```text
restaurant { slug, venueId, social, location, currencies[], languages[] }
banners[] { layout, i18n fields, image }
categories[] { id, name, description, items[] }
items { id, name, description, priceGel, image, badges[] }
```

Prices stored in **GEL** as source of truth; USD computed via configured rate (later: API).

### TableQR patterns adopted

- Sticky horizontal category navigation with scroll-spy
- Section headings with short descriptions per category
- Bottom tab bar (Home / Saved / Feedback)
- Language selector prominent near top

### TableQR patterns deferred

- WhatsApp / call CTA bar (can add in v2)
- Multi-restaurant switcher (single mock venue for now)

### Known prototype limitations

1. No service worker / offline cache
2. No image optimization pipeline (hotlinked Unsplash URLs)
3. Save button inside product card uses nested click — stopPropagation handled in JS
4. Feedback stored locally only (console-visible in localStorage)
5. Social links are placeholders (`#` replaced from JSON if URLs set)
6. GitHub Pages uses `gh-pages` branch deploy — enable once in repo Settings → Pages

### Next steps after approval

1. User review on mobile viewport
2. Tune spacing/typography from feedback → update `DESIGN_NOTES.md`
3. Scaffold React/Next.js app with same JSON schema
4. Backend: restaurant config API + FX rates endpoint
