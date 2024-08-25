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
            medium: "w-[143px] h-[49.9px] md:w-[222.47px] md:h-[77.63px] xl:w-[595.34px] xl:h-[192px]",
        },
    },
    defaultVariants: {
        size: "small",
    },
});

export const LogoButton = ({ size = "small" }: LogoButtonProps) => {
    const { theme } = useTheme();

    return (
        <Link href="/#home">
            <div className={logoButtonVariants({ size })}>
                <Image
                    src={theme === "dark" ? "/icons/dark/fulllogodark.svg" : "/icons/light/fulllogo.svg"}
                    alt="full logo"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </Link>
    );
};
