"use client";

import React, { useState, useRef } from "react";
import { Title } from "@/components/title";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/header/mobilenav";
import { LocalTime } from "@/components/footer/localtime";
import { SocialIcons } from "@/components/footer/socialicons";
import { Footer } from "@/components/footer/footer";
import { Textbox } from "@/components/textbox";
import { Contact } from "@/components/contact";
import Image from "next/image";
import { DottedLineSeparator } from "@/components/dottedlineseparator";
import { Button } from "@/components/button";
import { Scramble } from "@/styles/scrambler";
import Fader from "@/styles/fader";

export default function Home() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const sectionRefs = {
        home: useRef<HTMLDivElement>(null),
        recents: useRef<HTMLDivElement>(null),
        intro: useRef<HTMLDivElement>(null),
        contact: useRef<HTMLDivElement>(null),
    };

    return (
        <div className={`${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

            <div id="home" className={`flex flex-col min-h-dvh ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

                <main className="flex flex-col flex-grow items-start justify-center text-left text-xs sm:text-md px-6 md:px-16 xl:px-20">

                    <Fader>

                        <Title size="large">
                            <div className="fixed-line-spacing mt-[75.58px] lg:mt-[103.22px]">
                                fasai <br/> charoensudjai
                            </div>
                        </Title>

                        <div className="w-[65%] my-4 space-x-2">
                            <Textbox>
                                <Scramble> [ scroll to explore ] </Scramble>
                            </Textbox>
                        </div>

                    </Fader>
                </main>

                <div className="flex justify-between items-center px-3 md:px-5 py-3 bg-transparent">
                    <LocalTime/>
                    <SocialIcons/>
                </div>

                <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            </div>

            <div id="recents" ref={sectionRefs.recents}
                 className="px-6 md:px-16 xl:px-20 space-y-[25dvh] lg:space-y-12 my-7">

                <div className="sticky top-0 z-0">
                    <Fader>
                        <div className="flex min-h-[100dvh] justify-center items-center">

                            <div className="flex flex-col space-y-6 lg:space-y-7 xl:space-y-10">

                                <Title size="medium">
                                    <div
                                        className="fixed-line-spacing scroll-mt-[120.28px] lg:scroll-mt-[148.02px]"> recent
                                        works
                                    </div>
                                </Title>


                                <div className="lg:w-[65%]">
                                    <Textbox>
                                        <Scramble>
                                            Here are the previews for some of the pieces I've been working on lately.
                                            Feel
                                            free to click on them to see the full image, view some more details,
                                            or click on the gallery button to view all of them!
                                        </Scramble>
                                    </Textbox>
                                </div>

                                <div><Button href="/gallery"> view my gallery </Button></div>
                            </div>

                        </div>
                    </Fader>
                </div>

                <div className={`sticky top-0 z-10 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                    <Fader>
                        <div className="flex h-[100dvh] justify-center items-center">
                            <div className="py-[75.48px] lg:py-0 space-y-3 lg:space-y-5">

                                <div className="lg:hidden"><DottedLineSeparator align="left"> [ 01
                                    ] </DottedLineSeparator>
                                </div>

                                <div className="lg:hidden"><Title size="small"> raiden shogun </Title></div>

                                <div
                                    className="flex flex-col lg:flex-row lg:justify-between justify-center lg:space-x-16 space-y-3 md:space-y-7 lg:space-y-0 lg:py-12">

                                    <div className="relative lg:w-[65%] max-h-full">
                                        <Image
                                            src="/images/raiden-shogun/raiden-home.png"
                                            alt="snippet of raiden shogun"
                                            width={1183}
                                            height={851}
                                            style={{objectFit: "cover"}}
                                            quality={60}
                                            className="w-full h-auto lg:h-full lg:w-full"
                                        />
                                    </div>


                                    <div className="lg:min-w-[45%] lg:max-w-[45%] flex flex-col lg:space-y-5">

                                        <div className="hidden lg:block"><DottedLineSeparator align="left"> [ 01
                                            ] </DottedLineSeparator></div>

                                        <div className="hidden lg:block"><Title size="small"> raiden shogun </Title>
                                        </div>

                                        <div className="flex flex-col justify-evenly lg:space-y-7">

                                            <div className={`flex flex-grow w-full`}>
                                                <div
                                                    className={`className="flex-grow min-h-[100px] md:min-h-[150px] lg:min-h-[250px]`}>
                                                    <Textbox>
                                                        <Scramble>
                                                            Raiden Shogun has been my favourite character from Genshin
                                                            Impact
                                                            for the longest time, and so I wanted to capture her energy.
                                                            Inspired by the League of Legends splash art styles, this is
                                                            one of the biggest digital canvases I've ever worked on, and
                                                            I’m
                                                            really happy with how it turned out.
                                                        </Scramble>
                                                    </Textbox>
                                                </div>
                                            </div>

                                            <div className="hidden lg:block justify-start"><Button href=""> more
                                                detail </Button></div>

                                        </div>

                                    </div>

                                    <div className="lg:hidden flex justify-center items-center"><Button href=""> more
                                        detail </Button></div>

                                </div>
                            </div>
                        </div>
                    </Fader>
                </div>

                <div className={`sticky top-0 z-10 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                    <Fader>
                        <div className="flex h-[100dvh] justify-center items-center">
                            <div className="py-[75.48px] lg:py-0 space-y-3 lg:space-y-5">

                                <div className="lg:hidden"><DottedLineSeparator align="left"> [ 02
                                    ] </DottedLineSeparator>
                                </div>

                                <div className="lg:hidden"><Title size="small"> raven </Title></div>

                                <div
                                    className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:justify-between justify-center lg:space-x-16 space-y-3 md:space-y-7 lg:space-y-0 lg:py-12">

                                    <div className="relative lg:w-[65%] max-h-full">
                                        <Image
                                            src="/images/raven/raven-home.png"
                                            alt="snippet of raven"
                                            width={1183}
                                            height={851}
                                            style={{
                                                objectFit: "cover",
                                                objectPosition: "80% 50%"
                                            }}
                                            quality={80}
                                            className="w-full h-auto lg:h-full lg:w-auto"
                                        />
                                    </div>


                                    <div className="lg:min-w-[45%] lg:max-w-[45%] flex flex-col lg:space-y-5">

                                        <div className="hidden lg:block"><DottedLineSeparator align="right"> [ 02
                                            ] </DottedLineSeparator></div>

                                        <div className="hidden lg:block text-end"><Title size="small"> raven </Title>
                                        </div>

                                        <div className="flex flex-col justify-evenly lg:space-y-7">

                                            <div className={`flex flex-grow w-full`}>
                                                <div
                                                    className={`className="flex-grow min-h-[100px] md:min-h-[150px] lg:min-h-[250px] lg:text-end`}>
                                                    <Textbox>
                                                        <Scramble>
                                                            I joined a "Draw This In Your Style Challenge" for
                                                            Raven, a character by another artist.
                                                            It was a great learning experience, especially for
                                                            drawing metal and improving on backgrounds.
                                                            This project helped me grow as an artist, and I was very
                                                            happy to be featured on the front of the artist's post!
                                                        </Scramble>
                                                    </Textbox>
                                                </div>
                                            </div>

                                            <div className="hidden lg:flex justify-end"><Button href=""> more
                                                detail </Button></div>

                                        </div>

                                    </div>

                                    <div className="lg:hidden flex justify-center items-center"><Button href=""> more
                                        detail </Button></div>

                                </div>
                            </div>
                        </div>
                    </Fader>
                </div>

                <div className={`sticky top-0 z-10 ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
                    <Fader>
                        <div className="flex h-[100dvh] justify-center items-center">
                            <div className="py-[75.48px] lg:py-0 space-y-3 lg:space-y-5">
                                <div className="flex justify-center items-center md:mb-[10dvh] md:py-6">
                                    <Button href="/gallery"> view my gallery </Button>
                                </div>
                            </div>
                        </div>
                    </Fader>
                </div>


            </div>

            <div id="intro" className=" px-6 md:px-16 xl:px-20 space-y-5 lg:space-y-12 my-7 min-h-[100dvh] flex flex-col justify-center items-start">

                <Fader>
                    <div className={`py-[75.48px] space-y-3 lg:space-y-5`}>
                        <div id="" className="md:hidden fixed-line-spacing">
                            <Title size="medium">
                                a brief intro
                            </Title>
                        </div>

                        <div
                            className="flex flex-col justify-center space-y-3 lg:space-y-5 sm:flex-row-reverse sm:space-x-reverse sm:space-x-6 lg:space-x-reverse lg:space-x-12 xl:space-x-reverse sm:space-y-0 ">

                            <div className="flex items-center justify-center md:justify-center">
                                <Image
                                    src={theme === "dark" ? "/icons/dark/logodark.svg" : "/icons/light/logo.svg"}
                                    alt="logo"
                                    width={1000}
                                    height={1000}
                                    style={{
                                        objectFit: "contain",
                                    }}
                                    className="p-2 sm:p-4 xl:p-6 max-w-[70%] sm:h-[400px] lg:h-[700px] xl:h-full"
                                />
                            </div>

                            <div
                                className="sm:max-w-[50%] sm:space-y-5 lg:space-y-7 xl:space-y-10 flex flex-col justify-center items-start">
                                <div className="hidden md:block fixed-line-spacing">

                                    <Title size="medium">
                                        a brief intro
                                    </Title>

                                </div>

                                <div className="flex items-center">
                                    <Textbox>
                                        <Scramble>
                                            Hi, I’m Fasai, an artist from Thailand and an Economics student at the
                                            University of Warwick!
                                            I created this website to showcase my passion for illustration, concept art
                                            and
                                            fanart, combining my love for art with web design in a way that's true to my
                                            style.
                                            Click the button below to learn more about my journey!
                                        </Scramble>
                                    </Textbox>
                                </div>

                                <div className={"justify-start hidden sm:block"}><Button href=""> read my
                                    story </Button>
                                </div>
                            </div>

                            <div className="sm:hidden flex justify-center items-center"><Button href=""> read my
                                story </Button></div>

                        </div>
                    </div>
                </Fader>

            </div>

            <Fader> <Contact/> </Fader>

            <Footer/>

        </div>

    );
}
