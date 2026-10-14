import React from "react";
import { cva } from "class-variance-authority";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

interface TitleProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "stage" | "large" | "about" | "carousel";
}

const titleVariants = cva("font-sans", {
  variants: {
    size: {
      small: "text-[clamp(1.125rem,2.5vw,1.875rem)]",
      medium: "text-[clamp(1.25rem,3.5vw,2.5rem)]",
      // the display size — kept in sync with the profile manifesto headline in profile-sequence.tsx
      // ("from bangkok to london"): clamp(2rem, 5vw, 4.4rem)
      stage: "text-[clamp(2rem,5vw,4.4rem)] leading-none tracking-[-0.02em]",
      // fluid with two ceilings: never taller than 13vh (so it can't overflow a short window), and
      // never past 8rem — which is this clamp's value at a 1600px viewport, i.e. exactly where
      // .content-cap stops the frame. Without the second ceiling the type keeps growing on a wide
      // window while the column it sits in doesn't.
      large: "text-[clamp(1.5rem,8vw,min(13vh,8rem))]",
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
