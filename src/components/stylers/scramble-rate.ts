/**
 * The pace text decodes at when a scramble isn't handed a pace of its own. ONE definition, shared by
 * the recents stage's caption and the React `Scramble` — the two had been hand-tuned to the same
 * rhythm and kept drifting into separate copies of the same magic pair.
 *
 * `perTick` above 1 is what makes it read smooth rather than stepped. A timer can't fire once per
 * glyph at this speed (browsers clamp `setInterval` to ~4ms) and every tick is a render, so the
 * React scrambler was dropping frames to keep up — which is why it never felt like the stage's
 * caption, whose DOM writer was already revealing in runs of five.
 *
 * 5 every 12ms is ~2.4ms a glyph: the gallery's intro (~370 glyphs) clears in about 0.9s, and the
 * stage's caption in about 0.8s.
 */
export const SCRAMBLE_RATE = {
  /** glyphs revealed on each timer tick */
  perTick: 5,
  /** ms between ticks */
  ms: 12,
};
