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

The workflow pushes the static site to the **`gh-pages`** branch on every push to `main`.

#### One-time setup (required)

1. Open **https://github.com/0tok/QR-MENU/settings/pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: **`gh-pages`** / folder: **`/ (root)`**
4. Save

After the first successful workflow run, the site will be live at:

```text
https://0tok.github.io/QR-MENU/demo-restaurant/v1/?table=3
```

> **Note:** The official “GitHub Actions” Pages source must be enabled manually in Settings and does not auto-enable from workflows alone. This project uses the **`gh-pages` branch** method instead — it only needs the one-time branch selection above.

If deploy fails with permissions errors, go to **Settings → Actions → General → Workflow permissions** and enable **Read and write permissions**.

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
