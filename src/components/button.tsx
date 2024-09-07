import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import React from "react";
import {UnderlinedLink} from "@/components/underlinedlink";

interface ButtonProps {
    children: React.ReactNode;
    href: string,
}

export const Button = ({ children, href }: ButtonProps) => {

    const { theme } = useTheme();

    return (
        <motion.div>
            <motion.button
                style={{
                    color: theme === "dark" ? "#E8E7E2" : "#242424",
                    borderColor: theme === "dark" ? "#E8E7E2" : "#242424",
                    backgroundColor: theme === "dark" ? "#242424" : "#FEFBFB"
                }}
                whileTap={{
                    scale: 0.95,
                    color: theme === "dark" ? "#CD7A7A" : "#DDA6A6",
                    backgroundColor: theme === "dark" ? "#E8E7E2" : "#242424",
                    borderColor: theme === "dark" ? "#E8E7E2" : "#242424"
                }}
                whileHover={{
                    scale: 1.0,
                    color: theme === "dark" ? "#242424" : "#FEFBFB",
                    backgroundColor: theme === "dark" ? "#E8E7E2" : "#242424",
                    borderColor: theme === "dark" ? "#E8E7E2" : "#242424"
                }}
                className={`rounded-full border-[2px] py-1 md:py-[0.5rem] px-3 lg:px-5 lg:py-2.5 md:text-sm lg:text-md text-xs`}
            >
                <UnderlinedLink underline={false} href={href}>
                    {children}
                </UnderlinedLink>
            </motion.button>

        </motion.div>

    );
};
