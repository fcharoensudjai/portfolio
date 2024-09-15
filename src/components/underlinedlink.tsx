"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useExitAnimation } from "@/app/exitcontext";
import { useInView } from "react-intersection-observer";

interface UnderlinedLinkProps {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    isExternal?: boolean;
    exitDuration?: number;
    underline?: boolean;
    isVisible?: boolean;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const UnderlinedLink: React.FC<UnderlinedLinkProps> = ({ href, children, onClick, isExternal = false, exitDuration = 800, underline = true, isVisible = false }) => {
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

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.5,
    });

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (isExternal || !isCurrentPath || (isCurrentPath && currentHash === targetHash)) {
            // if external link or the base paths are different, trigger the exit animation
            // or if the base path and hash are the same, just call onClick
            if (!isCurrentPath) {
                event.preventDefault();
                setIsExit(true);
                await sleep(exitDuration);
                router.push(href);
                setIsExit(false);

            } else {
                onClick?.();
            }
        } else {
            // if the base paths are the same but hashes are different (aka same page), allow default behaviour without exit animation
            onClick?.();
        }
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
