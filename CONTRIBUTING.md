# Contributing to lumio-app

Thanks for your interest in Lumio — an open-source cooperative finance platform for savings
groups (*ajo*, *esusu*, *chamas*, SACCOs) on Stellar / Soroban. This repo holds the **product
surface**: the member [dashboard](apps/dashboard), the [admin](apps/admin) panel, and the
[API](apps/api). It sits on top of the [SDK](https://github.com/lumio-network/lumio-sdk) and the
[contracts](https://github.com/lumio-network/lumio-contracts).

Small, focused pull requests are very welcome — including your first one.

> ⚠️ **Scaffold status.** Every page is a placeholder rendered with the real design system, and the
> API returns `not-implemented` for domain routes (only `GET /health` does real work). There is no
> auth, no database schema, and no live contract calls yet — those are later phases and are **out of
> scope** for contributor PRs unless an issue says otherwise. Good starting points: accessibility,
> metadata/SEO, loading/error states, the health endpoint, tests, and DX — none of which need the
> chain wired up.

## The one hard prerequisite: a sibling, built `lumio-sdk`

This repo does **not** vendor `@lumio/ui`, `@lumio/sdk`, or `@lumio/shared`. It links them via
pnpm's `link:` protocol to a **sibling `lumio-sdk` checkout that you must build first**. pnpm
workspaces can't span repository roots, so nothing here installs correctly until that's in place:

```
lumio-network/
├── lumio-sdk/      # ← must exist and be built
└── lumio-app/      # ← this repo
```

```bash
# 1. Build the SDK packages the apps link against
cd ../lumio-sdk && pnpm install && pnpm build
# 2. Then install + run the apps
cd ../lumio-app && pnpm install && pnpm dev   # dashboard :3001, admin :3002, api :3000
```

See the [README](./README.md) for the full walkthrough and per-app commands.

## Prerequisites

- **Node.js ≥ 20**
- **pnpm 9.12.0** — `corepack enable` (recommended) or `npm i -g pnpm@9.12.0`

## Before you open a PR

CI runs **build the SDK (sibling) → install → lint → typecheck → build** (see
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) and must be green. Run the equivalents
locally (with `lumio-sdk` built as above):

```bash
pnpm lint && pnpm typecheck && pnpm build
```

Formatting is checked with Prettier — run `pnpm format` to auto-fix (or `pnpm format:check` to verify).

## Making a change

1. **Find or open an issue.** Browse [`good first issue`](https://github.com/lumio-network/lumio-app/labels/good%20first%20issue)
   and [`help wanted`](https://github.com/lumio-network/lumio-app/labels/help%20wanted), and comment
   on the one you'd like so we can assign it.
2. **Branch** off `main` (e.g. `feat/dashboard-open-graph`).
3. **Keep it focused.** One issue per PR; if you change behaviour, add coverage (see the note below —
   the test harness is itself a good first issue).
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/), e.g.
   `feat(api): return 200/503 from a health endpoint`, scoped to the app you touch
   (`dashboard` / `admin` / `api`).
5. **Open the PR** against `main`, link the issue (`Closes #123`), and say how you verified it (paste
   the relevant `pnpm build` / `curl` output).

## A note on tests

There is no test runner wired up in this repo yet. If your change would benefit from a test and no
harness exists, say so on the issue — standing up the first test setup is itself a tracked
contributor task, and we'd rather coordinate it than have three different runners land at once.

## Reporting a bug or proposing work

Open an issue with a clear title, the affected app (`dashboard` / `admin` / `api`), reproduction
steps, and expected vs. actual behaviour. Please scope requests to a single, reviewable change
rather than the not-yet-built later phases.

## License

By contributing you agree that your contributions are licensed under the project's
[Apache-2.0](./LICENSE) license.
