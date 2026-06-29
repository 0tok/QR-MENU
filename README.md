# QR-MENU

Digital QR menu platform for restaurants — React/Next.js customer app with PostgreSQL.

## Quick start (development)

```bash
docker compose up -d postgres
cd apps/web && npm install
cp .env.example .env
npm run db:migrate && npm run db:seed
npm run dev
```

**Demo menu:** http://localhost:3000/demo-restaurant/v1?table=3

## Production (Docker)

```bash
docker compose up --build
# First run only — seed demo data:
docker compose exec web npx prisma db seed
```

App: http://localhost:3000  
Health: http://localhost:3000/api/health

## Docs

- [Web app](./apps/web/README.md)
- [Design notes](./DESIGN_NOTES.md)
- [Agent skills](./SKILLS.md)
