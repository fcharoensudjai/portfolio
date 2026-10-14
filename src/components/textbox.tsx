import BlinkingCaret from "@/components/blinkingcaret/blinkingcaret";
import React from "react";

interface TextboxProps {
  children: React.ReactNode;
  caret?: boolean;
  /** KNOWN NAMING WART, worth a rename pass:
   *  - "caption" is really BODY — 1rem from md up. It is the unit the whole type ladder is built on
   *    (display is 4.4 x this), and it's what a piece caption uses in the recents stage.
   *  - "body" (the default) is a step ABOVE that — 1.25rem at xl. So the two names are inverted.
   *  - "label" is the genuine small tier: 0.8rem, the caption rung, for prompts and tags.
   *  The leading only reaches the text if the content is inline — a block child (e.g. a `<p>`) needs
   *  its own leading, because globals.css's `* { line-height: 1.75em }` matches it directly. */
  size?: "body" | "caption" | "label";
}

const textboxSizes = {
  body: "md:text-sm xl:text-md text-xs",
  caption: "text-xs md:text-sm leading-[1.6]",
  label: "text-xs leading-[1.6]",
};

export const Textbox: React.FC<TextboxProps> = ({ children, caret = true, size = "body" }) => {
  return (
    <div className={textboxSizes[size]}>
      {children}
      {caret && (
        <span className="relative inline caret-wrapper">
          <BlinkingCaret />
        </span>
      )}
    </div>
  );
};
