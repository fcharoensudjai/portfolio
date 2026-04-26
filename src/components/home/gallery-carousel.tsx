"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { imageData } from "@/components/card/imageData";
import { CarouselCard } from "@/components/card/carousel-card";
import { Title } from "@/components/title";

interface GalleryCarouselProps {
  scrollDirection: "up" | "down" | null;
  isScrolling?: boolean;
}

const RECENTS_FEATURED_NAMES = new Set(["raiden shogun", "raven"]);

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ scrollDirection, isScrolling = false }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [setWidth, setSetWidth] = useState(0);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const speedMultiplierRef = useRef(1);
  const scrollBoostRef = useRef(1);
  const directionRef = useRef<"up" | "down" | null>(scrollDirection);
  const isScrollingRef = useRef(isScrolling);

  const carouselItems = useMemo(() => {
    return [...imageData]
      .filter((item) => !RECENTS_FEATURED_NAMES.has(item.name.trim().toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, []);

  useEffect(() => {
    const node = firstSetRef.current;
    if (!node) return;

    const updateWidth = () => {
      setSetWidth(node.getBoundingClientRect().width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [carouselItems.length]);

  useEffect(() => {
    directionRef.current = scrollDirection;
  }, [scrollDirection]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  useEffect(() => {
    if (!setWidth) return;

    let rafId: number;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const baseSpeed = 68;
      const targetMultiplier = isHovered ? 0.45 : 1;
      const targetScrollBoost = isScrollingRef.current ? 1.65 : 1;

      speedMultiplierRef.current += (targetMultiplier - speedMultiplierRef.current) * Math.min(1, dt * 7);
      scrollBoostRef.current += (targetScrollBoost - scrollBoostRef.current) * Math.min(1, dt * 4.5);

      const speed = baseSpeed * speedMultiplierRef.current * scrollBoostRef.current;
      const direction = directionRef.current === "up" ? 1 : -1;

      let nextX = x.get() + direction * speed * dt;

      if (nextX <= -setWidth) {
        nextX += setWidth;
      }

      if (nextX >= 0) {
        nextX -= setWidth;
      }

      x.set(nextX);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [x, isHovered, setWidth]);

  return (
    <div className="w-full space-y-3 md:space-y-6">
      <div>
        <Title size="small">from the gallery</Title>
      </div>

      <div
        className="relative overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          style={{ x }}
          className="flex gap-2 sm:gap-3 md:gap-4 xl:gap-5 w-max px-3 sm:px-4 md:px-8 lg:px-16 xl:px-20"
        >
          <div ref={firstSetRef} className="flex gap-2 sm:gap-3 md:gap-4 xl:gap-5">
            {carouselItems.map((item, index) => (
              <CarouselCard
                key={`set-a-${item.src}-${index}`}
                src={`${basePath}${item.src}`}
                alt={item.alt}
                title={item.name}
                href="/gallery"
                wide={Boolean(item.wide)}
              />
            ))}
          </div>

          <div className="flex gap-2 sm:gap-3 md:gap-4 xl:gap-5" aria-hidden="true">
            {carouselItems.map((item, index) => (
              <CarouselCard
                key={`set-b-${item.src}-${index}`}
                src={`${basePath}${item.src}`}
                alt={item.alt}
                title={item.name}
                href="/gallery"
                wide={Boolean(item.wide)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
