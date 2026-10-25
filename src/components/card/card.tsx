import Fader from "@/components/stylers/fader";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scramble } from "@/components/stylers/scramblerthai";
import { ImageFrame } from "@/components/card/shared/imageframe";
import { useFollowLabel } from "@/components/card/shared/follow-label";

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

  const [showOverlay, setShowOverlay] = useState(false);
  const { measureLabel, trackPointer } = useFollowLabel();

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl min-h-[18.75rem] xl:min-h-[25rem] 2xl:min-h-[31.25rem] flex justify-center items-center ${className}`}
      // the card, not the grid cell, owns the cursor: the petal trail fades out over the artwork,
      // the same handover the recents stage makes for its frame
      data-petals-off
      // hover only: a tap on the artwork must fall straight through to the viewer. touch synthesises
      // mouseenter without ever firing the leave, which used to leave this overlay latched on.
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        setShowOverlay(true);
        trackPointer(e);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setShowOverlay(false);
      }}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") trackPointer(e);
      }}
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
              style={{ cursor: "none" }}
            >
              <div className="absolute inset-0 backdrop-blur-[2px] bg-surface-mid bg-opacity-60">
                {/* No width/height, same as the recents stage's label: the box is sized by its own
                    text so it hugs whatever the string is, and the clamp reads that box once it has
                    mounted. */}
                <div ref={measureLabel} className="absolute left-0 top-0 z-20" style={{ willChange: "transform" }}>
                  <motion.div
                    className="border-corner flex items-center justify-center whitespace-nowrap px-2 py-2.5 font-mono"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Fader>
    </motion.div>
  );
};
