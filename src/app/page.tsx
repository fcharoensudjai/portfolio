"use client";

import React, { useState, useEffect } from "react";
import { Title } from "@/components/title";
import { useTheme } from "next-themes";
import { MobileNav } from "@/components/header/mobilenav";
import { LocalTime } from "@/components/footer/localtime";
import { SocialIcons } from "@/components/footer/socialicons";
import { Footer } from "@/components/footer/footer";
import { Textbox } from "@/components/textbox";
import { Contact } from "@/components/contact";
import Image from "next/image";
import { DottedLineSeparator } from "@/components/dottedlineseparator";
import { Button } from "@/components/button";
import { Scramble } from "@/components/stylers/scramblerthai";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { useInView } from "react-intersection-observer";
import { useVisibility } from "@/app/contexts/recentsvisibilitycontext";
import { motion, AnimatePresence } from "framer-motion";
import { Petal } from "@/components/petal";
import { UnderlinedLink } from "@/components/underlinedlink";
import { GalleryCarousel } from "@/components/home/gallery-carousel";
import { ProfileSequence } from "@/components/home/profile-sequence";
import { CoverTiles } from "@/components/home/cover-tiles";

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { theme } = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  // controlling the underlining for the recents section

  const { setIsRecentsInView } = useVisibility();
  const { ref: recentsRef, inView: isRecentsInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // used to update the recents context with visibility state
  React.useEffect(() => {
    setIsRecentsInView(isRecentsInView);
  }, [isRecentsInView, setIsRecentsInView]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const attemptScroll = (retries = 20) => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "instant" });
        } else if (retries > 0) {
          setTimeout(() => attemptScroll(retries - 1), 200);
        }
      };
      setTimeout(() => attemptScroll(), 1100);
    }
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);
  const toggleOverlay = () => setShowOverlay(!showOverlay);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const textBoxWidth = 150;
  const textBoxHeight = 50;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clampedX = Math.min(Math.max(mouseX, textBoxWidth / 2), rect.width - textBoxWidth / 1.6);
    const clampedY = Math.min(Math.max(mouseY, textBoxHeight / 2), rect.height - textBoxHeight);

    setMousePosition({ x: clampedX, y: clampedY });
  };

  const coverRef = React.useRef<HTMLElement | null>(null);

  return (
    <div className="bg-surface text-ink">
      <Preloader duration={1100} texts={["hello", "สวัสดี"]} delay={500} />

      <div className="relative h-[320vh]">
        <section id="home" ref={coverRef} className="sticky top-0 h-[100dvh] overflow-hidden bg-surface text-ink">
          <div className="relative z-[1] flex h-full flex-col justify-between px-6 pb-[22px] pt-[74px] md:px-16 xl:px-20">
            <main className="flex flex-1 flex-col items-start justify-center text-left text-xs sm:text-md">
              <Fader enterDelay={1.5} once={true}>
                <div>
                  <Title size="large">
                    <div className="relative fixed-line-spacing mt-[75.58px] xl:mt-[103.22px]">
                      fasai <br /> charoensudjai{" "}
                      <Petal positioning="left-[96.5%] bottom-[36.75%] sm:left-[96.75%] sm:bottom-[36.5%] 2xl:left-[97%]" />
                    </div>
                  </Title>
                </div>

                <div className="my-4">
                  <Textbox>
                    <Scramble delay={2000} hover={true} interval={20}>
                      {"[ scroll to explore ] "}
                    </Scramble>
                  </Textbox>
                </div>
              </Fader>
            </main>

            <div className="flex items-center justify-between gap-5 bg-transparent pb-3 pt-3 text-xs xl:pb-7">
              <LocalTime />
              <SocialIcons />
            </div>
          </div>

          <CoverTiles coverRef={coverRef} />

          <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
        </section>
      </div>

      <ProfileSequence />

      <div className="content-cap">
        <div id="recents" className="px-6 md:px-16 xl:px-20 space-y-[10dvh] md:space-y-[14dvh] lg:space-y-16 my-7">
          <div ref={recentsRef}>
            <Fader>
              <div className="flex justify-center items-center py-[10dvh] md:py-[12dvh] h-[100dvh]">
                <div className="flex flex-col space-y-6 lg:space-y-7 xl:space-y-10">
                  <Title size="medium">
                    <div className="fixed-line-spacing scroll-mt-[120.28px] lg:scroll-mt-[148.02px]"> recent works</div>
                  </Title>

                  <div className="lg:w-[65%]">
                    <Textbox>
                      <Scramble>
                        {
                          "Here are the previews for some of the pieces I've been working on lately. Feel free to click on them to see the full image, view some more details, or click on the gallery button to view all of them!"
                        }
                      </Scramble>
                    </Textbox>
                  </div>

                  <div>
                    <Button href="/gallery"> view my gallery </Button>{" "}
                  </div>
                </div>
              </div>
            </Fader>
          </div>

          <div className={`${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
            <Fader>
              <div className="flex justify-center items-center py-[10dvh] md:py-[12dvh]">
                <div className="space-y-3 lg:space-y-5">
                  <div className="lg:hidden">
                    <DottedLineSeparator align="left"> [ 01 ] </DottedLineSeparator>
                  </div>

                  <div className="lg:hidden">
                    <Title size="small"> raiden shogun </Title>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:justify-between justify-center lg:space-x-16 space-y-3 md:space-y-7 lg:space-y-0 lg:py-12">
                    <motion.div
                      className="relative lg:w-[65%] md:min-h-[35dvh] max-h-full rounded-xl"
                      onHoverStart={toggleOverlay}
                      onHoverEnd={toggleOverlay}
                      onMouseMove={handleMouseMove}
                    >
                      <AnimatePresence>
                        {showOverlay && (
                          <motion.div
                            className="inset-0 z-10 absolute flex justify-center items-center rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                            style={{ cursor: showOverlay ? "none" : "default" }}
                          >
                            <div
                              className={`absolute inset-0 backdrop-blur-[2px] rounded-xl ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} bg-opacity-60`}
                            >
                              <motion.div
                                className="absolute border-corner z-20 flex justify-center items-center"
                                style={{
                                  top: mousePosition.y - textBoxHeight / 2 + 10,
                                  left: mousePosition.x - textBoxWidth / 2 + 10,
                                  width: textBoxWidth,
                                  height: textBoxHeight,
                                }}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 1.3 }}
                                transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <UnderlinedLink href="/recents/1" line={false}>
                                  <Scramble interval={20} hover={true}>
                                    {" more detail "}
                                  </Scramble>
                                </UnderlinedLink>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Image
                        src={`${basePath}/images/raiden-shogun/raiden-home.png`}
                        alt="snippet of raiden shogun"
                        width={1183}
                        height={851}
                        style={{ objectFit: "cover" }}
                        quality={60}
                        className="w-full h-auto lg:h-full lg:w-full rounded-xl"
                      />
                    </motion.div>

                    <div className="lg:min-w-[45%] lg:max-w-[45%] flex flex-col lg:space-y-5">
                      <div className="hidden lg:block">
                        <DottedLineSeparator align="left"> [ 01 ] </DottedLineSeparator>
                      </div>

                      <div className="hidden lg:block">
                        <Title size="small"> raiden shogun </Title>{" "}
                      </div>

                      <div className="flex flex-col justify-evenly lg:space-y-5">
                        <div className={`flex flex-grow w-full`}>
                          <div
                            className={`flex flex-grow items-center justify-center min-h-[100px] md:min-h-[150px] lg:min-h-[250px]`}
                          >
                            <Textbox>
                              <Scramble>
                                {
                                  "Raiden Shogun has been my favourite character from Genshin Impact for the longest time, and so I wanted to capture her energy. Inspired by the League of Legends splash art styles, this is one of the biggest digital canvases I've ever worked on, and I'm really happy with how it turned out."
                                }
                              </Scramble>
                            </Textbox>
                          </div>
                        </div>

                        <div className="hidden lg:block justify-start">
                          <Button href="/recents/1"> more detail </Button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden flex justify-center items-center">
                      <Button href="/recents/1"> more detail </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Fader>
          </div>

          <div className={`${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
            <Fader>
              <div className="flex justify-center items-center py-[10dvh] md:py-[12dvh]">
                <div className="space-y-3 lg:space-y-5">
                  <div className="lg:hidden">
                    <DottedLineSeparator align="left"> [ 02 ] </DottedLineSeparator>
                  </div>

                  <div className="lg:hidden">
                    <Title size="small"> raven </Title>
                  </div>

                  <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:justify-between justify-center lg:space-x-16 space-y-4 md:space-y-7 lg:space-y-0 lg:py-12">
                    <motion.div
                      className="relative lg:w-[65%] md:min-h-[35dvh] max-h-full rounded-xl"
                      onHoverStart={toggleOverlay}
                      onHoverEnd={toggleOverlay}
                      onMouseMove={handleMouseMove}
                    >
                      <AnimatePresence>
                        {showOverlay && (
                          <motion.div
                            className="inset-0 z-10 absolute flex justify-center items-center rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                            style={{ cursor: showOverlay ? "none" : "default" }}
                          >
                            <div
                              className={`absolute inset-0 backdrop-blur-[2px] rounded-xl ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} bg-opacity-60`}
                            >
                              <motion.div
                                className="absolute border-corner z-20 flex justify-center items-center"
                                style={{
                                  top: mousePosition.y - textBoxHeight / 2 + 10,
                                  left: mousePosition.x - textBoxWidth / 2 + 10,
                                  width: textBoxWidth,
                                  height: textBoxHeight,
                                }}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 1.3 }}
                                transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <UnderlinedLink href="/recents/2" line={false}>
                                  <Scramble interval={20} hover={true}>
                                    {" more detail "}
                                  </Scramble>
                                </UnderlinedLink>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Image
                        src={`${basePath}/images/raven/raven-home.png`}
                        alt="snippet of raven"
                        width={1183}
                        height={851}
                        style={{
                          objectFit: "cover",
                          objectPosition: "80% 50%",
                        }}
                        quality={80}
                        className="w-full h-auto lg:h-full lg:w-full rounded-xl"
                      />
                    </motion.div>

                    <div className="lg:min-w-[45%] lg:max-w-[45%] flex flex-col lg:space-y-5">
                      <div className="hidden lg:block">
                        <DottedLineSeparator align="right"> [ 02 ] </DottedLineSeparator>
                      </div>

                      <div className="hidden lg:block text-end">
                        <Title size="small"> raven </Title>
                      </div>

                      <div className="flex flex-col lg:space-y-7">
                        <div className={`flex flex-grow w-full`}>
                          <div
                            className={`flex flex-grow items-center justify-center min-h-[195px] lg:min-h-[250px] lg:text-end`}
                          >
                            <Textbox>
                              <Scramble>
                                {
                                  'I joined a "Draw This In Your Style Challenge" for Raven, a character by another artist. It was a great learning experience, especially for drawing metal and improving on backgrounds. This project helped me grow as an artist, and I was very happy to be featured on the front of the artist\'s post!'
                                }
                              </Scramble>
                            </Textbox>
                          </div>
                        </div>

                        <div className="hidden lg:flex justify-end">
                          <Button href="/recents/2"> more detail </Button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden flex justify-center items-center">
                      <Button href="/recents/2"> more detail </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Fader>
          </div>
        </div>

        <div className={`${theme === "dark" ? "bg-text-light" : "bg-main-light"} px-6 md:px-16 xl:px-20`}>
          <Fader once={true}>
            <div className="flex justify-center items-center py-10 md:py-12 lg:py-14">
              <GalleryCarousel />
            </div>
          </Fader>
        </div>
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
