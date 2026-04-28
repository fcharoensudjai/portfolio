"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { MobileNav } from "@/components/header/mobilenav";
import { Footer } from "@/components/footer/footer";
import { Contact } from "@/components/contact";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import Image from "next/image";
import { Button } from "@/components/button";
import { artworks, closerLook, bts } from "@/app/(pages)/recents/[id]/artworks";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ImageFrame } from "@/components/card/shared/imageframe";
import { GalleryCarousel } from "@/components/home/gallery-carousel";

export default function Recent() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { theme } = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const { id } = useParams();

  const artworkId = parseInt(id as string, 10);

  const artwork = artworks.find((artwork) => artwork.id === artworkId);

  const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
  };

  const btsTriggerRef = useRef<HTMLDivElement>(null);
  const btsEndTriggerRef = useRef<HTMLDivElement>(null);
  const [isBtsExpanded, setIsBtsExpanded] = useState(false);
  const [isBtsAreaHovered, setIsBtsAreaHovered] = useState(false);
  const [isBtsCtaHovered, setIsBtsCtaHovered] = useState(false);
  const btsHoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldShowBtsCta = isBtsExpanded && (isBtsAreaHovered || isBtsCtaHovered);
  const youtubeLink = artwork?.url ?? (process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/");

  const clearBtsHoverLeaveTimeout = () => {
    if (btsHoverLeaveTimeoutRef.current) {
      clearTimeout(btsHoverLeaveTimeoutRef.current);
      btsHoverLeaveTimeoutRef.current = null;
    }
  };

  const handleBtsAreaMouseEnter = () => {
    clearBtsHoverLeaveTimeout();
    setIsBtsAreaHovered(true);
  };

  const handleBtsAreaMouseLeave = () => {
    clearBtsHoverLeaveTimeout();
    btsHoverLeaveTimeoutRef.current = setTimeout(() => {
      setIsBtsAreaHovered(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      clearBtsHoverLeaveTimeout();
    };
  }, []);

  const [yBehind, setYBehind] = useState(0);
  const [yScenes, setYScenes] = useState(0);

  const calculateYValues = () => {
    const height = window.innerHeight;
    setYBehind(-0.35 * height);
    setYScenes(0.35 * height);
  };

  useEffect(() => {
    calculateYValues();
    window.addEventListener("resize", calculateYValues);

    return () => {
      window.removeEventListener("resize", calculateYValues);
    };
  }, []);

  const [xBehind, setXBehind] = useState(0);
  const [xScenes, setXScenes] = useState(0);

  const calculateXValues = () => {
    const width = window.innerWidth;
    setXBehind(-0.1 * width);
    setXScenes(0.1 * width);
  };

  useEffect(() => {
    calculateXValues();
    window.addEventListener("resize", calculateXValues);

    return () => {
      window.removeEventListener("resize", calculateXValues);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const updateBtsExpansionState = () => {
      if (!btsTriggerRef.current || !btsEndTriggerRef.current) return;

      const { top: startTop } = btsTriggerRef.current.getBoundingClientRect();
      const { top: endTop } = btsEndTriggerRef.current.getBoundingClientRect();
      const viewportMiddle = window.innerHeight / 2;
      const hasReachedStart = startTop <= viewportMiddle;
      const hasPassedEnd = endTop <= viewportMiddle;
      const shouldExpand = hasReachedStart && !hasPassedEnd;

      setIsBtsExpanded((prev) => (prev === shouldExpand ? prev : shouldExpand));
    };

    const handleScrollOrResize = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateBtsExpansionState);
    };

    updateBtsExpansionState();

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  if (!artwork) {
    return (
      <div
        className={`h-[100dvh] inset-0 flex flex-col space-y-3 md:space-y-5 justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}
      >
        <div> artwork not found! </div>
        <Button href="/#home"> return home </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[100dvh] flex flex-col ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}
    >
      <Preloader texts={[artwork.title]} delay={200} interval={40} />
      <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div className={`h-[100dvh] flex flex-col xl:space-y-2 2xl:space-y-4`}>
        <div className={`w-full h-[40dvh] md:h-[50dvh] relative flex justify-start items-end`}>
          <Image
            src={`${basePath}${artwork.banner}`}
            alt={artwork.alt}
            layout="fill"
            onContextMenu={handleContextMenu}
            style={{
              objectFit: "cover",
              objectPosition: "50% 50%",
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-45% from-transparent ${theme === "dark" ? "to-text-light" : "to-main-light"}`}
          />
          <div className={"absolute px-6 md:px-16 xl:px-20 py-3 lg:py-6"}>
            <Fader enterDelay={1.2} once={true}>
              <Title size={"large"}> {artwork.title} </Title>
            </Fader>
          </div>
        </div>

        <Fader enterDelay={1.2} once={true}>
          <div className={"flex flex-col space-y-5 px-6 md:px-16 xl:px-20"}>
            <div className={`w-full 2xl:w-[65%] lg:min-h-[285px] flex items-center`}>
              <Textbox caret={false}>
                <Scramble delay={1500}>{String(artwork.description)}</Scramble>
              </Textbox>
            </div>

            <Textbox>
              <Scramble delay={3750} hover={true} interval={20}>
                {"[ scroll for more ] "}
              </Scramble>
            </Textbox>
          </div>
        </Fader>
      </div>
      <Fader>
        <div className={`min-h-[100dvh] lg:h-[100dvh] lg:my-[20]`}>
          <div className={`flex flex-col px-6 md:px-16 xl:px-20 py-3 lg:py-6 xl:py-10`}>
            <Title size={"medium"}> a closer look </Title>
          </div>

          <div className={`px-6 md:px-16 xl:px-20 max-h-[70dvh]`}>
            <div className={`grid gap-4 xl:gap-5 auto-rows-min lg:grid-cols-2`}>
              {closerLook
                .filter((closerLook) => closerLook.id === artwork.id)
                .map((closerLook, index) => (
                  <div
                    key={closerLook.screenshot}
                    className={`relative overflow-hidden rounded-xl w-full min-h-[260px] sm:min-h-[300px] lg:min-h-[380px] ${
                      index === 0 ? "lg:row-span-2 lg:min-h-[760px]" : ""
                    }`}
                  >
                    <ImageFrame
                      src={`${basePath}${closerLook.screenshot}`}
                      alt={closerLook.alt}
                      onContextMenu={handleContextMenu}
                      pulsePlaceholder={true}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Fader>
      <Fader threshold={0.05}>
        <div className={`min-h-[100dvh] relative flex flex-col justify-center items-center`}>
          <motion.div className={`sticky top-0 z-20 bg-transparent h-[100dvh] w-[100%] pointer-events-none`}>
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div
                className={`pointer-events-auto transition-opacity duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  shouldShowBtsCta ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onMouseEnter={() => {
                  clearBtsHoverLeaveTimeout();
                  setIsBtsCtaHovered(true);
                }}
                onMouseLeave={() => setIsBtsCtaHovered(false)}
              >
                {shouldShowBtsCta && (
                  <Fader threshold={0}>
                    <div className="rounded-xl px-1.5 py-1 backdrop-blur-[2px] border-corner/70">
                      <Button href={youtubeLink} isExternal={true}>
                        see timelapse
                      </Button>
                    </div>
                  </Fader>
                )}
              </div>
            </div>

            <Fader threshold={0}>
              <motion.div
                className={`relative w-[100%] h-[50dvh] ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}
                initial={{ y: 0 }}
                animate={{ y: isBtsExpanded ? yBehind * 0.8 : 0 }}
                transition={{ delay: 0, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
              />
            </Fader>

            <div
              className={`flex flex-row space-x-[0.5rem] md:space-x-[1rem] justify-center items-center relative z-10`}
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: isBtsExpanded ? yBehind : 0, x: isBtsExpanded ? xBehind : 0 }}
                transition={{ delay: 0, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                className="relative z-10"
              >
                <Title> behind </Title>
              </motion.div>

              <motion.div
                initial={{ y: 0 }}
                animate={{ y: isBtsExpanded ? yScenes : 0, x: isBtsExpanded ? xScenes : 0 }}
                transition={{ delay: 0, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                className="relative z-10"
              >
                <Title> the scenes </Title>
              </motion.div>
            </div>

            <motion.div
              className={`relative w-[100%] h-[50dvh] ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}
              initial={{ y: 0 }}
              animate={{ y: isBtsExpanded ? yScenes * 0.8 : 0 }}
              transition={{ delay: 0, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.div>

          <div ref={btsTriggerRef} className={`h-px w-full`} aria-hidden="true" />

          <div
            data-nav-sample-ignore="true"
            className={`relative z-0 px-6 md:w-[70dvw] grid grid-cols-1 gap-4 xl:gap-5 auto-rows-min`}
            onMouseEnter={handleBtsAreaMouseEnter}
            onMouseLeave={handleBtsAreaMouseLeave}
          >
            <div
              className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] backdrop-blur-[2px] ${
                theme === "dark" ? "bg-middle-colour" : "bg-text-dark"
              } ${shouldShowBtsCta ? "opacity-55" : "opacity-0"}`}
              aria-hidden="true"
            />

            {bts
              .filter((bts) => bts.id === artwork.id)
              .map((bts) => (
                <Image
                  key={bts.screenshot}
                  src={`${basePath}${bts.screenshot}`}
                  alt={bts.alt}
                  height={1000}
                  width={1000}
                  quality={100}
                  onContextMenu={handleContextMenu}
                  style={{
                    objectFit: "cover",
                  }}
                  className={`rounded-xl w-full h-auto`}
                />
              ))}
          </div>

          <div ref={btsEndTriggerRef} className={`h-px w-full`} aria-hidden="true" />

          <div className={`h-[100dvh]`}> </div>
        </div>
      </Fader>
      <div className={`${theme === "dark" ? "bg-text-light" : "bg-main-light"} px-6 md:px-16 xl:px-20 my-7`}>
        <Fader enterDelay={0.6} threshold={0.2} once={true}>
          <div className="flex justify-center items-center py-10 md:py-12 lg:py-14">
            <GalleryCarousel labelText="see the gallery" />
          </div>
        </Fader>
      </div>
      <section className={`relative ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
        <div className="md:h-[130vh]">
          <div className="sticky top-0 z-10">
            <Fader>
              <Contact />
            </Fader>
          </div>
        </div>
      </section>

      <section className={`relative z-20 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
        <Footer />
      </section>
    </div>
  );
}
