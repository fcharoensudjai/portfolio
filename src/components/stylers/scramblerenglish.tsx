import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrambleProps {
  children: string;
}

export const ScrambleEnglish: React.FC<ScrambleProps> = ({ children }) => {
  const letters = "abcdefghijklmnopqrstuvwxyz";

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
    threshold: 0.5,
  });

  function scrambleText(text: string, intervalCount: number) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const graphemes = [...segmenter.segment(text)].map(({ segment }) => segment);
    return graphemes
      .map((char, index) => {
        if (char === " ") return " ";
        return index < intervalCount ? char : letters[Math.floor(Math.random() * letters.length)];
      })
      .join("");
  }

  function handleScramble() {
    const textLength = children.length;
    setIntervalCount(0);

    const id = setInterval(() => {
      setIntervalCount((prevCount) => {
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
      {[...scrambled.split(" ")].map((word, wi) => (
        <React.Fragment key={wi}>
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              marginRight: wi < scrambled.split(" ").length - 1 ? "1.25ch" : undefined,
            }}
          >
            {[...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(word)].map(({ segment }, ci) => (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  width: "1ch",
                  textAlign: "center",
                }}
              >
                {segment}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </motion.span>
  );
};
