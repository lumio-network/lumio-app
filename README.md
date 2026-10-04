# lumio-app

**The product surface.** The apps a cooperative actually uses: a member
[dashboard](apps/dashboard), an [admin](apps/admin) panel, and the [API](apps/api) that
will sit between them and the chain.

Part of [Lumio](https://github.com/lumio-network) — an open-source cooperative finance platform.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the workspace layout, SDK dependency model, current
scaffold status, and phased roadmap.

## Apps

| App              | Name                               | Stack                | Port | Responsibility                                      |
| ---------------- | ---------------------------------- | -------------------- | ---- | --------------------------------------------------- |
| `apps/dashboard` | `@lumio/dashboard`                 | Next.js (App Router) | 3001 | Member experience — contributions, treasury, votes. |
| `apps/admin`     | `@lumio/admin`                     | Next.js (App Router) | 3002 | Operator panel — members, cycles, payouts.          |
| `apps/api`       | [`@lumio/api`](apps/api/README.md) | NestJS               | 3000 | Backend — talks to contracts via `@lumio/sdk`.      |

> ⚠️ **Scaffold.** Every page is a placeholder rendered with the real design system. The API
> returns HTTP 501 with `not-implemented` summaries for `GET /v1/treasury`,
> `GET /v1/governance`, and `GET /v1/dividends`; `GET /health` remains unversioned. No auth, no
> database schema, no live contract calls yet — those are later phases.

## Requirements

- Node.js ≥ 20; the default is pinned to Node 20 in `.nvmrc` (`nvm use`), and CI also tests Node 22.
- pnpm 9.12 (`corepack enable` or `npm i -g pnpm@9.12.0`)
- A **sibling `lumio-sdk` checkout, built** (see below)

The root `.npmrc` enables strict engine checks, so package installs fail early if Node or pnpm does
not meet the declared `package.json` requirements.

## ⚠️ Getting started — read this first

This repo does **not** vendor `@lumio/ui`, `@lumio/sdk`, or `@lumio/shared`. It consumes them
through pnpm's `link:` protocol pointing at a **sibling `lumio-sdk` checkout**. pnpm workspaces
can't span repository roots, so the one hard prerequisite is:

**Check out `lumio-sdk` next to `lumio-app`, and build it first.**

```
lumio-network/
├── lumio-sdk/      # ← must exist and be built
└── lumio-app/      # ← this repo
```

```bash
# 1. Build the SDK packages the apps link against
cd ../lumio-sdk
pnpm install
pnpm build

# 2. Then install + run the apps
cd ../lumio-app
pnpm install
pnpm dev            # dashboard :3001, admin :3002, api :3000 (turbo runs all)
```

Individual apps:

```bash
pnpm --filter @lumio/dashboard dev
pnpm --filter @lumio/admin dev
pnpm --filter @lumio/api dev
```

Verify the API:

```bash
curl http://localhost:3000/health
# {"status":"ok","service":"lumio-api","time":"...","indicators":{"liveness":{"status":"up","details":"uptime: 123s"}}}
```

## Configuration

### Dashboard Environment Variables

- **`NEXT_PUBLIC_API_URL`** — Base URL for the dashboard's API health check. Defaults to `http://localhost:3000`.

### API Environment Variables

- **`CORS_ORIGINS`** — Comma-separated list of allowed CORS origins for the API. Defaults to `http://localhost:3001,http://localhost:3002` (dashboard and admin dev ports).
- **`PORT`** — API server port. Defaults to `3000`.
- **`RATE_LIMIT_TTL_MS`** — Rate-limit window in milliseconds. Defaults to `60000`.
- **`RATE_LIMIT_LIMIT`** — Maximum requests per client per window. Defaults to `100`. `GET /health` is exempt.

The API serves its OpenAPI document and Swagger UI at `/docs-json` and `/docs`. These routes are enabled in every environment and are unauthenticated. Helmet applies security headers globally; its Content-Security-Policy header is disabled only for `/docs` and its UI assets so Swagger's inline bootstrap can run. The API's CORS allowlist remains controlled by `CORS_ORIGINS`, so dashboard and admin origins do not need header relaxations. Frontend-specific CSP tuning is a follow-up.

### Prometheus Metrics

The API exposes process and HTTP request metrics at the unversioned `/metrics` endpoint. Add this scrape job to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: lumio-api
    metrics_path: /metrics
    static_configs:
      - targets: ["localhost:3000"]
```

## Scripts

```bash
pnpm build       # turbo: next build ×2 + tsc (api)
pnpm typecheck   # tsc --noEmit across apps
pnpm lint        # eslint .
pnpm format      # prettier --write .
```

## Frontend checks and bundle analysis

Run the dashboard render smoke tests with:

```bash
pnpm --filter @lumio/dashboard test
```

Generate a bundle analysis report for either app with:

```bash
ANALYZE=true pnpm --filter @lumio/dashboard build
ANALYZE=true pnpm --filter @lumio/admin build
```

## Design system

The apps import the finalized brand foundation from `@lumio/ui`:

- **Tokens** — `app/layout.tsx` imports `@lumio/ui/tokens/design-tokens.css` (the raw CSS
  variables) and wires the `next/font` families (Fraunces / IBM Plex Sans / IBM Plex Mono) into
  them.
- **Tailwind preset** — `tailwind.config.ts` extends `@lumio/ui/tailwind-preset`, so utilities
  like `bg-ink-950`, `text-lumen`, and `font-display` resolve to brand values.
- **Logo & favicon** — the real SVGs from the foundation kit are copied verbatim into each app's
  `public/brand/`; the nav renders `lumio-lockup-horizontal-on-dark.svg` and the tab uses
  `favicon.svg`. They are never redrawn.

## Docker

`docker-compose.yml` defines Postgres (works today: `docker compose up db`) and the API. The API
**image** build depends on `@lumio/sdk` being published to a registry (a later phase) because the
Docker build context can't reach the sibling `lumio-sdk` checkout — until then, run the API on the
host with `pnpm --filter @lumio/api dev`.

## Consuming the published SDK (once `@lumio/*` is on npm)

Today the apps link to a sibling `lumio-sdk` checkout via the `link:` protocol. Once the SDK
packages are published to npm, switch each app to versioned dependencies so a fresh clone (Vercel,
Docker, CI) installs them straight from the registry — no sibling checkout required.

In `apps/dashboard/package.json`, `apps/admin/package.json`, and `apps/api/package.json`, replace:

```jsonc
"@lumio/sdk": "link:../../../lumio-sdk/packages/sdk",
"@lumio/shared": "link:../../../lumio-sdk/packages/shared",
"@lumio/ui": "link:../../../lumio-sdk/packages/ui",
```

with the published versions (match whatever `lumio-sdk` released, e.g. `^0.1.0`):

```jsonc
"@lumio/sdk": "^0.1.0",
"@lumio/shared": "^0.1.0",
"@lumio/ui": "^0.1.0",
```

(`apps/api` does not depend on `@lumio/ui`; only swap the two it uses.) Then run `pnpm install` to
refresh the lockfile. After this, the sibling-checkout + build-SDK-first prerequisite above no
longer applies, and the API Docker image can build. See `lumio-sdk/PUBLISHING.md` for the release
side of this.

## License

[Apache-2.0](./LICENSE).
