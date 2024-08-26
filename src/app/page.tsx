"use client";

import React, {useState} from "react";
import { Title } from "@/components/title";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobilenav";
import { LocalTime } from "@/components/localtime";
import { SocialIcons } from "@/components/socialicons";
import { Footer } from "@/components/footer";
import { Textbox } from "@/components/textbox";
import { Contact } from "@/components/contact";
import Image from "next/image";
import { DottedLineSeparator } from "@/components/dottedlineseparator";
import { Button } from "@/components/button";


export default function Home() {

    const {theme} = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div className="space-y-12">

            <div id="home" className={`flex flex-col min-h-dvh ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>

                <main
                    className="flex flex-col flex-grow items-start justify-center text-left text-xs sm:text-md px-6 md:px-16 xl:px-20">


                    <Title size="large">
                        <div className="fixed-line-spacing mt-[75.58px] lg:mt-[103.22px]">
                            fasai <br/> charoensudjai
                        </div>
                    </Title>
                    <div className="w-[65%] my-4 space-x-2">
                        <Textbox>
                            [ scroll to explore ]
                        </Textbox>
                    </div>
                </main>

                <div className="flex justify-between items-center px-3 md:px-5 py-3 bg-transparent">
                    <LocalTime/>
                    <SocialIcons/>
                </div>

                <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

            </div>

            <div className="px-6 md:px-16 xl:px-20 space-y-8 lg:space-y-12 my-7">

                <Title size="medium">
                    <div id="recents" className="fixed-line-spacing scroll-mt-[120.28px] lg:scroll-mt-[148.02px]">
                        recent works
                    </div>
                </Title>


                <div className="lg:w-[65%]">
                    <Textbox>
                        Here are the previews for some of the pieces I've been working on lately. Feel free to click on
                        them to see the full image, view some
                        more details, or click on the gallery button to view all of them!
                    </Textbox>
                </div>

                <div className="flex min-h-[100dvh] justify-center items-center">
                    <div className="space-y-5">

                        <div className="lg:hidden"><DottedLineSeparator align="left"> [ 01 ] </DottedLineSeparator>
                        </div>

                        <div className="lg:hidden"><Title size="small"> raiden shogun </Title></div>

                        <div
                            className="flex flex-col lg:flex-row lg:justify-between justify-center lg:space-x-16 space-y-5 md:space-y-7 lg:space-y-0">

                            <div className="relative lg:w-[65%]">
                                <Image
                                    src="/images/raiden-shogun/raiden-home.png"
                                    alt="snippet of raiden shogun"
                                    width={1183}
                                    height={851}
                                    style={{objectFit: "cover"}}
                                    quality={60}
                                    className="w-full h-auto lg:h-full lg:w-auto"
                                />
                            </div>


                            <div className="lg:max-w-[45%] flex flex-col lg:space-y-5">

                                <div className="hidden lg:block"><DottedLineSeparator align="left"> [ 01
                                    ] </DottedLineSeparator></div>

                                <div className="hidden lg:block"><Title size="small"> raiden shogun </Title></div>

                                <div className="flex flex-col justify-evenly lg:space-y-7">

                                    <Textbox>
                                        Raiden Shogun has been my favorite character from Genshin Impact for the longest
                                        time, and so I wanted to make something that captured her energy. Inspired by
                                        the
                                        League of Legends splash art styles, this is one of the biggest digital canvases
                                        I've ever worked on, and I’m really happy with how it turned out.
                                    </Textbox>

                                    <div className="hidden lg:block justify-start"><Button href=""> more
                                        detail </Button>
                                    </div>

                                </div>

                            </div>

                            <div className="lg:hidden flex justify-center items-center"><Button href=""> more
                                detail </Button></div>

                        </div>
                    </div>
                </div>

                <div className="flex min-h-[100dvh] justify-center items-center">
                    <div className="space-y-5">

                        <div className="lg:hidden"><DottedLineSeparator align="left"> [ 02 ] </DottedLineSeparator>
                        </div>

                        <div className="lg:hidden"><Title size="small"> raven </Title></div>

                        <div
                            className="flex flex-col-reverse space-y-reverse md:space-y-reverse lg:flex-row lg:justify-between space-y-5 md:space-y-7 lg:space-y-0">

                            <div className="lg:hidden flex justify-center items-center"><Button href=""> more
                                detail </Button></div>

                            <div className="lg:max-w-[45%] flex flex-col lg:space-y-5 lg:mr-16">

                                <div className="hidden lg:block"><DottedLineSeparator align="right"> [ 02
                                    ] </DottedLineSeparator></div>

                                <div className="hidden lg:block text-end"><Title size="small"> raven </Title></div>

                                <div className="flex flex-col justify-evenly lg:space-y-7 lg:text-end">

                                    <Textbox>
                                        I participated in a "Draw This In Your Style Challenge" for Raven, a character
                                        by
                                        another artist. Raven was a great learning experience for me, especially in
                                        drawing
                                        metal, and marked my second attempt into drawing better backgrounds after
                                        Raiden.
                                        This project pushed me to grow as an artist and expand my skills,
                                        and I was very happy to have been featured on the front of the artist's post at
                                        the
                                        end of the competition!
                                    </Textbox>

                                    <div className="hidden lg:block justify-end"><Button href=""> more detail </Button>
                                    </div>

                                </div>

                            </div>

                            <div className="relative lg:w-[50%]">
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

                        </div>

                        <div className="lg:hidden flex justify-center items-center"><Button href=""> view my
                            gallery </Button></div>

                    </div>
                </div>

            </div>

            <div id="intro" className=" px-6 md:px-16 xl:px-20 space-y-5 lg:space-y-12 my-7 min-h-[85dvh] flex flex-col justify-center items-start scroll-mt-[75.48px]">

                <div id="" className="md:hidden fixed-line-spacing">
                    <Title size="medium">
                        a brief intro
                    </Title>
                </div>

                <div className="flex flex-col justify-center space-y-5 sm:flex-row-reverse sm:space-x-reverse sm:space-x-6 lg:space-x-reverse lg:space-x-12 xl:space-x-reverse sm:space-y-0">

                    <div className="flex items-center justify-center md:justify-start">
                        <Image
                            src={theme === "dark" ? "/icons/dark/logodark.svg" : "/icons/light/logo.svg"}
                            alt="logo"
                            width={1000}
                            height={1000}
                            style={{
                                objectFit: "contain",
                            }}
                            className="p-4 xl:p-6 max-h-[80%]"
                        />
                    </div>

                    <div className="sm:max-w-[50%] sm:space-y-5 lg:space-y-7 xl:space-y-10 flex flex-col justify-center items-start">
                        <div className="hidden md:block fixed-line-spacing">

                            <Title size="medium">
                                a brief intro
                            </Title>

                        </div>

                        <div className="flex items-center">
                            <Textbox>
                                Hi, I’m Fasai, an artist from Thailand and an Economics student at the University of
                                Warwick.
                                I created this website to showcase my passion for illustration, concept art and fanart,
                                combining my love for art with web design in a way that's true to my style.
                                Click the button below to learn more about my journey!
                            </Textbox>
                        </div>

                        <div className={"justify-start hidden sm:block"}><Button href=""> read my story </Button></div>
                    </div>

                    <div className="sm:hidden flex justify-center items-center"> <Button href=""> read my story </Button> </div>

                </div>

            </div>

            <Contact/>

            <Footer/>

        </div>

    );
}
