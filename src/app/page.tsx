"use client";

import React, {useState} from "react";
import { Title } from "@/components/title";
import Link from "next/link";
import Clock from "react-live-clock";
import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobilenav";
import {LocalTime} from "@/components/localtime";
import {SocialIcons} from "@/components/socialicons";

export default function Home() {

    const { theme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <div className={`flex flex-col items-start min-h-screen lg:ps-20 md:ps-10 sm:ps-6 ps-6 ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"}`}>
            <div className="flex flex-col items-start justify-center text-left px-4 min-h-screen">
                <Title size="extraLarge">
                    <div className="fixed-line-spacing">
                        fasai <br/> charoensudjai
                    </div>
                </Title>
                <div className="flex flex-row justify-center items-center my-4 space-x-2">
                    <div className="text-md flex items-center">
                        [ scroll to explore ]
                        <BlinkingCaret />
                    </div>
                </div>

                <div>

                    <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-5 py-3 bg-transparent md:invisible">

                        <div className="flex-grow flex justify-start">
                            <LocalTime/>
                        </div>

                        <div className="flex-grow flex justify-end">
                            <SocialIcons/>
                        </div>

                    </div>

                    <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-5 py-3 bg-transparent invisible md:visible">

                        <div className="flex-grow flex justify-start">
                            <LocalTime/>
                        </div>

                        <div className="flex-grow flex justify-end">
                            <ul className="flex text-md space-x-4">
                                <li>
                                    <a href="#"> linkedin </a>
                                </li>
                                <li>
                                    <a href="#"> instagram </a>
                                </li>
                                <li>
                                    <a href="#"> artstation </a>
                                </li>
                                <li>
                                    <a href="#"> youtube </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            <div className={`${isNavOpen ? "visible" : "invisible"}`}>
                <MobileNav/>
            </div>
        </div>

    );
}
