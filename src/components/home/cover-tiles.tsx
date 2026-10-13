"use client";

import { useEffect, useRef } from "react";

interface CoverTilesProps {
  coverRef: { current: HTMLElement | null };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface Tile {
  flip: HTMLDivElement;
  pt: number;
}

/**
 * The landing cover's tile wall, ported from home-preview-6.html: a grid of
 * tiles over the hero that flip as you scroll (bottom-to-top wave). Each tile's
 * back is the surface colour, so the name/socials get covered by blank tiles as
 * the wave passes — the cover "flips away" to a clean surface and the profile
 * scrolls in over it.
 */
export const CoverTiles = ({ coverRef }: CoverTilesProps) => {
  const tilesElRef = useRef<HTMLDivElement | null>(null);
  const tilesRef = useRef<Tile[]>([]);
  const cpStateRef = useRef(0);

  useEffect(() => {
    const cover = coverRef.current;
    const tilesEl = tilesElRef.current;
    if (!cover || !tilesEl) return;

    let built = false;

    const build = () => {
      const W = cover.clientWidth;
      const H = cover.clientHeight;
      if (!W || !H) return;
      const cols = W < 800 ? 12 : 24;
      const tw = Math.ceil(W / cols);
      const rows = Math.ceil(H / tw);

      tilesEl.innerHTML = "";
      const tiles: Tile[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * tw;
          const y = r * tw;
          const t = document.createElement("div");
          t.className = "cover-tile";
          t.style.cssText = `left:${x}px;top:${y}px;width:${tw + 1}px;height:${tw + 1}px`;
          const flip = document.createElement("div");
          flip.className = "flip";
          const back = document.createElement("div");
          back.className = "back";
          back.style.background = "rgb(var(--c-surface))";
          flip.appendChild(back);
          t.appendChild(flip);
          tilesEl.appendChild(t);
          const cy = y + tw / 2;
          tiles.push({ flip, pt: clamp((H - cy) / H, 0, 1) });
        }
      }
      tilesRef.current = tiles;
      built = true;
    };

    const apply = () => {
      if (!built) return;
      const cp = clamp(window.scrollY / (window.innerHeight * 0.85), 0, 1);
      const prev = cpStateRef.current;
      if (cp > 0) {
        tilesRef.current.forEach((t) => {
          t.flip.style.setProperty("--d", "0ms");
          t.flip.style.setProperty("--ry", cp >= t.pt ? "180deg" : "0deg");
        });
      } else if (prev > 0) {
        tilesRef.current.forEach((t) => {
          t.flip.style.setProperty("--d", "0ms");
          t.flip.style.setProperty("--ry", "0deg");
        });
      }
      cpStateRef.current = cp;
    };

    const doBuild = () => {
      build();
      apply();
    };
    doBuild();

    window.addEventListener("scroll", apply, { passive: true });
    let rt: number;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(doBuild, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
    };
  }, [coverRef]);

  return <div ref={tilesElRef} className="cover-tiles" aria-hidden="true" />;
};
