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
import Image from "next/image";
import {Button} from "@/components/button";
import { Petal } from "@/components/petal";

export default function Gallery() {
    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <Preloader texts={['about']} delay={200} interval={40}/>

            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            <Fader enterDelay={1.2} once={true}>
                <div className="min-h-[100dvh] flex flex-col justify-between items-center px-6 md:px-16 xl:px-20">
                    <div
                        className="flex flex-col flex-grow justify-center items-center text-center lg:max-w-[1500px] mt-[75.58px] xl:mt-[103.22px]">
                        <div>

                            <Title size="about">
                            Economics student with a passion for
                            finance and data science finding a
                            creative outlet, dedicated to bringing
                            ideas to life through vibrant and dynamic
                            </Title>

                            <span className={`relative`}><Title size="about">&nbsp;illustrations. <Petal enterDelay={0.3} size={"small"} positioning={'left-[64%] bottom-[92%] sm:left-[63.75%] sm:bottom-[94.5%] md:bottom-[138%] lg:left-[63%] lg:bottom-[165%] 2xl:left-[63.5%] 2xl:bottom-[240%]'}/> </Title></span>
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

            <div className="min-h-[100dvh] px-6 md:px-16 xl:px-20 lg:py-12 py-7">

                <div className="flex flex-col space-y-5 md:space-y-7 mt-[75.58px] xl:mt-[103.22px]">

                    <div className={`lg:hidden`}><Title> who am i? </Title></div>

                    <div
                        className="flex flex-col lg:justify-between lg:flex-row items-start space-y-7 lg:space-y-0 lg:space-x-16">

                        <div
                            className="lg:w-[45%] w-full h-full lg:sticky lg:top-0 lg:h-[100vh] flex flex-col justify-center items-start lg:space-y-7 lg:py-12 xl:py-20">

                            <div className={`lg:block hidden`}><Title> who am i? </Title></div>

                            <Image
                                src="/portfolio/images/about.png"
                                alt="a picture of me"
                                width={5000}
                                height={5000}
                                style={{objectFit: "cover"}}
                                quality={80}
                                className="w-full h-auto max-h-[70dvh] rounded-xl"
                            />
                        </div>

                        <div className="hidden lg:block lg:w-[55%] h-auto space-y-5">

                            <div
                                className="lg:sticky lg:top-0 lg:pt-[10dvh] lg:min-h-[100dvh] flex items-center justify-center">
                                <div
                                    className={`lg:h-[60dvh] flex justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                                    <Textbox>
                                        <Scramble>
                                            Hi, I’m Fasai Charoensudjai, a 20-year-old Economics student at the
                                            University
                                            of Warwick from Thailand. While I’m actively pursuing a career in
                                            consulting
                                            with a focus on data science and finance, my real passion is art. This
                                            website is a passion project I created
                                            over the summer, combining my love for art and web development to
                                            showcase
                                            my
                                            illustrations, concept art, and fanart in a way that feels true to my
                                            personal style.
                                        </Scramble>
                                    </Textbox>
                                </div>
                            </div>

                            <div
                                className="lg:sticky lg:top-0 lg:pt-[10.5dvh] lg:min-h-[100dvh] flex items-center justify-center">
                                <div
                                    className={`lg:h-[60dvh] flex justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                                    <Textbox>
                                        <Scramble>
                                            Art has always been a part of my life, and even though university keeps
                                            me
                                            busy, I still find time to draw pieces inspired by the games and shows I
                                            love, like League of Legends, Genshin Impact, and Arcane. I primarily
                                            work
                                            digitally using Procreate on my iPad, but I’ve also explored traditional
                                            mediums in the past. My creative process is mostly focused on stylistic
                                            work, but I’m always pushing myself to improve.
                                        </Scramble>
                                    </Textbox>

                                </div>
                            </div>

                            <div
                                className="lg:sticky lg:top-0 lg:pt-[12dvh] lg:min-h-[100dvh] flex items-center justify-center">
                                <div
                                    className={`lg:h-[50dvh] flex justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                                    <Textbox>
                                        <Scramble>
                                            Coming from Thailand, I wanted this website to reflect a bit of my
                                            cultural
                                            background, which is why I designed the logo based on a traditional Thai
                                            pattern. This site is not only a space to display my art but also a step
                                            forward in my web development journey!
                                        </Scramble>
                                    </Textbox>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden h-auto space-y-5">
                            <div
                                className={`flex justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                                <Textbox caret={false}>
                                    <Scramble>
                                        Hi, I’m Fasai Charoensudjai, a 20-year-old Economics student at the University
                                        of Warwick from Thailand. While I’m actively pursuing a career in consulting
                                        with a focus on data science and finance, my real passion is art. This website
                                        is a passion project I created over the summer, combining my love for art and
                                        web development to showcase my illustrations, concept art, and fanart in a way
                                        that feels true to my personal style.
                                    </Scramble>
                                </Textbox>
                            </div>

                            <div
                                className={`flex justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                                <Textbox caret={false}>
                                    <Scramble>
                                        Art has always been a part of my life, and even though university keeps me busy,
                                        I still find time to draw pieces inspired by the games and shows I love, like
                                        League of Legends, Genshin Impact, and Arcane. I primarily work digitally using
                                        Procreate on my iPad, but I’ve also explored traditional mediums in the past. My
                                        creative process is mostly focused on stylistic work, but I’m always pushing
                                        myself to improve.
                                    </Scramble>
                                </Textbox>
                            </div>

                            <div
                                className={`flex justify-center items-center ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                                <Textbox>
                                    <Scramble>
                                        Coming from Thailand, I wanted this website to reflect a bit of my cultural
                                        background, which is why I designed the logo based on a traditional Thai
                                        pattern. This site is not only a space to display my art but also a step forward
                                        in my web development journey!
                                    </Scramble>
                                </Textbox>
                            </div>
                        </div>


                    </div>

                    <div
                        className={`lg:min-h-[10dvh] flex justify-center items-center ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                        <Fader enterDelay={0.3} threshold={0.3}>
                            <div className="flex justify-center items-center">
                                <Button href="/gallery">
                                    view my gallery
                                </Button>
                            </div>
                        </Fader>
                    </div>

                </div>
            </div>


            <Fader>
                <Contact/>
            </Fader>

            <Footer/>
        </div>
    );
}
