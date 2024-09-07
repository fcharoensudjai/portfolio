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
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import ParagraphScroll from "@/components/stylers/paragraphscroll";


export default function Gallery() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const { ref: textRef, inView: textInView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
    })

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <Preloader texts={['about']}/>

            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            <Fader enterDelay={1.2} once={true}>
                <div className={`min-h-[100dvh] flex flex-col justify-between items-center px-6 md:px-16 xl:px-20`}>

                    <div
                        className={`flex flex-col flex-grow justify-center items-center text-center lg:max-w-[1500px] mt-[75.58px] xl:mt-[103.22px]`}>
                        <Title size="medium">
                            Economics student with a passion for finance, data science and art, finding
                            a creative outlet, dedicated to bringing ideas to life through vibrant and dynamic
                            illustrations.
                        </Title>
                    </div>

                    <div className={`py-3 lg:py-5`}>

                        <Textbox> <Scramble delay={1750} hover={true} interval={20}>[ scroll for more ]</Scramble> </Textbox>

                    </div>

                </div>
            </Fader>

            <div className={`min-h-[100dvh] px-6 md:px-16 xl:px-20 lg:py-12 py-7`}>

                <div className={`flex flex-col space-y-5 lg:space-y-7 mt-[75.58px] xl:mt-[103.22px]`}>

                    <Title> who am i? </Title>

                    <div
                        className={`lg:sticky lg:top-0 flex flex-col lg:justify-between lg:flex-row items-center space-y-7 lg:space-y-0 lg:space-x-16`}>

                        <div className="lg:w-[45%] w-full h-full">
                            <Image
                                src="/images/about.png"
                                alt="a picture of me"
                                width={5000}
                                height={5000}
                                style={{
                                    objectFit: "cover"
                                }}
                                quality={80}
                                className="w-full h-auto"
                            />
                        </div>

                        <div className={`lg:w-[55%] space-y-5`}>
                            <div className={`flex flex-col space-y-[1.5em] md:text-sm xl:text-md text-xs`}>


                                <ParagraphScroll>
                                    <Textbox>
                                        <Scramble>
                                            Hi, I’m Fasai Charoensudjai, a 20-year-old Economics student at the University
                                            of Warwick from Thailand.
                                            While I’m actively pursuing a career in consulting with a focus on data science
                                            and finance, my real passion is art.
                                            This website is a passion project I created over the summer, combining my love
                                            for art and web development to showcase my illustrations, concept art, and
                                            fanart in a way that feels true to my personal style.
                                        </Scramble>
                                    </Textbox>
                                </ParagraphScroll>

                                <ParagraphScroll>
                                    <Textbox>
                                        <Scramble>
                                            Art has always been a part of my life, and even though university keeps me busy,
                                            I still find time to draw pieces inspired by the games and shows I love, like
                                            League of Legends, Genshin Impact, and Arcane.
                                            I primarily work digitally using Procreate on my iPad, but I’ve also explored
                                            traditional mediums in the past.
                                            My creative process is mostly focused on stylistic work, but I’m always pushing
                                            myself to improve. Whether it’s learning anatomy, creating immersive
                                            backgrounds, or capturing the right ambience, I’m always eager to learn.
                                        </Scramble>
                                    </Textbox>
                                </ParagraphScroll>

                                <ParagraphScroll>
                                    <Textbox>
                                        <Scramble>
                                            Coming from Thailand, I wanted this website to reflect a bit of my cultural
                                            background, which is why I designed the logo based on a traditional Thai
                                            pattern.
                                            This site is not only a space to display my art but also a step forward in my
                                            web development journey!
                                        </Scramble>
                                    </Textbox>
                                </ParagraphScroll>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Fader> <Contact/> </Fader>

            <Footer/>

        </div>

    );
}
