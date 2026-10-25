"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/button";
import { Title } from "@/components/title";
import { Scramble } from "@/components/stylers/scramblerthai";
import { useVisibility2 } from "@/app/contexts/introvisibilitycontext";
import { viewportHeight } from "@/app/providers/viewport";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type PetalKey = "pl" | "pr" | "pu" | "pb";

const A0: Record<PetalKey, number> = { pl: Math.PI + 0.25, pr: -0.25, pu: -Math.PI / 2 - 0.2, pb: Math.PI / 2 + 0.2 };
const SWEEP: Record<PetalKey, number> = { pl: 4.6, pr: 5.3, pu: 4.9, pb: 5.6 };
const PETAL_KEYS: PetalKey[] = ["pl", "pr", "pu", "pb"];

// authored in the 396-unit view box each layer renders
const PETAL_PATHS: Record<PetalKey, string> = {
  pl: "M182.526 198.697C182.526 198.697 153.164 142.525 113.39 142.525C73.6169 142.525 38.4934 198.697 38.4934 198.697C38.4934 198.697 73.6169 254.87 113.39 254.87C153.164 254.87 182.526 198.697 182.526 198.697Z",
  pr: "M355.063 197.415C355.063 197.415 325.701 141.242 285.928 141.242C246.154 141.242 211.031 197.415 211.031 197.415C211.031 197.415 246.154 253.588 285.928 253.588C325.701 253.588 355.063 197.415 355.063 197.415Z",
  pb: "M197.525 212.037C197.525 212.037 141.352 241.399 141.352 281.173C141.352 320.946 197.525 356.07 197.525 356.07C197.525 356.07 253.698 320.946 253.698 281.173C253.698 241.399 197.525 212.037 197.525 212.037Z",
  pu: "M196.929 185.734C196.929 185.734 140.756 156.372 140.756 116.599C140.756 76.8253 196.929 41.7019 196.929 41.7019C196.929 41.7019 253.102 76.8253 253.102 116.599C253.102 156.372 196.929 185.734 196.929 185.734Z",
};

// mirrors cover-tiles' `cp`: the fold is fully flipped once the page has scrolled 0.85 viewport
// heights. The wave rises bottom-to-top, so the header's own band is the LAST thing left to flip
// (the top rows sit at pt ≈ 0.91–0.97) — the chrome therefore leaves as the fold is nearly done
// rather than as it starts, with a little travel to spare before the wave reaches it
const COVER_FOLD_VH = 0.85;
const CHROME_AWAY_AT_FOLD = 0.88;

// How the flower follows the scroll. The offset is written by the compositor and arrives on the main
// thread a frame or two later, in clumps: a slow drag hands over nothing on most frames and five
// pixels on the next. A transform copied straight from it therefore stalls and jumps, so the flower
// judders against the content around it. Eased on the frame clock, with the lag capped so a fling
// can't drag it behind.
const FOLLOW_TAU = 0.08; // seconds — smoothing constant for the clumpiness
const FOLLOW_MAX_LAG_PX = 16; // px of scroll the flower is allowed to trail by
const FOLLOW_SNAP = 0.0015;

// how far the page has to move the other way before the spin is allowed to reverse
const DIR_FLIP_PX = 24;

/**
 * The landing intro, ported from home-preview-6.html (#profile): as the section
 * scrolls into view the flower spirals in from the top and settles, then keeps
 * turning while the manifesto line scrambles in beneath it. The petals stay on
 * the flower — the break-away sequence lives on the about page. No sticky
 * pinning — the whole thing rides the page scroll so it stays visible.
 *
 * No sticky pinning — the whole thing rides the page scroll so it stays visible.
 */
