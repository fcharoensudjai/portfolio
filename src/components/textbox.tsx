import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";

interface TextboxProps {
  children: React.ReactNode;
  caret?: boolean;
  /** "body" is the full mono body size; "caption" steps down one size with tighter leading.
   *  The leading only reaches the text if the content is inline — a block child (e.g. a `<p>`)
   *  needs its own leading, because globals.css's `* { line-height: 1.75em }` matches it directly. */
  size?: "body" | "caption";
}

export const Textbox: React.FC<TextboxProps> = ({ children, caret = true, size = "body" }) => {
  return (
    <div className={size === "caption" ? "text-xs md:text-sm leading-[1.6]" : "md:text-sm xl:text-md text-xs"}>
      {children}
      {caret && (
        <span className="relative inline caret-wrapper">
          <BlinkingCaret />
        </span>
      )}
    </div>
  );
};
