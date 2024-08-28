import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


interface ScrambleProps {
    children: string;
}

export const Scramble: React.FC<ScrambleProps> = ({ children }) => {

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
        threshold: 0.5
    });

    function scrambleText(text: string, intervalCount: number) {
        const chars = text.split("");
        const spaces = chars.map((char, index) => (char === ' ' ? index : -1)).filter(index => index !== -1);
        const shuffledSpaces = shuffleArray([...spaces]);

        return chars.map((char, index) => { //if space, leave it alone
            if (char === ' ') {
                return shuffledSpaces.includes(index) ? ' ' : ' ';
            }
            return index < intervalCount ? char : letters[Math.floor(Math.random() * letters.length)];
        }).join(""); // if not a space, shuffle randomly, and choose letters from "letters" constant
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
        }, 25);

        setIntervalId(id);

        setTimeout(() => {
            if (id) {
                clearInterval(id);
                setScrambled(children);
            }
        }, textLength * 50);
    }

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    useEffect(() => {
        if (inView) {
            handleScramble();
        }
    }, [inView]);

    return (
        <motion.span onHoverStart={handleScramble} onClick={handleScramble} ref={ref}>
            {scrambled}
        </motion.span>
    );
};
