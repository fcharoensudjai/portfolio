"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { createPortal } from "react-dom";
import ThemeSwitch from "./themeswitch";
import { LogoButton } from "@/components/logobutton";
import { MobileNav } from "@/components/header/mobilenav";
import { Scrollbar } from "@/components/header/scrollbar";
import { UnderlinedLink } from "@/components/underlinedlink";
import { ExitAnimation } from "@/components/stylers/page-loading/exitanimation";
import { useVisibility } from "@/app/contexts/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/contexts/introvisibilitycontext";
import { useVisibility3 } from "@/app/contexts/contactvisibilitycontext";

type NavKey = "recents" | "gallery" | "intro" | "about" | "contact";

const NAV_LABELS: Record<NavKey, string> = {
  recents: "recents",
  gallery: "gallery",
  intro: "intro",
  about: "about",
  contact: "contact",
};

const DARK_TEXT_RGB = { r: 36, g: 36, b: 36 }; // text-light (#242424)
const LIGHT_TEXT_RGB = { r: 232, g: 231, b: 226 }; // text-dark (#E8E7E2)
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

const getElementBgColor = (el: Element | null): RGB | null => {
  let current: HTMLElement | null = el as HTMLElement | null;

  while (current) {
    const parsed = parseRgb(getComputedStyle(current).backgroundColor);
    if (parsed && parsed.a > 0) return parsed;
    current = current.parentElement;
  }

  return parseRgb(getComputedStyle(document.body).backgroundColor);
};

