"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes"
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

export default function Gallery() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const sortedImageData: CustomImageData[] = imageData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <Preloader texts={['gallery']} delay={200} interval={40}/>
            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            <Fader enterDelay={1.2} once={true}>
                <div className="min-h-[100dvh] flex flex-col justify-center items-start px-6 md:px-16 xl:px-20 space-y-5">
                    <Title size="large">
                        <div>
                            gallery
                        </div>
                    </Title>

                    <div className="lg:w-[65%] flex flex-col space-y-6 lg:space-y-7 xl:space-y-10">

                        <Textbox caret={false}>
                            <Scramble delay={1500}>
                            Welcome to my gallery! Here, you’ll find a collection of pieces that have been a part of my
                            journey in learning and growing as an artist.
                            I mostly work in Procreate, but you'll see some studies in other mediums from my pieces in school.
                            Click on the pieces to view them in detail, and feel free to see the progress I've made
                            along the way :)
                            </Scramble>
                        </Textbox>

                        <Textbox>
                            <Scramble delay={3250} hover={true} interval={20}> [ scroll to explore ]</Scramble>
                        </Textbox>
                    </div>
                </div>

            </Fader>

            <div className={`px-6 md:px-16 xl:px-20 lg:my-20`}>
                <div
                    className={`grid gap-4 xl:gap-5 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense`}>
                    {sortedImageData.map((image, index) => (
                        <Card
                            src={image.src}
                            alt={image.alt}
                            name={image.name}
                            key={index}
                            className={`${image.wide ? "md:col-span-2" : ""} ${image.tall ? "lg:row-span-2" : ""}`}
                        />
                    ))}
                </div>
            </div>

            <Fader> <Contact/> </Fader>

            <Footer/>

        </div>

    );
}
