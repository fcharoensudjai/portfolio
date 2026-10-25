"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface ChapterOverProps {
  basePath: string;
  eyebrow: string;
  title: string;
  paragraph: string;
  image: string;
  alt: string;
}

/**
 * 04 · the print. A letterbox that opens out to full bleed while the section is pinned: the frame
 * is full width from the first frame, so what you see is a thin band of artwork growing into the
 * whole screen rather than a small square scaling up in the middle of the charcoal.
 */
export const ChapterOver = ({ basePath, eyebrow, title, paragraph, image, alt }: ChapterOverProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  // The copy only decodes once the print has finished opening out: `useInView` alone fires while the
  // section is still sliding into place — the copy is pinned to the bottom of a 210vh section, so it
  // is technically 10% visible a long way before the bleed completes, and the text was decoding
  // under a letterbox.
  //
  // Tracked, not latched. Latching meant the Scramble stayed mounted after the first pass, so
  // scrolling back up and down again never restarted the decode — it had already resolved while the
  // copy was still at opacity 0. Following the threshold means it unmounts on the way back up (the
  // invisible placeholder holds the height) and remounts at the bleed on the next pass, so the
  // decode runs every time.
  const [isBleed, setIsBleed] = useState(false);
  const bleedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, section.offsetHeight - vh), 0, 1);
      const grow = clamp(p / 0.5, 0, 1);

      stage.style.setProperty("--f", (0.34 + 0.66 * grow).toFixed(4));
      stage.style.setProperty("--s", (1.12 - 0.12 * grow).toFixed(4));
      if (copyRef.current) copyRef.current.style.opacity = clamp((p - 0.48) / 0.18, 0, 1).toFixed(3);

      // grow hits 1 at p = 0.5: the frame is edge to edge from there on, and the copy starts fading
      // at 0.48, so the decode begins just as it becomes visible. Enter at 0.5, leave at 0.46 (still
      // at opacity 0) — hysteresis so parking the scroll on the threshold can't remount the Scramble
      // and restart the decode. The ref keeps this off React until the boolean actually flips.
      const bleed = bleedRef.current ? p >= 0.46 : p >= 0.5;
      if (bleed !== bleedRef.current) {
        bleedRef.current = bleed;
        setIsBleed(bleed);
      }
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

  return (
    <section ref={sectionRef} className="relative h-[210vh] bg-surface" aria-label={title}>
      <div ref={stageRef} className="sticky top-0 h-[100dvh] overflow-hidden">
        <figure
          className="absolute inset-0 z-[1] overflow-hidden"
          style={{
            clipPath: "inset(calc((1 - var(--f, 0.34)) * 50%) 0 calc((1 - var(--f, 0.34)) * 50%) 0)",
          }}
        >
          <Image
            src={`${basePath}${image}`}
            alt={alt}
            fill
            style={{ objectPosition: "center 40%" }}
            className="object-cover grayscale contrast-[1.06] brightness-[.92] [transform:scale(var(--s,1.12))] will-change-transform"
          />
          <div
            className="pointer-events-none absolute inset-0 min-[900px]:hidden"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(20,19,19,0.97) 0%, rgba(20,19,19,0.72) 40%, rgba(20,19,19,0.08) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 hidden min-[900px]:block"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(20,19,19,0.96) 0%, rgba(20,19,19,0.8) 30%, rgba(20,19,19,0.1) 66%, rgba(20,19,19,0) 100%)",
            }}
          />
        </figure>

        {/* the same bottom offset as 01's caption, at every width: both chapters are full-bleed with
            the copy sitting on the bottom edge, so they have to agree or the two read as different
            layouts. The old `md:pb-20` (8.4rem) sat 42px higher than 01's 9vh past 768. */}
        <div
          ref={copyRef}
          className="absolute bottom-0 left-0 z-[2] max-w-[56rem] px-6 pb-[9vh] opacity-0 md:px-16 xl:px-20"
        >
          <div className="mb-2 text-[rgba(232,231,226,0.7)]">
            <Textbox size="label" caret={false}>
              <span className="tracking-[0.06em]">{eyebrow}</span>
            </Textbox>
          </div>
          <div className="fixed-line-spacing">
            <Title size="display">{title}</Title>
          </div>
          <div className="mt-3 md:mt-4 max-w-[52rem] text-[rgba(232,231,226,0.84)]">
            <Textbox size="caption" caret={false}>
              {isBleed ? (
                <Scramble once={false} preScrambled delay={150}>
                  {paragraph}
                </Scramble>
              ) : (
                // holds the paragraph's own height while it is unmounted — the copy is bottom-anchored,
                // so without it the header would sit lower and jump up when the decode starts
                <span className="invisible" aria-hidden style={{ lineHeight: "inherit" }}>
                  {paragraph}
                </span>
              )}
            </Textbox>
          </div>
        </div>
      </div>
    </section>
  );
};
