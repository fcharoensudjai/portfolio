import { useState } from "react";

interface ClampOptions {
  mouseX: number;
  mouseY: number;
  containerWidth: number;
  containerHeight: number;
  trackerWidth: number;
  trackerHeight: number;
}

interface UseHoverTrackerOptions {
  trackerWidth: number;
  trackerHeight: number;
  clampCursor: (options: ClampOptions) => { x: number; y: number };
}

/**
 * Hover is a mouse idea, and touch does not honour it. A tap synthesises the same enter/move events a
 * cursor does, but nothing ever synthesises the matching leave — so a hover overlay opened by a tap
 * stayed open for good. Every handler here ignores anything that isn't a real cursor.
 */
const isMouse = (e: React.PointerEvent<HTMLElement>) => e.pointerType === "mouse";

export const useHoverTracker = ({ trackerWidth, trackerHeight, clampCursor }: UseHoverTrackerOptions) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (isMouse(e)) setIsHovered(true);
  };
  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (isMouse(e)) setIsHovered(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isMouse(e)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clampedPosition = clampCursor({
      mouseX,
      mouseY,
      containerWidth: rect.width,
      containerHeight: rect.height,
      trackerWidth,
      trackerHeight,
    });

    setCursorPosition(clampedPosition);
  };

  return {
    isHovered,
    cursorPosition,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerMove,
  };
};
