import React from "react";

/**
 * The character boxes every scramble renders its glyphs into. ONE definition, shared by the Thai and
 * English scramblers — the box styling used to be copy-pasted into both, which is how two dialects of
 * the same component end up with different typography.
 *
 * WHY THERE ARE BOXES AT ALL. The layout must not move while the scramble swaps glyphs, and Thai
 * isn't in Roboto Mono: a placeholder falls back to a proportional system face (measured 9.52px ก /
 * 11.44px ฬ / 13.31px ญ at 16px, against the mono's 9.602px slot). Unboxed, a sentence re-breaks
 * mid-scramble. `width: 1ch` freezes the slot, so boxed Latin and boxed Thai measure identically.
 *
 * WHY THESE THREE DECLARATIONS. Freezing the advance is all the box *needs* to do; the rest is what
 * makes it invisible to the type around it:
 *   - `lineHeight: inherit` — without it the boxes are matched by globals.css's
 *     `* { line-height: 1.75em }` *directly*, which beats the leading the paragraph asks for.
 *     `inherit` is an inline style, so it wins and the box becomes height-transparent.
 *   - `textAlign: left` — must be explicit, not merely "unset". In a mono face the 1ch cell IS the
 *     advance, so centring can only move a glyph off the position the font would have given it, and
 *     it moves each glyph by a different amount — that is what reads as uneven letterspacing once
 *     the scramble has settled. It has to be explicit because a `text-center` parent would otherwise
 *     re-centre it.
 *   - the word gap is a true `1ch`, i.e. exactly one space in a mono face, rather than the `1.25ch`
 *     fudge this used to carry (25% wide, which read as looser leading than the paragraph had).
 *
 * WHAT DOES AND DOESN'T MOVE. The per-glyph advance stays 1ch, so the line count can't drift while
 * the scramble animates. The word gap IS a genuine width change against the old value, so a word
 * sitting on a line boundary can pull up — a one-off reflow, not something that moves per frame.
 *
 * NOTE: `lineHeight: inherit` only reads the *nearest* ancestor's computed value. A block between the
 * styled parent and the Scramble (e.g. a plain `<div>` wrapper) is matched by the same global rule and
 * will hand down 1.75 — if a paragraph needs tighter leading, set it on that block too.
 */
export const SCRAMBLE_WORD_GAP = "1ch";

const wordStyle: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "nowrap",
  lineHeight: "inherit",
};

const charStyle: React.CSSProperties = {
  display: "inline-block",
  width: "1ch",
  lineHeight: "inherit",
  textAlign: "left",
};

/**
 * One word, rendered as fixed-width glyph cells. `gap` reserves the trailing space when this isn't
 * the last word on the line — the spaces themselves are lost when the text is split on " ".
 */
export const ScrambleWord = ({ glyphs, gap }: { glyphs: string[]; gap?: boolean }) => (
  <span style={{ ...wordStyle, marginRight: gap ? SCRAMBLE_WORD_GAP : undefined }}>
    {glyphs.map((glyph, i) => (
      <span key={i} style={charStyle}>
        {glyph}
      </span>
    ))}
  </span>
);
