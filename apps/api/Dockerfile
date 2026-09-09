# syntax=docker/dockerfile:1
#
# Scaffold Dockerfile for the Lumio API.
#
# NOTE: this assumes `@lumio/sdk` and `@lumio/shared` are resolvable from a
# registry. In the current scaffold they are linked from the sibling
# `lumio-sdk` checkout via pnpm `link:`, which is not part of this build
# context, so `pnpm install` here will not resolve them until the SDK is
# published. See docker-compose.yml for how to run the stack today.
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter @lumio/api --prod=false --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/api/src apps/api/src
COPY apps/api/nest-cli.json apps/api/tsconfig.json apps/api/
WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/main.js"]
