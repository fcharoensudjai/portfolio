import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cva } from "class-variance-authority";

interface PetalProps {
  positioning: string;
  enterDelay?: number;
  size?: "small" | "medium";
  autoWiggle?: number;
}

const petalVariants = cva("h-auto", {
  variants: {
    size: {
      small: "w-[12.38px] md:w-[22.5px] lg:w-[35px] 2xl:w-[50px]",
      medium: " w-[22.5px] sm:w-[33px] lg:w-[39px] 2xl:w-[60px]",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const Petal: React.FC<PetalProps> = ({ positioning, enterDelay = 0.75, size = "medium", autoWiggle = 3000 }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { theme } = useTheme();

  const [isWiggling, setIsWiggling] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  // The element that gets observed is the WRAPPER, and `inView` is read from it — not from the
  // glyph. The glyph is scaled to 0 while out of view, and an element with a zero-area box can
  // never report a visible ratio, so observing the glyph meant it could never come back into view:
  // the scale animation was pinned at 0 and the petal never appeared at all. The wrapper always
  // has a box, so it observes correctly.
  const { ref: parentRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [key, setKey] = useState("0");

  useEffect(() => {
    if (!inView) {
      setKey((k) => k + 1);
      setIsWiggling(false);
      setIsFlying(false);
    }
  }, [inView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inView && !isFlying) {
        setIsWiggling(true);

        setTimeout(() => {
          setIsFlying(true);
          setIsWiggling(false);
        }, 3000);
      }
    }, autoWiggle);

    return () => clearTimeout(timer);
  }, [isFlying, autoWiggle, inView]);

  return (
    <div
      ref={parentRef}
      className={`absolute ${petalVariants({ size })} ${positioning} ${isFlying ? "bg-transparent" : "bg-surface"}`}
    >
      <motion.div
        key={key}
        initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
        animate={{
          scale: inView ? 1 : 0,
          x: isFlying ? 900 : 0,
          y: isFlying ? -1700 : 0,
          rotate: isFlying ? [0, 75, 200, 500, -500, -300] : isWiggling ? [0, -5, 5, -5, 5, -2.5] : 0,
        }}
        transition={{
          delay: inView ? enterDelay : 0,
          duration: isWiggling ? 1.5 : 3,
          ease: isWiggling ? "easeInOut" : [0.4, 0, 0.5, 1],
          repeat: isWiggling ? 2 : 0,
          times: isWiggling || isFlying ? [0, 0.2, 0.4, 0.6, 0.8, 1] : undefined,
        }}
        className={`rounded-md origin-bottom-left ${petalVariants({ size })}`}
        style={{ transformOrigin: "10% 100%" }}
      >
        <Image
          src={theme === "dark" ? `${basePath}/icons/dark/petaldark.svg` : `${basePath}/icons/light/petal.svg`}
          alt={"petal"}
          width={38.45}
          height={49.29}
          className={`w-full h-auto`}
        />
      </motion.div>
    </div>
  );
};
