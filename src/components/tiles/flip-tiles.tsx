"use client";

import { useEffect, useRef } from "react";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface Tile {
  flip: HTMLDivElement;
  pt: number;
  ry: string;
}

interface FlipTilesProps {
  /** 0 → 1 as the thing underneath should be covered. Read on scroll and resize, never through
   *  React state — this repaints ~500 nodes and must not re-render the tree. */
  getProgress: () => number;
  /** How much later the wave arrives on the right edge than the left, in progress units. Without
   *  it the wave is a horizontal wipe; with it, it reads as a fold travelling across the surface. */
  rake?: number;
  /** Deterministic per-tile offset, in progress units, so the rows break up instead of arriving in
   *  lines. */
  jitter?: number;
  /** Tiles across, given the wall's width. */
  cols?: (width: number) => number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A wall of tiles whose backs are the surface colour: as progress passes each one it flips 180°, so
 * whatever sits underneath folds away into the page instead of cutting out. Ported from the landing
 * cover (home-preview-6.html) and now shared with the about sequence's first chapter.
 *
 * Built imperatively on purpose — a grid of several hundred divs driven by scroll is exactly the
 * thing React shouldn't be reconciling 60 times a second.
 */
export const FlipTiles = ({
  getProgress,
  rake = 0,
  jitter = 0,
  cols = (width) => (width < 800 ? 16 : 24),
  className = "cover-tiles",
  style,
}: FlipTilesProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const tilesRef = useRef<Tile[]>([]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // iOS collapses its toolbar mid-scroll and the wall's box grows to match. Build past the bottom
    // so that growth is already covered and a toolbar never forces a rebuild of the grid
    const ROWS_HEADROOM = 1.25;

    let builtAcross = 0;
    let builtSize = 0;
    let builtH = 0;

    // The wall is `pointer-events: none`, so the chrome cannot see it in a hit test — it reads the
    // photo underneath and keeps painting light ink over a fold that is already surface. Declaring
    // the colour only once every tile has turned means the declaration never claims to cover a photo
    // that is still showing. It reads the tiles rather than the progress value: those are what is on
    // screen, and they are the thing that has actually been painted.
    const declareCoverage = (progress: number) => {
      const tiles = tilesRef.current;
      const covered = tiles.length > 0 && tiles.every((tile) => tile.ry === "180deg");

      if (covered) el.setAttribute("data-nav-sample", "surface");
      else el.removeAttribute("data-nav-sample");

      // Once every tile has turned, the wall is only a surface-coloured rectangle. Left as a grid,
      // those few hundred 3D flip nodes parked behind whatever animates on top of them cost a full
      // compositing pass per frame — the landing flower measured ~4fps behind a settled wall and 60
      // once the grid was collapsed. A single painted surface is pixel-identical, and the grid comes
      // back the instant progress drops below 1, long before any tile needs to un-flip.
      const settled = covered && progress >= 1;
      if (settled !== el.hasAttribute("data-flip-settled")) {
        if (settled) el.setAttribute("data-flip-settled", "");
        else el.removeAttribute("data-flip-settled");
      }
    };

    const build = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;

      const across = cols(w);
      const size = Math.ceil(w / across);
      const rows = Math.ceil((h * ROWS_HEADROOM) / size);
      const progress = clamp(getProgress(), 0, 1);

      el.innerHTML = "";
      const frag = document.createDocumentFragment();
      const tiles: Tile[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < across; c++) {
          const x = c * size;
          const y = r * size;

          const tile = document.createElement("div");
          tile.className = "cover-tile";
          tile.style.cssText = `left:${x}px;top:${y}px;width:${size + 1}px;height:${size + 1}px`;

          const flip = document.createElement("div");
          flip.className = "flip";
          const back = document.createElement("div");
          back.className = "back";
          back.style.background = "rgb(var(--c-surface))";
          flip.appendChild(back);
          tile.appendChild(flip);
          frag.appendChild(tile);

          // the wave runs bottom to top, raked left-to-right and jittered per tile
          const wobble = jitter > 0 ? Math.abs(Math.sin((r + 1) * 12.9898 + (c + 1) * 78.233)) * jitter : 0;
          const pt = clamp((h - (y + size / 2)) / h + (c / across) * rake + wobble, 0, 1);

          // seeded on the detached node: a rebuild lands in the state the page is already in
          // instead of replaying the fold from nothing
          const ry = progress >= pt ? "180deg" : "0deg";
          flip.style.setProperty("--ry", ry);

          tiles.push({ flip, pt, ry });
        }
      }

      el.appendChild(frag);
      tilesRef.current = tiles;
      builtAcross = across;
      builtSize = size;
      builtH = h;
      declareCoverage(progress);
    };

    const apply = () => {
      const progress = clamp(getProgress(), 0, 1);
      const tiles = tilesRef.current;
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const ry = progress >= t.pt ? "180deg" : "0deg";
        if (ry === t.ry) continue;
        t.ry = ry;
        t.flip.style.setProperty("--ry", ry);
      }

      declareCoverage(progress);
    };

    build();

    window.addEventListener("scroll", apply, { passive: true });
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;

        // only a real layout change needs a rebuild. same tile size and a wall still inside its
        // headroom means the box moved for a reason that has nothing to do with the grid — an iOS
        // toolbar — and rebuilding there would replay the fold in front of the user
        const across = cols(w);
        const size = Math.ceil(w / across);
        if (across === builtAcross && size === builtSize && h <= builtH * ROWS_HEADROOM) return;

        build();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [getProgress, rake, jitter, cols]);

  return <div ref={elRef} className={className} style={style} aria-hidden="true" />;
};
