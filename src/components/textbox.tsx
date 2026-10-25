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
        <>
          {/* U+2060 WORD JOINER, and it has to sit between the text and the caret. Atomic inlines
              (the scramble's per-word spans, and the caret wrapper) are treated as ideographic for
              line breaking, so a break is allowed between two of them even with no whitespace — when
              the last word happens to fill the measure, the caret alone wrapped onto the next line
              (iPad mini was the tell). A word joiner forbids the break on both sides, so the last
              word and the caret travel together and the caret always lands at the end of the sentence.
              Zero-width, so nothing moves. */}
          {"\u2060"}
          {/* `-mr-[1.2em]` cancels the caret's own advance (0.7em block + 0.5em lead-in) so it
              occupies no space in the line box. That's what stops it being pushed onto a line of its
              own when the text already fills the measure: the last word stays where it was and the
              caret simply hangs past the container's right edge (which is the one thing we'd rather
              overflow than have a stray caret on the left margin). */}
          <span className="relative inline caret-wrapper -mr-[1.2em]">
            <BlinkingCaret />
          </span>
        </>
      )}
    </div>
  );
};
