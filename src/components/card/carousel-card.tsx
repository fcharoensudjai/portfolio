"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageFrame } from "@/components/card/shared/imageframe";
import { Title } from "@/components/title";
import { useExitAnimation } from "@/app/contexts/exitcontext";

interface CarouselCardProps {
  src: string;
  alt: string;
  title: string;
  href?: string;
  className?: string;
  ctaText?: string;
  year?: string;
  /** Focal point the square crop is centred on, e.g. "64% 33%". */
  focus?: string;
  /** True while another tile in the same row is hovered — the rest of the row drops back. */
  dimmed?: boolean;
}

// TARGET is the share of the artwork a square frame gets to keep. A square takes a different slice
// out of a 1.78 wide than out of a 0.71 tall, so equalising the *loss* per piece (rather than the
// zoom) is what stops some tiles reading as whole and others as mangled.
const CROP_TARGET = 0.58;
const CROP_FALLBACK = 1.5;

export const CarouselCard: React.FC<CarouselCardProps> = ({
  src,
  alt,
  title,
  href = "/gallery",
  className,
  ctaText = "view gallery",
  year,
  focus = "50% 32%",
  dimmed = false,
}) => {
  const path = usePathname();
  const { setIsExit } = useExitAnimation();
  const [crop, setCrop] = React.useState(CROP_FALLBACK);

  const handleImageLoad = (img: HTMLImageElement) => {
    const aspect = img.naturalWidth / img.naturalHeight;
    if (!aspect) return;
    setCrop(Math.max(1, Math.min(aspect, 1 / aspect) / CROP_TARGET));
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const baseCurrentPath = path.split("#")[0];
    const baseHref = href.split("#")[0];

    if (baseCurrentPath === baseHref) {
      return;
    }

    event.preventDefault();
    setIsExit(true);
    await sleep(800);
    setIsExit(false);

    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    window.location.href = window.location.origin + base + href;
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      // the row dims as a whole while it is hovered: every tile drops back, the hovered one comes
      // back to full strength and lifts above its neighbours. data-petals-off hands the language of
      // the hover to the artwork itself, the same way the recents stage does for its frame.
      data-petals-off
      className={`group/card isolate relative flex-shrink-0 overflow-hidden rounded-xl aspect-square w-[min(clamp(220px,38vh,400px),78vw)] cursor-pointer ${
        dimmed ? "opacity-60" : "opacity-100"
      } hover:z-10 hover:scale-[1.05] hover:opacity-100 ${className ?? ""}`}
      style={{ transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease" }}
      aria-label={`${title} – ${ctaText}`}
    >
      <ImageFrame
        src={src}
        alt={alt}
        pulsePlaceholder={true}
        className="inset-0"
        objectPosition={focus}
        imageStyle={{ transform: `scale(${crop})` }}
        onImageLoad={handleImageLoad}
      />

      {/* no hover on touch, so the caption stays put there instead of hiding the name entirely.
          the text is pinned to the light ink rather than `ink`: the scrim behind it is always dark,
          so in light mode an inherited ink would be near-black on near-black. */}
      <div className="absolute inset-0 z-[15] flex flex-col justify-end p-4 lg:p-5 text-[#E8E7E2] bg-[linear-gradient(180deg,rgba(18,18,18,0)_45%,rgba(18,18,18,0.74))] opacity-0 transition-opacity duration-[350ms] ease-in group-hover/card:opacity-100 [@media(hover:none)]:opacity-100">
        <Title size="carousel">{title.toLowerCase()}</Title>
        {year ? <span className="font-mono text-xs opacity-[0.62]">{year}</span> : null}
      </div>
    </Link>
  );
};
