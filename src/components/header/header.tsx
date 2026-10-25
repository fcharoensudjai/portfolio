"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import ThemeSwitch from "./themeswitch";
import { FLIP_INK, useThemeFlip } from "./usethemeflip";
import { LogoButton } from "@/components/logobutton";
import { MobileNav } from "@/components/header/mobilenav";
import { Scrollbar } from "@/components/header/scrollbar";
import { UnderlinedLink } from "@/components/underlinedlink";
import { ExitAnimation } from "@/components/stylers/page-loading/exitanimation";
import { useVisibility2 } from "@/app/contexts/introvisibilitycontext";

type NavKey = "home" | "gallery" | "about";

const NAV_LABELS: Record<NavKey, string> = {
  home: "home",
  gallery: "gallery",
  about: "about",
};

const DARK_TEXT_RGB = { r: 36, g: 36, b: 36 }; // ink (light theme) #242424
const LIGHT_TEXT_RGB = { r: 232, g: 231, b: 226 }; // ink (dark theme) #E8E7E2
const MIN_VISIBLE_IMAGE_ALPHA = 0.35;
let sharedSampleCanvas: HTMLCanvasElement | null = null;
let sharedSampleCtx: CanvasRenderingContext2D | null = null;

const smoothNeighbourBlend = (values: number[]): number[] => {
  if (values.length <= 1) return values;

  return values.map((_, idx) => {
    const left = values[Math.max(0, idx - 1)];
    const center = values[idx];
    const right = values[Math.min(values.length - 1, idx + 1)];
    return left * 0.22 + center * 0.56 + right * 0.22;
  });
};

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const letterColor = (blend: number) => {
  const t = Math.min(1, Math.max(0, blend));
  const r = Math.round(lerp(DARK_TEXT_RGB.r, LIGHT_TEXT_RGB.r, t));
  const g = Math.round(lerp(DARK_TEXT_RGB.g, LIGHT_TEXT_RGB.g, t));
  const b = Math.round(lerp(DARK_TEXT_RGB.b, LIGHT_TEXT_RGB.b, t));
  return `rgb(${r}, ${g}, ${b})`;
};

type RGB = { r: number; g: number; b: number; a: number };

const parseRgb = (value: string): RGB | null => {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] ? Number(match[4]) : 1,
  };
};

