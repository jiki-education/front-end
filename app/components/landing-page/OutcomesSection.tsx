"use client";

import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import ArrowIcon from "./icons/arrow-1.svg";
import styles from "./OutcomesSection.module.css";
import { useInView } from "./hooks/useInView";
import { CertificateVisual } from "./outcomes/CertificateVisual";
import { ProjectsVisual } from "./outcomes/ProjectsVisual";
import { CodeVisual } from "./outcomes/CodeVisual";

const OUTCOMES = [
  { key: "certificate", visual: <CertificateVisual /> },
  { key: "portfolio", visual: <ProjectsVisual /> },
  { key: "understanding", visual: <CodeVisual /> }
] as const satisfies readonly { key: string; visual: ReactNode }[];

export function OutcomesSection() {
  const t = useTranslations("landing.outcomes");
  const { ref, inView } = useInView<HTMLOListElement>(0.3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.headRow}>
          <div className={styles.head}>
            <span className={styles.bubble}>{t("bubble")}</span>
            <h3 className={styles.heading}>{t("heading")}</h3>
            <p className={styles.sub}>{t("sub")}</p>
          </div>
          <ArrowIcon className={styles.headArrow} aria-hidden="true" />
        </div>

        <ol className={`${styles.cols} ${inView ? styles.ticked : ""}`} ref={ref}>
          {OUTCOMES.map(({ key, visual }, i) => (
            <li key={key} className={styles.col} style={{ "--i": i } as CSSProperties}>
              <div className={styles.viz}>{visual}</div>

              <div className={styles.item}>
                {/* The numeral and the tick sit on top of each other and cross-fade. */}
                <span className={styles.num}>
                  <span className={styles.numeral}>{i + 1}</span>
                  <svg className={styles.tick} viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7.5 5.5 11 12 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h4>{t(`${key}Title`)}</h4>
                  <p>{t(`${key}Body`)}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
