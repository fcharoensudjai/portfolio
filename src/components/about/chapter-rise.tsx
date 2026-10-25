"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import { FlipTiles } from "@/components/tiles/flip-tiles";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface ChapterRiseProps {
  basePath: string;
  eyebrow: string;
  title: string;
  /** the hero statement, which the photo rises over — a node, so the page can keep its own markup
   *  for the tail of the line (the petal grows out of the word, not beside it) */
  statement: React.ReactNode;
  image: string;
  alt: string;
  paragraph: string;
}

/**
 * 01 · the statement, and the photo that rises over it.
 *
 * One pinned stage, three layers: the statement (fades and drifts out), the photo (a top-down
 * clip reveal that scales slightly as it lands, with its chapter copy fading in at the bottom) and
 * the tile wall (flips to surface on the way out, handing the page to 02).
 *
 * All of it is driven by one progress value read from the section's own scroll position, written
 * straight to CSS variables — the same approach the recents stage uses, so nothing here re-renders
 * on scroll except the one flag that mounts the chapter copy.
 */
export const ChapterRise = ({ basePath, eyebrow, title, statement, image, alt, paragraph }: ChapterRiseProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLElement | null>(null);
  const exitRef = useRef(0);
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - vh), 0, 1);
      // the reveal owns the first 45% of the stage's scroll, so the photo is fully up well before
      // the wall starts folding it away
      const q = clamp(p / 0.45, 0, 1);

      stage.style.setProperty("--q", q.toFixed(4));
      stage.style.setProperty("--scale", (1 + q * 0.03).toFixed(4));

      if (copyRef.current) copyRef.current.style.opacity = clamp((q - 0.42) / 0.35, 0, 1).toFixed(3);
      if (statementRef.current) {
        statementRef.current.style.opacity = (1 - q).toFixed(3);
        statementRef.current.style.transform = `translateY(${(-q * 2).toFixed(2)}vh)`;
      }

      exitRef.current = clamp((p - 0.58) / 0.3, 0, 1);

      // the copy only decodes once the photo has risen over the statement — mounting it late is
      // what delays the scramble, since a Scramble that mounts in view fires immediately
      if (q > 0.58) setIsLate((was) => was || true);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const getExit = useRef(() => exitRef.current);

  return (
    <section ref={sectionRef} className="relative h-[300vh]" aria-label="introduction">
      <div ref={stageRef} className="sticky top-0 h-[100dvh] overflow-hidden bg-surface">
        <div
          ref={statementRef}
          className="absolute inset-0 grid place-items-center px-6 pb-24 pt-[var(--nav-clearance)] text-center will-change-[opacity,transform] md:px-16 xl:px-20"
        >
          <div className="text-center">{statement}</div>

          {/* ink, not secondary, and the caret on: this is chrome (an affordance), and it's the same
              cue the home hero and the gallery open with — in secondary it read as the last line of
              the statement above it rather than a prompt */}
          <div className="absolute inset-x-0 bottom-6 text-ink">
            <Textbox size="caption">
              {/* the same cue props as the home hero and the gallery: 2s in, hover to replay, and
                  `once={false}` so it decodes again on every re-entry */}
              <Scramble delay={2000} hover={true} interval={20} once={false}>
                {"[ scroll for more ] "}
              </Scramble>
            </Textbox>
          </div>
        </div>

        <figure
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(calc((1 - var(--q, 0)) * 100%) 0 0 0)" }}
        >
          <Image
            src={`${basePath}${image}`}
            alt={alt}
            fill
            loading="eager"
            style={{ objectPosition: "center 42%" }}
            className="object-cover [transform:scale(var(--scale,1))] will-change-transform"
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[62%]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,19,19,0) 0%, rgba(20,19,19,0.5) 42%, rgba(20,19,19,0.94) 100%)",
            }}
          />

          <figcaption
            ref={copyRef}
            className="absolute bottom-0 left-0 z-[2] max-w-[56rem] px-6 pb-[9vh] opacity-0 md:px-16 xl:px-20"
          >
            {/* the eyebrow sits a step clear of the title — `mb-1` read as one block with it */}
            <div className="mb-2 text-[rgba(232,231,226,0.7)]">
              <Textbox size="label" caret={false}>
                <span className="tracking-[0.06em]">{eyebrow}</span>
              </Textbox>
            </div>
            <div className="mb-3 md:mb-4">
              <Title size="display">{title}</Title>
            </div>
            <div className="max-w-[52rem] text-[rgba(232,231,226,0.82)]">
              <Textbox size="caption" caret={false}>
                {isLate ? (
                  <Scramble delay={400} once={false} preScrambled>
                    {paragraph}
                  </Scramble>
                ) : (
                  // The copy mounts only once the photo has landed (a Scramble that mounts in view
                  // fires immediately), but the figcaption is bottom-anchored — so without something
                  // holding the paragraph's own height the header sat two lines lower on first paint
                  // and jumped up the moment the text mounted. Same string, same mono measure, so the
                  // line count and the height are identical.
                  <span className="invisible" aria-hidden style={{ lineHeight: "inherit" }}>
                    {paragraph}
                  </span>
                )}
              </Textbox>
            </div>
          </figcaption>
        </figure>

        <FlipTiles getProgress={getExit.current} rake={0.1} jitter={0.035} style={{ zIndex: 4 }} />
      </div>
    </section>
  );
};
