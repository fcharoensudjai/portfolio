"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function HashScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname, searchParams]);
  return null;
}
