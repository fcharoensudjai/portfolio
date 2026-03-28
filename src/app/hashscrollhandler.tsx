"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function HashScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    let attempts = 0;
    const maxAttempts = 20; // ~1s if interval is 50ms
    const interval = 50;

    const scrollToHash = () => {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return true;
      }
      return false;
    };

    if (!scrollToHash()) {
      const timer = setInterval(() => {
        attempts++;
        if (scrollToHash() || attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [pathname, searchParams]);
  return null;
}
