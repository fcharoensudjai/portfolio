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
import { Card } from "@/components/card/card";
import { imageData, CustomImageData } from "@/components/card/imageData";
import { ImageViewer } from "@/components/imageviewer";
import { AnimatePresence, motion } from "framer-motion";

export default function Gallery() {
    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState<number | null>(null);

    const toggleViewer = (index?: number) => {
        setIsViewerOpen(index ?? null);
    };

    const sortedImageData: CustomImageData[] = imageData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
            <Preloader texts={['gallery']} delay={200} interval={40}/>
            <MobileNav isNavOpen={isNavOpen} toggleNav={() => setIsNavOpen(!isNavOpen)}/>

            <Fader enterDelay={1.2} once={true}>
                <div className="min-h-[100dvh] flex flex-col justify-center items-start px-6 md:px-16 xl:px-20 space-y-3 lg:space-y-7 xl:space-y-12">
                    <Title size="large">gallery</Title>
                    <div className="lg:w-[65%] flex flex-col space-y-6 lg:space-y-7 xl:space-y-10">
                        <div className={`min-h-200px sm:min-h-0`}><Textbox caret={false}>
                            <Scramble delay={1500}>
                                Welcome to my gallery! Here, you’ll find a collection of pieces that have been a part of
                                my journey in learning and growing as an artist. I mostly work in Procreate, but you'll
                                see some studies in other mediums from my pieces in school. Click on the pieces to view
                                them in detail, and feel free to see the progress I've made along the way :)
                            </Scramble>
                        </Textbox></div>
                        <Textbox>
                            <Scramble delay={3250} hover={true} interval={20}> [ scroll to explore ]</Scramble>
                        </Textbox>
                    </div>
                </div>
            </Fader>

            <div className={`px-6 md:px-16 xl:px-20 lg:my-20`}>
                <div className={`grid gap-4 xl:gap-5 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense`}>
                    {sortedImageData.map((image, index) => (
                        <Card
                            src={image.src}
                            alt={image.alt}
                            name={image.name}
                            key={index}
                            className={`${image.wide ? "md:col-span-2" : ""} ${image.tall ? "lg:row-span-2" : ""}`}
                            onClick={() => toggleViewer(index)}
                        />
                    ))}
                </div>
            </div>

            <Fader><Contact/></Fader>
            <Footer/>

            <AnimatePresence>
                {isViewerOpen !== null && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                        className={`fixed h-[100dvh] inset-0 z-30 backdrop-blur-[8px] bg-opacity-50 ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"}`}
                    >
                        <ImageViewer
                            src={sortedImageData[isViewerOpen].src}
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
