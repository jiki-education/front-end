"use client";

import { useEffect, useRef } from "react";

export function useWavingHand() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          el.classList.add("waving-hand-animation");
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
