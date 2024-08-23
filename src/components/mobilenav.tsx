"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import ThemeSwitch from "@/components/themeswitch";
import React, { useState } from "react";
import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/localtime";
import { SocialIcons} from "@/components/socialicons";

export const MobileNav = () => {

    const { theme } = useTheme();
    const path = usePathname();

    const [isNavOpen, setIsNavOpen] = useState(true); // when this visible open we know that the nav is open
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <div className={`md:hidden flex flex-col fixed inset-0 min-h-screen w-screen z-50 ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} ${isNavOpen ? "visible" : "invisible"}`}>
            <div className="flex items-center justify-between px-4 py-2">
                <LogoButton />

                <div className={"flex items-center space-x-3"}>
                    <ThemeSwitch/>

                    <button onClick={toggleNav} aria-label="toggle navigation">
                        <Image

                            src={theme === "dark" ? "/icons/dark/closedark.svg" : "/icons/light/close.svg"}
                            alt="close navigation"
                            width={35}
                            height={35}
                            layout="fixed"
                            className="max-w-[40px]"
                        />
                    </button>
                </div>
            </div>

            <div className="flex flex-grow justify-end items-center pe-8">
                <ul className="flex flex-col space-y-6 text-2xl text-right font-sans right-0">
                    <li>
                        <Link
                            className={path === "/" ? "underline underline-offset-[12px] decoration-accent-light" : ""}
                            href="/"> home </Link>
                    </li>
                    <li>
                        <Link
                            className={path === "/recent-works" ? "underline underline-offset-[12px] decoration-accent-light" : ""}
                            href="/recent-works"> recent works </Link>
                    </li>
                    <li>
                        <Link
                            className={path === "/gallery" ? "underline underline-offset-[12px] decoration-accent-light" : ""}
                            href="/gallery"> gallery </Link>
                    </li>
                    <li>
                        <Link
                            className={path === "/about" ? "underline underline-offset-[12px] decoration-accent-light" : ""}
                            href="/about"> about </Link>
                    </li>
                    <li>
                        <Link
                            className={path === "/contact" ? "underline underline-offset-[12px] decoration-accent-light" : ""}
                            href="/contact"> contact </Link>
                    </li>
                </ul>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-5 py-3 bg-transparent">
                <div className="flex-grow flex justify-start">
                    <LocalTime/>
                </div>
                <div className="flex-grow flex justify-end">
                    <SocialIcons/>
                </div>
            </div>


        </div>
    )
}