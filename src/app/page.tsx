"use client";

import React, {useState} from "react";
import { Title } from "@/components/title";
import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobilenav";
import { LocalTime } from "@/components/localtime";
import { SocialIcons } from "@/components/socialicons";
import {Footer} from "@/components/footer";

export default function Home() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div>
            <div
                className={`flex flex-col min-h-dvh ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
                <main className="flex flex-col flex-grow items-start justify-center text-left px-6 md:px-16 xl:px-20">
                    <Title size="large">
                        <div className="fixed-line-spacing">
                            fasai <br/> charoensudjai
                        </div>
                    </Title>
                    <div className="flex flex-row justify-center items-center my-4 space-x-2">
                        <div className="text-sm sm:text-md flex items-center">
                            [ scroll to explore ]
                            <BlinkingCaret/>
                        </div>
                    </div>
                </main>

                <div className="flex justify-between items-center px-5 py-3 bg-transparent">
                    <LocalTime/>
                    <SocialIcons/>
                </div>

                <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>
            </div>

            <div className="px-4">
                <Title size="medium">
                    <div className="fixed-line-spacing">
                        recent works
                    </div>
                </Title>
            </div>

            {/*<Footer />*/}
        </div>

    );
}
