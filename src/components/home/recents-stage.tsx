"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Title } from "@/components/title";
import { Button } from "@/components/button";
import { Textbox } from "@/components/textbox";
import { UnderlinedLink } from "@/components/underlinedlink";
import { Scramble } from "@/components/stylers/scramblerthai";

export interface RecentsStageItem {
  id: number;
  title: string;
  caption: string;
  image: string;
  alt: string;
  href: string;
}

/**
 * The pieces the stage cycles through. Written as a list so the stage is N-ready:
 * add an item and the wrapper grows, the bands re-divide and the wipe chains on
 * its own. The captions are the home-page teasers (shorter than `artworks.ts`,
 * which drives /recents/[id]) — worth pointing both at one source later.
 */
export const recentItems: RecentsStageItem[] = [
  {
    id: 1,
    title: "raiden shogun",
    caption:
      "Raiden Shogun has been my favourite character from Genshin Impact for the longest time, and so I wanted to capture her energy. Inspired by the League of Legends splash art styles, this is one of the biggest digital canvases I've ever worked on, and I'm really happy with how it turned out.",
    image: "/images/raiden-shogun/raiden-home.png",
    alt: "snippet of raiden shogun",
    href: "/recents/1",
  },
  {
    id: 2,
    title: "raven",
    caption:
      'I joined a "Draw This In Your Style Challenge" for Raven, a character by another artist. It was a great learning experience, especially for drawing metal and improving on backgrounds. This project helped me grow as an artist, and I was very happy to be featured on the front of the artist\'s post!',
    image: "/images/raven/raven-home.png",
    alt: "snippet of raven",
    href: "/recents/2",
  },
];

// Geometry, ported from home-preview-6 and generalised to N pieces: the wrapper gives the
// stage itself 100vh, plus 110vh of scroll for every piece-to-piece handoff.
const BASE_VH = 100;
const VH_PER_HANDOFF = 110;
const WIPE_IN = 0.2; // the incoming layer starts wiping 20% into its band …
const WIPE_LEN = 0.5; // … and is fully in 50% later (preview-6: (p - 0.2) / 0.5)
const SWITCH_AT = 0.45; // the copy swaps here (the scramble covers this)
// how far back past the switch the copy has to be dragged before it returns to the previous piece.
// without this a slow scroll parked on the threshold flips the two slides against each other every
// frame, which reads as the text shaking. the forward crossing stays exactly at SWITCH_AT so the
// timing still matches preview-6.
const SWITCH_HYSTERESIS = 0.05;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const pad = (n: number) => String(n).padStart(2, "0");

const textBoxWidth = 150;
const textBoxHeight = 50;

/**
 * The handoff flourish, ported straight from home-preview-6: a plain time-based scramble — scroll
 * only decides *when* it fires, never how far along it is. Two departures from the preview, both
 * because ours lands on a paragraph rather than a sentence:
 *
 * 1. it writes into one fixed-width box per character instead of rewriting the whole string. Thai
 *    isn't in Roboto Mono, so the placeholders fall back to a system font with different advances —
 *    as a bare string that re-breaks every line on every tick. In a box they just overflow their
 *    slot, and the slot is 1ch: exactly the advance Roboto Mono gives every one of its glyphs. So
 *    the line widths are untouched.
 * 2. spaces stay real space text nodes between nowrap word boxes, so the break opportunities are the
 *    ones the plain string had — a word still can't break part-way through.
 *
 * The glyph is deliberately NOT centred in its slot. Centring repositions it every tick (the
 * placeholders are different widths), which reads as the line vibrating side to side. Anchored to
 * the slot's left edge its position is a constant, and in a monospace face that's also exactly where
 * the font would have put it anyway — the advance start.
 */
const THAI = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ";
const randomChar = () => THAI[Math.floor(Math.random() * THAI.length)];
const scrambleTimers = new WeakMap<HTMLElement, ReturnType<typeof setInterval>>();

/** Rebuilds `host` as fixed-width character boxes and hands the boxes back, in text order. */
function fillFixedChars(host: HTMLElement, text: string) {
  const boxes: HTMLSpanElement[] = [];
  const fragment = document.createDocumentFragment();
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;
    if (!part.trim()) {
      fragment.appendChild(document.createTextNode(part));
      return;
    }
    const word = document.createElement("span");
    word.style.display = "inline-block";
    word.style.whiteSpace = "nowrap";
    // globals.css's `* { line-height: 1.75em }` matches these spans *directly*, so left alone they'd
    // come out 1.75em tall against the paragraph's own 1.6 — every line would grow by 2.4px and the
    // block by 16.8px the moment the boxes are built. `inherit` is an inline style, so it wins, and
    // takes the paragraph's real 1.6 back down to them.
    word.style.lineHeight = "inherit";
    Array.from(part).forEach((char) => {
      const box = document.createElement("span");
      box.style.display = "inline-block";
      box.style.width = "1ch";
      box.style.lineHeight = "inherit";
      box.textContent = char;
      word.appendChild(box);
      boxes.push(box);
    });
    fragment.appendChild(word);
  });
  host.replaceChildren(fragment);
  return boxes;
}

