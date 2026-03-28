import React from "react";
import { cva } from "class-variance-authority";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

interface TitleProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "about";
}

const titleVariants = cva("font-sans", {
  variants: {
    size: {
      small: "text-[clamp(1.125rem,2.5vw,1.875rem)]",
      medium: "text-[clamp(1.25rem,3.5vw,2.5rem)]",
      large: "text-[clamp(1.5rem,8vw,13vh)]",
      about: "text-[clamp(1.125rem,2.5vw,3rem)]",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const Title = ({ children, size = "medium" }: TitleProps) => {
  return <span className={`${titleVariants({ size })} ${poppins.className}`}>{children}</span>;
};
