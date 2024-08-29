"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useExitAnimation } from "@/app/exitcontext";

interface UnderlinedLinkProps {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    isExternal?: boolean;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const UnderlinedLink: React.FC<UnderlinedLinkProps> = ({ href, children, onClick, isExternal = false }) => {
    const [hovered, setHovered] = useState(false);
    const { theme } = useTheme();
    const path = usePathname();
    const isCurrentPath = path === href;
    const router = useRouter();
    const { setIsExit } = useExitAnimation();

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isCurrentPath) {
            event.preventDefault();
            setIsExit(true);
            await sleep(1100);
            router.push(href);
            setIsExit(false);
        } else {
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

    return (
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
                ${hovered || isCurrentPath ? "w-full" : "w-0"} 
            `}>
            </div>
        </motion.div>
    );
};
