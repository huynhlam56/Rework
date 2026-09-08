# Future: moving test execution off the Next.js app

## Where things stand today

The admin dashboard's "Run tests" button calls `triggerLocalTestRun()`
(`src/lib/services/test-runs.ts`), which spawns `playwright test --reporter=json`
as a child process of the Next.js server itself, waits for it to exit, parses the
JSON report, and writes `TestRun`/`TestResult` rows directly.

That only works because `next dev` (and a self-hosted `next start`) is a
persistent, long-lived Node process with a real filesystem. It will not work once
this app is deployed to Vercel: serverless functions have no persistent
filesystem for Playwright's browser binaries, no long-running child processes,
and hard execution time limits far shorter than a full test suite. Local exec is
a dev-time convenience, not a production design.

## Target architecture

Pull execution into a separate, always-running service instead of the request/
response cycle of the main app:

```
Admin dashboard (Next.js, Vercel)
        │  POST /run-tests  (bearer token)
        ▼
Test Runner Service (Node/Express, Docker image w/ Playwright + browsers baked in)
        │  runs on ECS Fargate, one task per invocation or a small warm pool
        │
        │  on completion: POST /api/ingest  (same contract CI will use)
        ▼
Next.js app's ingest endpoint → writes TestRun/TestResult to Postgres
```

The key insight: **this becomes the same shape as the CI pipeline**, not a new
one. Whether a run was kicked off manually from the admin UI, by a GitHub Actions
push, or on a schedule, the runner (wherever it executes) reports results back to
one shared `/api/ingest` endpoint using one shared contract. Local exec is the
odd one out today because it writes to Postgres directly and synchronously -
everything else converges on "trigger, then report back async."

## API contract

**Admin app → runner service**

```
POST https://runner.internal/run-tests
Authorization: Bearer <RUNNER_SERVICE_TOKEN>

{ "runId": "<TestRun id created ahead of time, status QUEUED>" }
```

The admin app creates the `TestRun` row itself (status `QUEUED`) before calling
the runner, so the dashboard has something to show immediately instead of
waiting on the whole suite synchronously.

**Runner service → admin app**, once the suite finishes:

```
POST https://rewear.vercel.app/api/ingest
Authorization: Bearer <TEST_INGEST_TOKEN>

{ "runId": "...", "status": "PASSED" | "FAILED" | "ERRORED", "results": [...] }
```

This is the same endpoint and payload shape the future GitHub Actions workflow
will use (see the original project plan, Phase 3/4) - one ingestion path for
every trigger source.

## What actually changes in the code

- `triggerLocalTestRun()` gets replaced by `triggerRemoteTestRun()`: create the
  `TestRun` row (`QUEUED`), `fetch()` the runner's `/run-tests` with the run id,
  return immediately. No more spawning a child process from the Next.js server.
- `/api/ingest` (not yet built) becomes real and shared: it's what both the
  runner service and, later, GitHub Actions POST to.
- The admin UI doesn't change - it already renders whatever status a `TestRun`
  is in (`QUEUED` and `RUNNING` states exist in the schema today for exactly
  this reason), it just starts seeing runs move through those states over
  seconds/minutes instead of resolving synchronously.
- The runner service is a new, small, separate codebase: an HTTP server with one
  route, Playwright + Chromium installed in its Docker image, given
  `DATABASE_URL`/`TEST_INGEST_TOKEN` are not needed there - it only needs the
  target app's URL and the ingest token.

## Infra sketch (not built yet)

- **Image**: `mcr.microsoft.com/playwright:v1.<x>-noble` (or similar) as a base,
  `npx playwright test` as the entrypoint, code checked out or baked into the
  image at build time.
- **Compute**: ECS Fargate task definition, triggered per run (`RunTask` API)
  rather than a long-lived service, so there's no idle cost between runs.
- **Auth**: a shared bearer token (`RUNNER_SERVICE_TOKEN`) in both the admin
  app's and the runner's environment - no need for anything heavier at this
  scale.
- **Networking**: the runner only needs outbound access to the deployed app and
  to GitHub (to pull the latest test code) - no inbound listener is required if
  the admin app invokes ECS's `RunTask` API directly instead of hitting an
  HTTP endpoint on the container.

## When to do this

Not urgent - local exec is genuinely fine for a portfolio project run from a
laptop. This becomes necessary the moment the app is deployed anywhere
serverless (Vercel) and "Run tests" needs to keep working from that deployed
admin dashboard, not just from `next dev`.
