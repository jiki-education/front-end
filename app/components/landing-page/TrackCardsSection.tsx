import styles from "./TrackCardsSection.module.css";
import { LearnToCodeCard } from "./track-cards/LearnToCodeCard";
import { FunPrints } from "./track-cards/FunPrints";

// The course in two full-width bands: the walkthrough demo, then the prints of what
// learners make.
export function TrackCardsSection() {
  return (
    <section className={styles.section}>
      <div>
        <LearnToCodeCard />
        <FunPrints />
      </div>
    </section>
  );
}
