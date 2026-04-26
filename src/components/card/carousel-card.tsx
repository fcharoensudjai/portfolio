"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ImageFrame } from "@/components/card/shared/imageframe";
import { Title } from "@/components/title";
import { useExitAnimation } from "@/app/contexts/exitcontext";
import { Scramble } from "@/components/stylers/scramblerthai";

interface CarouselCardProps {
  src: string;
  alt: string;
  title: string;
  href?: string;
  className?: string;
  ctaText?: string;
  wide?: boolean;
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
  src,
  alt,
  title,
  href = "/gallery",
  className,
  ctaText = "view gallery",
  wide = false,
}) => {
  const path = usePathname();
  const { theme } = useTheme();
  const { setIsExit } = useExitAnimation();
  const [showOverlay, setShowOverlay] = React.useState(false);

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
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      className={`group/card isolate relative flex-shrink-0 overflow-hidden rounded-xl aspect-[16/10] ${
        wide ? "w-[280px] sm:w-[320px] lg:w-[470px] xl:w-[520px]" : "w-[200px] sm:w-[210px] lg:w-[230px]"
      } ${className ?? ""}`}
      aria-label={`${title} — ${ctaText}`}
    >
      <ImageFrame src={src} alt={alt} pulsePlaceholder={true} className="inset-0" imageClassName="scale-100" />

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className={`absolute inset-0 z-[18] pointer-events-none backdrop-blur-[1px] ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} bg-opacity-55`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 h-[38%] z-[15] pointer-events-none bg-gradient-to-t from-black via-black/65 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 lg:p-5 text-text-dark">
        <div className="lowercase leading-tight">
          <Title size="carousel">{title.toLowerCase()}</Title>
        </div>

        <div className="mt-0.2 md:mt-0.5 lg:mt-1 w-fit pointer-events-auto group/cta">
          <div className="flex items-center gap-0.5 sm:gap-0.75 md:gap-1 text-xxs sm:text-xs text-text-dark lowercase">
            <Scramble hover={true} navigate={showOverlay} interval={20}>{`[ ${ctaText.toLowerCase()}`}</Scramble>
            <span className="inline-block transition-transform duration-300 ease-out group-hover/card:translate-x-[25%]">
              →
            </span>
            <span>]</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
