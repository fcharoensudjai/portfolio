import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cva } from "class-variance-authority";
import React from "react";

interface LogoButtonProps {
    size?: "small" | "medium";
}

const logoButtonVariants = cva("relative", {
    variants: {
        size: {
            small: "w-32 h-[49.9px] lg:w-56 lg:h-[77.63px]",
            medium: "w-56 h-[77.63px] lg:w-70 lg:h-[143px]",
        },
    },
    defaultVariants: {
        size: "small",
    },
});

export const LogoButton = ({ size = "small" }: LogoButtonProps) => {
    const { theme } = useTheme();

    return (
        <Link href="/">
            <div className={logoButtonVariants({ size })}>
                <Image
                    src={theme === "dark" ? "/icons/dark/logodark.svg" : "/icons/light/logo.svg"}
                    alt="logo"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </Link>
    );
};
