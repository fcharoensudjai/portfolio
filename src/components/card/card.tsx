import Fader from "@/components/stylers/fader";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Scramble } from "@/components/stylers/scramblerthai";
import { ImageFrame } from "@/components/card/shared/imageframe";
import { useHoverTracker } from "@/components/card/shared/use-hover-tracker";

interface CardProps {
  src: string;
  alt: string;
  name?: string;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ src, alt, className, onClick }) => {
  const handleContextMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
  };

  const { theme } = useTheme();

  const textBoxWidth = 175;
  const textBoxHeight = 50;

  const {
    isHovered: showOverlay,
    cursorPosition: mousePosition,
    handleMouseEnter: toggleOverlayEnter,
    handleMouseLeave: toggleOverlayLeave,
    handleMouseMove,
  } = useHoverTracker({
    trackerWidth: textBoxWidth,
    trackerHeight: textBoxHeight,
    clampCursor: ({ mouseX, mouseY, containerWidth, containerHeight }) => ({
      x: Math.min(Math.max(mouseX, textBoxWidth / 2), containerWidth - textBoxWidth / 1.6),
      y: Math.min(Math.max(mouseY, textBoxHeight / 2), containerHeight - textBoxHeight),
    }),
  });

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl min-h-[300px] xl:min-h-[400px] 2xl:min-h-[500px] flex justify-center items-center ${className}`}
      onHoverStart={toggleOverlayEnter}
      onHoverEnd={toggleOverlayLeave}
      onMouseMove={(e: any) => handleMouseMove(e as React.MouseEvent<HTMLElement>)}
      onClick={onClick}
    >
      <Fader once={true} threshold={0.4}>
        <ImageFrame src={src} alt={alt} onContextMenu={handleContextMenu} pulsePlaceholder={true} />

        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className="inset-0 z-10 absolute flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
              style={{ cursor: showOverlay ? "none" : "default" }}
            >
              <div
                className={`absolute inset-0 backdrop-blur-[2px] ${theme === "dark" ? "bg-middle-colour" : "bg-text-dark"} bg-opacity-60`}
              >
                <motion.div
                  className="absolute border-corner z-20 flex justify-center items-center"
                  style={{
                    top: mousePosition.y - textBoxHeight / 2 + 10,
                    left: mousePosition.x - textBoxWidth / 2 + 10,
                    width: textBoxWidth,
                    height: textBoxHeight,
                  }}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 1.3 }}
                  transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Scramble interval={20} hover={true}>
                    {" see full image "}
                  </Scramble>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Fader>
    </motion.div>
  );
};
