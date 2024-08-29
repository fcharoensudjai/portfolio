"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UnmounterProps {
    delay: number;
    children: React.ReactNode;
    visible: boolean;
}

export const Unmounter: React.FC<UnmounterProps> = ({ delay = 3000, children, visible }) => {
    const [show, setShow] = useState(visible);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (visible) {
            setShow(true);
        } else {
            timer = setTimeout(() => {
                setShow(false);
            }, delay);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [visible, delay]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
