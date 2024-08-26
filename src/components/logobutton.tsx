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
            medium: "w-[595.34px] h-[192px]",
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
                    width={500}
                    height={500}
                    style={{
                        objectFit: "contain",
                    }}
                />
            </div>
        </Link>
    );
};
