import { useCallback, useState } from "react";

type CursorPosition = { x: number; y: number };

type ClampCursorArgs = {
  mouseX: number;
  mouseY: number;
  containerWidth: number;
  containerHeight: number;
  trackerWidth: number;
  trackerHeight: number;
};

type UseHoverTrackerOptions = {
  trackerWidth: number;
  trackerHeight: number;
  clampCursor?: (args: ClampCursorArgs) => CursorPosition;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const defaultClampCursor = ({
  mouseX,
  mouseY,
  containerWidth,
  containerHeight,
  trackerWidth,
  trackerHeight,
}: ClampCursorArgs): CursorPosition => {
  return {
    x: clamp(mouseX, trackerWidth / 2, containerWidth - trackerWidth / 2),
    y: clamp(mouseY, trackerHeight / 2, containerHeight - trackerHeight / 2),
  };
};

export const useHoverTracker = ({
  trackerWidth,
  trackerHeight,
  clampCursor = defaultClampCursor,
}: UseHoverTrackerOptions) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsHovered(true);
    setCursorPosition({ x: rect.width / 2, y: rect.height / 2 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setCursorPosition(
        clampCursor({
          mouseX,
          mouseY,
          containerWidth: rect.width,
          containerHeight: rect.height,
          trackerWidth,
          trackerHeight,
        })
      );
    },
    [clampCursor, trackerWidth, trackerHeight]
  );

  return {
    isHovered,
    cursorPosition,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  };
};
