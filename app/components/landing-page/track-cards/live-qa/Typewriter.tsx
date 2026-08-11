import { Fragment } from "react";
import type { CSSProperties } from "react";
import styles from "./Typewriter.module.css";

const MS_PER_CHARACTER = 26;

/**
 * Reveals text one character at a time, with no timers and no re-rendering: every
 * character is laid out up front and revealed by its own `animation-delay`.
 *
 * The whole string being present from the start is the point — building it up
 * incrementally reflows on every keystroke and the wrap point visibly jumps. Characters
 * are grouped per word so the browser still breaks lines at spaces.
 */
export function Typewriter({ text }: { text: string }) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span className={styles.typewriter}>
      {words.map((word, w) => (
        <Fragment key={w}>
          {/* The word itself never breaks; the space after it is the break opportunity,
              so it has to sit outside the nowrap span. */}
          <span className={styles.word}>
            {[...word].map((char, c) => (
              <span key={c} className={styles.char} style={{ "--i": charIndex++ } as CSSProperties}>
                {char}
              </span>
            ))}
          </span>
          {w < words.length - 1 && (
            <span className={styles.char} style={{ "--i": charIndex++ } as CSSProperties}>
              {" "}
            </span>
          )}
        </Fragment>
      ))}
    </span>
  );
}

export const typewriterDuration = (text: string) => [...text].length * MS_PER_CHARACTER;
