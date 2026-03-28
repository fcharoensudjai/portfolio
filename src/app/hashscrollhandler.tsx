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
    const maxAttempts = 60; // ~3s if interval is 50ms
    const interval = 50;

    const scrollToHash = () => {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        console.log(`[HashScrollHandler] Found element for hash: ${hash} (attempt ${attempts})`);
        el.scrollIntoView({ behavior: "smooth" });
        return true;
      } else {
        console.log(`[HashScrollHandler] Element not found for hash: ${hash} (attempt ${attempts})`);
      }
      return false;
    };

    if (!scrollToHash()) {
      const timer = setInterval(() => {
        attempts++;
        if (scrollToHash() || attempts >= maxAttempts) {
          if (attempts >= maxAttempts) {
            console.warn(`[HashScrollHandler] Failed to find element for hash: ${hash} after ${maxAttempts} attempts.`);
          }
          clearInterval(timer);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [pathname, searchParams]);
  return null;
}
