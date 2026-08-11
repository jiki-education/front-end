import ArrowIcon from "./icons/arrow-1.svg";
import styles from "./TrackCardsSection.module.css";
import { LearnToCodeCard } from "./track-cards/LearnToCodeCard";
import { LearnToBuildCard } from "./track-cards/LearnToBuildCard";
import { FunPrints } from "./track-cards/FunPrints";

// Expands on the two strands introduced above: one full-width band per track, with the
// project prints sitting between them.
export function TrackCardsSection() {
  return (
    <section className={styles.section}>
      <div>
        <LearnToCodeCard />
        <FunPrints />
        {/* Carries the eye across the seam into the Build track. A real element between
            the two bands, rather than absolutely positioned up out of the lower one. */}
        <div className={styles.seam} aria-hidden="true">
          <ArrowIcon className={styles.seamArrow} />
        </div>
        <LearnToBuildCard />
      </div>
    </section>
  );
}
