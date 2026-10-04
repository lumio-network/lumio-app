# Architecture

## Workspace layout

This pnpm monorepo contains three applications and a small shared shell package:

- `apps/dashboard` is the Next.js member experience.
- `apps/admin` is the Next.js operator interface.
- `apps/api` is a NestJS service exposing health, metrics, and versioned domain routes.
- `apps/shared` contains the shared app shell used by both Next.js applications.

## SDK dependency model

The application workspace does not publish or vendor `@lumio/sdk`, `@lumio/shared`, or `@lumio/ui`.
The apps link to those packages from a sibling `lumio-sdk` checkout using pnpm `link:` dependencies.
Build the sibling SDK before building this repository. CI checks out the SDK beside this repo and
builds its packages before the app when the SDK build cache is cold.

## Current scaffold

The dashboard and admin pages are UI scaffolds and do not yet read domain data from the chain. The
API's `/health` and `/metrics` endpoints are implemented; the versioned treasury, governance, and
dividends routes currently return `501 not-implemented` responses. There is no application database
schema or authentication/authorization flow yet. The Docker Compose API image also remains dependent
on publishing the sibling SDK packages; until then, run the API from the host and use Compose for
Postgres.

## Phased roadmap

1. **Operational health** — establish the API health and metrics endpoints and local app scaffolds.
2. **Domain route contracts** — define stable treasury, governance, and dividends routes and
   response shapes; the current handlers are placeholders.
3. **SDK-backed reads** — implement domain reads through `@lumio/sdk` and connect the application
   surfaces to the API.
4. **Persistence** — introduce a database schema and persist the application state that requires it.
5. **Authentication and authorization** — add identity, session management, and access controls
   after the data boundaries are established.
