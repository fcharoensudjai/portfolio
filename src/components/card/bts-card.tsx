import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Scramble } from "@/components/stylers/scramblerthai";
import { useHoverTracker } from "@/components/card/shared/use-hover-tracker";

interface BtsCardProps {
  src: string;
  alt: string;
  href: string;
  isBtsExpanded: boolean;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

const BTS_TRACKER_WIDTH = 175;
const BTS_TRACKER_HEIGHT = 50;

export const BtsCard: React.FC<BtsCardProps> = ({ src, alt, href, isBtsExpanded, onContextMenu }) => {
  const { theme } = useTheme();

  const {
    isHovered,
    cursorPosition,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove: trackerMouseMove,
  } = useHoverTracker({
    trackerWidth: BTS_TRACKER_WIDTH,
    trackerHeight: BTS_TRACKER_HEIGHT,
    clampCursor: ({ mouseX, mouseY, containerWidth, containerHeight }) => ({
      x: Math.min(Math.max(mouseX, BTS_TRACKER_WIDTH / 2), containerWidth - BTS_TRACKER_WIDTH / 1.6),
      y: Math.min(Math.max(mouseY, BTS_TRACKER_HEIGHT / 2), containerHeight - BTS_TRACKER_HEIGHT),
    }),
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isBtsExpanded) return;
    trackerMouseMove(e);
  };
  const showOverlay = isBtsExpanded && isHovered;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="see timelapse"
      className="relative flex justify-center items-center overflow-hidden rounded-xl"
    >
      <div
        className="relative w-full md:w-auto flex justify-center items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ cursor: showOverlay ? "none" : "pointer" }}
      >
        <Image
          src={src}
          alt={alt}
          height={1000}
          width={1000}
          quality={100}
          onContextMenu={onContextMenu}
          style={{
            objectFit: "contain",
          }}
          className={`rounded-xl w-full max-h-[55dvh] md:w-auto h-auto`}
        />

        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className={`absolute inset-0 z-10 backdrop-blur-[2px] ${
                theme === "dark" ? "bg-middle-colour" : "bg-text-dark"
              } bg-opacity-60 rounded-xl`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
            >
              <motion.div
                className="absolute border-corner z-20 flex justify-center items-center"
                style={{
                  top: cursorPosition.y - BTS_TRACKER_HEIGHT / 2 + 10,
                  left: cursorPosition.x - BTS_TRACKER_WIDTH / 2 + 10,
                  width: BTS_TRACKER_WIDTH,
                  height: BTS_TRACKER_HEIGHT,
                }}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                exit={{ scale: 1.3 }}
                transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
                whileTap={{ scale: 0.9 }}
              >
                <Scramble interval={20} hover={true}>
                  {" see timelapse "}
                </Scramble>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </a>
  );
};
