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

export default function Home() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div>
            <div id="home" className={`flex flex-col min-h-dvh ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                <main className="flex flex-col flex-grow items-start justify-center text-left text-xs sm:text-md px-6 md:px-16 xl:px-20">
                    <Title size="large">
                        <div className="fixed-line-spacing">
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

            <div className="px-6 md:px-16 xl:px-20 space-y-5 my-7">
                <Title size="medium">
                    <div id="recent-works" className="fixed-line-spacing">
                        recent works
                    </div>
                </Title>



                <div className="md:w-[65%]">
                    <Textbox>
                        Here are some of the pieces I've been working on lately. Feel free to click on them to view some more details, or the gallery button to view all of them!
                    </Textbox>
                </div>

                <Image
                    src={""}
                />
            </div>

            <Contact />

            <Footer/>
        </div>

    );
}
