"use client";

import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import ThemeSwitch from "./themeswitch";
import { LogoButton } from "@/components/logobutton";
import { MobileNav } from "@/components/header/mobilenav";
import {Scrollbar} from "@/components/header/scrollbar";
import {UnderlinedLink} from "@/components/underlinedlink";

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const { theme } = useTheme();

    return (
        <div>

            <Scrollbar />

            <header className={`fixed top-0 left-0 bg-transparent backdrop-blur-[8px] w-screen z-40 ${theme === "dark" ? "text-text-dark" : "text-text-light"}`}>

                <div className="flex items-center justify-between px-4 py-2 md:px-6">

                    <LogoButton/>

                    <div className="flex items-center space-x-4 mix-blend-difference">
                        <nav className="hidden md:flex md:items-center">
                            <ul className="flex space-x-4 text-xs lg:text-sm xl:text-md">
                                <li>
                                    <UnderlinedLink href="/#recents">
                                        recents
                                    </UnderlinedLink>
                                </li>
                                <li>
                                    <UnderlinedLink href="/gallery">
                                        gallery
                                    </UnderlinedLink>
                                </li>
                                <li>
                                    <UnderlinedLink href="/#intro">
                                        intro
                                    </UnderlinedLink>
                                </li>
                                <li>
                                    <UnderlinedLink href="/about">
                                        about
                                    </UnderlinedLink>
                                </li>
                                <li>
                                    <UnderlinedLink href="/#contact">
                                        contact
                                    </UnderlinedLink>
                                </li>
                            </ul>
                        </nav>
                        <div className="invisible md:visible ml-4 flex justify-center items-center">
                            <ThemeSwitch/>
                        </div>
                    </div>
                    <div className="flex md:hidden items-center space-x-3">
                        <ThemeSwitch/>
                        <button onClick={toggleNav} aria-label="toggle navigation">
                            <Image
                                src={theme === "dark" ? "/icons/dark/hamburgerdark.svg" : "/icons/light/hamburger.svg"}
                                alt="hamburger"
                                width={30}
                                height={30}
                                className="max-w-[40px] md:w-[40px] md:h-[40px]"
                            />
                        </button>
                    </div>
                </div>
            </header>

            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav}/>

        </div>
    );
};
