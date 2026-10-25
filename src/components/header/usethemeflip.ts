"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Long enough to cover the page's own 400ms token cross-fade, short enough that the sampled header
// tone takes over again promptly.
export const FLIP_MS = 700;

// The sampled header tone trails the theme class by a couple of frames, so on a flip it would still
// be the old ink painted over the new background — i.e. briefly invisible. The chrome holds the ink
// token while the swap plays instead. It holds the token rather than its hex so the glyph travels
// with the fading page rather than snapping to the new theme while the ground under it is still the
// old one.
export const FLIP_INK = "rgb(var(--c-ink))";

export function useThemeFlip(flipMs: number = FLIP_MS) {
  const { resolvedTheme } = useTheme();
  const [isFlipping, setIsFlipping] = useState(false);
  const previousTheme = useRef(resolvedTheme);

  useEffect(() => {
    if (previousTheme.current === resolvedTheme) return;
    previousTheme.current = resolvedTheme;
    setIsFlipping(true);
    const id = setTimeout(() => setIsFlipping(false), flipMs);
    return () => clearTimeout(id);
  }, [resolvedTheme, flipMs]);

  return { isDark: resolvedTheme === "dark", isFlipping };
}
