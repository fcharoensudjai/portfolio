"use client";

import React, { useState, useEffect } from "react";
import { Title } from "@/components/title";
import { MobileNav } from "@/components/header/mobilenav";
import { LocalTime } from "@/components/footer/localtime";
import { SocialIcons } from "@/components/footer/socialicons";
import { Textbox } from "@/components/textbox";
import { Contact } from "@/components/contact";
import { Button } from "@/components/button";
import { Scramble } from "@/components/stylers/scramblerthai";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { useInView } from "react-intersection-observer";
import { useVisibility } from "@/app/contexts/recentsvisibilitycontext";
import { Petal } from "@/components/petal";
import { GalleryCarousel } from "@/components/home/gallery-carousel";
import { ProfileSequence } from "@/components/home/profile-sequence";
import { CoverTiles } from "@/components/home/cover-tiles";
import { RecentsStage } from "@/components/home/recents-stage";

export default function Home() {
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

  const coverRef = React.useRef<HTMLElement | null>(null);

  return (
    <div className="bg-surface text-ink">
      <Preloader duration={1100} texts={["hello", "สวัสดี"]} delay={500} />

      <div className="relative h-[320vh]">
        <section id="home" ref={coverRef} className="sticky top-0 h-[100dvh] overflow-hidden bg-surface text-ink">
          {/* no content-cap here: the hero's footer row is edge-anchored to match the nav, so the cap
              has to sit on the sections, not on this wrapper. At 2560 both land at the same gutter */}
          <div className="relative z-[1] flex h-full flex-col justify-between px-6 pb-[1.375rem] pt-[4.625rem] md:px-16 md:pb-4 xl:px-20 xl:pb-6">
            <main className="flex flex-1 flex-col items-start justify-center text-left text-xs sm:text-md">
              <Fader enterDelay={1.5} once={true}>
                <div>
                  <Title size="large">
                    {/* no nav offset here: <main> centres this lockup between the container's
                        top padding and the footer row, so the nav clearance is already in that box.
                        A margin here only pushes the lockup off-centre. */}
                    <div className="relative fixed-line-spacing">
                      fasai <br /> charoensudjai{" "}
                      <Petal positioning="left-[96.5%] bottom-[36.75%] sm:left-[96.75%] sm:bottom-[36.5%] 2xl:left-[97%]" />
                    </div>
                  </Title>
                </div>

                <div className="my-4 text-ink">
                  {/* ink, not secondary: the cue is chrome (an affordance), not copy. secondary is the
                      supporting-content tier, and once a page puts prose in it the cue stops reading as
                      a prompt and starts reading as the paragraph's last line */}
                  <Textbox size="caption">
                    <Scramble delay={2000} hover={true} interval={20} once={false}>
                      {"[ scroll to explore ] "}
                    </Scramble>
                  </Textbox>
                </div>
              </Fader>
            </main>

            {/* ink, not secondary: the landing page footer is chrome and reads as part of the nav */}
            <div className="-mx-6 flex items-center justify-between gap-5 bg-transparent px-4 text-xs md:-mx-16 md:px-6 md:text-sm xl:-mx-20">
              <LocalTime />

              {/* both chrome rows sit on the same 38.4px inset, straight off the row padding — no
                  compensation here, since an asset's own internal padding is not something this
                  row can know about. It was nudged 6px for a while to line up with the theme mark; */}
              <div>
                <SocialIcons />
              </div>
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
                <div className="flex flex-col">
                  {/* the heading and the line under it are one pair, so they take the tight pair step
                      (12/16) — the same one the stage pieces and the gallery carousel use. The button
                      below keeps the looser step, since it's a different kind of element. */}
                  <div className="flex flex-col space-y-3 md:space-y-4">
                    {/* the section heading takes the display step, so it reads 4.4x the body beneath
                        it — the same relationship as a piece title and its caption in the stage */}
                    <Title size="display">
                      <div className="fixed-line-spacing scroll-mt-[7.5175rem] lg:scroll-mt-[9.25125rem]">
                        {" "}
                        recent works
                      </div>
                    </Title>

                    <div className="lg:w-[65%] text-ink-secondary">
                      {/* the body unit (1rem), so this sits at exactly 4.4x below the display heading
                          above it — same relationship as a piece caption under its title, secondary ink
                          in both cases */}
                      <Textbox size="caption">
                        <Scramble once={false} preScrambled>
                          {
                            "Here are the previews for some of the pieces I've been working on lately. Feel free to click on them to see the full image, view some more details, or click on the gallery button to view all of them!"
                          }
                        </Scramble>
                      </Textbox>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-7 xl:mt-10">
                    {/* sm, matching the stage's "more detail" buttons and the intro's "more about
                        me" — one button size for in-page actions */}
                    <Button href="/gallery" size="sm">
                      {" "}
                      view my gallery{" "}
                    </Button>{" "}
                  </div>
                </div>
              </div>
            </Fader>
          </div>

          <RecentsStage />
        </div>

        <div className="bg-surface px-6 md:px-16 xl:px-20">
          <Fader once={true}>
            <div className="flex justify-center items-center py-10 md:py-12 lg:py-14">
              <GalleryCarousel />
            </div>
          </Fader>
        </div>
      </div>

      <section className="relative z-20 bg-surface">
        <Fader>
          <Contact once={false} />
        </Fader>
      </section>
    </div>
  );
}
