# lumio-app

**The product surface.** The apps a cooperative actually uses: a member
[dashboard](apps/dashboard), an [admin](apps/admin) panel, and the [API](apps/api) that
will sit between them and the chain.

Part of [Lumio](https://github.com/lumio-network) — an open-source cooperative finance platform.

## Apps

| App              | Name              | Stack            | Port   | Responsibility                                    |
| ---------------- | ----------------- | ---------------- | ------ | ------------------------------------------------- |
| `apps/dashboard` | `@lumio/dashboard`| Next.js (App Router) | 3001 | Member experience — contributions, treasury, votes. |
| `apps/admin`     | `@lumio/admin`    | Next.js (App Router) | 3002 | Operator panel — members, cycles, payouts.        |
| `apps/api`       | `@lumio/api`      | NestJS           | 3000   | Backend — talks to contracts via `@lumio/sdk`.    |

> ⚠️ **Scaffold.** Every page is a placeholder rendered with the real design system, and the API
> returns `not-implemented` for domain routes (only `GET /health` does real work). No auth, no
> database schema, no live contract calls yet — those are later phases.

## Requirements

- Node.js ≥ 20
- pnpm 9.12 (`corepack enable` or `npm i -g pnpm@9.12.0`)
- A **sibling `lumio-sdk` checkout, built** (see below)

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
# {"status":"ok","service":"lumio-api","time":"..."}
```

## Scripts

```bash
pnpm build       # turbo: next build ×2 + tsc (api)
pnpm typecheck   # tsc --noEmit across apps
pnpm lint        # eslint .
pnpm format      # prettier --write .
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

## License

[Apache-2.0](./LICENSE).
