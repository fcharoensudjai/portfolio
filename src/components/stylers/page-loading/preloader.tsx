import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ScrambleEnglish } from "@/components/stylers/scramblerenglish";
import { Scramble } from "@/components/stylers/scramblerthai";

const texts = ["hello", "สวัสดี"];
const getRandomInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface PreloaderProps {
    duration?: number;
    texts?: string[];
    delay?: number;
}

export const Preloader: React.FC<PreloaderProps> = ( { duration = 700, texts = ["hello", "สวัสดี"], delay = 400} ) => {
    const [loading, setLoading] = useState(true);
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const updateText = () => {
            intervalId = setTimeout(() => {
                setTextIndex(prevIndex => (prevIndex + 1) % texts.length);
                updateText();
            }, getRandomInterval(50, 500));
        };

        updateText();

        return () => clearTimeout(intervalId);
    }, []);

    // first word in the array always gets the thai scramble, while every word after it will get the english scramble

    const getScrambler = (index: number) => {
        return index === 0 ? Scramble : ScrambleEnglish ;
    };

    const ScramblerComponent = getScrambler(textIndex);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className={`fixed inset-0 z-50 bg-middle-colour text-text-dark flex justify-center text-2xl md:text-3xl xl:text-4xl items-center`}
                    initial={{ y: 0 }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                >
                    <ScramblerComponent delay={delay}>{texts[textIndex]}</ScramblerComponent>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

