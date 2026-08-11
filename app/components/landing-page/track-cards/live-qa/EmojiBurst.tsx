import type { CSSProperties } from "react";
import styles from "./EmojiBurst.module.css";

const EMOJI = ["🙌", "💜", "🔥", "👏", "✨", "🎉"];

// Spread the three emoji apart deliberately rather than jittering them randomly: random
// offsets kept stacking two on top of each other, and being derived from the seed means
// the same burst renders the same on the server as on the client.
const OFFSETS = [
  { x: -14, drift: -12, rotate: -14, size: 18 },
  { x: 2, drift: 6, rotate: 8, size: 22 },
  { x: 16, drift: 14, rotate: 16, size: 17 }
];

/** Three emoji drifting up off a face, trailing its pop-in. */
export function EmojiBurst({ seed }: { seed: number }) {
  return (
    <>
      {OFFSETS.map((offset, i) => (
        <span
          key={i}
          className={styles.emoji}
          aria-hidden="true"
          style={
            {
              "--x": `${offset.x}px`,
              "--drift": `${offset.drift}px`,
              "--rotate": `${offset.rotate}deg`,
              fontSize: `${offset.size}px`,
              // Trails the face's pop-in, which is itself held back from the message.
              animationDelay: `${500 + i * 180}ms`
            } as CSSProperties
          }
        >
          {EMOJI[(seed * 3 + i) % EMOJI.length]}
        </span>
      ))}
    </>
  );
}
