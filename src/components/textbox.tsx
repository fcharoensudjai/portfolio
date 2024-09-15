import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";


interface TextboxProps {
    children: React.ReactNode;
    caret?: boolean;
}

export const Textbox: React.FC<TextboxProps> = ({ children, caret = true }) => {
    return (
        <div className={"md:text-sm xl:text-md text-xs"}>
            {children}
            {caret && (
                <span className="relative inline caret-wrapper">
              <BlinkingCaret />
            </span>
            )}
        </div>
    );
}