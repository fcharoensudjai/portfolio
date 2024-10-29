"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useExitAnimation } from "@/app/exitcontext";
import { motion } from "framer-motion";

export const ExitAnimation: React.FC = () => {
    const { isExit } = useExitAnimation();
    const [isAnimating, setIsAnimating] = useState(false);
    const currentPath = usePathname();
    const [previousPath, setPreviousPath] = useState<string | null>(null);

    useEffect(() => {
        if (isExit) {
            setIsAnimating(true);
        }
    }, [isExit]);

    useEffect(() => {
        if (previousPath && previousPath !== currentPath) {
            setIsAnimating(false);
        }

        setPreviousPath(currentPath);
    }, [currentPath, previousPath]);

    return (
        <>
            {isAnimating && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                    className="fixed inset-0 z-50 bg-middle-colour"

                />
            )}
        </>
    );
};
