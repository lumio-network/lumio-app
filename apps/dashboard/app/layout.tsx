import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Image from "next/image";
import "@lumio/ui/tokens/design-tokens.css";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-lumio-display",
});
const ui = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lumio-ui",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-lumio-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumio.network"), // TODO: Replace with actual production domain
  title: "Lumio — Member Dashboard",
  description: "Your cooperative's savings, contributions, and payouts at a glance.",
  icons: { icon: "/brand/favicon.svg" },
  openGraph: {
    title: "Lumio — Member Dashboard",
    description: "Your cooperative's savings, contributions, and payouts at a glance.",
    url: "/",
    siteName: "Lumio",
    images: [
      {
        url: "/brand/lumio-lockup-horizontal-on-light.svg",
        width: 1200,
        height: 630,
        alt: "Lumio - Cooperative Finance Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumio — Member Dashboard",
    description: "Your cooperative's savings, contributions, and payouts at a glance.",
    images: ["/brand/lumio-lockup-horizontal-on-light.svg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>
        <header className="border-b border-ink-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            {/* Real brand asset from the foundation kit, copied verbatim — never redrawn. */}
            <Image
              src="/brand/lumio-lockup-horizontal-on-dark.svg"
              alt="Lumio"
              width={120}
              height={28}
              className="h-7 w-auto"
            />
            <span className="font-mono text-caption uppercase tracking-wide text-ink-400">
              Member
            </span>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-16">{children}</main>
      </body>
    </html>
  );
}
