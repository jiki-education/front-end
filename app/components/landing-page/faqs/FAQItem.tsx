import type { ReactNode } from "react";
import styles from "./FAQItem.module.css";

// Native <details>/<summary>, so the open/close needs no JS and keyboard and
// screen-reader behaviour come for free.
export function FAQItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <h4>{question}</h4>
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  );
}
