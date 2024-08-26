import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";

interface TextboxProps {
    children: React.ReactNode;
}

export const Textbox: React.FC<TextboxProps> = ( { children } ) => {
  return (
      <div className={"md:text-sm lg:text-md text-xs"}>
          {children}
          <span className="caret-wrapper"> <BlinkingCaret/> </span>
      </div>

  )
}
