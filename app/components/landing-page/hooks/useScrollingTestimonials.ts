"use client";

import { useEffect, useRef, type RefObject } from "react";
import { animate } from "animejs";

export function useScrollingTestimonials(extraHoverRef?: RefObject<HTMLElement | null>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const marqueeElement = ulRef.current;
    const extra = extraHoverRef?.current;
    if (!container || !marqueeElement) return;

    const marqueeWidth = marqueeElement.scrollWidth;
    const clonedItems = marqueeElement.innerHTML;
    marqueeElement.innerHTML = clonedItems + clonedItems;

    const speed = { current: 1, max: 5, min: 1 };
    const velocityScale = 0.1;
    let animationPosition = 0;
    let lastTimestamp: number | null = null;
    let rafId: number;

    function animateMarquee(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      animationPosition += elapsed * speed.current * velocityScale;
      if (animationPosition >= marqueeWidth) {
        animationPosition = animationPosition % marqueeWidth;
      }

      marqueeElement!.style.transform = `translateX(${-animationPosition}px)`;
      rafId = requestAnimationFrame(animateMarquee);
    }

    rafId = requestAnimationFrame(animateMarquee);

    const handleMouseEnter = () => {
      animate(speed, { current: speed.max, duration: 500, ease: "linear" });
    };
    const handleMouseLeave = () => {
      animate(speed, { current: speed.min, duration: 500, ease: "linear" });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    extra?.addEventListener("mouseenter", handleMouseEnter);
    extra?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      extra?.removeEventListener("mouseenter", handleMouseEnter);
      extra?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [extraHoverRef]);

  return { containerRef, ulRef };
}
