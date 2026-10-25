import type Lenis from "lenis";

let activeLenis: Lenis | null = null;

export const setActiveLenis = (lenis: Lenis | null) => {
  activeLenis = lenis;
};

// programmatic scrolling has to go through lenis: its raf loop keeps writing its own
// target to the document, so a native smooth scroll gets snapped back mid-flight
export const scrollToTop = () => {
  if (activeLenis) {
    activeLenis.scrollTo(0);
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};
