"use client";

import React from "react";
import { motion } from "framer-motion";
import { useExitAnimation } from "@/app/exitcontext";

interface ExitAnimationProps {
    isExit: boolean;
}

export const ExitAnimation: React.FC<ExitAnimationProps> = () => {
    const { isExit } = useExitAnimation();

    return (
        <motion.div
            initial={{ y: "-100%"}}
            animate={{ y: isExit ? 0 : "100%",}}
            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            className={`fixed inset-0 z-50 bg-middle-colour`}
        />
    );
};