function scramble(el: HTMLElement, text: string, { perTick = 1, ms = 30 } = {}) {
  const running = scrambleTimers.get(el);
  if (running) clearInterval(running);
  const boxes = fillFixedChars(el, text);
  const chars = text.replace(/\s+/g, "");
  let revealed = 0;
  const id = setInterval(() => {
    revealed += perTick;
    const settled = revealed >= chars.length;
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].textContent = settled || i < revealed ? chars[i] : randomChar();
    }
    if (settled) {
      clearInterval(id);
      scrambleTimers.delete(el);
    }
  }, ms);
  scrambleTimers.set(el, id);
}

/**
 * The "recent works" stage: a sticky plate the page scrubs through. Each piece
 * owns a band of scroll; the next one wipes in from the top over the last, both
 * images settle out of a slight zoom as it passes, and the copy swaps mid-band
 * behind a crossfade.
 *
 * The imagery is a pure function of scroll (`--w` clips the layer, `--s` scales
 * the image) so scrolling back up runs the whole handoff in reverse.
 */
export const RecentsStage = ({ items = recentItems }: { items?: RecentsStageItem[] }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const n = items.length;
  const segments = Math.max(1, n - 1);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layers = useRef<Array<HTMLDivElement | null>>([]);

  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  // mirrors `active` for the scroll handler, which needs the current value without re-subscribing
  const activeRef = useRef(0);
  const captionRefs = useRef<Array<HTMLSpanElement | null>>([]);
  // the cursor label is positioned imperatively — a React state write per mousemove would
  // re-render the whole stage on every pointer event
  const overlayLabelRef = useRef<HTMLDivElement | null>(null);

  // rewrite the arriving caption on every handoff. this is what covers the copy swap — preview-6's
  // trick, and the reason its crossfade is allowed to be this gentle. skipped on mount so a
  // first-load scramble doesn't fire before the stage has even been scrolled to. the rates are the
  // preview's own: fast and five characters a tick, because a paragraph needs to clear itself in
  // roughly a second rather than one glyph at a time.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = captionRefs.current[active];
    if (el) scramble(el, items[active].caption, { perTick: 5, ms: 18 });
  }, [active, items]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // The wrapper's own geometry only changes on resize, or when something above it reflows — so it
    // is measured then, and NOT per scroll frame. A getBoundingClientRect() inside the scroll handler
    // forces a synchronous layout on every frame, and the pinned plate then paints against a layout
    // that is a frame behind the compositor's scroll offset. That is what makes pinned content read
    // as wobbling under a smooth scroll.
    let wrapTop = 0;
    let band = 1;
    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      wrapTop = rect.top + window.scrollY;
      band = Math.max(1, rect.height - window.innerHeight);
    };

    const update = () => {
      const p = clamp((window.scrollY - wrapTop) / band, 0, 1);
      // work in band units so N pieces behave exactly like preview-6 does with 2:
      // `seg` is the handoff we're inside, `t` is how far through it we are.
      const u = p * segments;
      const seg = Math.min(segments - 1, Math.floor(u));
      const t = clamp(u - seg, 0, 1);
      const incoming = Math.min(n - 1, seg + 1);
      const wipe = ease(clamp((t - WIPE_IN) / WIPE_LEN, 0, 1));

      layers.current.forEach((el, k) => {
        if (!el) return;
        el.style.setProperty("--w", k === incoming ? wipe.toFixed(3) : k <= seg ? "1" : "0");
        // the arriving image settles out of a deeper zoom; the one being covered
        // only un-zooms a little, so the two never read as the same move
        const scale =
          k === incoming
            ? 1.18 - 0.18 * clamp((t - WIPE_IN) / 0.8, 0, 1)
            : k === seg
              ? 1.12 - 0.12 * clamp(t / 0.4, 0, 1)
              : 1;
        el.style.setProperty("--s", scale.toFixed(3));
      });

      const next = t > SWITCH_AT ? incoming : t < SWITCH_AT - SWITCH_HYSTERESIS ? seg : activeRef.current;
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const remeasure = () => {
      measure();
      update();
    };

    remeasure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", remeasure);
    // the copy above the wrapper reflows once the display font lands, which moves the wrapper
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
    };
  }, [n, segments]);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const label = overlayLabelRef.current;
    if (!label) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clampedX = Math.min(Math.max(x, textBoxWidth / 2), rect.width - textBoxWidth / 1.6);
    const clampedY = Math.min(Math.max(y, textBoxHeight / 2), rect.height - textBoxHeight);
    label.style.transform = `translate(${(clampedX - textBoxWidth / 2 + 10).toFixed(1)}px, ${(
      clampedY -
      textBoxHeight / 2 +
      10
    ).toFixed(1)}px)`;
  };

  return (
    <div className="relative bg-surface">
      <div ref={wrapRef} style={{ height: `${BASE_VH + segments * VH_PER_HANDOFF}vh` }} className="relative">
        {/* the parent (#recents) already carries the page gutters — this stage adds none */}
        {/* The copy column is pinned to the measure (46ch, the same cap the caption carries) and the
            image column takes everything else. That's what keeps the text-to-image distance exactly
            one gap — with a proportional split the copy column grows wider than its own paragraph,
            and all of that surplus reads as space between the two. */}
        {/* The stage is capped by the frame's height budget, not the viewport width: frame height x
            its ratio, plus the copy column (the same 46ch the track and the caption use) plus the
            gap. On a wide, short window the height is what binds, so this narrows the whole block and
            centres it — the surplus becomes equal margins instead of dead space beside the artwork.
            On a normal window the ratio of the two means it never engages at all. */}
        <div className="sticky top-0 mx-auto grid h-[100dvh] max-w-[calc(var(--frame-h)*var(--frame-ratio)+46ch+6.4rem)] grid-cols-1 content-center items-center gap-6 pb-12 pt-[84px] lg:grid-cols-[minmax(280px,46ch)_1fr] lg:gap-x-16 xl:pt-28">
          {/* copy — the slides share one grid cell (so the swap costs no layout) and each is
              top-aligned in it. that's what holds the breadcrumb and the title at the same y on
              every piece: only what hangs below them differs, so only the cta moves. */}
          <div className="order-2 grid lg:order-1">
            {items.map((item, k) => (
              <div
                key={item.id}
                aria-hidden={k !== active}
                // symmetric on purpose, like preview-6: the outgoing copy fades out as the incoming
                // one fades in, and the scramble on the caption covers the moment they overlap
                className={`col-start-1 row-start-1 transition-[opacity,visibility] duration-[450ms] ease-in-out ${
                  k === active ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <div className="font-mono text-xs text-ink-secondary md:text-sm">[ {pad(k + 1)} ]</div>

                <div className="mt-3">
                  <Title size="stage">{item.title}</Title>
                </div>

                {/* the scramble owns this span's glyphs — Textbox only supplies the size and leading.
                    the inline line-height matters: globals.css's `* { line-height: 1.75em }` catches
                    this span directly, so without it the caption leads at 1.75 instead of the
                    Textbox's 1.6 — 2.4px a line that arrive silently with the boxes. */}
                <div className="mt-3 max-w-[46ch] text-ink-secondary">
                  <Textbox size="caption" caret={false}>
                    <span
                      style={{ lineHeight: "inherit" }}
                      ref={(el) => {
                        captionRefs.current[k] = el;
                      }}
                    >
                      {item.caption}
                    </span>
                  </Textbox>
                </div>

                <div className="mt-4">
                  <Button size="sm" href={item.href}>
                    more detail
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* the frame — image on top on mobile, right-hand column from lg */}
          <div className="relative order-1 lg:order-2">
            <div
              // The height is capped by capping the WIDTH, not with a max-height. A max-height on an
              // aspect-ratio box doesn't shrink it, it squashes it — the width stays put and
              // object-cover starts eating the artwork. Capping the width keeps the ratio intact and
              // simply limits how tall it can get. NOT `ml-auto`: right-flushing the frame when this
              // cap bites would push its slack into the text-to-image gap, which is the one space that
              // should stay fixed. The height itself comes from --frame-h so it agrees with the stage.
              className="relative aspect-[1600/1151] w-full overflow-hidden rounded-2xl lg:max-w-[calc(var(--frame-h)*var(--frame-ratio))]"
              // the frame, not the grid cell, owns the cursor: the petal trail fades out over it
              data-petals-off
              onMouseEnter={(e) => {
                setHovering(true);
                handlePointerMove(e);
              }}
              onMouseLeave={() => setHovering(false)}
              onMouseMove={handlePointerMove}
            >
              {items.map((item, k) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    layers.current[k] = el;
                  }}
                  className="absolute inset-0 overflow-hidden"
                  style={k === 0 ? undefined : { clipPath: "inset(calc((1 - var(--w, 0)) * 100%) 0 0 0)" }}
                >
                  <div className="absolute inset-[-4%]">
                    <Image
                      src={`${basePath}${item.image}`}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      quality={70}
                      className="object-cover"
                      style={{ transform: "scale(var(--s, 1))", willChange: "transform" }}
                    />
                  </div>
                </div>
              ))}

              <AnimatePresence>
                {hovering && (
                  <motion.div
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                    style={{ cursor: "none" }}
                  >
                    <div className="absolute inset-0 bg-surface-mid bg-opacity-60 backdrop-blur-[2px]">
                      <div
                        ref={overlayLabelRef}
                        className="absolute left-0 top-0 z-20"
                        style={{ width: textBoxWidth, height: textBoxHeight, willChange: "transform" }}
                      >
                        <motion.div
                          className="border-corner flex h-full w-full items-center justify-center font-mono"
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                        >
                          <UnderlinedLink href={items[active].href} line={false}>
                            <Scramble interval={20} hover={true}>
                              {" more detail "}
                            </Scramble>
                          </UnderlinedLink>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
