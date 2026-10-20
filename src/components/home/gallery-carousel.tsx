"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { imageData } from "@/components/card/imageData";
import { CarouselCard } from "@/components/card/carousel-card";
import { Title } from "@/components/title";
import { Textbox } from "@/components/textbox";
import { Scramble } from "@/components/stylers/scramblerthai";

interface GalleryCarouselProps {
  scrollDirection?: "up" | "down" | null;
  isScrolling?: boolean;
  labelText?: string;
  /** Caption under the heading — same body/caption step the recents section uses. Pass "" to drop it. */
  captionText?: string;
}

const RECENTS_FEATURED_NAMES = new Set(["raiden shogun", "raven"]);

const BASE_SPEED = 68; // px/s at rest
// the scroll boost is proportional to how fast the page is moving, not just "moving or not"
const SCROLL_BOOST_MAX = 3.4;
const SCROLL_BOOST_RAMP = 2600; // px/s of page scroll that reaches the ceiling
const SCROLL_VELOCITY_DECAY = 0.22; // seconds — how quickly the boost drains once scrolling stops
const DRAG_FLICK_DECAY = 0.35; // seconds of momentum left over from a throw
const DRAG_FLICK_MAX = 6000; // px/s
const DRAG_THRESHOLD = 6; // px of travel before a press counts as a drag rather than a click

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  scrollDirection,
  isScrolling,
  labelText = "from the gallery",
  captionText = "A running selection of older pieces. Click any one to open the gallery, or drag the row to move through them.",
}) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [internalScrollDirection, setInternalScrollDirection] = useState<"up" | "down" | null>(null);
  const [setWidth, setSetWidth] = useState(0);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const secondSetRef = useRef<HTMLDivElement | null>(null);
  const speedMultiplierRef = useRef(1);
  const scrollBoostRef = useRef(1);
  const scrollVelocityRef = useRef(0);
  const activeScrollDirection = scrollDirection ?? internalScrollDirection;
  const directionRef = useRef<"up" | "down" | null>(activeScrollDirection);
  const isScrollingRef = useRef(Boolean(isScrolling));
  const previousScrollRef = useRef({ y: 0, t: 0 });
  const flickVelocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({ pointerId: -1, startX: 0, lastX: 0, lastT: 0, velocity: 0 });

  const carouselItems = useMemo(() => {
    return [...imageData]
      .filter((item) => !RECENTS_FEATURED_NAMES.has(item.name.trim().toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, []);

  useEffect(() => {
    const first = firstSetRef.current;
    const second = secondSetRef.current;
    if (!first || !second) return;

    const updateWidth = () => {
      // the loop period is the distance between the two sets, so it carries the gap that sits
      // between them — measuring one set alone would make the track jump by that gap every lap.
      setSetWidth(second.getBoundingClientRect().left - first.getBoundingClientRect().left);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(first);
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

      // velocity, not a flag: the faster the page moves, the further the row accelerates. tiny
      // moves are ignored so jitter and rubber-banding don't nudge it.
      const pxPerSecond = Math.abs(deltaY) > 2 ? (Math.abs(deltaY) / deltaT) * 1000 : 0;
      scrollVelocityRef.current =
        scrollVelocityRef.current * 0.65 + Math.min(pxPerSecond, SCROLL_BOOST_RAMP * 2) * 0.35;

      previousScrollRef.current = { y: currentScrollY, t: now };
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollDirection, isScrolling]);

  useEffect(() => {
    directionRef.current = activeScrollDirection;
  }, [activeScrollDirection]);

  useEffect(() => {
    isScrollingRef.current = Boolean(isScrolling);
  }, [isScrolling]);

  useEffect(() => {
    if (!setWidth) return;

    let rafId: number;
    let lastTime = performance.now();

    const frame = (now: number) => {
      // capped so a backgrounded tab doesn't come back and teleport the row
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // the boost drains on its own, so the row settles back to its resting drift when the page
      // stops moving instead of snapping down as soon as the scroll events stop
      scrollVelocityRef.current *= Math.exp(-dt / SCROLL_VELOCITY_DECAY);

      const targetMultiplier = isHovered && !isDraggingRef.current ? 0.45 : 1;
      const targetScrollBoost =
        isScrolling !== undefined
          ? isScrollingRef.current
            ? 1.65
            : 1
          : 1 + Math.min(scrollVelocityRef.current / SCROLL_BOOST_RAMP, 1) * (SCROLL_BOOST_MAX - 1);

      speedMultiplierRef.current += (targetMultiplier - speedMultiplierRef.current) * Math.min(1, dt * 7);
      scrollBoostRef.current += (targetScrollBoost - scrollBoostRef.current) * Math.min(1, dt * 6);

      let nextX = x.get();

      // while dragging the pointer owns the position; the drift and the throw take over on release
      if (!isDraggingRef.current) {
        const speed = BASE_SPEED * speedMultiplierRef.current * scrollBoostRef.current;
        const direction = directionRef.current === "up" ? 1 : -1;
        nextX += direction * speed * dt;

        if (Math.abs(flickVelocityRef.current) > 2) {
          nextX += flickVelocityRef.current * dt;
          flickVelocityRef.current *= Math.exp(-dt / DRAG_FLICK_DECAY);
        } else {
          flickVelocityRef.current = 0;
        }
      }

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
  }, [x, isHovered, isScrolling, setWidth]);

  const wrapX = (value: number) => {
    if (!setWidth) return value;
    let next = value;
    while (next <= -setWidth) next += setWidth;
    while (next >= 0) next -= setWidth;
    return next;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const now = performance.now();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastT: now,
      velocity: 0,
    };
    // deliberately NOT captured here: capturing on pointerdown retargets the click to the row, so
    // the card's link never fires and the row becomes drag-only. capture starts with the drag.
    suppressClickRef.current = false;
    flickVelocityRef.current = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (event.pointerId !== drag.pointerId) return;

    const now = performance.now();
    const dx = event.clientX - drag.lastX;
    const dt = Math.max(1, now - drag.lastT);
    drag.velocity = dx / dt;
    drag.lastX = event.clientX;
    drag.lastT = now;

    if (!isDraggingRef.current) {
      if (Math.abs(event.clientX - drag.startX) <= DRAG_THRESHOLD) return;
      // the press has become a drag, so claim the pointer and let the row follow it
      isDraggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    x.set(wrapX(x.get() + dx));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (event.pointerId !== drag.pointerId) return;

    if (isDraggingRef.current) {
      flickVelocityRef.current = Math.max(-DRAG_FLICK_MAX, Math.min(DRAG_FLICK_MAX, drag.velocity * 1000));
      // consumed by the next click; the pointerup that ends a throw still produces one
      suppressClickRef.current = true;
    }

    isDraggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.pointerId = -1;
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    // only the click that ends the throw is swallowed; the next press clears the flag
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full space-y-6 md:space-y-8">
      <div className="flex flex-col space-y-3 md:space-y-4">
        {/* the same editorial step as the recents piece titles, so the row reads as one of them */}
        <Title size="display">{labelText}</Title>

        {captionText ? (
          <div className="lg:w-[65%] text-ink-secondary">
            <Textbox size="caption">
              <Scramble once={false} preScrambled>
                {captionText}
              </Scramble>
            </Textbox>
          </div>
        ) : null}
      </div>

      <div
        // breaks out of the section gutter so the row runs edge to edge, while the label above it
        // stays on the gutter
        className="relative overflow-hidden py-4 -mx-6 md:-mx-16 xl:-mx-20 cursor-grab select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        // native image drag would preempt the pointer drag (and stop the click reaching the link)
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={handleClickCapture}
      >
        <motion.div style={{ x }} className="flex gap-3 sm:gap-4 md:gap-5 xl:gap-6 w-max">
          <div ref={firstSetRef} className="flex gap-3 sm:gap-4 md:gap-5 xl:gap-6">
            {carouselItems.map((item, index) => (
              <CarouselCard
                key={`set-a-${item.src}-${index}`}
                src={`${basePath}${item.src}`}
                alt={item.alt}
                title={item.name}
                href="/gallery"
                year={item.date.slice(0, 4)}
                focus={item.focus}
                dimmed={isHovered}
              />
            ))}
          </div>

          <div ref={secondSetRef} className="flex gap-3 sm:gap-4 md:gap-5 xl:gap-6" aria-hidden="true">
            {carouselItems.map((item, index) => (
              <CarouselCard
                key={`set-b-${item.src}-${index}`}
                src={`${basePath}${item.src}`}
                alt={item.alt}
                title={item.name}
                href="/gallery"
                year={item.date.slice(0, 4)}
                focus={item.focus}
                dimmed={isHovered}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
