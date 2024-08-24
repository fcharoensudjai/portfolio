import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";

interface TextboxProps {
    children: React.ReactNode; // Type for children
}

export const Textbox: React.FC<TextboxProps> = ( { children } ) => {
  return (
      <div className={"text-sm lg:text-md"}>
          {children}
          <span className="caret-wrapper"> <BlinkingCaret/> </span>
      </div>

  )
}
