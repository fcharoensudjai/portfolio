"use client";

import React, { useState } from "react";
import { MobileNav } from "@/components/header/mobilenav";
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
import { ImageFrame } from "@/components/card/shared/imageframe";
import { GalleryCarousel } from "@/components/home/gallery-carousel";
import { BtsStage } from "@/components/recents/bts-stage";

export default function Recent() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const { id } = useParams();

  const artworkId = parseInt(id as string, 10);

  const artwork = artworks.find((artwork) => artwork.id === artworkId);

  const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
  };

  const youtubeLink = artwork?.url ?? (process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/");
  const btsFrames = bts.filter((frame) => frame.id === artworkId);

  if (!artwork) {
    return (
      <div className="h-[100dvh] inset-0 flex flex-col space-y-3 md:space-y-5 justify-center items-center bg-surface text-ink">
        <div> artwork not found! </div>
        <Button href="/#home"> return home </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-surface text-ink">
      <Preloader texts={[artwork.title]} delay={200} interval={40} />
      <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div className={`h-[100dvh] flex flex-col`}>
        <div className={`w-full h-[40dvh] md:h-[50dvh] relative flex justify-start items-end`}>
          <Image
            src={`${basePath}${artwork.banner}`}
            alt={artwork.alt}
            layout="fill"
            crossOrigin="anonymous"
            onContextMenu={handleContextMenu}
            style={{
              objectFit: "cover",
              objectPosition: "50% 50%",
            }}
          />
          <div data-nav-sample-ignore="true" className="banner-fade absolute inset-0 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0" data-nav-sample-ignore="true">
            {/* 12/16 under the title — the gallery's heading→body pair step. The prose below starts
                flush against the banner, so this padding IS the title-to-body gap. */}
            <div className="content-cap px-6 pb-3 md:px-16 md:pb-4 xl:px-20">
              <Fader enterDelay={1.2} once={true}>
                <Title size={"large"}> {artwork.title} </Title>
              </Fader>
            </div>
          </div>
        </div>

        <div className="content-cap">
          <Fader enterDelay={1.2} once={true}>
            <div className={`flex flex-col px-6 md:px-16 xl:px-20`}>
              {/* caption + secondary ink: the same prose treatment the recents intro and the gallery
                  intro use. Full width until xl — the 65% measure is a desk measure, and at 1024
                  (iPad mini on its side) it was cutting the paragraph to ~700px with a whole gutter of
                  empty space beside it. The length is the one place this page runs long, so it keeps
                  a narrower measure at xl than the rest of the site's prose. */}
              <div className={`w-full xl:w-[65%] text-ink-secondary`}>
                <Textbox caret={false} size="caption">
                  <Scramble once={false} preScrambled>
                    {String(artwork.description)}
                  </Scramble>
                </Textbox>
              </div>

              {/* the gallery's looser step below the pair (24/28/40) — the cue is a different kind
                  of element, so it sits apart from the title+prose block rather than inside it */}
              <div className="mt-6 lg:mt-7 xl:mt-10">
                <Textbox size="caption">
                  <Scramble delay={2000} hover={true} interval={20} once={false}>
                    {"[ scroll for more ] "}
                  </Scramble>
                </Textbox>
              </div>
            </div>
          </Fader>
        </div>
      </div>

      <div className="content-cap">
        <Fader>
          {/* One screen from md up, not just lg: below 1024 the section was still stacking the crops
              at 300px each, so a narrow desktop window got a 948px column instead of a screen.
              The section is a fixed viewport height and the grid takes whatever is left, so nothing
              inside it has a height of its own and it can't overflow.
              The heading gets the nav clearance + 2.4rem above it — the clearance alone left it
              jammed under the bar — and 1.6rem below, so the air reads as the heading's own rather
              than as a gap before the crops. */}
          <div
            className={`flex min-h-[100dvh] flex-col md:h-[100dvh] md:pt-[calc(var(--nav-clearance)_+_2.4rem)] lg:my-[20]`}
          >
            <div className={`flex shrink-0 flex-col px-6 py-3 md:px-16 md:pb-4 md:pt-0 xl:px-20 xl:pb-5`}>
              {/* section headings take the display step, like "recent works" on the landing page */}
              <div className="fixed-line-spacing">
                <Title size="display"> a closer look </Title>
              </div>
            </div>

            <div className={`min-h-0 flex-1 px-6 pb-3 md:px-16 md:pb-6 xl:px-20`}>
              <div className={`grid h-full gap-4 xl:gap-5 auto-rows-min md:grid-cols-2 md:grid-rows-2`}>
                {closerLook
                  .filter((closerLook) => closerLook.id === artwork.id)
                  .map((closerLook, index) => (
                    <div
                      key={closerLook.screenshot}
                      className={`relative overflow-hidden rounded-xl w-full min-h-[260px] sm:min-h-[300px] md:min-h-0 ${
                        index === 0 ? "md:row-span-2" : ""
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

        <div className="content-cap">
          <BtsStage frames={btsFrames} href={youtubeLink} basePath={basePath} onContextMenu={handleContextMenu} />
        </div>

        {/* mt-14 + the block's own py-14 is ~146px above the carousel label at lg — the same step the
            home page uses between its blocks (space-y-[10dvh] md:space-y-[14dvh]), instead of the
            2.8rem that had the gallery tucked straight under the behind-the-scenes stage */}
        <div className="bg-surface px-6 md:px-16 xl:px-20 mt-14 mb-7">
          <Fader enterDelay={0.6} threshold={0.2} once={true}>
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
