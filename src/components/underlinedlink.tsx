"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useExitAnimation } from "@/app/contexts/exitcontext";
import { useVisibility } from "@/app/contexts/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/contexts/introvisibilitycontext";

interface UnderlinedLinkProps {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
  isExternal?: boolean;
  exitDuration?: number;
  underline?: boolean;
  isVisible?: boolean;
  scroll?: boolean;
  toggleNav?: () => void;
  line?: boolean;
  linkClassName?: string;
  wrapperClassName?: string;
  disableMotion?: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const UnderlinedLink: React.FC<UnderlinedLinkProps> = ({
  href,
  children,
  onClick,
  isExternal = false,
  exitDuration = 800,
  underline = true,
  isVisible = false,
  scroll = false,
  toggleNav,
  line = true,
  linkClassName,
  wrapperClassName,
  disableMotion = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [isScrollNavigating, setIsScrollNavigating] = useState(false);
  const { theme } = useTheme();
  const path = usePathname();
  const baseCurrentPath = path.split("#")[0];
  const baseHref = href.split("#")[0];
  const currentHash = path.split("#")[1] || "";
  const targetHash = href.split("#")[1] || "";

  const router = useRouter();
  const { setIsExit } = useExitAnimation();
  const isActive = href === path;
  const { resetRecentsVisibility } = useVisibility();
  const { resetIntroVisibility } = useVisibility2();

  const scrollToSection = (hash: string) => {
    const targetId = hash.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: targetId === "contact" ? "end" : "start",
      });
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isExternal) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    if (scroll) {
      event.preventDefault();
      setIsScrollNavigating(true);

      if (toggleNav) toggleNav();
      if (targetHash) {
        scrollToSection(targetHash);
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
      setHovered(false);
      return;
    }

    if (baseCurrentPath !== baseHref) {
      event.preventDefault();
      setIsExit(true);
      await sleep(exitDuration);
      setIsExit(false);
      resetRecentsVisibility();
      resetIntroVisibility();
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      window.location.href = window.location.origin + base + href;

      setTimeout(() => {
        scrollToSection(targetHash);
      }, 1500);
    } else if (currentHash !== targetHash) {
      event.preventDefault();
      if (targetHash) {
        setIsScrollNavigating(true);
      }
      scrollToSection(targetHash);
      setHovered(false);
      onClick?.();
    } else {
      onClick?.();
    }

    setHovered(false);
  };

  useEffect(() => {
    if (path.includes("#") && baseCurrentPath === baseHref && targetHash) {
      scrollToSection(targetHash);
    }
  }, [path, targetHash, baseCurrentPath, baseHref]);

  useEffect(() => {
    if (!isScrollNavigating) return;

    if (isVisible) {
      setIsScrollNavigating(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsScrollNavigating(false);
    }, 1400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isScrollNavigating, isVisible]);

  const content = isExternal ? (
    <a href={href} onClick={handleClick} className={`relative inline-block ${linkClassName ?? ""}`}>
      {children}
    </a>
  ) : (
    <Link href={href} onClick={handleClick} className={linkClassName}>
      {children}
    </Link>
  );

  const sharedProps = {
    className: `relative inline-block ${wrapperClassName ?? ""}`,
    onMouseDown: () => setHovered(true),
    onTouchStart: () => setHovered(true),
    onTouchEnd: () => setHovered(false),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return underline ? (
    disableMotion ? (
      <div {...sharedProps}>
        {content}
        <div
          className={`
                border-t-[3px] transition-all duration-[350ms] ease-in-out
                ${theme === "dark" ? "border-accent-dark" : "border-accent-light"}
                ${(hovered && line) || isActive || isVisible || isScrollNavigating ? "w-full" : "w-0"}
            `}
        ></div>
      </div>
    ) : (
      <motion.div
        className={`relative inline-block ${wrapperClassName ?? ""}`}
        onMouseDown={() => setHovered(true)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setHovered(false)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {content}
        <div
          className={`
                border-t-[3px] transition-all duration-[350ms] ease-in-out
                ${theme === "dark" ? "border-accent-dark" : "border-accent-light"}
                ${(hovered && line) || isActive || isVisible || isScrollNavigating ? "w-full" : "w-0"}
            `}
        ></div>
      </motion.div>
    )
  ) : (
    content
  );
};
