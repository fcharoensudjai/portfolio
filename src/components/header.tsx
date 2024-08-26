"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import ThemeSwitch from "./themeswitch";
import { LogoButton } from "@/components/logobutton";
import { MobileNav } from "@/components/mobilenav";

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const path = usePathname();
    const { theme } = useTheme();

    return (
        <>
            <header className={`fixed top-0 left-0 bg-transparent backdrop-blur-[8px] w-screen z-40 ${theme === "dark" ? "text-text-dark" : "text-text-light"}`}>
                <div className="flex items-center justify-between px-4 py-2 md:px-6">
                    <LogoButton />
                    <div className="flex items-center space-x-4">
                        <nav className="hidden md:flex md:items-center">
                            <ul className="flex space-x-4 text-md">
                                <li>
                                    <Link
                                        className={path === "/#recents" ? "underline underline-offset-[10px] decoration-accent-light" : ""}
                                        href="/#recents"> recents </Link>
                                </li>
                                <li>
                                    <Link
                                        className={path === "/gallery" ? "underline underline-offset-[10px] decoration-accent-light" : ""}
                                        href="/gallery"> gallery </Link>
                                </li>
                                <li>
                                    <Link
                                        className={path === "/#intro" ? "underline underline-offset-[10px]  decoration-accent-light" : ""}
                                        href="/#intro"> intro </Link>
                                </li>
                                <li>
                                    <Link
                                        className={path === "/about" ? "underline underline-offset-[10px]  decoration-accent-light" : ""}
                                        href="/about"> about </Link>
                                </li>
                                <li>
                                    <Link
                                        className={path === "/#contact" ? "underline underline-offset-[10px]  decoration-accent-light" : ""}
                                        href="/#contact"> contact </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="invisible md:visible ml-4 flex justify-center items-center">
                            <ThemeSwitch/>
                        </div>
                    </div>
                    <div className="flex md:hidden items-center space-x-3">
                        <ThemeSwitch />
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
            <MobileNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
        </>
    );
};
