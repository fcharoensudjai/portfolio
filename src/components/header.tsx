"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"
import ThemeSwitch from "./themeswitch"
import { motion, AnimatePresence} from "framer-motion";

export const Header = () => {

    const [isNavOpen, setIsNavOpen] = useState(false); // checking if mobile nav is open

    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const path = usePathname();
    const { theme } = useTheme();

    return (

        <header className={`fixed top-0 left-0 right-0 backdrop-blur-sm z-50 ${isNavOpen ? (theme === "dark" ? "bg-middle-colour md:bg-transparent" : "bg-text-dark md:bg-transparent") : "bg-transparent"} ${theme === "dark" ? "text-text-dark" : "text-text-light"}`}>
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

                {/* for md and larger screens */}
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
                        <ThemeSwitch />
                    </div>

                </div>


                {/* for smaller screens (hamburger menu) */}
                <div className="flex md:hidden items-center space-x-3">
                    <ThemeSwitch/>
                    <button onClick={toggleNav} aria-label="toggle navigation">
                        <Image

                            src={theme === "dark" ? "/icons/hamburgerdark.svg" : "/icons/hamburger.svg"}
                            alt="hamburger"
                            width={40}
                            height={40}
                            layout="fixed"
                            className="max-w-[40px]"
                        />
                    </button>
                </div>
            </div>

            {/* mobile dropdown nav */}
            <AnimatePresence>
                {isNavOpen && (
                    <motion.div
                        className={`fixed inset-x-0 top-[calc(6rem)] h-[calc(100vh-6rem)] md:hidden ${theme === "dark" ? 'bg-middle-colour' : 'bg-text-dark'}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <nav className="flex h-full justify-center items-center">
                            <ul className="flex flex-col space-y-4 text-2xl font-sans [a_&]:text-end" onClick={toggleNav}>
                                <li>
                                    <Link className={path === "/" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                          href="/"> home </Link>
                                </li>
                                <li>
                                    <Link className={path === "/recent-works" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                          href="/recent-works"> recent works </Link>
                                </li>
                                <li>
                                    <Link className={path === "/gallery" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                          href="/gallery"> gallery </Link>
                                </li>
                                <li>
                                    <Link className={path === "/about" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                          href="/about"> about </Link>
                                </li>
                                <li>
                                    <Link className={path === "/contact" ? "underline underline-offset-4 decoration-accent-light" : ""}
                                          href="/contact"> contact </Link>
                                </li>
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
