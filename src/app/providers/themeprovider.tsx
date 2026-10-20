"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ProviderTheme({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hand the theme cross-fade back once the first themed frame is on screen: next-themes sets the class
  // in an effect that runs before this one, so the two rAFs below leave that snap opaque to the eye and
  // only real switches (see `theme-boot` in globals.css) animate.
  useEffect(() => {
    if (!mounted) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => document.documentElement.classList.remove("theme-boot"));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [mounted]);

  // avoid hydration mismatch by only rendering provider after the client has mounted
  if (!mounted) return <div className={`inset-0 bg-surface-mid`}> </div>;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
}
