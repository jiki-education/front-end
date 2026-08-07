"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Typewriter } from "./Typewriter";
import styles from "./ChatBubble.module.css";

interface ChatBubbleProps {
  name: string;
  face: StaticImageData;
  message: string;
  /** Changes per message; drives the enter animation and the remount. */
  cycle: number;
}

// The bubble grows and shrinks to fit each message. Height is measured rather than
// transitioned from `auto`, which is not animatable — a ResizeObserver on the content
// keeps the one measurement in one place, instead of the design's manual border-box
// arithmetic scattered through the animation loop.
export function ChatBubble({ name, face, message, cycle }: ChatBubbleProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.card} style={height ? { height } : undefined}>
      <div className={styles.viewport}>
        {/* Keyed on the cycle so React remounts it and the enter animation replays. */}
        <div key={cycle} ref={contentRef} className={styles.item}>
          <Image src={face} alt="" aria-hidden="true" className={styles.face} sizes="44px" />
          <div className={styles.body}>
            <span className={styles.name}>{name}</span>
            <span className={styles.message}>
              <Typewriter text={message} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
