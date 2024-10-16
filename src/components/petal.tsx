import React, {useEffect, useState} from "react";
import Image from "next/image";
import { useTheme} from "next-themes";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cva } from "class-variance-authority";

interface PetalProps {
    positioning: string;
    enterDelay?: number;
    size?: "small" | "medium";
    autoWiggle?: number;
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

export const Petal : React.FC<PetalProps> = ({ positioning, enterDelay = 0.75, size = "medium", autoWiggle = 3000}) => {

    const { theme } = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    const [isWiggling, setIsWiggling] = useState(false);
    const [isFlying, setIsFlying] = useState(false);


    const { ref: parentRef, inView: parentInView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    const [key, setKey] = useState("0");

    useEffect(() => {
        if (!parentInView) {
            setKey(key +1)
            setIsWiggling(false);
            setIsFlying(false);
        }
    }, [parentInView]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inView && !isFlying) {
                setIsWiggling(true);

                setTimeout(() => {
                    setIsFlying(true);
                    setIsWiggling(false);
                }, 3000);
            }
        }, autoWiggle);

        return () => clearTimeout(timer);
    }, [isFlying, autoWiggle, inView]);


    return (
        <div ref={parentRef} className={`absolute ${petalVariants({ size })} ${positioning} ${isFlying ? "bg-transparent" : (theme === "dark" ? "bg-text-light" : "bg-main-light")}`}>
            <motion.div
                ref={ref}
                key={key}
                initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                    scale: inView ? 1 : 0,
                    x: isFlying ? 900 : 0,
                    y: isFlying ? -1700 : 0,
                    rotate: isFlying ? [0, 75, 200, 500, -500, -300] : isWiggling ? [0, -5, 5, -5, 5, -2.5] : 0,
            }}
                transition={{
                    delay: inView ? enterDelay : 0,
                    duration: isWiggling ? 1.5 : 3,
                    ease: isWiggling ? "easeInOut" : [0.4, 0, 0.5, 1],
                    repeat: isWiggling ? 2 : 0,
                    times: isWiggling || isFlying ? [0, 0.2, 0.4, 0.6, 0.8, 1] : parentInView ? undefined : [0,0,0,0],
            }}
                className={`rounded-md origin-bottom-left ${petalVariants({ size })}`}
                style={{ transformOrigin: "10% 100%" }}
            >
                <Image
                    src={theme === "dark" ? "/portfolio/icons/dark/petaldark.svg" : "/portfolio/icons/light/petal.svg"}
                    alt={"petal"}
                    width={38.45}
                    height={49.29}
                    className={`w-full h-auto`}
                />
            </motion.div>
        </div>
    )
}