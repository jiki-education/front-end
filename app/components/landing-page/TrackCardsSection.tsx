import styles from "./TrackCardsSection.module.css";
import { LearnToCodeCard } from "./track-cards/LearnToCodeCard";
import { FunPrints } from "./track-cards/FunPrints";

// Expands on the two strands introduced above: one full-width band per track, with the
// project prints sitting between them. The Learn to Build card is still to come.
export function TrackCardsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <LearnToCodeCard />
        <FunPrints />
      </div>
    </section>
  );
}
