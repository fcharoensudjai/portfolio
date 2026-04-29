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

export const useHoverTracker = ({ trackerWidth, trackerHeight, clampCursor }: UseHoverTrackerOptions) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  };
};
