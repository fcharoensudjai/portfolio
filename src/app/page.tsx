"use client";

import React from "react";
import { Title } from "@/components/title";
import Link from "next/link";
import Clock from "react-live-clock";
import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import { useTheme } from "next-themes"

export default function Home() {

    const { theme } = useTheme();

    return (
        <div className={`flex flex-col items-start lg:ps-20 md:ps-10 sm:ps-6 ps-6 ${theme === "dark" ? "bg-text-light text-text-dark" : "bg-main-light text-text-light"} min-h-screen`}>
            <div className="flex flex-grow flex-col items-start justify-center text-left px-4 min-h-screen">
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
                    <div
                        className="lg:absolute lg:bottom-5 lg:right-4 invisible md:visible md:absolute md:bottom-5 md:right-4 space-x-4">
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

                    <div className="md:text-md lg:text-md text-xs absolute bottom-5 left-5 md:left-5 flex flex-row justify-between md:space-x-2 space-x-1">
                        <p> [ local time (GB) |</p>
                        <Clock
                            timezone={"GB"}
                            format={"H:mm:ss"}
                            ticking={true}
                        />
                        <p> ] </p>
                    </div>
                </div>
            </div>




            <footer className={"text-4xl mt-auto"}>footer yayay</footer>
        </div>

    );
}
