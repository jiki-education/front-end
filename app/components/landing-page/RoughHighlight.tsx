"use client";

import type { ReactNode } from "react";
import { useInView } from "./hooks/useInView";
import styles from "./RoughHighlight.module.css";

// An amber marker-pen sweep that wipes across the phrase when it scrolls into view.
// The sweep is a background-size transition, so reduced motion just lands it filled.
export function RoughHighlight({ children }: { children: ReactNode }) {
  // Held back 100px so the sweep starts once the phrase is properly on screen, rather
  // than the instant its first pixel clears the fold.
  const { ref, inView } = useInView<HTMLElement>(0.2, "0px 0px -100px 0px");

  return (
    <strong ref={ref} className={`${styles.highlight} ${inView ? styles.visible : ""}`}>
      {children}
    </strong>
  );
}
