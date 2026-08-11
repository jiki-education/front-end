"use client";

import { useTranslations } from "next-intl";
import styles from "./TwoHalves.module.css";
import { useInView } from "./hooks/useInView";
import { PuzzlePieces } from "./two-halves/PuzzlePieces";
import { TechRow } from "./two-halves/TechRow";

export function TwoHalves() {
  const t = useTranslations("landing.twoHalves");
  // One observer for the whole section. Both reveals hang off this single boolean and
  // are sequenced entirely by CSS delays, so they cannot fall out of step.
  const { ref, inView } = useInView<HTMLDivElement>(0.5);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <p className={styles.intro}>{t.rich("intro", { strong: (chunks) => <strong>{chunks}</strong> })}</p>

        <div className={styles.row} ref={ref}>
          <div className={`${styles.col} ${styles.right}`}>
            <h3>
              {t.rich("codeHeading", {
                word: (chunks) => <span className={styles.codeWord}>{chunks}</span>
              })}
            </h3>
            <p>{t("codeBody")}</p>
          </div>

          <PuzzlePieces lit={inView} />

          <div className={styles.col}>
            <h3>
              {t.rich("buildHeading", {
                word: (chunks) => <span className={styles.buildWord}>{chunks}</span>
              })}
            </h3>
            <p>{t("buildBody")}</p>
          </div>
        </div>

        <TechRow lit={inView} />
      </div>

      <hr className={styles.divider} />
    </section>
  );
}
