# QR-MENU

Digital QR menu platform for restaurants — customer-facing menu first, admin & backend later.

## Prototype (HTML)

Static mobile-first prototype with mock JSON data.

### Local preview

```bash
# From repo root — any static server works
npx serve .
# or: python3 -m http.server 8080
```

Open:

- [http://localhost:3000/demo-restaurant/v1/](http://localhost:3000/demo-restaurant/v1/)
- With table param: [http://localhost:3000/demo-restaurant/v1/?table=3](http://localhost:3000/demo-restaurant/v1/?table=3)

### GitHub Pages

After merge to `main`, the workflow deploys the static site.

Live URL pattern:

```text
https://<user>.github.io/QR-MENU/demo-restaurant/v1/?table=3
```

Future production URL pattern:

```text
https://domain.com/demo-restaurant/v1?table=3
```

## Project structure

```text
demo-restaurant/v1/   # Customer menu entry (venue v1)
assets/               # CSS, JS, images
data/                 # Mock restaurant JSON
DESIGN_NOTES.md       # Taste + preferences log
PROTOTYPE_DECISIONS.md
REACT_MIGRATION.md    # Plan to rewrite in React + shadcn
```

## Docs

- [Design notes](./DESIGN_NOTES.md)
- [Prototype decisions](./PROTOTYPE_DECISIONS.md)
- [React migration plan](./REACT_MIGRATION.md)
