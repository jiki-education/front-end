"use client";

import { useEffect, useRef, useState } from "react";
import { Typewriter } from "./Typewriter";
import styles from "./ChatBubble.module.css";

interface ChatBubbleProps {
  name: string;
  message: string;
  /** Which side of the face the bubble hangs off; the pointer goes on the other edge. */
  side: "left" | "right";
}

// The bubble grows to fit its message. Height is measured rather than transitioned from
// `auto`, which is not animatable — one ResizeObserver keeps that measurement in one
// place, instead of hand-written border-box arithmetic spread through an animation loop.
export function ChatBubble({ name, message, side }: ChatBubbleProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height + 20));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.card} ${styles[side]}`} style={height ? { height } : undefined}>
      <div ref={contentRef} className={styles.item}>
        <span className={styles.name}>{name}</span>
        <span className={styles.message}>
          <Typewriter text={message} />
        </span>
      </div>
    </div>
  );
}
