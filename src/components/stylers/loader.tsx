"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const Loader: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // When the pathname changes, mount the loader
        setIsMounted(true);

        // Automatically unmount after a delay, matching the exit animation duration
        const timer = setTimeout(() => {
            setIsMounted(false);
        }, 1000); // Adjust delay to match the animation duration

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            {isMounted && (
                <motion.div
                    key={pathname}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                    className="fixed inset-0 bg-middle-colour z-50"
                >
                    <motion.div className="flex items-center justify-center h-full text-white">

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;
