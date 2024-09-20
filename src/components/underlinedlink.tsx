"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useExitAnimation } from "@/app/exitcontext";
import { useVisibility } from "@/app/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/introvisibilitycontext";

interface UnderlinedLinkProps {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    isExternal?: boolean;
    exitDuration?: number;
    underline?: boolean;
    isVisible?: boolean;
    scroll?: boolean;
    toggleNav?: () => void;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const UnderlinedLink: React.FC<UnderlinedLinkProps> = ({ href, children, onClick, isExternal = false, exitDuration = 800, underline = true, isVisible = false, scroll = false, toggleNav }) => {
    const [hovered, setHovered] = useState(false);
    const { theme } = useTheme();
    const path = usePathname();
    const baseCurrentPath = path.split('#')[0];
    const baseHref = href.split('#')[0];
    const currentHash = path.split('#')[1];
    const targetHash = href.split('#')[1];
    const isCurrentPath = baseCurrentPath === baseHref;
    const router = useRouter();
    const { setIsExit } = useExitAnimation();
    const isActive = href === path

    const { resetRecentsVisibility } = useVisibility();
    const { resetIntroVisibility } = useVisibility2();

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
    };

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {

        if (scroll) {
            // if scroll is true, perform scrolling to the bottom and exit
            event.preventDefault();
            if (toggleNav) toggleNav();
            scrollToBottom();
            return;
        }

        // handle navigation and exit animation logic only if not scrolling
        if (isExternal || !isCurrentPath || (isCurrentPath && currentHash === targetHash)) {
            if (!isCurrentPath) {
                event.preventDefault();
                setIsExit(true);
                await sleep(exitDuration);
                router.push(href);
                setIsExit(false);
                resetRecentsVisibility();
                resetIntroVisibility();
            } else {
                onClick?.();
            }
        } else {
            onClick?.();
        }

        setHovered(false);
    };

    const content = isExternal ? (
        <a
            href={href}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block"
        >
            {children}
        </a>
    ) : (
        <Link href={href} onClick={handleClick}>
            {children}
        </Link>
    );

    return underline ? (
        <motion.div
            className="relative inline-block"
            onClick={() => setHovered(true)}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            {content}
            <div
                className={`
                border-t-[3px] transition-all duration-[350ms] ease-in-out
                ${theme === "dark" ? "border-accent-dark" : "border-accent-light"} 
                ${hovered || isActive || isVisible ? "w-full" : "w-0"} 
            `}>
            </div>
        </motion.div> )
        : (content);
};
