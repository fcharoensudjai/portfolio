"use client";

import React, { useState } from "react";
import { MobileNav } from "@/components/header/mobilenav";
import { Contact } from "@/components/contact";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { GalleryCarousel } from "@/components/home/gallery-carousel";
import { Title } from "@/components/title";
import { Petal } from "@/components/petal";
import { ChapterRise } from "@/components/about/chapter-rise";
import { ChapterBand } from "@/components/about/chapter-band";
import { ChapterPlate } from "@/components/about/chapter-plate";
import { ChapterOver } from "@/components/about/chapter-over";
import { ChapterClosing } from "@/components/about/chapter-closing";
import { aboutSequenceItems } from "./about-data";

const STATEMENT_LEAD =
  "A finance and tech mind with a love for the creative space, dedicated to bringing ideas to life through vibrant and dynamic";

// the petal grows out of the second i in "illustrations", anchored to that word's own box — the
// offsets are the ones the old hero used, so it lands on the glyph at every breakpoint
const STATEMENT_TAIL = "illustrations.";
const STATEMENT_PETAL_POSITION =
  "left-[64%] bottom-[92%] sm:left-[63.75%] sm:bottom-[94.5%] md:bottom-[138%] lg:left-[63%] lg:bottom-[165%] 2xl:left-[63.5%] 2xl:bottom-[240%]";

export default function About() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const [intro, journey, upTo, outsideOfWork, thisSite] = aboutSequenceItems;

  return (
    <div className="bg-surface text-ink">
      <Preloader texts={["about"]} delay={200} interval={40} />
      <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

      <div className="content-cap">
        {/* 01 — the statement, and the photo that rises over it */}
        <ChapterRise
          basePath={basePath}
          eyebrow={`[ ${intro.id} ]`}
          title={intro.title}
          statement={
            <>
              <Title size="about">{STATEMENT_LEAD}</Title>
              <span className="relative">
                <Title size="about">
                  &nbsp;{STATEMENT_TAIL}{" "}
                  <Petal enterDelay={0.3} size="small" positioning={STATEMENT_PETAL_POSITION} />{" "}
                </Title>
              </span>
            </>
          }
          image={intro.image.src}
          alt={intro.image.alt}
          paragraph={intro.paragraphs.join(" ")}
        />

        {/* 02 — rises over the tail of the fold */}
        <ChapterBand
          basePath={basePath}
          eyebrow={`[ ${journey.id} ]`}
          title={journey.title}
          paragraph={journey.paragraphs.join(" ")}
          image={journey.image.src}
          alt={journey.image.alt}
        />

        {/* 03 — copy and print on a counter drift */}
        <ChapterPlate
          basePath={basePath}
          eyebrow={`[ ${upTo.id} ]`}
          title={upTo.title}
          paragraphs={upTo.paragraphs}
          image={upTo.image.src}
          alt={upTo.image.alt}
        />

        {/* 04 — a letterbox opening out to full bleed */}
        <ChapterOver
          basePath={basePath}
          eyebrow={`[ ${outsideOfWork.id} ]`}
          title={outsideOfWork.title}
          paragraph={outsideOfWork.paragraphs.join(" ")}
          image={outsideOfWork.image.src}
          alt={outsideOfWork.image.alt}
        />

        {/* 05 — the flower, and the gust that takes it apart */}
        <ChapterClosing eyebrow={`[ ${thisSite.id} ]`} title={thisSite.title} paragraphs={thisSite.paragraphs} />

        <div className="bg-surface px-6 py-[14vh] md:px-16 xl:px-20">
          <Fader enterDelay={0.3} threshold={0.3} once={true}>
            <div className="flex justify-center items-center py-10 md:py-12 lg:py-14">
              <GalleryCarousel labelText="see the gallery" />
            </div>
          </Fader>
        </div>
      </div>

      <section className="relative z-20 bg-surface">
        <Fader>
          <Contact />
        </Fader>
      </section>
    </div>
  );
}