const luminance = ({ r, g, b }: RGB) => {
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const OBJECT_POSITION_KEYWORDS: Record<string, number> = {
  left: 0,
  top: 0,
  center: 0.5,
  right: 1,
  bottom: 1,
};

const parseObjectPositionAxis = (token: string | undefined, fallback: number) => {
  if (!token) return fallback;
  if (token in OBJECT_POSITION_KEYWORDS) return OBJECT_POSITION_KEYWORDS[token];

  const value = parseFloat(token);
  return Number.isFinite(value) ? value / 100 : fallback;
};

const getImagePixelColor = (img: HTMLImageElement, x: number, y: number): RGB | null => {
  if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return null;

  const rect = img.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;

  // The box is not the bitmap. `object-fit: cover`/`contain` and `object-position` move the drawn
  // image around inside the box, and the carousel crops its squares with all three, so mapping box
  // coordinates straight onto the source reads a pixel the viewer is not looking at. Normalised
  // coordinates survive a centred `scale()` unchanged, which is why the transformed rect is the right
  // box to work in.
  const { objectFit, objectPosition } = getComputedStyle(img);
  const [positionX, positionY] = (objectPosition || "50% 50%").split(/\s+/);

  let drawnWidth = rect.width;
  let drawnHeight = rect.height;

  if (objectFit === "cover" || objectFit === "contain") {
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const boxAspect = rect.width / rect.height;
    const fitByWidth = objectFit === "cover" ? imageAspect <= boxAspect : imageAspect >= boxAspect;

    if (fitByWidth) drawnHeight = rect.width / imageAspect;
    else drawnWidth = rect.height * imageAspect;
  }

  const drawnLeft = rect.left + (rect.width - drawnWidth) * parseObjectPositionAxis(positionX, 0.5);
  const drawnTop = rect.top + (rect.height - drawnHeight) * parseObjectPositionAxis(positionY, 0.5);

  const relX = (x - drawnLeft) / drawnWidth;
  const relY = (y - drawnTop) / drawnHeight;

  // letterboxed: the point is in the gap, not in the image, so let the caller keep looking
  const tolerance = 0.5 / Math.max(drawnWidth, drawnHeight);
  if (relX < -tolerance || relX > 1 + tolerance || relY < -tolerance || relY > 1 + tolerance) return null;

  const sx = Math.min(Math.max(relX, 0), 1) * (img.naturalWidth - 1);
  const sy = Math.min(Math.max(relY, 0), 1) * (img.naturalHeight - 1);

  try {
    if (!sharedSampleCanvas || !sharedSampleCtx) {
      sharedSampleCanvas = document.createElement("canvas");
      sharedSampleCanvas.width = 1;
      sharedSampleCanvas.height = 1;
      sharedSampleCtx = sharedSampleCanvas.getContext("2d", { willReadFrequently: true });
    }

    if (!sharedSampleCtx) return null;

    sharedSampleCtx.clearRect(0, 0, 1, 1);
    sharedSampleCtx.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = sharedSampleCtx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  } catch {
    return null;
  }
};

// A token name from `data-nav-sample`, resolved the way the page paints it — `--c-surface` is the
// current theme's value, mid-transition included, so a declared colour fades with the page.
const resolveTokenColor = (token: string | null | undefined): RGB | null => {
  if (!token) return null;

  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue(`--c-${token}`)
    .trim()
    .split(/[\s,]+/)
    .map(Number);

  if (channels.length < 3 || channels.some((value) => !Number.isFinite(value))) return null;

  return { r: channels[0], g: channels[1], b: channels[2], a: 1 };
};

// What the chrome is painted over at a point: the topmost thing under it that isn't the chrome
// itself. Three things make this more than a background-colour lookup.
// Images are read pixel by pixel, because a box can only report its own fill and a photo sliding
// under the header reads as the photo. Each element is judged on its *own* fill only — its ancestors
// are already further down the stack, so walking up to them from a transparent overlay (a carousel
// card's caption scrim, say) only ever succeeds by jumping past the photo underneath and answering
// with the section behind the whole row. And an element that paints but refuses pointer events is
// invisible to elementsFromPoint altogether: the flip wall folds to the surface colour on top of a
// photo while staying `pointer-events: none`, so it is switched on for the length of the hit test —
// the stack then reports it as the thing on top, which is what it is on screen.
const sampleBackdrop = (x: number, y: number): RGB | null => {
  const revived: HTMLElement[] = [];

  document.querySelectorAll<HTMLElement>("[data-nav-sample]").forEach((overlay) => {
    const rect = overlay.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
    if (getComputedStyle(overlay).pointerEvents !== "none") return;

    revived.push(overlay);
    overlay.style.pointerEvents = "auto";
  });

  const stack = document
    .elementsFromPoint(x, y)
    .filter(
      (el) =>
        !el.closest("[data-nav-layer='desktop']") &&
        !el.closest("[data-header-layer='blur']") &&
        !el.closest("[data-nav-sample-ignore='true']")
    );

  revived.forEach((overlay) => {
    overlay.style.pointerEvents = "";
  });

  for (const el of stack) {
    const declared = el.closest<HTMLElement>("[data-nav-sample]");
    const declaredColor = resolveTokenColor(declared?.dataset.navSample);
    if (declaredColor) return declaredColor;

    if (el instanceof HTMLImageElement) {
      const pixel = getImagePixelColor(el, x, y);
      if (pixel && pixel.a >= MIN_VISIBLE_IMAGE_ALPHA) return pixel;
      continue;
    }

    const ownFill = parseRgb(getComputedStyle(el).backgroundColor);
    if (ownFill && ownFill.a > 0) return ownFill;
  }

  return parseRgb(getComputedStyle(document.body).backgroundColor);
};

// 0 = the backdrop is light and the ink has to be dark, 1 = the reverse. Null when there is nothing
// laid out to sample, which leaves the caller's last tone in place.
const sampleTone = (target: Element | null): number | null => {
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const sampleColor = sampleBackdrop(rect.left + rect.width / 2, rect.top + rect.height / 2);
  if (!sampleColor) return null;

  return luminance(sampleColor) > 0.52 ? 0 : 1;
};

// Inline rather than a file swap: the bars take the chrome's sampled ink, so they fade with the page
// on a theme flip instead of snapping a frame ahead of it.
const HamburgerGlyph = ({ color, transitionDuration }: { color: string; transitionDuration: string }) => (
  <svg
    width={30}
    height={30}
    viewBox="0 0 24 25"
    // the bars were drawn on a 24×25 artboard and the old <Image> stretched it into a 30×30 box;
    // `none` keeps that exact geometry, so the -3.75px pull on the button stays true
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
  >
    <path
      d="M3 18.9512H21V16.9512H3V18.9512ZM3 13.9512H21V11.9512H3V13.9512ZM3 6.95123V8.95123H21V6.95123H3Z"
      fill={color}
      style={{ transitionProperty: "fill", transitionDuration, transitionTimingFunction: "ease-in-out" }}
    />
  </svg>
);

export const Header = () => {
  const SAMPLE_INTERVAL_MS = 140;
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [headerRowHeight, setHeaderRowHeight] = useState<number | null>(null);
  const [enableToneTransition, setEnableToneTransition] = useState(false);
  const [navTone, setNavTone] = useState<Record<NavKey, number[]>>({
    home: Array.from(NAV_LABELS.home).map(() => 0),
    gallery: Array.from(NAV_LABELS.gallery).map(() => 0),
    about: Array.from(NAV_LABELS.about).map(() => 0),
  });
  type ChromeKey = "logo" | "icon";
  const [chromeTone, setChromeTone] = useState<Record<ChromeKey, number>>({ logo: 0, icon: 0 });
  const themeSwitchRef = React.useRef<HTMLDivElement | null>(null);
  const logoRef = React.useRef<HTMLDivElement | null>(null);
  const labelRefs = React.useRef<Record<NavKey, Array<HTMLSpanElement | null>>>({
    home: Array.from(NAV_LABELS.home).map(() => null),
    gallery: Array.from(NAV_LABELS.gallery).map(() => null),
    about: Array.from(NAV_LABELS.about).map(() => null),
  });
  const headerRowRef = React.useRef<HTMLDivElement | null>(null);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const pathname = usePathname();
  // `isDark` only gates the sampler's re-run below: a flip has to re-sample once the new ground is
  // painted, or the tone keeps describing the theme that just left.
  const { isDark, isFlipping } = useThemeFlip();
  const { isIntroChromeAway } = useVisibility2();
  const isOnLanding = pathname === "/";

  // The chrome's ink follows what is behind it, so a flip has to hold the token instead of the
  // sampled tone — see usethemeflip.ts.
  const chromeInk = (tone: number) => (isFlipping ? FLIP_INK : letterColor(tone));
  const chromeTransition = enableToneTransition ? "500ms" : "0ms";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const row = headerRowRef.current;
    if (!row) return;

    const syncHeight = () => {
      setHeaderRowHeight(row.getBoundingClientRect().height);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(row);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let rafId: number | null = null;
    let isDisposed = false;
    let lastUpdatedAt = 0;
    let hasAppliedInstantThemeSample = false;
    let hasReenabledTransitions = false;

    setEnableToneTransition(false);

    const updateTone = () => {
      const sampledTone: Record<NavKey, number[]> = {
        home: Array.from(NAV_LABELS.home).map(() => 0),
        gallery: Array.from(NAV_LABELS.gallery).map(() => 0),
        about: Array.from(NAV_LABELS.about).map(() => 0),
      };

      (Object.keys(labelRefs.current) as NavKey[]).forEach((key) => {
        labelRefs.current[key].forEach((node, index) => {
          if (!node) return;

          const tone = sampleTone(node);
          if (tone === null) return;

          sampledTone[key][index] = tone;
        });
      });

      const nextTone: Record<NavKey, number[]> = {
        home: smoothNeighbourBlend(sampledTone.home),
        gallery: smoothNeighbourBlend(sampledTone.gallery),
        about: smoothNeighbourBlend(sampledTone.about),
      };

      const nextChromeTone: Record<ChromeKey, number> = {
        logo: sampleTone(logoRef.current) ?? 0,
        icon: sampleTone(themeSwitchRef.current) ?? 0,
      };

      setChromeTone((prev) =>
        prev.logo === nextChromeTone.logo && prev.icon === nextChromeTone.icon ? prev : nextChromeTone
      );

      setNavTone((prev) => {
        const same = (Object.keys(prev) as NavKey[]).every((k) =>
          prev[k].every((tone, idx) => Math.abs(tone - nextTone[k][idx]) < 0.01)
        );
        return same ? prev : nextTone;
      });

      if (!hasAppliedInstantThemeSample) {
        hasAppliedInstantThemeSample = true;
        return;
      }

      if (!hasReenabledTransitions) {
        hasReenabledTransitions = true;
        if (!isDisposed) {
          setEnableToneTransition(true);
        }
      }
    };

    const runSample = () => {
      if (isDisposed) return;
      rafId = requestAnimationFrame((now) => {
        if (now - lastUpdatedAt >= SAMPLE_INTERVAL_MS) {
          updateTone();
          lastUpdatedAt = now;
        }

        runSample();
      });
    };

    updateTone();
    lastUpdatedAt = performance.now();
    runSample();

    return () => {
      isDisposed = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMounted, isDark, SAMPLE_INTERVAL_MS]);

  // while the intro owns the screen the chrome steps out of the way. visibility, not just
  // opacity, so the links drop out of the tab order and stop being hittable — CSS resolves the
  // visibility step at the end of the transition going out and immediately coming back. it leaves
  // quicker than it returns: it has to be gone before the cover's fold sweeps up past it
  const chromeFade = `transition-[opacity,visibility] ease-out ${
    isIntroChromeAway ? "duration-300 opacity-0 invisible" : "duration-500 opacity-100 visible"
  }`;

  const desktopNav = (
    <nav
      data-nav-layer="desktop"
      className={`fixed top-0 left-0 w-screen z-40 pointer-events-none hidden md:block ${chromeFade}`}
      style={headerRowHeight ? { height: `${headerRowHeight}px` } : undefined}
    >
      <div className="flex h-full items-center justify-end px-4 md:px-6">
        <div className="flex h-full items-center space-x-4">
          {/* the body unit (1rem), not a pinned size: this sits in the same tier as the footer rows and
              the captions. It grows with the root (16 → 22px), which is the point — it was 27.5px at
              a 2560 window before, so this is also the fix for the oversized nav. */}
          <ul className="flex items-center space-x-4 text-sm tracking-wide pointer-events-auto">
            <li>
              <UnderlinedLink href={`/#home`} scroll={isOnLanding} isVisible={isOnLanding} disableMotion={true}>
                {Array.from(NAV_LABELS.home).map((char, idx) => (
                  <span
                    key={`home-${idx}`}
                    className="transition-colors ease-in-out"
                    style={{
                      color: letterColor(navTone.home[idx]),
                      transitionDuration: enableToneTransition ? "500ms" : "0ms",
                    }}
                    ref={(el) => {
                      labelRefs.current.home[idx] = el;
                    }}
                  >
                    {char}
                  </span>
                ))}
              </UnderlinedLink>
            </li>
            <li>
              <UnderlinedLink href={`/gallery`} disableMotion={true}>
                {Array.from(NAV_LABELS.gallery).map((char, idx) => (
                  <span
                    key={`gallery-${idx}`}
                    className="transition-colors ease-in-out"
                    style={{
                      color: letterColor(navTone.gallery[idx]),
                      transitionDuration: enableToneTransition ? "500ms" : "0ms",
                    }}
                    ref={(el) => {
                      labelRefs.current.gallery[idx] = el;
                    }}
                  >
                    {char}
                  </span>
                ))}
              </UnderlinedLink>
            </li>
            <li>
              <UnderlinedLink href={`/about`} disableMotion={true}>
                {Array.from(NAV_LABELS.about).map((char, idx) => (
                  <span
                    key={`about-${idx}`}
                    className="transition-colors ease-in-out"
                    style={{
                      color: letterColor(navTone.about[idx]),
                      transitionDuration: enableToneTransition ? "500ms" : "0ms",
                    }}
                    ref={(el) => {
                      labelRefs.current.about[idx] = el;
                    }}
                  >
                    {char}
                  </span>
                ))}
              </UnderlinedLink>
            </li>
          </ul>

          <div className="invisible ml-4 flex justify-center items-center pointer-events-none">
            <ThemeSwitch color={chromeInk(chromeTone.icon)} />
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div>
      <Scrollbar />

      <header
        data-header-layer="blur"
        className={`fixed top-0 left-0 bg-transparent backdrop-blur-[8px] w-screen z-40 text-ink ${chromeFade}`}
      >
        {/* the blur band and this row are both full-bleed on purpose: the chrome stays anchored to the
            window while .content-cap holds the sections back, so the nav keeps its own inset */}
        <div ref={headerRowRef} className="flex items-center justify-between px-4 py-[12.8px] md:px-6">
          <div ref={logoRef} className="flex items-center">
            <LogoButton inkColor={chromeInk(chromeTone.logo)} transitionDuration={chromeTransition} />
          </div>

          <div className="flex items-center space-x-4">
            {/* The row's padding is symmetric, so both corners sit on the same box edge — but the
                ink doesn't. The mark's window is 30px inside a 36px button and the glyph is already
                flush to the window (see themeswitch.tsx), so the mark still ends 3px short of the
                button box. Pulling the button out by that much puts the sun/moon's right edge on the
                row's edge, level with the footer's last social label directly below it. */}
            <div
              className="invisible md:visible ml-4 flex justify-center items-center"
              style={{ marginRight: "-3px" }}
              ref={themeSwitchRef}
            >
              <ThemeSwitch color={chromeInk(chromeTone.icon)} transitionDuration={chromeTransition} />
            </div>
          </div>
          <div className="flex md:hidden items-center space-x-3">
            <ThemeSwitch color={chromeInk(chromeTone.icon)} transitionDuration={chromeTransition} />
            {/* the hamburger's bars span 3–21 of its 24-unit viewBox, so at 30px its ink stops
                3.75px inside the button box. Pulling it out by that lands the glyphs on the row's
                edge, level with the last social icon in the footer. */}
            <button onClick={toggleNav} aria-label="toggle navigation" style={{ marginRight: "-3.75px" }}>
              <HamburgerGlyph color={chromeInk(chromeTone.icon)} transitionDuration={chromeTransition} />
            </button>
          </div>
        </div>
      </header>

      {isMounted && createPortal(desktopNav, document.body)}

      <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

      <ExitAnimation />
    </div>
  );
};
