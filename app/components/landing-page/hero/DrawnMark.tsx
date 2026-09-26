import type { CSSProperties, ReactNode } from "react";
import styles from "./DrawnMark.module.css";

interface DrawnMarkProps {
  type: "highlight" | "underline";
  // Seconds to wait before the stroke wipes in, so several marks can appear in sequence.
  delay?: number;
  children: ReactNode;
}

// A highlighter block or a thin underline that wipes in from the left. Pure CSS:
// the mark is a background gradient whose width animates from 0 to 100%, so
// there is nothing to measure and it wraps whatever width the text ends up at.
export function DrawnMark({ type, delay = 0, children }: DrawnMarkProps) {
  const style = { "--mark-delay": `${delay}s` } as CSSProperties;
  return (
    <span className={type === "highlight" ? styles.highlight : styles.underline} style={style}>
      {children}
    </span>
  );
}
