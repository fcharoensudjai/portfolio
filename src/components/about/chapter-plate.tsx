"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface ChapterPlateProps {
  basePath: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  alt: string;
}

/**
 * 03 · the plate. Copy on the left, a print bleeding off the right edge, both on a slow counter
 * drift: the image tracks down the section while the copy rises, so the pair separates as it
 * passes rather than moving as one block.
 *
 * The image sits at scale 1.45 inside an overflow-hidden frame, which is what buys the parallax
 * its travel without ever showing an edge.
 *
 * From below 900px there is no drift at all. The chapter is one stacked column that owns exactly
 * one viewport, so there is no travel to spend — the copy would just ride out of its own padding
 * and an oversized print would crop itself for no visible gain. Same breakpoint the layout
 * switches at, so the two can't disagree.
 */
export const ChapterPlate = ({ basePath, eyebrow, title, paragraphs, image, alt }: ChapterPlateProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // the drift is a desk-wide effect: below 900px the chapter is a single stacked column sized to
    // the viewport, so the transforms are cleared rather than merely frozen (a stale translate from
    // a resize would otherwise leave the copy sitting off its own padding)
    const wide = window.matchMedia("(min-width: 900px)");

    let raf = 0;
    const paint = () => {
      raf = 0;
      if (!wide.matches) {
        if (imageRef.current) imageRef.current.style.transform = "";
        if (copyRef.current) copyRef.current.style.transform = "";
        return;
      }

      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);

      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${((p - 0.5) * 38).toFixed(2)}%) scale(1.45)`;
      }
      if (copyRef.current) {
        copyRef.current.style.transform = `translateY(${((0.5 - p) * 5.5).toFixed(2)}rem)`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    wide.addEventListener("change", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      wide.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    // One viewport, and on phones it is one column: the copy sits under the nav and the print takes
    // every pixel left over, which is what makes the chapter land as a single screen instead of a
    // screen-and-a-bit. The 46vh of top padding is desk-only — on a phone it pushed the chapter past
    // twice the viewport for a drift that no longer runs there.
    //
    // The prose→print gap is 02's 9vh, not a tight clamp: 01, 02 and 04 all put copy above a print,
    // so the step has to be the same number or 03 reads cramped next to the chapter before it.
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col justify-center gap-[9vh] overflow-hidden pb-[5vh] pt-[var(--nav-clearance)] min-[900px]:grid min-[900px]:items-center min-[900px]:gap-0 min-[900px]:pb-[18vh] min-[900px]:pt-[46vh] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
      aria-label={title}
    >
      <div
        ref={copyRef}
        className="px-6 will-change-transform md:px-16 min-[900px]:max-w-[39rem] min-[900px]:py-0 min-[900px]:pl-16 min-[900px]:pr-[5.5rem] xl:pl-20"
      >
        <div className="mb-2 text-ink-secondary">
          <Textbox size="label" caret={false}>
            <span className="tracking-[0.06em]">{eyebrow}</span>
          </Textbox>
        </div>
        <div className="fixed-line-spacing">
          {/* the last two words are glued with a no-break space: "what i'm up to" wraps somewhere
              around 900–1380, and left alone it broke after "up" and orphaned the "to". With the
              pair glued the only break left is after "i'm", so it reads "what i'm / up to" exactly
              when it has to wrap and stays on one line when it doesn't. */}
          <Title size="display">{title.replace(/ (\S+)$/, "\u00a0$1")}</Title>
        </div>

        {/* the same header→body step the home recents block uses (space-y-3 / md:space-y-4) */}
        <div className="mt-3 md:mt-4 max-w-[52rem] text-ink-secondary">
          <Textbox size="caption" caret={false}>
            <Scramble delay={400} once={false} preScrambled>
              {paragraphs.join(" ")}
            </Scramble>
          </Textbox>
        </div>
      </div>

      {/* the print fills whatever the copy leaves. No aspect ratio of its own below 900px: with the
          chapter pinned to one viewport the leftover height IS the crop, and a fixed 4:3 box left the
          photo shorter than the screen it was supposed to fill. */}
      <figure className="relative mx-6 min-h-[34vh] flex-1 overflow-hidden rounded-xl md:mx-16 min-[900px]:mx-0 min-[900px]:min-h-0 min-[900px]:h-[min(78vh,44rem)] min-[900px]:w-[112%] min-[900px]:flex-none min-[900px]:rounded-r-none">
        {/* no inline scale: the effect owns the transform, so on a phone the print never flashes
            zoomed for a frame before the gate clears it */}
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={`${basePath}${image}`}
            alt={alt}
            fill
            style={{ objectPosition: "center 50%" }}
            className="object-cover"
          />
        </div>
      </figure>
    </section>
  );
};
