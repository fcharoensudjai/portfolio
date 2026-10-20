"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setActiveLenis } from "@/app/providers/lenisscroll";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });

    setActiveLenis(lenis);

    // a scroll-driven page must not resume a previous scroll position on load: coming back
    // to "/#home" from another page should land on the cover, not wherever we left off
    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      setActiveLenis(null);
      history.scrollRestoration = previousScrollRestoration;
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
