import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface FaderProps {
    enterDelay?: number;
    once?: boolean;
    children: React.ReactNode;
    threshold?: number;
}

const Fader: React.FC<FaderProps> = ({ enterDelay = 0, once = false, children, threshold = 0.5 }) => {
    const { ref, inView } = useInView({
        triggerOnce: once,
        threshold: threshold,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: inView ? enterDelay : 0, duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

export default Fader;
