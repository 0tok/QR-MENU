# QR Menu — Web App

Production customer-facing menu (Next.js 16 + PostgreSQL + Prisma).

## Development

```bash
# From repo root
docker compose up -d postgres

cd apps/web
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

- Menu: http://localhost:3000/demo-restaurant/v1?table=3
- API: http://localhost:3000/api/menu/demo-restaurant/v1
- Health: http://localhost:3000/api/health

## Production build

**Important:** Use the webpack build (`npm run build`). Next.js 16 Turbopack builds can reference JS chunks that are missing on disk, which leaves you with static HTML and no interactivity.

```bash
npm run build
HOSTNAME=0.0.0.0 PORT=3000 npm run start
```

Or one command:

```bash
npm run preview
```

**Do not** expose `npm run dev` through Cloudflare tunnel — HMR/WebSocket fails through quick tunnels and the page will not hydrate reliably.

Or use Docker from repo root:

```bash
docker compose up --build
docker compose exec web npx prisma db seed   # first run
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (standalone) |
| `npm run start` | Start production server |
| `npm run db:migrate` | Dev migrations |
| `npm run db:migrate:deploy` | Production migrations |
| `npm run db:seed` | Seed demo Samani Kitchen data |
| `npm run db:reset` | Reset DB + reseed |

## Routes

| Path | Description |
|------|-------------|
| `/[slug]/[venue]` | Customer menu (`?table=3`) |
| `/api/menu/[slug]/[venue]` | Menu JSON (60s cache) |
| `/api/feedback` | POST guest feedback |
| `/api/health` | DB health check |

## Data

Seed loads from `/data/demo-restaurant.json`. Custom product fields (calories, prep time, allergens) are on select dishes.
