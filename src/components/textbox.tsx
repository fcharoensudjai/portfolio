import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";

export const Textbox = ( { children } ) => {
  return (
      <div>
          {children}
          <span className="caret-wrapper"> <BlinkingCaret/> </span>
      </div>

  )
}
