"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { Title } from "@/components/title";
import Fader from "@/components/stylers/fader";
import { UnderlinedLink } from "@/components/underlinedlink";
import { aboutSequenceItems } from "./about-data";
import { AboutPanel } from "./panel";

interface AboutSequenceProps {
  theme?: string;
}

export const AboutSequence: React.FC<AboutSequenceProps> = ({ theme }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const bgClass = theme === "dark" ? "bg-text-light" : "bg-main-light";

  const [activeIndex, setActiveIndex] = useState(0);

  // flower rotating speed logic
  const rotateValue = useMotionValue(0);
  const [isIntroFlowerHovered, setIsIntroFlowerHovered] = useState(false);
  const flowerDirectionRef = useRef<"up" | "down" | null>(null);
  const flowerScrollingRef = useRef(false);
  const flowerHoverRef = useRef(false);
  const flowerSpeedMultiplierRef = useRef(1);
  const flowerScrollBoostRef = useRef(1);
  const previousScrollRef = useRef({ y: 0, t: 0 });
  const speedDecayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    previousScrollRef.current = { y: window.scrollY, t: performance.now() };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const { y: prevY, t: prevT } = previousScrollRef.current;
      const deltaY = currentScrollY - prevY;
      const deltaT = Math.max(1, now - prevT);

      if (deltaY > 0) {
        flowerDirectionRef.current = "down";
      } else if (deltaY < 0) {
        flowerDirectionRef.current = "up";
      }

      const pxPerSecond = (Math.abs(deltaY) / deltaT) * 1000;
      const hasMeaningfulScroll = Math.abs(deltaY) > 8 && pxPerSecond > 260;
      if (hasMeaningfulScroll) {
        flowerScrollingRef.current = true;
      }

      previousScrollRef.current = { y: currentScrollY, t: now };

      if (speedDecayTimeoutRef.current) {
        clearTimeout(speedDecayTimeoutRef.current);
      }

      speedDecayTimeoutRef.current = setTimeout(() => {
        flowerScrollingRef.current = false;
      }, 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (speedDecayTimeoutRef.current) {
        clearTimeout(speedDecayTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    flowerHoverRef.current = isIntroFlowerHovered;
  }, [isIntroFlowerHovered]);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Only spin base speed constantly, or respond to direction
      const baseSpeed = 35;
      const targetHoverMultiplier = flowerHoverRef.current ? 0.45 : 1;
      const targetScrollBoost = flowerScrollingRef.current ? 1.65 : 1;

      flowerSpeedMultiplierRef.current +=
        (targetHoverMultiplier - flowerSpeedMultiplierRef.current) * Math.min(1, dt * 7);
      flowerScrollBoostRef.current += (targetScrollBoost - flowerScrollBoostRef.current) * Math.min(1, dt * 4.5);

      const speed = baseSpeed * flowerSpeedMultiplierRef.current * flowerScrollBoostRef.current;
      const direction = flowerDirectionRef.current === "up" ? -1 : 1;

      let nextRotation = rotateValue.get() + direction * speed * dt;

      if (nextRotation >= 360) {
        nextRotation -= 360;
      }
      if (nextRotation <= -360) {
        nextRotation += 360;
      }

      rotateValue.set(nextRotation);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [rotateValue]);

  return (
    <section className={`relative w-full ${bgClass} z-10 px-0 mb-32`} aria-label="Who am I sequence">
      <div className="flex flex-col xl:flex-row w-full justify-between">
        {/* LEFT SIDE: Sticky Legend */}
        <div className="hidden xl:flex flex-col justify-center pr-9 xl:pr-12 min-w-[280px] sticky top-0 h-[100vh] py-[15vh]">
          <div className="w-full mb-12 absolute top-[15vh] left-0">
            <Fader once={true} threshold={0.1}>
              <div className="fixed-line-spacing">
                <Title> who am i? </Title>
              </div>
            </Fader>
          </div>

          <div className="flex flex-col gap-5 w-full mt-auto mb-auto">
            {aboutSequenceItems.map((item, index) => {
              const isActive = activeIndex === index;
              const activeColorClass = theme === "dark" ? "text-text-dark" : "text-black";
              const inactiveClass = theme === "dark" ? "text-text-dark/50" : "text-black/50";
              return (
                <div key={item.id} className="flex items-center gap-3 relative group whitespace-nowrap">
                  <div className="w-[32px] flex justify-center items-center h-[32px]">
                    {isActive && (
                      <motion.div
                        layoutId="flower-indicator"
                        style={{ rotate: rotateValue }}
                        onHoverStart={() => setIsIntroFlowerHovered(true)}
                        onHoverEnd={() => setIsIntroFlowerHovered(false)}
                        className="w-[32px] h-[32px] text-current"
                      >
                        <Image
                          src={
                            theme === "dark"
                              ? `${basePath}/icons/dark/logodark.svg`
                              : `${basePath}/icons/light/logo.svg`
                          }
                          alt="Active Indicator"
                          width={48}
                          height={48}
                          className="w-full h-auto object-contain text-inherit"
                        />
                      </motion.div>
                    )}
                  </div>
                  <div
                    className={`lowercase transition-colors duration-300 ${isActive ? activeColorClass : `${inactiveClass} group-hover:${activeColorClass}`}`}
                  >
                    <UnderlinedLink
                      href={`#about-card-${index}`}
                      scroll={true}
                      underline={true}
                      isVisible={isActive}
                      disableMotion
                    >
                      <Title size="small">{item.title}</Title>
                    </UnderlinedLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Scrolling Cards */}
        <div className="w-full xl:flex-1 flex flex-col justify-end pt-4 xl:pt-0 pl-5 2xl:pl-16">
          {/* Mobile Title (shown only below xl) */}
          <div className="xl:hidden w-full mb-12">
            <Fader once={true} threshold={0.1}>
              <div className="fixed-line-spacing">
                <Title> who am i? </Title>
              </div>
            </Fader>
          </div>

          {aboutSequenceItems.map((item, index) => (
            <AboutPanel
              key={item.id}
              item={item}
              index={index}
              setActiveIndex={setActiveIndex}
              basePath={basePath}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
