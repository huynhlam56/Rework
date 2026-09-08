# Rewear - SDET Portfolio Project

A full-stack demo app built to showcase SDET/SWE skills: a real product to test, and a real
Playwright test-automation practice around it.

The app has two halves:

- **The marketplace** (`app/(marketplace)`) - Rewear, a used-clothing marketplace (browse/search
  listings, listing detail, cart & checkout, auth, seller listing management). This is the
  application under test.
- **The admin dashboard** (`app/admin`) - a password-gated view of live Playwright test metrics:
  pass-rate trends, flaky tests, per-run breakdowns, and per-test history. Data comes from a real
  GitHub Actions pipeline that runs the Playwright suite and POSTs results to `/api/ingest`, not
  from mock data.

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
- Playwright for E2E tests (`tests/e2e`, added in a later phase)
- GitHub Actions for CI, feeding real run data into the admin dashboard

## Scripts

- `npm run dev` - start the dev server
- `npm run build` / `npm run start` - production build/serve
- `npm run lint` - ESLint
- `npm run format` / `npm run format:check` - Prettier
