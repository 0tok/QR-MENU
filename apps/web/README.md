# QR Menu — Web App

Next.js customer-facing menu with PostgreSQL + Prisma.

## Quick start

```bash
# From repo root — start Postgres (or use local install)
docker compose up -d

cd apps/web
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open:

- http://localhost:3000/demo-restaurant/v1?table=3
- API: http://localhost:3000/api/menu/demo-restaurant/v1

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed mock Samani Kitchen data |
| `npm run db:reset` | Reset DB + reseed |

## Routes

| Path | Description |
|------|-------------|
| `/[slug]/[venue]` | Customer menu |
| `/api/menu/[slug]/[venue]` | Menu JSON API |
| `/api/feedback` | POST guest feedback |

## Data

Seed loads from `/data/demo-restaurant.json` into PostgreSQL.

Custom product fields (calories, prep time, allergens) are seeded on select dishes.
