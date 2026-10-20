import { motion } from "framer-motion";
import React from "react";
import { UnderlinedLink } from "@/components/underlinedlink";

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  isExternal?: boolean;
  size?: "sm" | "md";
}

// The pill's colours are the tokens, not a per-theme hex trio, so it fades with the page on a theme
// flip (see the token block in globals.css) instead of snapping halfway through it. Hover and press
// pair the same three tokens the other way round — ink ground, surface type — and the rose press
// tint is the accent token. Framer keeps the scale; the colours are CSS so they can sit on the same
// transition as the fade.
export const Button = ({ children, href, isExternal = false, size = "md" }: ButtonProps) => {
  return (
    <motion.div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.0 }}
        className={`rounded-full border-[2px] border-ink bg-surface text-ink transition-colors duration-300 ease-out hover:bg-ink hover:text-surface active:text-rose ${
          size === "sm"
            ? "px-4 py-[0.5rem] text-xs md:text-sm"
            : "py-1 md:py-[0.5rem] px-3 lg:px-5 lg:py-2.5 md:text-sm lg:text-md text-xs"
        }`}
      >
        <UnderlinedLink underline={false} href={href} isExternal={isExternal}>
          {children}
        </UnderlinedLink>
      </motion.button>
    </motion.div>
  );
};
