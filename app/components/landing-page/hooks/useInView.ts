"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once, the first time the observed element crosses `threshold`, then stops
 * observing. Intended for one-shot scroll reveals: the caller turns the boolean into a
 * class name and lets CSS own the timing, rather than scheduling steps in JS.
 */
export function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Where IntersectionObserver is unavailable (jsdom in tests, ancient browsers),
    // settle on the revealed state rather than leaving content stuck mid-animation.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
