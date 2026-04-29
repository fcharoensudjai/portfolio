"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { imageData } from "@/components/card/imageData";
import { CarouselCard } from "@/components/card/carousel-card";
import { Title } from "@/components/title";

interface GalleryCarouselProps {
  scrollDirection?: "up" | "down" | null;
  isScrolling?: boolean;
  labelText?: string;
}

const RECENTS_FEATURED_NAMES = new Set(["raiden shogun", "raven"]);

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  scrollDirection,
  isScrolling,
  labelText = "from the gallery",
}) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [internalScrollDirection, setInternalScrollDirection] = useState<"up" | "down" | null>(null);
  const [internalIsScrolling, setInternalIsScrolling] = useState(false);
  const [setWidth, setSetWidth] = useState(0);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const speedMultiplierRef = useRef(1);
  const scrollBoostRef = useRef(1);
  const activeScrollDirection = scrollDirection ?? internalScrollDirection;
  const activeIsScrolling = isScrolling ?? internalIsScrolling;
  const directionRef = useRef<"up" | "down" | null>(activeScrollDirection);
  const isScrollingRef = useRef(activeIsScrolling);
  const previousScrollRef = useRef({ y: 0, t: 0 });
  const speedDecayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (scrollDirection !== undefined && isScrolling !== undefined) {
      return;
    }

    previousScrollRef.current = { y: window.scrollY, t: performance.now() };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const { y: prevY, t: prevT } = previousScrollRef.current;
      const deltaY = currentScrollY - prevY;
      const deltaT = Math.max(1, now - prevT);

      if (scrollDirection === undefined) {
        if (deltaY > 0) {
          setInternalScrollDirection("down");
        } else if (deltaY < 0) {
          setInternalScrollDirection("up");
        }
      }

      if (isScrolling === undefined) {
        const pxPerSecond = (Math.abs(deltaY) / deltaT) * 1000;
        const hasMeaningfulScroll = Math.abs(deltaY) > 8 && pxPerSecond > 260;
        if (hasMeaningfulScroll) {
          setInternalIsScrolling(true);
        }

        if (speedDecayTimeoutRef.current) {
          clearTimeout(speedDecayTimeoutRef.current);
        }

        speedDecayTimeoutRef.current = setTimeout(() => {
          setInternalIsScrolling(false);
        }, 120);
      }

      previousScrollRef.current = { y: currentScrollY, t: now };
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (speedDecayTimeoutRef.current) {
        clearTimeout(speedDecayTimeoutRef.current);
      }
    };
  }, [scrollDirection, isScrolling]);

  useEffect(() => {
    directionRef.current = activeScrollDirection;
  }, [activeScrollDirection]);

  useEffect(() => {
    isScrollingRef.current = activeIsScrolling;
  }, [activeIsScrolling]);

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
        <Title size="small">{labelText}</Title>
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
