"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useExitAnimation } from "@/app/exitcontext";

export const ExitAnimation: React.FC = () => {
    const { isExit } = useExitAnimation();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isExit) {
            setIsAnimating(true);
        }
    }, [isExit]);

    const handleAnimationComplete = () => {
        setTimeout(() => {
            setIsAnimating(false);
        }, 850);
    };

    return (
        <>
            {isAnimating && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                    className="fixed inset-0 z-50 bg-middle-colour"
                    onAnimationComplete={handleAnimationComplete}
                />
            )}
        </>
    );
};
