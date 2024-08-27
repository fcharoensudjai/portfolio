import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {stagger, motion, useAnimate} from "framer-motion";

interface ButtonProps {
    children: React.ReactNode;
    href: string,
}

export const Button = ({ children, href }: ButtonProps) => {

    const { theme } = useTheme();
    const [scope, animate] = useAnimate()

    const onButtonClick = () => {
        animate(".letter", {y:-32}, {duration: 0.2, delay: stagger(0.05)})
    }

    return (
        <motion.div>
            <button
                className={`rounded-full transition-colors border-[2px] py-1 md:py-[0.5rem] px-3 lg:px-5 lg:py-2.5 md:text-sm lg:text-md text-xs 
                ${theme === "dark" ? "text-text-dark border-text-dark" : "text-text-light border-text-light"}
                ${theme === "dark" ? "hover:text-text-light hover:bg-text-dark" : "hover:text-main-light hover:bg-text-light"}`}
            >
                <Link href={href}>
                    {children}
                </Link>
            </button>

        </motion.div>

    );
};