export const ProfileSequence = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const rose = isDark ? "#CD7A7A" : "#DDA6A6";
  const sand = isDark ? "#BFAF9C" : "#7A736F";

  const { setIsIntroChromeAway } = useVisibility2();

  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const flowerRef = useRef<HTMLDivElement | null>(null);
  const petalsRef = useRef<Partial<Record<PetalKey, HTMLDivElement | null>>>({});
  const dmRef = useRef<HTMLDivElement | null>(null);

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
    // travel against the current spin direction, since the last reversal
    against: 0,
  });
  // mirrors the context flag so the loop only pushes a render when it actually flips
  const chromeAwayRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    const flower = flowerRef.current;
    if (!section || !wrap || !flower) return;

    const st = stateRef.current;
    const onEnter = () => {
      st.hover = true;
    };
    const onLeave = () => {
      st.hover = false;
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    // the loop needs where the section sits and how tall it is on every frame, but reading a rect
    // for that forces style work on the main thread while iOS is scrolling on another — the whole
    // reason the flower stutters there while the rest of the page is smooth. measure on mount and
    // on a real resize, then subtract scrollY (cheap, no layout) inside the loop
    let sectionTop = 0;
    let sectionH = 0;
    // petal travel is authored in the 396-unit view box, the layers are laid out in px
    let unit = 1;
    const measure = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = rect.top + window.scrollY;
      sectionH = rect.height;
      const w = flower.clientWidth;
      if (w) unit = w / 396;
    };
    measure();
    window.addEventListener("resize", measure);

    st.lastY = window.scrollY;
    st.lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - st.lastY;
      const dt = Math.max(1, now - st.lastT);
      // A reversal is only believed once it has actually travelled. iOS hands the tail of a fling
      // over in both directions, and rubber-banding hands over plenty of it — flipping the spin on
      // one of those wrenches the flower round for a frame or two, right as the page settles.
      if (dy * st.dir < 0) {
        st.against += Math.abs(dy);
        if (st.against > DIR_FLIP_PX) {
          st.dir = -st.dir;
          st.against = 0;
        }
      } else {
        st.against = 0;
      }
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

    // the last `run` the petals were drawn at. they only move with scroll, so a write on a frame
    // where `run` hasn't changed is a repaint of the whole SVG for a motion that isn't happening
    let lastRun = -1;
    // -1 until the first frame has a real value to follow from
    let smoothRun = -1;

    // an arrow, not a function declaration: TS drops a guard's narrowing inside hoisted functions,
    // and `flower` here is the non-null capture from the guard above
    const step = (dt: number) => {
      const vh = viewportHeight();
      const vw = window.innerWidth;

      // spin — faster when scrolling, slower on hover, reverses with direction
      st.mul += ((st.hover ? 0.3 : 1) - st.mul) * Math.min(1, dt * 7);
      st.boost += ((st.fast ? 1.8 : 1) - st.boost) * Math.min(1, dt * 4.5);
      const spinGate = clamp((st.formed - 0.35) / 0.4, 0, 1);
      st.angle = (st.angle + st.dir * 38 * st.mul * st.boost * dt * spinGate) % 360;

      // journey progress, measured against the SECTION's scroll position (like the
      // html): the flower lands when the section top is ~25% down the viewport, which
      // puts the flower itself around the centre of the screen
      const sTop = sectionTop - window.scrollY;
      const raw = clamp((vh * 1.6 - sTop) / (vh * 1.35), 0, 1);

      if (smoothRun < 0) smoothRun = raw;
      smoothRun += (raw - smoothRun) * (1 - Math.exp(-dt / FOLLOW_TAU));
      // …but never let it fall more than a few pixels of scroll behind. The time constant is there
      // to smooth the clumpiness, which only shows at low speed; at fling speed it would leave the
      // flower most of a screen behind and it would lurch to catch up the moment you let go. Capped,
      // the lag stops growing and is gone within a few frames of the page stopping.
      const lag = raw - smoothRun;
      const maxLag = FOLLOW_MAX_LAG_PX / (1.35 * vh);
      if (Math.abs(lag) > maxLag) smoothRun = raw - Math.sign(lag) * maxLag;
      // a flower sitting 0.4px off its landing spot is a flower with its petals fractionally apart
      if (Math.abs(raw - smoothRun) < FOLLOW_SNAP) smoothRun = raw;
      const run = smoothRun;

      // same curve as the raw version, just read off the followed value: 1.35vh of travel over the
      // 0.2vh the petals take to fade up
      const enter = clamp((run * 1.35) / 0.2, 0, 1);

      const swirl = -Math.PI / 2 + (470 / 180) * Math.PI * run;
      const rad = 1 - run * run * (3 - 2 * run);
      const lift = vh * 0.4 * (1 - run) * (1 - run);
      const fDriftX = Math.cos(swirl) * vw * 0.36 * rad;
      const fDriftY = Math.sin(swirl) * vh * 0.38 * rad - vh * 1.35 * (1 - run) - lift;
      const fScale = 0.6 + 0.45 * ease(run);

      // the chrome steps out as the fold nearly closes and comes back the moment the flower has
      // FORMED — run = 1, i.e. it has landed and is holding its shape. Tied to run rather than a
      // threshold so it can't drift out of sync with the landing maths above. keyed off position,
      // not scroll direction, so scrolling back up hides it over exactly the same stretch. this
      // runs even off screen: it's a comparison, not a paint
      const coverFold = window.scrollY / (vh * COVER_FOLD_VH);
      const chromeAway = coverFold >= CHROME_AWAY_AT_FOLD && run < 1;
      if (chromeAway !== chromeAwayRef.current) {
        chromeAwayRef.current = chromeAway;
        setIsIntroChromeAway(chromeAway);
      }

      st.formed = run;
      if (run <= 0.01) st.angle = 0;

      // a screen and a half out either way and none of it can be seen
      if (sTop > vh * 2.6 || sTop < -(sectionH + vh)) {
        lastRun = -1;
        return;
      }

      flower.style.transform = `translate(${fDriftX.toFixed(1)}px, ${fDriftY.toFixed(1)}px) rotate(${st.angle.toFixed(2)}deg) scale(${fScale.toFixed(3)})`;

      // the flower forms and stays whole — the petals no longer break off on the wind (that
      // sequence lives on the about page now), so the only petal motion left is the separation
      // closing as it spirals in
      //
      // exact compare, not a threshold: any tolerance aliases against the scroll's own step and the
      // petals end up moving every other frame at slow speeds, which reads as a stutter
      if (run !== lastRun) {
        lastRun = run;

        PETAL_KEYS.forEach((cls) => {
          const pt = petalsRef.current[cls];
          if (!pt) return;
          const ang = A0[cls] + SWEEP[cls] * run;
          const sep = 1 - clamp((run - 0.45) / 0.55, 0, 1);
          const tx = Math.cos(ang) * sep * 250 * unit;
          const ty = Math.sin(ang) * sep * 180 * unit;
          const rot = SWEEP[cls] * (1 - run) * 40;
          pt.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`;
          pt.style.opacity = enter.toFixed(3);
        });
        if (dmRef.current) dmRef.current.style.opacity = run.toFixed(3);
      }
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      clearTimeout(st.decay);
      // the flower only exists on the landing page — never leave the chrome hidden behind us
      chromeAwayRef.current = false;
      setIsIntroChromeAway(false);
    };
  }, [setIsIntroChromeAway]);

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
        {/* One layer per petal, not paths inside one svg. WebKit rasterises SVG children on the
            main thread: with the flower's own transform on the compositor and its petals repainting
            inside that layer, the two land on different clocks and the petals read as rattling
            against the flower while it moves. As divs they are layer transforms, which only the
            compositor touches. */}
        <div
          ref={flowerRef}
          aria-hidden="true"
          className="relative h-full w-full"
          style={{ willChange: "transform", transformOrigin: "50% 50%" }}
        >
          {PETAL_KEYS.map((key) => (
            <div
              key={key}
              ref={(el) => {
                petalsRef.current[key] = el;
              }}
              className="absolute inset-0"
              style={{ willChange: "transform, opacity", transformOrigin: "50% 50%" }}
            >
              <svg
                viewBox="0 0 396 396"
                style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}
              >
                <path fill={rose} d={PETAL_PATHS[key]} />
              </svg>
            </div>
          ))}

          <div ref={dmRef} className="absolute inset-0" style={{ willChange: "opacity", transformOrigin: "50% 50%" }}>
            <svg viewBox="0 0 396 396" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
              <rect
                x="177.364"
                y="198.718"
                width="27.0641"
                height="27.0641"
                transform="rotate(-45 177.364 198.718)"
                fill={sand}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(28px,6vh,64px)]">
        {/* the headline rides the same display step as a piece title, so the manifesto and the
            recents block are the same size by construction instead of by coincidence. `story-head`
            stays on the wrapper because it's the escape hatch from globals.css's
            `* { line-height: 1.75em }` — without it the h2's own strut leads at 1.75 and the two
            lines drift apart even though the span is `leading-none`. */}
        <h2 className="story-head mb-3 md:mb-4 lowercase">
          <Title size="display">
            from bangkok
            <br />
            to london
          </Title>
        </h2>
        {/* secondary ink — one of the four supporting texts that carries the tier. The size is the
            caption step, spelled the way every other paragraph on the site spells it
            (`text-xs md:text-sm`, which is what `Textbox size="caption"` compiles to): 0.8rem on a
            phone, the body unit from md up — so it holds the 4.4:1 ratio with the display headline
            where the headline is at full size, and matches the recents copy at every width.
            Hard-coding `var(--type-body)` made this the one paragraph that stayed 16px on mobile,
            reading a full step larger than the prose around it. */}
        <div
          className="text-ink-secondary text-xs md:text-sm"
          style={{
            lineHeight: 1.6,
            maxWidth: "36em",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* `lineHeight: inherit` has to sit on the <div>, not on the wrapper above: globals.css's
              `* { line-height: 1.75em }` matches this div *directly*, so it beats the 1.6 the wrapper
              sets and the text leads 2.4px looser than the intro asks for. `inherit` re-reads the
              wrapper's 1.6, and Scramble's boxes inherit it on down from there. */}
          <div style={{ lineHeight: "inherit" }}>
            <Scramble interval={20} delay={400} once={false} preScrambled>
              Working in Finance and tech,
            </Scramble>
          </div>
          <div style={{ lineHeight: "inherit" }}>
            <Scramble interval={20} delay={400} once={false} preScrambled>
              creating art whenever I can.
            </Scramble>
          </div>
        </div>
      </div>

      {/* the same two steps the recents block uses: `space-y-3 md:space-y-4` between the headline and
          the manifesto, and `mt-6 lg:mt-7 xl:mt-10` down to the action. Both were viewport clamps of
          their own here (2.5vh / 5vh, capped at 24 and 48), which is why the pair never quite lined
          up with the rest of the page. */}
      <div className="mt-6 lg:mt-7 xl:mt-10">
        {/* no fade: every other in-page CTA fades in as part of its whole block (recent works, the
            gallery hero), but here the headline and manifesto above are static — so a Fader on the
            button alone landed 0.8s after everything else and read as a stray. It arrives with the
            rest of the intro instead. */}
        {/* sm so it matches the recents stage's "more detail" buttons — one button size for
            in-page actions, and it belongs to the intro's type scale rather than towering over it. */}
        <Button size="sm" href="/about">
          {" "}
          more about me{" "}
        </Button>
      </div>
    </section>
  );
};