const getImagePixelColor = (img: HTMLImageElement, x: number, y: number): RGB | null => {
  if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return null;

  const rect = img.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;

  const relX = (x - rect.left) / rect.width;
  const relY = (y - rect.top) / rect.height;

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

export const Header = () => {
  const SAMPLE_INTERVAL_MS = 140;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [headerRowHeight, setHeaderRowHeight] = useState<number | null>(null);
  const [enableToneTransition, setEnableToneTransition] = useState(false);
  const [navTone, setNavTone] = useState<Record<NavKey, number[]>>({
    recents: Array.from(NAV_LABELS.recents).map(() => 0),
    gallery: Array.from(NAV_LABELS.gallery).map(() => 0),
    intro: Array.from(NAV_LABELS.intro).map(() => 0),
    about: Array.from(NAV_LABELS.about).map(() => 0),
    contact: Array.from(NAV_LABELS.contact).map(() => 0),
  });
  const labelRefs = React.useRef<Record<NavKey, Array<HTMLSpanElement | null>>>({
    recents: Array.from(NAV_LABELS.recents).map(() => null),
    gallery: Array.from(NAV_LABELS.gallery).map(() => null),
    intro: Array.from(NAV_LABELS.intro).map(() => null),
    about: Array.from(NAV_LABELS.about).map(() => null),
    contact: Array.from(NAV_LABELS.contact).map(() => null),
  });
  const headerRowRef = React.useRef<HTMLDivElement | null>(null);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const { theme } = useTheme();
  const { isRecentsInView } = useVisibility();
  const { isIntroInView } = useVisibility2();
  const { isContactInView } = useVisibility3();

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
        recents: Array.from(NAV_LABELS.recents).map(() => 0),
        gallery: Array.from(NAV_LABELS.gallery).map(() => 0),
        intro: Array.from(NAV_LABELS.intro).map(() => 0),
        about: Array.from(NAV_LABELS.about).map(() => 0),
        contact: Array.from(NAV_LABELS.contact).map(() => 0),
      };

      (Object.keys(labelRefs.current) as NavKey[]).forEach((key) => {
        labelRefs.current[key].forEach((node, index) => {
          if (!node) return;

          const rect = node.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          let sampleColor: RGB | null = null;

          const stack = document
            .elementsFromPoint(x, y)
            .filter((el) => !el.closest("[data-nav-layer='desktop']") && !el.closest("[data-header-layer='blur']"));

          for (const el of stack) {
            if (el instanceof HTMLImageElement) {
              const pixel = getImagePixelColor(el, x, y);
              if (pixel && pixel.a >= MIN_VISIBLE_IMAGE_ALPHA) {
                sampleColor = pixel;
                break;
              }
              continue;
            }

            const bgColor = getElementBgColor(el);
            if (bgColor && bgColor.a > 0) {
              sampleColor = bgColor;
              break;
            }
          }

          if (!sampleColor) return;

          const lum = luminance(sampleColor);
          sampledTone[key][index] = lum > 0.52 ? 0 : 1;
        });
      });

      const nextTone: Record<NavKey, number[]> = {
        recents: smoothNeighbourBlend(sampledTone.recents),
        gallery: smoothNeighbourBlend(sampledTone.gallery),
        intro: smoothNeighbourBlend(sampledTone.intro),
        about: smoothNeighbourBlend(sampledTone.about),
        contact: smoothNeighbourBlend(sampledTone.contact),
      };

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
  }, [isMounted, theme, SAMPLE_INTERVAL_MS]);

  const desktopNav = (
    <nav
      data-nav-layer="desktop"
      className="fixed top-0 left-0 w-screen z-40 pointer-events-none hidden md:block"
      style={headerRowHeight ? { height: `${headerRowHeight}px` } : undefined}
    >
      <div className="flex h-full items-center justify-end px-4 md:px-6">
        <div className="flex h-full items-center space-x-4">
          <ul className="flex items-center space-x-4 md:text-sm xl:text-md text-xs pointer-events-auto">
            <li>
              <UnderlinedLink exitDuration={1100} href={`/#recents`} isVisible={isRecentsInView} disableMotion={true}>
                {Array.from(NAV_LABELS.recents).map((char, idx) => (
                  <span
                    key={`recents-${idx}`}
                    className="transition-colors ease-in-out"
                    style={{
                      color: letterColor(navTone.recents[idx]),
                      transitionDuration: enableToneTransition ? "500ms" : "0ms",
                    }}
                    ref={(el) => {
                      labelRefs.current.recents[idx] = el;
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
              <UnderlinedLink exitDuration={1100} href={`/#intro`} isVisible={isIntroInView} disableMotion={true}>
                {Array.from(NAV_LABELS.intro).map((char, idx) => (
                  <span
                    key={`intro-${idx}`}
                    className="transition-colors ease-in-out"
                    style={{
                      color: letterColor(navTone.intro[idx]),
                      transitionDuration: enableToneTransition ? "500ms" : "0ms",
                    }}
                    ref={(el) => {
                      labelRefs.current.intro[idx] = el;
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
            <li>
              <UnderlinedLink
                exitDuration={1100}
                href={`/#contact`}
                scroll={true}
                isVisible={isContactInView}
                disableMotion={true}
              >
                {Array.from(NAV_LABELS.contact).map((char, idx) => (
                  <span
                    key={`contact-${idx}`}
                    className="transition-colors ease-in-out"
                    style={{
                      color: letterColor(navTone.contact[idx]),
                      transitionDuration: enableToneTransition ? "500ms" : "0ms",
                    }}
                    ref={(el) => {
                      labelRefs.current.contact[idx] = el;
                    }}
                  >
                    {char}
                  </span>
                ))}
              </UnderlinedLink>
            </li>
          </ul>

          <div className="invisible ml-4 flex justify-center items-center pointer-events-none">
            <ThemeSwitch />
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
        className={`fixed top-0 left-0 bg-transparent backdrop-blur-[8px] w-screen z-40 ${theme === "dark" ? "text-text-dark" : "text-text-light"}`}
      >
        <div ref={headerRowRef} className="flex items-center justify-between px-4 py-2 md:px-6">
          <LogoButton />

          <div className="flex items-center space-x-4">
            <div className="invisible md:visible ml-4 flex justify-center items-center">
              <ThemeSwitch />
            </div>
          </div>
          <div className="flex md:hidden items-center space-x-3">
            <ThemeSwitch />
            <button onClick={toggleNav} aria-label="toggle navigation">
              <Image
                src={
                  theme === "dark"
                    ? `${basePath}/icons/dark/hamburgerdark.svg`
                    : `${basePath}/icons/light/hamburger.svg`
                }
                alt="hamburger"
                width={30}
                height={30}
                className="max-w-[40px] md:w-[40px] md:h-[40px]"
              />
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
