import type { Metadata, Viewport } from "next";
import React from "react";
import { Roboto_Mono } from "next/font/google";
import { Header } from "@/components/header/header";
import "./globals.css";
import { ProviderTheme } from "@/app/providers/themeprovider";
import Highlighter from "@/components/stylers/highlighter";
import { PetalFollow } from "@/components/petalfollow";
import { ExitAnimationProvider } from "@/app/contexts/exitcontext";
import { VisibilityProvider } from "@/app/contexts/recentsvisibilitycontext";
import { VisibilityProvider2 } from "@/app/contexts/introvisibilitycontext";
import { VisibilityProvider3 } from "@/app/contexts/contactvisibilitycontext";
import LenisProvider from "@/app/providers/lenisprovider";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "fuzzch | portfolio",
  description: "welcome to my portfolio!",
  icons: {
    icon: `${basePath}/icons/dark/logodark.svg`, // logo for thumbnail
  },
};

// The first frame is the default theme's ground, so the strip the browser paints around the page
// starts there too rather than at the browser's own default; `ThemeColor` takes over once the
// client knows which theme the visitor actually stored. Kept in step with `--c-surface-mid` in
// globals.css.
export const viewport: Viewport = {
  themeColor: "#403B3B",
};

/**
 * Puts the stored theme on <html> while the document is still parsing.
 *
 * next-themes normally ships a script that does this, but it is rendered by `ThemeProvider`, and that
 * provider only mounts on the client here (see themeprovider.tsx) — so on a reload the parse-time
 * frame is `<html>` with no theme class, which resolves to the `:root` dark tokens and flashes
 * charcoal before hydration corrects it. This runs first in the body, so the ground is already the
 * visitor's own by the time the placeholder paints.
 *
 * The meta is corrected here too, off the same token, because a phone samples the strip around the
 * page at load rather than after hydration.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var resolved =
      stored === "light" || stored === "dark"
        ? stored
        : stored === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : "dark";

    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    // Read the ground back off the token rather than repeating its channels in here; the class is on
    // <html> by now, so the probe resolves against the theme that is about to paint.
    var probe = document.createElement("span");
    probe.style.cssText = "display:none;color:rgb(var(--c-surface-mid))";
    root.appendChild(probe);
    var ground = getComputedStyle(probe).color;
    probe.remove();
    if (/^rgb/.test(ground)) meta.setAttribute("content", ground);
  } catch (_) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${robotoMono.variable} theme-boot`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ProviderTheme>
          <LenisProvider>
            <ExitAnimationProvider>
              <VisibilityProvider>
                <VisibilityProvider2>
                  <VisibilityProvider3>
                    <Highlighter />
                    <PetalFollow />
                    <Header />
                    <div className={`bg-surface-mid`}>{children}</div>
                  </VisibilityProvider3>
                </VisibilityProvider2>
              </VisibilityProvider>
            </ExitAnimationProvider>
          </LenisProvider>
        </ProviderTheme>
      </body>
    </html>
  );
}
