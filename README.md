# QR-MENU

Digital QR menu platform for restaurants.

## Customer app (Next.js + PostgreSQL)

```bash
docker compose up -d          # Postgres
cd apps/web && npm install
cp .env.example .env
npm run db:migrate && npm run db:seed
npm run dev
```

**Demo menu:** http://localhost:3000/demo-restaurant/v1?table=3

See [apps/web/README.md](./apps/web/README.md) for full docs.

## HTML prototype (legacy)

Static prototype at `demo-restaurant/v1/` for GitHub Pages — superseded by the Next.js app for active development.

## Docs

- [Web app](./apps/web/README.md)
- [Design notes](./DESIGN_NOTES.md)
- [Agent skills](./SKILLS.md)
