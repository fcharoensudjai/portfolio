"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { MobileNav } from "@/components/header/mobilenav";
import { Footer } from "@/components/footer/footer";
import { Contact } from "@/components/contact";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import { Petal } from "@/components/petal";
import { GalleryCarousel } from "@/components/home/gallery-carousel";
import { AboutSequence } from "./sequence";

export default function Gallery() {
  // const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { theme } = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
      <Preloader texts={["about"]} delay={200} interval={40} />
      <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div className="content-cap">
        <Fader enterDelay={1.2} once={true}>
          <div className="min-h-[100dvh] flex flex-col justify-between items-center px-6 md:px-16 xl:px-20">
            <div className="flex flex-col flex-grow justify-center items-center text-center lg:max-w-[1500px] mt-[75.58px] xl:mt-[103.22px]">
              <div>
                <Title size="about">
                  A finance and tech mind with a love for the creative space, dedicated to bringing ideas to life
                  through vibrant and dynamic
                </Title>

                <span className={`relative`}>
                  <Title size="about">
                    &nbsp;illustrations.{" "}
                    <Petal
                      enterDelay={0.3}
                      size={"small"}
                      positioning={
                        "left-[64%] bottom-[92%] sm:left-[63.75%] sm:bottom-[94.5%] md:bottom-[138%] lg:left-[63%] lg:bottom-[165%] 2xl:left-[63.5%] 2xl:bottom-[240%]"
                      }
                    />{" "}
                  </Title>
                </span>
              </div>
            </div>

            <div className="py-3 lg:py-5">
              <Textbox>
                <Scramble delay={1750} hover={true} interval={20}>
                  [ scroll for more ]
                </Scramble>
              </Textbox>
            </div>
          </div>
        </Fader>

        <div className="min-h-[100dvh] lg:py-12 py-7 w-full px-0">
          <div className="flex flex-col space-y-5 md:space-y-7 mt-[10vh] xl:mt-[15vh]">
            <div className="w-full relative px-6 md:px-16 xl:px-20">
              <AboutSequence theme={theme} />
            </div>

            <div className={`${theme === "dark" ? "bg-text-light" : "bg-main-light"} px-6 md:px-16 xl:px-20 my-7`}>
              <Fader enterDelay={0.3} threshold={0.3} once={true}>
                <div className="flex justify-center items-center py-10 md:py-12 lg:py-14">
                  <GalleryCarousel labelText="see the gallery" />
                </div>
              </Fader>
            </div>
          </div>
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
