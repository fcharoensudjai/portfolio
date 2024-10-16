"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cva } from "class-variance-authority";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useExitAnimation } from "@/app/exitcontext";
import { useVisibility } from "@/app/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/introvisibilitycontext";

interface LogoButtonProps {
    size?: "small" | "medium";
    exitDuration?: number;
}

const logoButtonVariants = cva("relative", {
    variants: {
        size: {
            small: "w-32 h-[49.9px] xl:w-56 xl:h-[77.63px]",
            medium: "w-[595.34px] h-[192px]",
        },
    },
    defaultVariants: {
        size: "small",
    },
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const LogoButton = ({ size = "small", exitDuration = 800 }: LogoButtonProps) => {
    const { theme } = useTheme();
    const path = usePathname();
    const router = useRouter();
    const { setIsExit } = useExitAnimation();
    const { resetRecentsVisibility } = useVisibility();
    const { resetIntroVisibility } = useVisibility2();

    const baseCurrentPath = path.split('#')[0];
    const currentHash = path.split('#')[1];
    const targetHash = "home";
    const isCurrentPath = baseCurrentPath === "/";

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isCurrentPath || (isCurrentPath && currentHash === targetHash)) {
            if (!isCurrentPath) {
                event.preventDefault();
                setIsExit(true);
                await sleep(exitDuration);
                router.push("/#home");
                setIsExit(false);
                resetRecentsVisibility();
                resetIntroVisibility();
            } else {
                event.preventDefault();
                window.scrollTo({
                    top: document.getElementById("home")?.offsetTop || 0,
                    behavior: "smooth",
                });
            }
        }
    };

    return (
        <Link href="/#home" onClick={handleClick}>
            <div className={logoButtonVariants({ size })}>
                <Image
                    src={theme === "dark" ? "@/../icons/dark/fulllogodark.svg" : "@/../icons/light/fulllogo.svg"}
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
