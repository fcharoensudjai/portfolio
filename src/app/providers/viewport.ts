/**
 * The viewport height, latched.
 *
 * iOS collapses its toolbars as you scroll, and both `window.innerHeight` and `dvh` follow it
 * mid-gesture — about 13% on an iPhone. Anything that derives geometry from the viewport (scroll
 * progress, parallax travel) moves with it, so the numbers jump under the user's thumb the moment
 * the bar goes: the fold un-flips a row, the flower drops half a screen, and then both catch up.
 *
 * So read one height, once, and only take a new one when the change is too big to be a toolbar:
 * a width change, or a height change over 20%. A real resize (rotate, split view, a dragged
 * desktop window) always clears one of those; a toolbar collapsing never does.
 */

const TOOLBAR_MAX_DELTA = 0.2;

let height = 0;
let width = 0;
let listening = false;

const onResize = () => {
  const nextWidth = window.innerWidth;
  const nextHeight = window.innerHeight;
  if (nextWidth === width && Math.abs(nextHeight - height) < height * TOOLBAR_MAX_DELTA) return;
  height = nextHeight;
  width = nextWidth;
};

export const viewportHeight = () => {
  if (height) return height;
  if (typeof window === "undefined") return 0;

  height = window.innerHeight;
  width = window.innerWidth;
  if (!listening) {
    listening = true;
    window.addEventListener("resize", onResize);
  }

  return height;
};
