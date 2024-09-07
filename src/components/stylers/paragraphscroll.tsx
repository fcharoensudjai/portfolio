import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface ScrollFadeInProps {
    children: React.ReactNode;
}

const ParagraphScroll: React.FC<ScrollFadeInProps> = ({ children }) => {
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

export default ParagraphScroll;
