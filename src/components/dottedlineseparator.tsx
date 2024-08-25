import React from "react";
import { cva } from "class-variance-authority"

interface DottedLineSeparatorProps {
    children: React.ReactNode;
    align: "left" | "right";
}

const AlignmentVariants = cva("md:text-sm lg:text-md text-xs", {
    variants: {
        align: {
            left: "flex items-center space-x-2",
            right: "flex flex-row-reverse items-center space-x-reverse space-x-2",
        },
    },
    defaultVariants: {
        align: "left",
    },
});

export const DottedLineSeparator: React.FC<DottedLineSeparatorProps> = ({ children, align="left" }: DottedLineSeparatorProps ) => {
    return (
        <div className={`${AlignmentVariants({ align })} flex items-center space-x-2`}>
            <div>{children}</div>
            <div className="flex-grow">
                <div
                    style={{
                        height: '0.5em',
                        backgroundImage: 'linear-gradient(to right, currentColor 50%, transparent 50%)',
                        backgroundSize: '15px 2px',
                        backgroundRepeat: 'repeat-x',
                        transform: 'translateY(0.225em)',
                    }}
                />
            </div>
        </div>
    );
};