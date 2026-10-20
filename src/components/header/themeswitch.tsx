"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const SWAP_MS = 420;
const SWAP_EASE = "cubic-bezier(0.34, 1.45, 0.64, 1)";

export default function ThemeSwitch({ color, transitionDuration }: { color?: string; transitionDuration?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, resolvedTheme } = useTheme();

  const previousTheme = useRef(resolvedTheme);
  const flipAt = useRef(0);
  if (previousTheme.current !== resolvedTheme) {
    previousTheme.current = resolvedTheme;
    flipAt.current = Date.now();
  }
  const themeJustFlipped = Date.now() - flipAt.current < 700;

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
  const tint = color || (isDark ? "#E8E7E2" : "#242424");

  // The tint rides on `transitionDuration` so it can ease along with the header's tone as the page
  // scrolls, but on an actual theme flip that same easing would hold the old ink over the new
  // background and wash the mark out for half a second — so a flip snaps the colour instead.
  const swapTransition = (entering: boolean) =>
    [
      entering ? "opacity 200ms ease-out 90ms" : "opacity 180ms ease-in",
      `transform ${entering ? SWAP_MS : SWAP_MS - 80}ms ${SWAP_EASE}`,
      `background-color ${themeJustFlipped ? "0ms" : transitionDuration || "0ms"} ease-in-out`,
    ].join(", ");

  // Both marks live in the same box at all times; only opacity/rotation/scale swap between them, so
  // the change reads as one glyph turning over instead of an asset being replaced. The entering mark
  // holds its fade for a beat so the filled moon and the stroked sun never muddy into each other
  // halfway through, and it gets a longer, springier turn so the settle stays visible past the fade.
  const mark = (src: string, active: boolean, restingRotation: number) => (
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
        opacity: active ? 1 : 0,
        transform: active ? "rotate(0deg) scale(1)" : `rotate(${restingRotation}deg) scale(0.45)`,
        transformOrigin: "center",
        transition: swapTransition(active),
      }}
    />
  );

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-[36px] w-[36px] items-center justify-center transition-colors ease-in-out"
      aria-label="toggle theme"
    >
      <div className="relative h-[30px] w-[30px]">
        {mark(`${basePath}/icons/light/moon.svg`, !isDark, -110)}
        {mark(`${basePath}/icons/dark/sun.svg`, isDark, 110)}
      </div>
    </button>
  );
}
