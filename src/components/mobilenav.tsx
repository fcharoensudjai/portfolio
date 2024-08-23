"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import ThemeSwitch from "@/components/themeswitch";
import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/localtime";
import { SocialIcons } from "@/components/socialicons";

interface MobileNavProps {
    isNavOpen: boolean;
    toggleNav: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isNavOpen, toggleNav }) => {
    const { theme } = useTheme();
    const path = usePathname();

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: isNavOpen ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"}`}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-2">
                    <LogoButton />
                    <div className="flex items-center space-x-3">
                        <ThemeSwitch />
                        <button onClick={toggleNav} aria-label="close navigation">
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
                    <ul className="flex flex-col space-y-3 text-2xl text-right font-sans">
                        <li> <Link className={path === "/" ? "underline underline-offset-[12px] decoration-accent-light" : ""} href="/"> home </Link> </li>
                        <li> <Link className={path === "/recent-works" ? "underline underline-offset-[12px] decoration-accent-light" : ""} href="/recent-works"> recent works </Link> </li>
                        <li> <Link className={path === "/gallery" ? "underline underline-offset-[12px] decoration-accent-light" : ""} href="/gallery"> gallery </Link> </li>
                        <li> <Link className={path === "/about" ? "underline underline-offset-[12px] decoration-accent-light" : ""} href="/about"> about </Link> </li>
                        <li> <Link className={path === "/contact" ? "underline underline-offset-[12px] decoration-accent-light" : ""} href="/contact"> contact </Link> </li>
                    </ul>
                </div>
                <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-5 py-3 bg-transparent">
                    <div className="flex-grow flex justify-start">
                        <LocalTime />
                    </div>
                    <div className="flex-grow flex justify-end">
                        <SocialIcons />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};