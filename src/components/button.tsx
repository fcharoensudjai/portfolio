import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface ButtonProps {
    children: React.ReactNode;
    href: string,
}

export const Button = ({ children, href }: ButtonProps) => {

    const { theme } = useTheme();

    return (
        <motion.div
            whileHover={{
                backgroundColor: theme === "dark" ? "text-dark" : "text-light",
                color: theme === "dark" ? "text-dark" : "main-light",

            }}>
            <div
                className={`rounded-full inline-block border-[2px] py-2.5 px-3 lg:px-5 md:text-sm lg:text-md text-xs ${theme === "dark" ? "bg-text-light text-text-dark border-text-dark" : "bg-main-light text-text-light border-text-light"} `}>
                <Link href={href}>
                    {children}
                </Link>
            </div>

        </motion.div>

    );
};
