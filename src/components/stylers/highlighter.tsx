"use client";

import { useEffect } from "react";

// Written once, in tokens rather than theme-branched hexes: the selection follows the theme on its own
// (and fades with the rest of the page, since the tokens are what animate).
const Highlighter = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "selection-styles";
    style.innerHTML = `
                ::selection {
                    background: rgb(var(--c-surface-mid));
                    color: rgb(var(--c-ink));
                }
                ::-moz-selection {
                    background: rgb(var(--c-surface-mid));
                    color: rgb(var(--c-ink));
                }
            `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default Highlighter;
