import React from "react";
import { cva } from "class-variance-authority";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

interface TitleProps {
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
}

const titleVariants = cva("font-sans", {
    variants: {
        size: {
            small: "text-lg md:text-2xl lg:text-3xl",
            medium: "text-xl md:text-3xl xl:text-4xl",
            large: "text-2xl sm:text-5xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem]",
        },
    },
    defaultVariants: {
        size: "medium",
    },
});

export const Title = ({ children, size = "medium" }: TitleProps) => {
    return (
        <div className={`${titleVariants({ size })} ${poppins.className}`}>
            {children}
        </div>
    );
};
