"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import styles from "./EmojiBurst.module.css";

const EMOJI = ["🙌", "💜", "🔥", "👏", "✨", "🎉"];

// Three emoji drifting up off whichever face just popped in. The jitter is randomised
// per burst rather than fixed per message: five fixed arrangements cycling forever
// starts to read as a loop, where a bit of variation reads as a crowd.
export function EmojiBurst({ cycle }: { cycle: number }) {
  const burst = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        char: EMOJI[Math.floor(Math.random() * EMOJI.length)],
        x: (Math.random() - 0.5) * 26,
        drift: (Math.random() - 0.5) * 36,
        rotate: (Math.random() - 0.5) * 40,
        size: 16 + Math.random() * 8,
        // Trails the avatar's pop-in, which is itself held back from the message.
        delay: 700 + i * 180
      })),
    // A fresh burst per message. `cycle` is the whole point of the memo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cycle]
  );

  return (
    <>
      {burst.map((e, i) => (
        <span
          key={i}
          className={styles.emoji}
          aria-hidden="true"
          style={
            {
              "--x": `${e.x}px`,
              "--drift": `${e.drift}px`,
              "--rotate": `${e.rotate}deg`,
              fontSize: `${e.size}px`,
              animationDelay: `${e.delay}ms`
            } as CSSProperties
          }
        >
          {e.char}
        </span>
      ))}
    </>
  );
}
