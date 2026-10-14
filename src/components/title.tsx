import React from "react";
import { cva } from "class-variance-authority";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

interface TitleProps {
  children: React.ReactNode;
  /** Roles, not locations. Each ceiling comes from the type ladder in globals.css, so a size is
   *  changed in one place for the whole site. `large` and `medium` still carry their old names — they
   *  are on the rename list; `subhead`/`about`/`carousel` keep theirs because they're genuinely
   *  scoped (item titles, the about page, gallery cards). */
  size?: "small" | "medium" | "display" | "large" | "about" | "carousel";
}

const titleVariants = cva("font-sans", {
  variants: {
    size: {
      small: "text-[clamp(1.125rem,2.5vw,var(--type-subhead))]",
      medium: "text-[clamp(1.25rem,3.5vw,var(--type-title))]",
      // the editorial size: piece titles AND section headings, so a heading reads 4.4x the body
      // beneath it wherever it appears. Also what the profile manifesto headline uses.
      display: "text-[clamp(2rem,5vw,var(--type-display))] leading-none tracking-[-0.02em]",
      // two ceilings: never taller than the viewport allows (so it can't overflow a short window)
      // and never past its rem ceiling (so it stops when the frame it sits in does)
      large: "text-[clamp(1.5rem,8vw,var(--type-name))]",
      about: "text-lg md:text-2xl lg:text-3xl 2xl:text-5xl",
      carousel: "text-xs sm:text-sm lg:text-md",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const Title = ({ children, size = "medium" }: TitleProps) => {
  return <span className={`${titleVariants({ size })} ${poppins.className}`}>{children}</span>;
};
