import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ScrambleWord } from "@/components/stylers/scramble-boxes";
import { SCRAMBLE_RATE } from "@/components/stylers/scramble-rate";

interface ScrambleProps {
  children: string;
  delay?: number; // delay before starting the scramble effect
  hover?: boolean; // choose whether I want it to have an onHover effect
  // ms per glyph, for the slow glyph-by-glyph decode the short hover labels want. Omit it and the
  // text runs at SCRAMBLE_RATE — the same pace as the recents stage's caption
  interval?: number;
  // override the shared decode pace for one instance — same shape as SCRAMBLE_RATE. Only applies
  // when `interval` is omitted; a slower pace means fewer glyphs per tick or a longer tick, never
  // one glyph per tick (that's 1 render per glyph and the reason `interval` drops frames).
  rate?: { perTick: number; ms: number };
  paragraphs?: boolean;
  navigate?: boolean;
  preScrambled?: boolean; // holds the text scrambled while out of view, then unscrambles it in view
  once?: boolean; // scramble only the first time the text comes into view
  renderCustom?: (scrambledNodes: React.ReactNode[]) => React.ReactNode; // custom render callback
}

export const Scramble: React.FC<ScrambleProps> = ({
  children,
  delay = 500,
  hover = false,
  interval,
  rate,
  paragraphs = false,
  navigate = false,
  preScrambled = false,
  once = true,
  renderCustom,
}) => {
  // default delay is 500ms

  // omitting `interval` opts into the shared site pace: glyphs arrive in runs of SCRAMBLE_RATE.perTick
  // per tick. An explicit interval keeps the one-glyph-per-tick rhythm the hover labels are tuned to.
  // `rate` is the third option: the same run-based rhythm as the site pace, dialled to a paragraph
  // that wants longer to decode.
  const pace = rate ?? SCRAMBLE_RATE;
  const perTick = interval === undefined ? pace.perTick : 1;
  const tickMs = interval ?? pace.ms;

  const letters = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ";

  function fullyScrambled(text: string) {
    return text
      .split("")
      .map((char) =>
        char === " " || char === "\n" || char === "|" ? char : letters[Math.floor(Math.random() * letters.length)]
      )
      .join("");
  }

  const [scrambled, setScrambled] = useState<string>(() => (preScrambled ? fullyScrambled(children) : children));
  const [intervalCount, setIntervalCount] = useState<number>(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // the first pass keeps its `delay` so entrance choreography still staggers; later passes
  // unscramble the moment the text is back in view
  const hasPlayedRef = useRef(false);

  function stopScramble() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1, // small threshold to detect when in view
  });

  function scrambleText(text: string, intervalCount: number) {
    const chars = text.split("");
    const spaces = chars.map((char, index) => (char === " " ? index : -1)).filter((index) => index !== -1);
    const shuffledSpaces = shuffleArray([...spaces]);

    return chars
      .map((char, index) => {
        if (char === " " || char === "|") {
          return char;
        }
        return index < intervalCount ? char : letters[Math.floor(Math.random() * letters.length)];
      })
      .join("");
  }

  function handleScramble() {
    const textLength = children.length;
    stopScramble();
    setIntervalCount(0);

    intervalRef.current = setInterval(() => {
      setIntervalCount((prevCount) => {
        const newCount = prevCount + perTick;
        setScrambled(scrambleText(children, newCount));
        return newCount;
      });
    }, tickMs);

    timeoutRef.current = setTimeout(() => {
      stopScramble();
      setScrambled(children);
    }, textLength * 50);
  }

  useEffect(() => {
    if (inView && !navigate) {
      const delayTimer = setTimeout(
        () => {
          hasPlayedRef.current = true;
          handleScramble();
        },
        hasPlayedRef.current ? 0 : delay
      );

      return () => clearTimeout(delayTimer);
    }
  }, [inView, delay]);

  // while out of view, park the text back in its scrambled state so it decodes again on re-entry
  useEffect(() => {
    if (!preScrambled || inView) return;

    stopScramble();
    setIntervalCount(0);
    setScrambled(fullyScrambled(children));
  }, [inView, preScrambled, children]);

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
      stopScramble();
    };
  }, []);

  const rawParagraphs = scrambled.split("|||");

  const paragraphNodes = rawParagraphs.map((paraText, pIndex) => (
    <React.Fragment key={pIndex}>
      {paraText.split(" ").map((word, wi) => (
        <ScrambleWord key={wi} glyphs={word.split("")} gap={wi < paraText.split(" ").length - 1} />
      ))}
    </React.Fragment>
  ));

  if (renderCustom) {
    return (
      <span ref={ref} className="w-full" style={{ lineHeight: "inherit" }}>
        {renderCustom(paragraphNodes)}
      </span>
    );
  }

  return (
    <motion.span
      style={{ whiteSpace: paragraphs ? "pre-wrap" : "normal", lineHeight: "inherit" }}
      ref={ref}
      onHoverStart={() => {
        if (hover) {
          handleScramble();
        }
      }}
      onClick={() => {
        if (hover) {
          handleScramble();
        }
      }}
    >
      {scrambled.split(" ").map((word, wi) => (
        <React.Fragment key={wi}>
          <ScrambleWord glyphs={word.split("")} gap={wi < scrambled.split(" ").length - 1} />
        </React.Fragment>
      ))}
    </motion.span>
  );
};
