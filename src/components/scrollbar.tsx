import { motion, useScroll, useSpring } from 'framer-motion';

export const Scrollbar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 50,
        restDelta: 0.001
    });

    return (
        <div className='fixed top-0 left-0 w-full h-2 z-50'>
            <motion.div
                style={{
                    scaleX,
                    backgroundColor: "white",
                    mixBlendMode: "difference",
                }}
                className=""
            />
        </div>
    );
};
