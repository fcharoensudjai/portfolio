"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface PetalSpec {
  h: number; // petal height (px)
  k: number; // follow ease
  r: number; // orbit radius
  s: number; // spin speed
  ph: number; // phase
}

// ported from home-preview-6.html (#flock) — four petals that trail the pointer,
// and re-anchor to ring small interactive targets (links/buttons) on hover.
const PETALS: PetalSpec[] = [
  { h: 22, k: 0.13, r: 26, s: 1.1, ph: 0 },
  { h: 17, k: 0.085, r: 38, s: 0.8, ph: 2 },
  { h: 14, k: 0.06, r: 48, s: 0.65, ph: 4 },
  { h: 11, k: 0.04, r: 58, s: 0.5, ph: 5.5 },
];

// only ring targets that are roughly button-sized — four petals spread round a big
// surface reads sparse and arbitrary, so those keep the plain trail
const RING_MAX_W = 260;
const RING_MAX_H = 200;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// a control can be nested (our buttons wrap a link as their label) — resolve to the
// outermost link/button so the ring measures the whole control, not the slice under
// the pointer; otherwise hovering the label vs. the padding changes the orbit radii
const resolveUnit = (start: Element | null): Element | null => {
  let unit = start?.closest("a, button") ?? null;
  if (!unit) return null;
  for (let p = unit.parentElement; p; p = p.parentElement) {
    const outer = p.closest("a, button");
    if (!outer) break;
    unit = outer;
  }
  return unit;
};

export const PetalFollow = () => {
  const { resolvedTheme } = useTheme();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const src = resolvedTheme === "light" ? `${basePath}/icons/light/petal.svg` : `${basePath}/icons/dark/petaldark.svg`;

  const [enabled, setEnabled] = useState(false);

  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const flockRef = useRef<HTMLDivElement | null>(null);
  const pets = useRef(PETALS.map((o) => ({ ...o, x: -200, y: -200, rot: 0 })));
  const mouse = useRef({ x: -200, y: -200 });
  const orbitEl = useRef<Element | null>(null);
  const orbAmt = useRef(0); // 0 = follow, 1 = ring the target; eased so it glides, not jumps

  // touch has no pointer — render nothing
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    // one delegated listener — moving anywhere that isn't a link/button resolves to
    // null, so leaving a target resets it without needing mouseout
    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    const setFlockHidden = (hidden: boolean) => {
      if (!flockRef.current) return;
      if (hidden) {
        // hide at once, reveal after a beat: crossing a small gap between two tiles that both
        // opt out (the carousel's cards) would otherwise make the flock stutter in and out
        if (revealTimer) {
          clearTimeout(revealTimer);
          revealTimer = null;
        }
        flockRef.current.classList.add("opacity-0");
        return;
      }
      if (revealTimer || !flockRef.current.classList.contains("opacity-0")) return;
      revealTimer = setTimeout(() => {
        revealTimer = null;
        flockRef.current?.classList.remove("opacity-0");
      }, 140);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      orbitEl.current = resolveUnit(t);
      // petals step aside where something else owns the language (the recents stage's frame, the
      // gallery carousel's cards): anything marked [data-petals-off] fades the flock out while hovered.
      setFlockHidden(!!t?.closest("[data-petals-off]"));
    };

    let prev = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      // where the ring wants to be (and how big), if this hover qualifies
      let ex = mouse.current.x;
      let ey = mouse.current.y;
      let erx = 0;
      let ery = 0;
      if (orbitEl.current) {
        const r = orbitEl.current.getBoundingClientRect();
        const l = Math.max(0, r.left);
        const t = Math.max(0, r.top);
        const rr = Math.min(window.innerWidth, r.right);
        const b = Math.min(window.innerHeight, r.bottom);
        const w = rr - l;
        const h = b - t;
        if (w > 8 && h > 8 && w <= RING_MAX_W && h <= RING_MAX_H) {
          ex = (l + rr) / 2;
          ey = (t + b) / 2;
          // hug the shape, but never let the ring run off screen
          erx = Math.max(24, Math.min(w / 2 + 20, ex - 10, window.innerWidth - ex - 10));
          ery = Math.max(12, Math.min(h / 2 + 20, ey - 10, window.innerHeight - ey - 10));
        }
      }

      // ease the anchor and radii between "follow" and "ring" so entry/exit glide
      orbAmt.current += ((erx > 0 ? 1 : 0) - orbAmt.current) * Math.min(1, dt * 6);

      pets.current.forEach((f, i) => {
        const a = now * 0.001 * f.s + f.ph;
        const px = f.x;
        const ax = mouse.current.x + (ex - mouse.current.x) * orbAmt.current;
        const ay = mouse.current.y + (ey - mouse.current.y) * orbAmt.current;
        const rx = f.r + (erx + f.r * 0.12 - f.r) * orbAmt.current;
        const ry = f.r * 0.8 + (ery + f.r * 0.12 - f.r * 0.8) * orbAmt.current;
        // blend the two vertical shapes by AMPLITUDE — morphing the sine's argument
        // would swing its phase and make the petals flip around
        const sy = Math.sin(a * 1.3) * (1 - orbAmt.current) + Math.sin(a) * orbAmt.current;
        const k = f.k * (1 + orbAmt.current * 0.6);
        f.x += (ax + Math.cos(a) * rx - f.x) * k;
        f.y += (ay + sy * ry - f.y) * k;
        f.rot += (clamp((f.x - px) * 3, -40, 40) + Math.sin(a * 2) * 8 - f.rot) * 0.1;
        const el = imgRefs.current[i];
        if (el) {
          el.style.transform = `translate(${f.x.toFixed(1)}px, ${f.y.toFixed(1)}px) translate(-50%, -50%) rotate(${f.rot.toFixed(1)}deg)`;
        }
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (revealTimer) clearTimeout(revealTimer);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={flockRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] transition-opacity duration-[250ms] ease-out"
    >
      {PETALS.map((o, i) => (
        <img
          key={i}
          ref={(el) => {
            imgRefs.current[i] = el;
          }}
          src={src}
          alt=""
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: o.h,
            willChange: "transform",
            transformOrigin: "50% 80%",
          }}
        />
      ))}
    </div>
  );
};
