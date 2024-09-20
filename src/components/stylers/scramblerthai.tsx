import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrambleProps {
    children: string;
    delay?: number; // delay before starting the scramble effect
    hover?: boolean; // choose whether I want it to have an onHover effect
    interval?: number; // how quickly stuff scrambles
    paragraphs?: boolean;
    navigate?: boolean;

}

export const Scramble: React.FC<ScrambleProps> = ({ children, delay = 500, hover = false, interval = 2, paragraphs=false, navigate = false }) => { // default delay is 500ms

    const letters = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ";

    const [scrambled, setScrambled] = useState<string>(children);
    const [intervalCount, setIntervalCount] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1, // small threshold to detect when in view
    });

    function scrambleText(text: string, intervalCount: number) {
        const chars = text.split("");
        const spaces = chars.map((char, index) => (char === ' ' ? index : -1)).filter(index => index !== -1);
        const shuffledSpaces = shuffleArray([...spaces]);

        return chars.map((char, index) => {
            if (char === ' ') {
                return shuffledSpaces.includes(index) ? ' ' : ' ';
            }
            return index < intervalCount ? char : letters[Math.floor(Math.random() * letters.length)];
        }).join("");
    }

    function handleScramble() {
        const textLength = children.length;
        setIntervalCount(0);

        const id = setInterval(() => {
            setIntervalCount(prevCount => {
                const newCount = prevCount + 1;
                setScrambled(scrambleText(children, newCount));
                return newCount;
            });
        }, interval);

        setIntervalId(id);

        setTimeout(() => {
            if (id) {
                clearInterval(id);
                setScrambled(children);
            }
        }, textLength * 50);
    }

    useEffect(() => {
        if (inView && !navigate) {
            const delayTimer = setTimeout(() => {
                handleScramble();
            }, delay);

            return () => clearTimeout(delayTimer);
        }
    }, [inView, delay]);

    useEffect(() => {
        if (navigate) {
            const delayTimer = setTimeout(() => {
                handleScramble();
            }, 200);

            return () => clearTimeout(delayTimer);
        }
    }, [children, navigate]);

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    return (
        <motion.span
            style={{ whiteSpace: paragraphs ? 'pre-wrap' : 'normal' }}
            ref={ref}
            onHoverStart={() => { if (hover) { handleScramble() } } }
            onClick={() => { if (hover) { handleScramble() } } }
        >
            {scrambled}
        </motion.span>
    );
};
