import React from "react";
import { cva } from "class-variance-authority"

interface TitleProps {
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
}

const titleVariants = cva("font-sans dark:text-text-dark text-text-light", {
    variants: {
        size: {
            small: "text-xl",
            medium: "text-xl md:text-3xl xl:text-4xl",
            large: "text-3xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem]",
        },
    },
    defaultVariants: {
        size: "medium",
    },
});

export const Title = ({ children, size = "medium" }: TitleProps) => {
    return (
        <div className={titleVariants({ size })}>
            {children}
        </div>
    );
}