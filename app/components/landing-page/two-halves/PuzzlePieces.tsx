import styles from "./PuzzlePieces.module.css";

// The Code and Build strands as interlocking puzzle pieces: Code carries the knob on its
// right edge, Build the matching socket on its left. Decorative — the same words are in
// the headings either side, so this is hidden from assistive tech.
export function PuzzlePieces({ lit }: { lit: boolean }) {
  return (
    <div className={`${styles.pieces} ${lit ? styles.lit : ""}`} aria-hidden="true">
      <svg className={styles.code} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14,4 H90 A10,10 0 0 1 100,14 V42 C118,32 118,88 100,78 V106 A10,10 0 0 1 90,116 H14 A10,10 0 0 1 4,106 V14 A10,10 0 0 1 14,4 Z"
          fill="var(--color-purple-100)"
          stroke="var(--color-purple-400)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text x="52" y="67" fill="var(--color-purple-700)">
          Code
        </text>
      </svg>
      <svg className={styles.build} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30,4 H106 A10,10 0 0 1 116,14 V106 A10,10 0 0 1 106,116 H30 A10,10 0 0 1 20,106 V78 C38,88 38,32 20,42 V14 A10,10 0 0 1 30,4 Z"
          fill="var(--color-blue-100)"
          stroke="var(--color-blue-400)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text x="70" y="67" fill="var(--color-blue-700)">
          Build
        </text>
      </svg>
    </div>
  );
}
