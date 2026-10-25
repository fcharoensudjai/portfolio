"use client";

import { useCallback } from "react";
import { FlipTiles } from "@/components/tiles/flip-tiles";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * The landing cover's tile wall: a grid of tiles over the hero that flip as you scroll
 * (bottom-to-top wave). Each tile's back is the surface colour, so the name/socials get covered by
 * blank tiles as the wave passes — the cover "flips away" to a clean surface and the profile
 * scrolls in over it.
 *
 * The wall itself is FlipTiles, shared with the about sequence's first chapter.
 */
export const CoverTiles = () => {
  // the fold is fully flipped once the page has scrolled 0.85 viewport heights
  const getProgress = useCallback(() => clamp(window.scrollY / (window.innerHeight * 0.85), 0, 1), []);

  return <FlipTiles getProgress={getProgress} cols={(width) => (width < 800 ? 12 : 24)} />;
};
