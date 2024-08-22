import React from "react";
import { cva } from "class-variance-authority"

interface TitleProps {
    children: React.ReactNode;
    size?: "extraSmall" | "small" | "medium" | "large" | "extraLarge";
}

const titleVariants = cva("font-sans dark:text-text-dark text-text-light", {
    variants: {
        size: {
            extraSmall: "text-lg",
            small: "text-xl",
            medium: "text-3xl",
            large: "text-4xl",
            extraLarge: "text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem]",
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