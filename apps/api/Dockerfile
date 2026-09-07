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
COPY package.json ./
RUN pnpm install --prod=false

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/main.js"]
