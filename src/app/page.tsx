"use client";

import React, {useState} from "react";
import { Title } from "@/components/title";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobilenav";
import { LocalTime } from "@/components/localtime";
import { SocialIcons } from "@/components/socialicons";
import { Footer } from "@/components/footer";
import {Textbox} from "@/components/textbox";
import {Contact} from "@/components/contact";
import Image from "next/image";
import {DottedLineSeparator} from "@/components/dottedlineseparator";


export default function Home() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div>
            <div id="home"
                 className={`flex flex-col min-h-dvh ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
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

            <div className="px-6 md:px-16 xl:px-20 space-y-5 lg:space-y-12 my-7">

                <Title size="medium">
                    <div id="recent-works" className="fixed-line-spacing scroll-mt-[120.28px] lg:scroll-mt-[148.02px]">
                        recent works
                    </div>
                </Title>


                <div className="lg:w-[65%]">
                    <Textbox>
                        Here are some of the pieces I've been working on lately. Feel free to click on them to view some
                        more details, or the gallery button to view all of them!
                    </Textbox>
                </div>

                <div className="space-y-5">

                    <div className="lg:hidden"> <DottedLineSeparator> [ 01 ] </DottedLineSeparator> </div>


                    <div className="lg:hidden"> <Title size="small"> raiden shogun </Title> </div>

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


                        <div className="lg:max-w-[45%] order-last flex flex-col lg:space-y-5">

                            <div className="hidden lg:block"><Title size="small"> raiden shogun </Title></div>

                            <div className="flex flex-col justify-evenly lg:space-y-7">

                                <Textbox>
                                    Raiden Shogun has been my favorite character from Genshin Impact for the longest
                                    time, and so I wanted to make something that captured her energy. Inspired by the
                                    League of Legends splash art styles, this is one of the biggest digital canvases
                                    I've ever
                                    worked on, and I’m really happy with how it turned out.
                                </Textbox>

                            </div>

                        </div>
                    </div>
                </div>

                <div className="space-y-5">

                    <div className="lg:hidden"><DottedLineSeparator> [ 02 ] </DottedLineSeparator></div>

                    <div className="lg:hidden"><Title size="small"> raven </Title></div>

                    <div
                        className="flex flex-col-reverse space-y-reverse md:space-y-reverse lg:flex-row lg:justify-between justify-between lg:space-x-16 space-y-5 md:space-y-7 lg:space-y-0">

                        <div className="lg:max-w-[45%] flex flex-col lg:items-end lg:space-y-5">

                            <div className="hidden lg:block"><Title size="small"> raven </Title></div>

                            <div className="flex flex-col justify-evenly lg:space-y-7 lg:text-end">

                                <Textbox>
                                    I participated in a "Draw This In Your Style" contest for Raven, a character by
                                    another artist. Raven was a great learning experience for me, especially in drawing
                                    metal, and marked my second attempt into drawing better backgrounds after Raiden.
                                    This project pushed me to grow as an artist and expand my skills,
                                    and I was very happy to have been featured on the front of the artist's post at the
                                    end of the competition!
                                </Textbox>

                            </div>

                        </div>

                        <div className="relative lg:w-[50%]">
                            <Image
                                src="/images/raven/raven-home.png"
                                alt="snippet of raven"
                                width={1183}
                                height={851}
                                style={{objectFit: "cover"}}
                                quality={80}
                                className="w-full h-auto lg:h-full lg:w-auto "
                            />
                        </div>

                    </div>
                </div>

            </div>

            <div className="px-6 md:px-16 xl:px-20 space-y-5 lg:space-y-12 my-7">

                <Title size="medium">
                    <div id="about" className="fixed-line-spacing scroll-mt-[120.28px] lg:scroll-mt-[148.02px]">
                        a brief intro
                    </div>
                </Title>


            </div>



            <Contact/>

            <Footer/>

        </div>

        );
    }
