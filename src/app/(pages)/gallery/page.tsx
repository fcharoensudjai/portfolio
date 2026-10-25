"use client";

import React, { useState } from "react";
import { MobileNav } from "@/components/header/mobilenav";
import { Contact } from "@/components/contact";
import Fader from "@/components/stylers/fader";
import { Preloader } from "@/components/stylers/page-loading/preloader";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";
import { Card } from "@/components/card/card";
import { imageData, CustomImageData } from "@/components/card/imageData";
import { ImageViewer } from "@/components/imageviewer";
import { AnimatePresence, motion } from "framer-motion";

export default function Gallery() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState<number | null>(null);

  const toggleViewer = (index?: number) => {
    setIsViewerOpen(index ?? null);
  };

  const sortedImageData: CustomImageData[] = [...imageData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-surface text-ink">
      <Preloader texts={["gallery"]} delay={200} interval={40} />
      <MobileNav isNavOpen={isNavOpen} toggleNav={() => setIsNavOpen(!isNavOpen)} />

      <div className="content-cap">
        <Fader enterDelay={1.2} once={true}>
          <div className="min-h-[100dvh] flex flex-col justify-center items-start px-6 md:px-16 xl:px-20">
            <div className="lg:w-[65%] flex flex-col">
              {/* the heading and the line under it are one pair, so they take the tight pair step
                  (12/16) — the same one the gallery carousel and the recents stage use */}
              <div className="flex flex-col space-y-3 md:space-y-4">
                <Title size="large">gallery</Title>
                <div className={`min-h-200px sm:min-h-0 text-ink-secondary`}>
                  <Textbox caret={false} size="caption">
                    <Scramble once={false} preScrambled>
                      {
                        "Welcome to my gallery! Here, you'll find a collection of pieces that have been a part of my journey in learning and growing as an artist. I mostly work in Procreate, but you'll see some studies in other mediums from my pieces in school. Click on the pieces to view them in detail, and feel free to see the progress I've made along the way."
                      }
                    </Scramble>
                  </Textbox>
                </div>
              </div>
              {/* ink, not secondary: the cue is chrome, not copy — same-size secondary text under a
                  paragraph reads as its last line. It keeps the looser step below the pair, because
                  it's a different kind of element (the stage gives its button the same treatment) */}
              <div className="mt-6 lg:mt-7 xl:mt-10 text-ink">
                <Textbox size="caption">
                  <Scramble delay={2000} hover={true} interval={20} once={false}>
                    {"[ scroll to explore ] "}
                  </Scramble>
                </Textbox>
              </div>
            </div>
          </div>
        </Fader>

        <div className={`px-6 md:px-16 xl:px-20 lg:my-20`}>
          <div className={`grid gap-4 xl:gap-5 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense`}>
            {sortedImageData.map((image, index) => (
              <Card
                src={`${basePath}${image.src}`}
                alt={image.alt}
                name={image.name}
                key={index}
                className={`${image.wide ? "md:col-span-2" : ""} ${image.tall ? "lg:row-span-2" : ""}`}
                onClick={() => toggleViewer(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="relative z-20 bg-surface">
        <Fader>
          <Contact />
        </Fader>
      </section>

      <AnimatePresence>
        {isViewerOpen !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="fixed h-[100dvh] inset-0 z-30 backdrop-blur-[8px] bg-opacity-50 bg-surface-mid"
          >
            <ImageViewer
              src={`${basePath}${sortedImageData[isViewerOpen].src}`}
              alt={sortedImageData[isViewerOpen].alt}
              name={sortedImageData[isViewerOpen].name}
              toggleViewer={() => toggleViewer()}
              prevImage={() => toggleViewer((isViewerOpen - 1 + sortedImageData.length) % sortedImageData.length)}
              nextImage={() => toggleViewer((isViewerOpen + 1) % sortedImageData.length)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
