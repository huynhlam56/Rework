# Rework - SDET Portfolio Project

A full-stack demo app built to showcase SDET/SWE skills: a real product to test, and a real
Playwright test-automation practice around it.

The app has two halves:

- **The marketplace** (`app/(marketplace)`) - Rewear, a used-clothing marketplace (browse/search
  listings, listing detail, cart & checkout, auth, seller listing management). This is the
  application under test.
- **The admin dashboard** (`app/admin`) - a full-stack test-orchestration dashboard that discovers
  registered Playwright tests via the CLI, triggers on-demand runs, and persists results to the
  database for historical reporting: pass-rate trends, flaky tests, per-run breakdowns, and
  per-test history.

## Getting started

```bash
cp .env.example .env   # fill in DATABASE_URL, TEST_INGEST_TOKEN, ADMIN_PASSWORD
npm install
npx prisma migrate dev # create the database schema
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Prisma + Postgres (Neon in production)
- Playwright for E2E tests (`tests/e2e`)
- Test runs are triggered on-demand via the CLI/dashboard and results are persisted to Postgres via `/api/ingest`

## Scripts

- `npm run dev` - start the dev server
- `npm run build` / `npm run start` - production build/serve
- `npm run lint` - ESLint
- `npm run format` / `npm run format:check` - Prettier

## Future Improvements

- Set up GitHub Actions CI to automatically run the Playwright suite on push/PR and feed results
  into the dashboard, instead of relying solely on manually triggered on-demand runs.
