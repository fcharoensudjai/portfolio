import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";
import { Scramble } from "@/components/stylers/scramblerthai";

interface TextboxProps {
    children: React.ReactNode;
}

export const Textbox: React.FC<TextboxProps> = ( { children } ) => {
  return (
      <div className={"md:text-sm xl:text-md text-xs"}>
          {children}
          <span className="relative inline caret-wrapper"> <BlinkingCaret/> </span>
      </div>

  )
}
