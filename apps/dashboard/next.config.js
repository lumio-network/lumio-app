/** @type {import('next').NextConfig} */
const nextConfig = {
  // These packages are linked from the sibling `lumio-sdk` checkout; let Next
  // process them so the symlinked, cross-repo imports resolve reliably.
  transpilePackages: ["@lumio/ui", "@lumio/sdk", "@lumio/shared"],
  // Linting is a separate turbo/eslint task at the repo root, not part of build.
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
