import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import React from "react";

export const Scrollbar = () => {
    const { scrollYProgress } = useScroll();
    const reverseScrollYProgress = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const scaleX = useSpring(reverseScrollYProgress, {
        stiffness: 100,
        damping: 50,
        restDelta: 0.001
    });

    return (
        <header className="fixed top-0 left-0 right-0 h-[3px] lg:h-[4px] z-50 bg-white mix-blend-difference">
            <motion.div
                style={{
                    scaleX,
                    backgroundColor: "white",
                }}
                className="h-full origin-right mix-blend-difference"
            />
        </header>
    );
};
