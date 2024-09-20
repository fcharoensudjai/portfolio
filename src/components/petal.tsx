import React from "react";
import Image from "next/image";
import { useTheme} from "next-themes";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cva } from "class-variance-authority";

interface PetalProps {
    positioning: string;
    enterDelay?: number;
    size?: "small" | "medium";
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

export const Petal : React.FC<PetalProps> = ({ positioning, enterDelay = 0.75, size = "medium"}) => {

    const { theme } = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    return (
        <div className={`absolute ${petalVariants({ size })} ${positioning} ${theme === "dark" ? "bg-text-light" : "bg-main-light"}`}>
            <motion.div
                ref={ref}
                initial={{scale: 0}}
                animate={{ scale: inView ? 1 : 0}}
                transition={{delay: inView ? enterDelay : 0, duration: 3, ease: [0.4, 0, 0.5, 1]}}
                className={`w-[22.45px] origin-bottom-left ${petalVariants({ size })}`}
                style={{ transformOrigin: "10% 100%" }}
            >
                <Image
                    src={theme === "dark" ? "/icons/dark/petaldark.svg" : "/icons/light/petal.svg"}
                    alt={"petal"}
                    width={38.45}
                    height={49.29}
                    className={`w-full h-auto`}
                />
            </motion.div>
        </div>
    )
}