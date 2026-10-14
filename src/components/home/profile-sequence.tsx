"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Poppins } from "next/font/google";
import { Button } from "@/components/button";
import { Scramble } from "@/components/stylers/scramblerthai";
import Fader from "@/components/stylers/fader";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type PetalKey = "pl" | "pr" | "pu" | "pb";

const A0: Record<PetalKey, number> = { pl: Math.PI + 0.25, pr: -0.25, pu: -Math.PI / 2 - 0.2, pb: Math.PI / 2 + 0.2 };
const SWEEP: Record<PetalKey, number> = { pl: 4.6, pr: 5.3, pu: 4.9, pb: 5.6 };
const GX: Record<PetalKey, number> = { pl: -0.3, pr: 0.25, pu: -0.15, pb: 0.3 };
const GY: Record<PetalKey, number> = { pl: -1.2, pr: -0.9, pu: -1.6, pb: -1.1 };
const K: Record<PetalKey, number> = { pl: 0.6, pr: 1, pu: 0.8, pb: 0.45 };
const PETAL_KEYS: PetalKey[] = ["pl", "pr", "pu", "pb"];

/**
 * The landing intro, ported from home-preview-6.html (#profile): as the section
 * scrolls into view the flower spirals in from the top and settles, then the
 * petals break off on the wind while the manifesto line scrambles in beneath it.
 * No sticky pinning — the whole thing rides the page scroll so it stays visible.
 */
