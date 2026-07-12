import { marked } from "marked";
import type { EpisodeSummary as EpisodeSummaryData } from "@/lib/content/types";
import styles from "./EpisodeSummary.module.css";

interface EpisodeSummaryProps {
  summary: EpisodeSummaryData;
}

/**
 * Compact from → to journey card for the episode sidebar.
 */
export default function EpisodeSummary({ summary }: EpisodeSummaryProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Episode in Brief</h3>
      <div className={styles.start}>
        <span className={styles.label}>Where we start</span>
        <span className={styles.text} dangerouslySetInnerHTML={{ __html: marked.parseInline(summary.from) }} />
      </div>
      <div className={styles.stop}>
        <span className={styles.label}>Where we end up</span>
        <span className={styles.text} dangerouslySetInnerHTML={{ __html: marked.parseInline(summary.to) }} />
      </div>
      {summary.keyConcepts.length > 0 && (
        <div className={styles.concepts}>
          <span className={styles.label}>What we cover</span>
          <ul className={styles.conceptsList}>
            {summary.keyConcepts.map((concept) => (
              <li key={concept} className={styles.conceptsItem}>
                {concept}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
