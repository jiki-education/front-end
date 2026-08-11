"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./hooks/useInView";
import styles from "./RoughHighlight.module.css";

// An amber marker-pen sweep that wipes across the phrase when it scrolls into view.
// The sweep is a background-size transition, so reduced motion just lands it filled.
//
// `delay` (seconds) staggers a run of highlights that come into view together. It is a
// transition-delay rather than a timer, so one observer per phrase still yields one
// ordered sequence with nothing to keep in step. Omitted, a highlight sweeps at once.
export function RoughHighlight({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  // Held back 100px so the sweep starts once the phrase is properly on screen, rather
  // than the instant its first pixel clears the fold.
  const { ref, inView } = useInView<HTMLElement>(0.2, "0px 0px -100px 0px");

  return (
    <strong
      ref={ref}
      className={`${styles.highlight} ${inView ? styles.visible : ""}`}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </strong>
  );
}