export const ProfileSequence = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const rose = isDark ? "#CD7A7A" : "#DDA6A6";
  const sand = isDark ? "#BFAF9C" : "#7A736F";

  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const flowerRef = useRef<SVGSVGElement | null>(null);
  const petalsRef = useRef<Partial<Record<PetalKey, SVGPathElement | null>>>({});
  const dmRef = useRef<SVGRectElement | null>(null);

  const stateRef = useRef({
    angle: 0,
    dir: 1,
    mul: 1,
    boost: 1,
    hover: false,
    fast: false,
    lastY: 0,
    lastT: 0,
    formed: 0,
    decay: 0,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const flower = flowerRef.current;
    if (!wrap || !flower) return;

    const st = stateRef.current;
    const onEnter = () => {
      st.hover = true;
    };
    const onLeave = () => {
      st.hover = false;
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    st.lastY = window.scrollY;
    st.lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - st.lastY;
      const dt = Math.max(1, now - st.lastT);
      if (dy > 0) st.dir = 1;
      else if (dy < 0) st.dir = -1;
      if (Math.abs(dy) > 8 && (Math.abs(dy) / dt) * 1000 > 260) st.fast = true;
      clearTimeout(st.decay);
      st.decay = window.setTimeout(() => (st.fast = false), 120);
      st.lastY = window.scrollY;
      st.lastT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      step(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    function step(dt: number) {
      // re-read inside the loop — TS can't carry the outer narrowing into this closure
      const section = sectionRef.current;
      const flower = flowerRef.current;
      if (!section || !flower) return;

      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // spin — faster when scrolling, slower on hover, reverses with direction
      st.mul += ((st.hover ? 0.3 : 1) - st.mul) * Math.min(1, dt * 7);
      st.boost += ((st.fast ? 1.8 : 1) - st.boost) * Math.min(1, dt * 4.5);
      const spinGate = clamp((st.formed - 0.35) / 0.4, 0, 1);
      st.angle = (st.angle + st.dir * 38 * st.mul * st.boost * dt * spinGate) % 360;

      // journey progress, measured against the SECTION's scroll position (like the
      // html): the flower lands when the section top is ~25% down the viewport, which
      // puts the flower itself around the centre of the screen
      const sTop = section.getBoundingClientRect().top;
      const run = clamp((vh * 1.6 - sTop) / (vh * 1.35), 0, 1);
      const enter = clamp((vh * 1.6 - sTop) / (vh * 0.2), 0, 1);

      const swirl = -Math.PI / 2 + (470 / 180) * Math.PI * run;
      const rad = 1 - run * run * (3 - 2 * run);
      const lift = vh * 0.4 * (1 - run) * (1 - run);
      const fDriftX = Math.cos(swirl) * vw * 0.36 * rad;
      const fDriftY = Math.sin(swirl) * vh * 0.38 * rad - vh * 1.35 * (1 - run) - lift;
      const fScale = 0.6 + 0.45 * ease(run);
      flower.style.transform = `translate(${fDriftX.toFixed(1)}px, ${fDriftY.toFixed(1)}px) rotate(${st.angle.toFixed(2)}deg) scale(${fScale.toFixed(3)})`;

      // once settled, the wind lifts the petals away — only after the section has
      // scrolled a good way past the top, so the flower stays intact through the
      // middle of the screen and breaks late
      const winds = clamp((-vh * 0.1 - sTop) / (vh * 0.6), 0, 1);
      PETAL_KEYS.forEach((cls) => {
        const pt = petalsRef.current[cls];
        if (!pt) return;
        const ang = A0[cls] + SWEEP[cls] * run;
        const sep = 1 - clamp((run - 0.45) / 0.55, 0, 1);
        const rx = sep * 250;
        const ry = sep * 180;
        const ox = Math.cos(ang) * rx;
        const oy = Math.sin(ang) * ry;
        const rot = SWEEP[cls] * (1 - run) * 40;
        const w = clamp(winds * K[cls], 0, 1);
        const tx = ox + GX[cls] * w * 230;
        const ty = oy + GY[cls] * w * 230;
        pt.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${(rot + GY[cls] * w * 90).toFixed(1)}deg)`;
        pt.style.opacity = clamp((1 - w) * enter, 0, 1).toFixed(3);
      });
      if (dmRef.current) dmRef.current.style.opacity = clamp(run * (1 - winds), 0, 1).toFixed(3);
      st.formed = run;
      if (run <= 0.01) st.angle = 0;
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      clearTimeout(st.decay);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      aria-label="intro"
      className="relative z-[3] -mt-[40vh] flex min-h-[100dvh] flex-col items-center justify-center bg-surface px-6 text-center md:px-16 xl:px-20"
    >
      <div
        ref={wrapRef}
        className="cursor-pointer"
        style={{ width: "clamp(200px, min(34vh, 34vw), 380px)", aspectRatio: "1" }}
      >
        <svg
          ref={flowerRef}
          viewBox="0 0 396 396"
          aria-hidden="true"
          style={{ width: "100%", height: "100%", display: "block", willChange: "transform", overflow: "visible" }}
        >
          <path
            ref={(el) => {
              petalsRef.current.pl = el;
            }}
            fill={rose}
            style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
            d="M182.526 198.697C182.526 198.697 153.164 142.525 113.39 142.525C73.6169 142.525 38.4934 198.697 38.4934 198.697C38.4934 198.697 73.6169 254.87 113.39 254.87C153.164 254.87 182.526 198.697 182.526 198.697Z"
          />
          <path
            ref={(el) => {
              petalsRef.current.pr = el;
            }}
            fill={rose}
            style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
            d="M355.063 197.415C355.063 197.415 325.701 141.242 285.928 141.242C246.154 141.242 211.031 197.415 211.031 197.415C211.031 197.415 246.154 253.588 285.928 253.588C325.701 253.588 355.063 197.415 355.063 197.415Z"
          />
          <path
            ref={(el) => {
              petalsRef.current.pb = el;
            }}
            fill={rose}
            style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
            d="M197.525 212.037C197.525 212.037 141.352 241.399 141.352 281.173C141.352 320.946 197.525 356.07 197.525 356.07C197.525 356.07 253.698 320.946 253.698 281.173C253.698 241.399 197.525 212.037 197.525 212.037Z"
          />
          <path
            ref={(el) => {
              petalsRef.current.pu = el;
            }}
            fill={rose}
            style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
            d="M196.929 185.734C196.929 185.734 140.756 156.372 140.756 116.599C140.756 76.8253 196.929 41.7019 196.929 41.7019C196.929 41.7019 253.102 76.8253 253.102 116.599C253.102 156.372 196.929 185.734 196.929 185.734Z"
          />
          <rect
            ref={dmRef}
            x="177.364"
            y="198.718"
            width="27.0641"
            height="27.0641"
            transform="rotate(-45 177.364 198.718)"
            fill={sand}
          />
        </svg>
      </div>

      <div className="mt-[clamp(28px,6vh,64px)]">
        <h2
          className="story-head"
          style={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 4.4rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
            marginBottom: "clamp(14px, 2.5vh, 24px)",
          }}
        >
          from bangkok
          <br />
          to london
        </h2>
        <div
          style={{
            fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
            lineHeight: 1.6,
            maxWidth: "36em",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div>
            <Scramble interval={20} delay={400}>
              working in finance and tech,
            </Scramble>
          </div>
          <div>
            <Scramble interval={20} delay={400}>
              creating art whenever i can.
            </Scramble>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(26px,5vh,48px)]">
        <Fader enterDelay={0.8} once={true}>
          <Button href="/about"> more about me </Button>
        </Fader>
      </div>
    </section>
  );
};
