"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Scramble } from "@/components/stylers/scramblerthai";
import { useHoverTracker } from "@/components/card/shared/use-hover-tracker";
import { Title } from "@/components/title";

export interface BtsFrame {
  screenshot: string;
  alt: string;
}

interface BtsStageProps {
  frames: BtsFrame[];
  href: string;
  basePath: string;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

const TRACKER_WIDTH = 175;
const TRACKER_HEIGHT = 50;

/** Room above and below the frame for the two heading words to live in once the curtain is open.
 *  Without it a portrait piece (raven's stills are 4:5) takes the full stage height, so the words
 *  end up sitting on the artwork instead of bracketing it. */
const WORD_ROOM = 176;

/** Viewport heights of scroll per frame. The section's entire length is this one number times the
 *  frame count — 0.4 puts 14 stills on 5.6 screens of scrub instead of 7.4 screens of column. */
const PER_FRAME = 0.4;

/** The pinned scrub: one frame, scroll wipes through the process stills in place, so the piece
 *  builds in front of you instead of marching past as a film reel. Each frame is revealed top-down
 *  over the one before it by its own slice of the scroll, which is why consecutive stills read as
 *  the drawing continuing rather than as the image being replaced. */
export const BtsStage = ({ frames, href, basePath, onContextMenu }: BtsStageProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const firstFrameRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  // the two heading words open as the section pins, and stay open for the whole scrub — the drift
  // the section had before, now framing the scrub instead of a scrolling column
  const [isExpanded, setIsExpanded] = useState(false);
  const [offset, setOffset] = useState({ y: 0, x: 0 });

  // the frame hugs the piece's own aspect — raiden's stills are 16:9, raven's are 4:5 — so it is
  // always the largest frame the screen allows and never letterboxed in either piece
  const [ratio, setRatio] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // read off the node rather than an onLoad prop: a cached image can finish loading before
  // hydration, in which case the load event never reaches React and the frame never measures
  useEffect(() => {
    const read = () => {
      const img = firstFrameRef.current?.querySelector("img");
      if (!img || !img.naturalWidth) return;
      setRatio(img.naturalWidth / img.naturalHeight);
    };
    read();
    const img = firstFrameRef.current?.querySelector("img");
    img?.addEventListener("load", read);
    return () => img?.removeEventListener("load", read);
  }, []);

  const { isHovered, cursorPosition, handleMouseEnter, handleMouseLeave, handleMouseMove } = useHoverTracker({
    trackerWidth: TRACKER_WIDTH,
    trackerHeight: TRACKER_HEIGHT,
    clampCursor: ({ mouseX, mouseY, containerWidth, containerHeight }) => ({
      x: Math.min(Math.max(mouseX, TRACKER_WIDTH / 2), containerWidth - TRACKER_WIDTH / 1.6),
      y: Math.min(Math.max(mouseY, TRACKER_HEIGHT / 2), containerHeight - TRACKER_HEIGHT),
    }),
  });

  useEffect(() => {
    if (!ratio) return;
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      let w = stage.clientWidth;
      let h = w / ratio;
      // the frame never takes the whole stage: WORD_ROOM is held back above and below so the two
      // words have somewhere to land. Landscape pieces are width-bound anyway and don't move.
      const availH = Math.max(160, stage.clientHeight - WORD_ROOM);
      if (h > availH) {
        h = availH;
        w = h * ratio;
      }
      setSize({ w: Math.round(w), h: Math.round(h) });
      // the words travel to just outside the frame, so they always bracket the artwork no matter
      // which piece or window size this is
      setOffset({ y: h / 2 + 40, x: 0.1 * window.innerWidth });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [ratio]);

  // written straight to the nodes rather than through state: 14 frames re-rendering on every scroll
  // tick is the one thing that would make a scrub stutter
  useEffect(() => {
    const track = trackRef.current;
    if (!track || frames.length === 0) return;

    const n = frames.length;
    let frameId = 0;

    const paint = () => {
      frameId = 0;
      const trackTop = track.getBoundingClientRect().top;
      const scrub = track.offsetHeight - window.innerHeight;
      if (scrub <= 0) return;

      // the words open exactly as the pin locks, and close again on the way back up. Gating on the
      // pin rather than "half arriving" means the split always happens with both words on screen —
      // triggering it earlier sent "the scenes" flying off the bottom edge while it was still coming up
      const shouldExpand = trackTop <= 0;
      setIsExpanded((prev) => (prev === shouldExpand ? prev : shouldExpand));

      const travelled = -trackTop;
      const progress = Math.min(1, Math.max(0, travelled / scrub));
      const pos = progress * n;
      const active = Math.min(n - 1, Math.floor(pos));
      const local = active >= n - 1 ? 1 : pos - active;

      frameRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i < active) {
          el.style.clipPath = "none";
          el.style.opacity = "1";
        } else if (i === active) {
          el.style.clipPath = active > 0 ? `inset(${(1 - local) * 100}% 0% 0% 0%)` : "none";
          el.style.opacity = "1";
        } else {
          el.style.clipPath = "none";
          el.style.opacity = "0";
        }
      });
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [frames.length]);

  if (frames.length === 0) return null;

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `calc(100dvh + ${Math.round(frames.length * PER_FRAME * 100)}dvh)` }}
    >
      {/* overflow-hidden is load-bearing: the curtain panels translate a half-frame past the stage,
          and translated children escape their parent's box. Without this they paint over whatever
          section comes next — the gallery carousel's heading was being covered by a surface panel
          that had no business still being on screen. */}
      {/* petals off for the whole stage, not just the frame: this section is the one that comes
          apart as you scrub, so the flock drifting over the words and the curtain reads as a bug */}
      <div data-petals-off className="flex h-[100dvh] flex-col sticky top-0 isolate overflow-hidden">
        <div className="min-h-0 flex-1 px-6 pb-6 pt-[var(--nav-clearance)] md:px-16 xl:px-20">
          <div ref={stageRef} className="relative flex h-full w-full items-center justify-center">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="watch the timelapse"
              data-nav-sample-ignore="true"
              className="relative block overflow-hidden rounded-xl bg-surface-mid"
              style={{ width: size.w || "100%", height: size.h || "100%", cursor: isHovered ? "none" : "pointer" }}
              onMouseEnter={(e) => {
                handleMouseEnter();
                // seed the tracker on entry: without this the cursor position is still (0,0) until
                // the first mousemove, and the bracket renders half outside the frame
                handleMouseMove(e);
              }}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {frames.map((frame, i) => (
                <div
                  key={frame.screenshot}
                  ref={(el) => {
                    frameRefs.current[i] = el;
                    if (i === 0) firstFrameRef.current = el;
                  }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image
                    src={`${basePath}${frame.screenshot}`}
                    alt={frame.alt}
                    fill
                    sizes="(min-width: 1280px) 70vw, 90vw"
                    quality={85}
                    // eager but NOT priority: the frame needs the first still's dimensions before the
                    // section is reached, but a preload here would compete with the banner for LCP
                    loading={i === 0 ? "eager" : "lazy"}
                    onContextMenu={onContextMenu}
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                  />
                </div>
              ))}

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-surface-mid bg-opacity-60 backdrop-blur-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <motion.div
                      className="border-corner absolute z-20 flex items-center justify-center"
                      style={{
                        top: cursorPosition.y - TRACKER_HEIGHT / 2 + 10,
                        left: cursorPosition.x - TRACKER_WIDTH / 2 + 10,
                        width: TRACKER_WIDTH,
                        height: TRACKER_HEIGHT,
                      }}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 1.3 }}
                      transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Scramble interval={20} hover={true}>
                        {" see timelapse "}
                      </Scramble>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </a>

            {/* the curtain the section always had: two surface panels meeting at the frame's centre,
                with the words riding the seam. Closed they hide the artwork — which is what makes the
                section arrive as a blank page with "behind the scenes" on it — then they part to
                exactly the frame's top and bottom edges as it pins.
                Each panel is 50% + 1px tall so they overlap at the seam (at 50/50 a fractional stage
                height rounds them apart and leaves a hairline of artwork showing), and 13px wider than
                the stage each side so their vertical edges are never within a pixel of the artwork —
                at stage width they land a fraction of a pixel inside the frame and antialias into a
                sliver down its edge. */}
            <motion.div
              className="pointer-events-none absolute -inset-x-2 top-0 z-10 bg-surface"
              style={{ height: "calc(50% + 1px)" }}
              animate={{ y: isExpanded ? -size.h / 2 : 0 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.div
              className="pointer-events-none absolute -inset-x-2 bottom-0 z-10 bg-surface"
              style={{ height: "calc(50% + 1px)" }}
              animate={{ y: isExpanded ? size.h / 2 : 0 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* the two words sit on the seam and drift out past the panels' new edges.
                pointer-events-none keeps the frame's hover alive underneath them. */}
            <motion.div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex flex-row items-center space-x-[0.5rem] md:space-x-[1rem]">
                <motion.div
                  animate={{ y: isExpanded ? -offset.y : 0, x: isExpanded ? -offset.x : 0 }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Title> behind </Title>
                </motion.div>

                <motion.div
                  animate={{ y: isExpanded ? offset.y : 0, x: isExpanded ? offset.x : 0 }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Title> the scenes </Title>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
