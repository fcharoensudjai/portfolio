"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"
import ThemeSwitch from "./themeswitch"

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false); // Checking if the mobile nav is open
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() =>
        typeof window !== "undefined" ? localStorage.getItem("dark-mode") === "true" : false
    );

    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const handleNavItemClick = () => setIsNavOpen(false);
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem("dark-mode", newDarkMode ? "true" : "false");
    };

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    const path = usePathname();
    const { theme } = useTheme();

    return (
        <header className={`fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm z-50 dark:text-text-dark text-text-light ${isDarkMode ? 'bg-transparent text-text-dark' : 'bg-transparent'}`}>
            <div className="flex items-center justify-between px-4 py-2">
                <Link href="/">
                    <Image
                        src={theme === 'dark' ? "/icons/logodark.svg" : "/icons/logo.svg"}
                        alt="logo"
                        width={222.47}
                        height={77.63}
                        layout="fixed"
                    />
                </Link>

                {/* For md and larger screens */}
                <div className="flex items-center space-x-4">
                    <nav className="hidden md:flex md:items-center">
                        <ul className="flex space-x-4 text-md">
                            <li>
                                <Link
                                    className={path === "/" ? "invisible underline underline-offset-4 decoration-accent-light" : ""}
                                    href="/"> home </Link>
                            </li>
                            <li>
                                <Link
                                    className={path === "/recent-works" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                    href="/recent-works"> recent works </Link>
                            </li>
                            <li>
                                <Link
                                    className={path === "/gallery" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                    href="/gallery"> gallery </Link>
                            </li>
                            <li>
                                <Link
                                    className={path === "/about" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                    href="/about"> about </Link>
                            </li>
                            <li>
                                <Link
                                    className={path === "/contact" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                    href="/contact"> contact </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="invisible md:visible ml-4 flex justify-center items-center">
                        <ThemeSwitch classNames={"p-0 m-0"} />
                    </div>

                </div>


                {/* for smaller screens (hamburger menu) */}
                <div className="flex md:hidden items-center space-x-3">
                    <ThemeSwitch/>
                    <button onClick={toggleNav} aria-label="toggle navigation">
                        <Image
                            src="/icons/hamburger.svg"
                            alt="hamburger"
                            width={40}
                            height={40}
                            layout="fixed"
                            className="max-w-[40px]"
                        />
                    </button>
                </div>
            </div>

            {/* mobile dropdown nav*/}
            <div
                className={`fixed inset-x-0 top-[calc(6rem)] h-[calc(100vh-6rem)] md:hidden ${isNavOpen ? 'visible' : 'invisible'} ${isDarkMode ? 'bg-text-dark text-text-light' : 'bg-text-dark text-text-light'}`}>
                <nav className="flex h-full justify-center items-center text-end">
                    <ul className="flex flex-col space-y-4 text-2xl font-sans items-center"
                        onClick={handleNavItemClick}>
                        <li>
                            <Link className={path === "/" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                  href="/"> home </Link>
                        </li>
                        <li>
                            <Link className={path === "/recent-works" ? "underline underline-offset-4 decoration-accent-light" : ""} href="/recent-works"> recent works </Link>
                        </li>
                        <li>
                            <Link className={path === "/gallery" ? "underline underline-offset-4 decoration-accent-light" : ""} href="/gallery"> gallery </Link>
                        </li>
                        <li>
                            <Link className={path === "/about" ? "underline underline-offset-4 decoration-accent-light" : ""} href="/about"> about </Link>
                        </li>
                        <li>
                            <Link className={path === "/contact" ? "underline underline-offset-4 decoration-accent-light" : ""} href="/contact"> contact </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};
