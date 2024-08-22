"use client";

import React from "react";
import { Title } from "@/components/title";
import Link from "next/link";
import Clock from "react-live-clock"


export default function Home() {
    return (
        <div className="flex flex-col items-start lg:ps-20 md:ps-10 sm:ps-6 ps-6 text-text-light dark:text-text-dark">
            <div className="flex flex-grow flex-col items-start justify-center text-left px-4 min-h-screen">
                <Title size="extraLarge" className="leading-normal">
                    <div className="fixed-line-spacing">
                        fasai <br/> charoensudjai
                    </div>
                </Title>
                <div className="mt-4">
                    <p className="text-md text-text-light dark:text-text-dark">
                        [ scroll to explore ]
                    </p>

                    <div className={"bg-text-light dark:bg-text-dark min-h-full w-min-[2rem]"}> <span /> </div>
                </div>

                <div>
                    <div
                        className="lg:absolute lg:bottom-4 lg:right-4 invisible md:visible md:absolute md:bottom-4 md:right-4 text-text-light dark:text-text-dark">
                        <ul className="flex text-md space-x-3">
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

                    <div className="md:text-md lg:text-md text-xs absolute bottom-2 left-3 md:bottom-4 md:left-4 flex flex-row justify-between md:space-x-2 space-x-1">
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




            <footer className={"text-4xl"}>footer yayay</footer>
        </div>

    );
}
