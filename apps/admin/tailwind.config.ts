import type { Config } from "tailwindcss";
import { lumioPreset } from "@lumio/ui/tailwind-preset";

const config: Config = {
  presets: [lumioPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    // Scan the linked design-system source so its utility classes are generated.
    "../../../lumio-sdk/packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
