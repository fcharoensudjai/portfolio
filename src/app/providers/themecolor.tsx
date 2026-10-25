"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// The token cross-fade is 400ms (globals.css); read the ground once it has landed, because a sample
// taken mid-flip is a blend of both themes and the strip would settle on that.
const SETTLE_MS = 500;

/**
 * Keeps the strip the browser paints around the page — behind the notch, and the band at the bottom
 * on iOS — on the page's own ground.
 *
 * Two halves, because no single one of them works everywhere. `<meta name="theme-color">` is the
 * honest signal and Chrome/Android honour it the moment it changes, so it follows the live token
 * here. Safari's Liquid Glass reads rendered pixels instead and ignores runtime writes, so the flip
 * also raises `data-theme-flipping` for a beat, which paints the sampling band in globals.css.
 */
export function ThemeColor() {
  const { resolvedTheme } = useTheme();
  const previousTheme = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!resolvedTheme) return;

    const root = document.documentElement;
    // The first resolved theme is the boot correction, not a flip — the ground is already right there
    // and a band over it would be the only thing that moved.
    const isFlip = previousTheme.current !== undefined && previousTheme.current !== resolvedTheme;
    previousTheme.current = resolvedTheme;

    const paint = () => {
      const channels = getComputedStyle(root).getPropertyValue("--c-surface-mid").trim();
      if (!channels) return;

      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = `rgb(${channels.split(/\s+/).join(", ")})`;
    };

    if (isFlip) root.setAttribute("data-theme-flipping", "");

    // One frame later, so a cold load paints the stored theme immediately (the boot snap has no fade
    // to wait out), and once more when a real flip's fade has landed.
    const frame = requestAnimationFrame(paint);
    const id = window.setTimeout(() => {
      paint();
      root.removeAttribute("data-theme-flipping");
    }, SETTLE_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(id);
      root.removeAttribute("data-theme-flipping");
    };
  }, [resolvedTheme]);

  return null;
}
