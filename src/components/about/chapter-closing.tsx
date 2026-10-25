"use client";

import { useEffect, useRef } from "react";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type PetalKey = "pl" | "pr" | "pb" | "pu";

const PETAL_KEYS: PetalKey[] = ["pl", "pr", "pb", "pu"];

/**
 * One gust, and it blows to the right: every petal crosses the frame edge before it ever sinks as
 * far as the copy, so they leave the scene instead of dissolving inside it.
 *
 * Nothing about a gust is uniform though — heading, distance and easing differ per petal, so they
 * spread apart the way petals actually do once they're in the air rather than sliding as a clump.
 * `deg` is measured from straight-right, positive downwards, so these are shallow, mostly sideways.
 */
const WIND: Record<PetalKey, { deg: number; travel: number; ease: number; wob: number; phase: number }> = {
  pb: { deg: 12, travel: 1150, ease: 1.25, wob: 26, phase: 4.1 },
  pl: { deg: 18, travel: 1000, ease: 1.1, wob: 18, phase: 0.6 },
  pr: { deg: 22, travel: 1100, ease: 1.35, wob: 30, phase: 2.4 },
  pu: { deg: 26, travel: 950, ease: 1.05, wob: 22, phase: 1.3 },
};

/** when each petal lets go, as a fraction of the gust */
const LAUNCH: Record<PetalKey, number> = { pl: 0, pu: 0.1, pr: 0.22, pb: 0.34 };
const TUMBLE: Record<PetalKey, number> = { pl: 18, pr: -26, pu: 22, pb: -14 };

const PATHS: Record<PetalKey, string> = {
  pl: "M182.526 198.697C182.526 198.697 153.164 142.525 113.39 142.525C73.6169 142.525 38.4934 198.697 38.4934 198.697C38.4934 198.697 73.6169 254.87 113.39 254.87C153.164 254.87 182.526 198.697 182.526 198.697Z",
  pr: "M355.063 197.415C355.063 197.415 325.701 141.242 285.928 141.242C246.154 141.242 211.031 197.415 211.031 197.415C211.031 197.415 246.154 253.588 285.928 253.588C325.701 253.588 355.063 197.415 355.063 197.415Z",
  pb: "M197.525 212.037C197.525 212.037 141.352 241.399 141.352 281.173C141.352 320.946 197.525 356.07 197.525 356.07C197.525 356.07 253.698 320.946 253.698 281.173C253.698 241.399 197.525 212.037 197.525 212.037Z",
  pu: "M196.929 185.734C196.929 185.734 140.756 156.372 140.756 116.599C140.756 76.8253 196.929 41.7019 196.929 41.7019C196.929 41.7019 253.102 76.8253 253.102 116.599C253.102 156.372 196.929 185.734 196.929 185.734Z",
};

interface ChapterClosingProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

/**
 * 05 · the flower. It turns on its own frame loop rather than on scroll, so it keeps spinning while
 * you read; the moment the section starts to leave, the gust takes it apart.
 *
 * The wind is computed in SCREEN space and inverse-rotated back into the flower's own frame, so the
 * petals always leave along the same heading no matter where the spin happened to stop.
 */
