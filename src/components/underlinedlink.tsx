import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface UnderlineLinkProps {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    isExternal?: boolean;
}

export const UnderlinedLink: React.FC<UnderlineLinkProps> = ({ href, children, onClick, isExternal = false }) => {
    const [hovered, setHovered] = useState(false);
    const { theme } = useTheme();
    const path = usePathname();
    const isActive = path === href;

    const content = isExternal ? (
        <a
            href={href}
            onClick={onClick}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block"
        >
            {children}
        </a>
    ) : (
        <Link href={href} onClick={onClick}>
            {children}
        </Link>
    );

    return (
        <motion.div
            className="relative inline-block"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            {content}
            <div
                className={`
                border-t-[3px] transition-all duration-[350ms] ease-in-out
                ${theme === "dark" ? "border-accent-dark" : "border-accent-light"} 
                ${hovered || isActive ? "w-full" : "w-0"} 
            `}>
            </div>
        </motion.div>
    );
};
