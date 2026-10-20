"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// The travel reads slower than a fade, so it gets the lab's 1.1× on the old 420ms swap.
const ROLL_MS = 460;
// The same lift as the swap's old spring, minus the overshoot: it settles into the window instead of
// bouncing against its edge.
const ROLL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Long enough to cover the roll, short enough that the sampled header tone takes over again promptly.
const FLIP_MS = 700;

export default function ThemeSwitch({ color, transitionDuration }: { color?: string; transitionDuration?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, resolvedTheme } = useTheme();

  const [themeFlipping, setThemeFlipping] = useState(false);
  const previousTheme = useRef(resolvedTheme);

  useEffect(() => {
    if (previousTheme.current === resolvedTheme) return;
    previousTheme.current = resolvedTheme;
    setThemeFlipping(true);
    const id = setTimeout(() => setThemeFlipping(false), FLIP_MS);
    return () => clearTimeout(id);
  }, [resolvedTheme]);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div
        className="w-[30px] h-[30px]"
        style={{
          backgroundColor: color || "currentColor",
          maskImage: `url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg==)`,
          WebkitMaskImage: `url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg==)`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          transitionProperty: "background-color",
          transitionDuration: transitionDuration || "0ms",
        }}
      />
    );

  const isDark = resolvedTheme === "dark";
  const defaultTint = isDark ? "#E8E7E2" : "#242424";
  // The header's sampled `color` trails the theme class by a couple of frames, so on a flip it would
  // still be the old ink painted over the new background — i.e. briefly invisible. The mark holds the
  // theme's own ink while the swap plays, then hands back to the sampled tone. It holds the ink *token*
  // rather than its hex so the glyph travels with the fading page instead of snapping to the new theme
  // while the ground under it is still the old one.
  const tint = themeFlipping ? "rgb(var(--c-ink))" : color || defaultTint;

  // The tint rides on `transitionDuration` so it can ease along with the header's tone as the page
  // scrolls. During a flip it drops that easing and follows the ink token frame by frame instead, so
  // the mark fades at the page's own rate rather than chasing a target that is itself moving.
  const swapTransition = `transform ${ROLL_MS}ms ${ROLL_EASE}, background-color ${
    themeFlipping ? "0ms" : transitionDuration || "0ms"
  } ease-in-out`;

  // Sunrise: one window, two marks travelling through it. The sun rises in from below as the moon
  // leaves over the top; on the way back the moon drops in from above. Nothing crossfades, so the
  // filled moon and the stroked sun can never muddy into each other mid-swap — the clipped box does
  // the masking instead, and both marks are always painted.
  const mark = (src: string, active: boolean, parkedY: string) => (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundColor: tint,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        transform: active ? "translateY(0)" : `translateY(${parkedY})`,
        transition: swapTransition,
      }}
    />
  );

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-[36px] w-[36px] items-center justify-center transition-colors ease-in-out"
      aria-label="toggle theme"
    >
      <div className="relative h-[30px] w-[30px] overflow-hidden">
        {/* parked at ±118%: fully clear of the window at both ends of the travel */}
        {mark(`${basePath}/icons/light/moon.svg`, !isDark, "-118%")}
        {mark(`${basePath}/icons/dark/sun.svg`, isDark, "118%")}
      </div>
    </button>
  );
}
