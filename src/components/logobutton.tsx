"use client";

import Link from "next/link";
import { cva } from "class-variance-authority";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useExitAnimation } from "@/app/contexts/exitcontext";
import { useVisibility } from "@/app/contexts/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/contexts/introvisibilitycontext";
import { BrandMark } from "@/components/brandmark";

interface LogoButtonProps {
  size?: "small" | "medium";
  exitDuration?: number;
  // The chrome's sampled tone, handed down like the theme switch's. Left alone (the ink token, fading
  // with the page) when the lockup sits on a known surface, e.g. the mobile nav's panel.
  inkColor?: string;
  transitionDuration?: string;
}

const logoButtonVariants = cva("relative", {
  variants: {
    size: {
      // px, not rem: the chrome is the one thing that deliberately does NOT ride the fluid root. At
      // 14rem the wordmark would render 308px wide in a 2560 window, which is what made the nav read
      // as oversized. Pinning both sizes keeps it the same physical size at every window.
      small: "w-[128px] h-[49.9px] xl:w-[224px] xl:h-[77.63px]",
      medium: "w-[595px] h-[192px]",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const LogoButton = ({ size = "small", exitDuration = 800, inkColor, transitionDuration }: LogoButtonProps) => {
  const path = usePathname();
  const router = useRouter();
  const { setIsExit } = useExitAnimation();
  const { resetRecentsVisibility } = useVisibility();
  const { resetIntroVisibility } = useVisibility2();

  const baseCurrentPath = path.split("#")[0];
  const isCurrentPage = baseCurrentPath === "/";

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    if (isCurrentPage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setIsExit(true);
      await sleep(exitDuration);
      router.push("/#home");
      setIsExit(false);
      resetRecentsVisibility();
      resetIntroVisibility();
    }
  };

  return (
    <Link href="/#home" onClick={handleClick} aria-label="fuzzch — home">
      <div className={logoButtonVariants({ size })}>
        <BrandMark className="h-full w-full" inkColor={inkColor} transitionDuration={transitionDuration} />
      </div>
    </Link>
  );
};