export const ChapterClosing = ({ eyebrow, title, paragraphs }: ChapterClosingProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const flowerRef = useRef<SVGSVGElement | null>(null);
  const petalRefs = useRef<Partial<Record<PetalKey, SVGPathElement | null>>>({});
  const coreRef = useRef<SVGRectElement | null>(null);

  const spinRef = useRef(0);
  const boostRef = useRef(1);
  const lastYRef = useRef(0);
  const dirSignRef = useRef(1);
  const windStateRef = useRef(-1);
  const drawnSpinRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const flower = flowerRef.current;
    if (!section || !flower) return;

    const driveFlower = (winds: number) => {
      const spin = spinRef.current;
      flower.style.transform = `rotate(${spin.toFixed(1)}deg)`;

      // undo the group rotation so the gust is measured on screen, not in the flower's frame
      const inv = (-spin * Math.PI) / 180;
      const cs = Math.cos(inv);
      const sn = Math.sin(inv);

      for (const key of PETAL_KEYS) {
        const el = petalRefs.current[key];
        if (!el) continue;
        const spec = WIND[key];
        const w = clamp((winds - LAUNCH[key]) / (1 - LAUNCH[key]), 0, 1);
        const smooth = w * w * (3 - 2 * w);
        const e = Math.pow(smooth, spec.ease);
        const r = e * spec.travel;
        const rad = (spec.deg * Math.PI) / 180;
        // a shallow flutter across the path, growing as they pick up speed: nothing in a gust
        // travels in a straight line, and a shared curve is what makes a group read as a formation
        const wob = Math.sin(e * 6.2 + spec.phase) * spec.wob * e;
        const fx = Math.cos(rad) * r - Math.sin(rad) * wob;
        const fy = Math.sin(rad) * r + Math.cos(rad) * wob;
        const tx = fx * cs - fy * sn;
        const ty = fx * sn + fy * cs;

        el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) rotate(${(TUMBLE[key] * e).toFixed(1)}deg)`;
        // by now they are past the edge — this only exists so a very tall viewport can't leave one
        // parked at the end of its travel
        el.style.opacity = clamp((1 - e) / 0.06, 0, 1).toFixed(3);
      }

      const core = coreRef.current;
      if (core) {
        const c = clamp(winds / 0.55, 0, 1);
        core.style.opacity = clamp(1 - c, 0, 1).toFixed(3);
        core.setAttribute("transform", `rotate(${(-45 + c * 200).toFixed(1)} 177.364 198.718)`);
      }
    };

    let raf = 0;
    let last = performance.now();
    lastYRef.current = window.scrollY;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.bottom > 0 && rect.top < vh) {
        const y = window.scrollY;
        const d = Math.abs(y - lastYRef.current);
        if (y > lastYRef.current) dirSignRef.current = 1;
        else if (y < lastYRef.current) dirSignRef.current = -1;
        lastYRef.current = y;

        // the break starts the moment the section begins to leave, and the spin dies with it —
        // a flower coming apart shouldn't still be whirling
        const winds = clamp(-rect.top / (vh * 0.5), 0, 1);
        const damp = 1 - clamp(winds * 4, 0, 1);

        boostRef.current += ((d > 6 ? 1.9 : 1) - boostRef.current) * Math.min(1, dt * 5);
        spinRef.current = (spinRef.current + dirSignRef.current * 38 * boostRef.current * damp * dt) % 360;

        // the petals only need redrawing when the gust moves; between steps the flower itself
        // keeps turning, so update just the group
        const q = Math.round(winds * 80) / 80;
        if (q !== windStateRef.current) {
          windStateRef.current = q;
          drawnSpinRef.current = spinRef.current;
          driveFlower(q);
        } else if (Math.abs(spinRef.current - drawnSpinRef.current) > 0.05) {
          drawnSpinRef.current = spinRef.current;
          flower.style.transform = `rotate(${spinRef.current.toFixed(1)}deg)`;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    driveFlower(0);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 py-[16vh] md:px-16 xl:px-20"
      aria-label={title}
    >
      <div className="flex w-full flex-col items-center gap-[clamp(20px,4.5vh,52px)] text-center">
        <svg
          ref={flowerRef}
          viewBox="0 0 396 396"
          aria-hidden="true"
          className="aspect-square w-[clamp(180px,min(33vh,34vw),380px)] flex-none overflow-visible [&_path]:origin-center [&_path]:[transform-box:view-box] [&_path]:will-change-transform"
        >
          {PETAL_KEYS.map((key) => (
            <path
              key={key}
              ref={(el) => {
                petalRefs.current[key] = el;
              }}
              fill="rgb(var(--c-rose))"
              d={PATHS[key]}
            />
          ))}
          <rect
            ref={coreRef}
            x="177.364"
            y="198.718"
            width="27.0641"
            height="27.0641"
            transform="rotate(-45 177.364 198.718)"
            fill="rgb(var(--c-sand))"
          />
        </svg>

        <div className="relative z-[1] w-full max-w-[44rem]">
          <div className="mb-2 text-ink-secondary">
            <Textbox size="label" caret={false}>
              <span className="tracking-[0.06em]">{eyebrow}</span>
            </Textbox>
          </div>
          <div className="fixed-line-spacing mb-3 md:mb-4">
            <Title size="display">{title}</Title>
          </div>
          <div className="text-ink-secondary">
            <Textbox size="caption" caret={false}>
              <Scramble delay={400} once={false} preScrambled>
                {paragraphs.join(" ")}
              </Scramble>
            </Textbox>
          </div>
        </div>
      </div>
    </section>
  );
};
