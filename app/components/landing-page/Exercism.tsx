"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import exercismFace from "./assets/exercism-face.webp";
import styles from "./Exercism.module.css";

const STATS = ["taught", "testimonials", "submitted"] as const;

// A guest-brand band: this is Exercism's own palette and motifs, deliberately not Jiki's
// tokens. Do not substitute --color-* values here.
export function Exercism() {
  const t = useTranslations("landing.exercism");

  return (
    <section className={styles.band}>
      <div className={styles.note}>
        <span className={`${styles.shape} ${styles.square}`} aria-hidden="true" />
        <svg className={`${styles.shape} ${styles.zig}`} width="30" height="30" aria-hidden="true">
          <path d="M4 16L16 4M8 26L20 14" stroke="#1b1449" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
        <span className={`${styles.shape} ${styles.tri}`} aria-hidden="true">
          <svg width="36" height="30" viewBox="0 0 36 30">
            <path d="M18 27L2.5 3h31L18 27Z" stroke="#1b1449" strokeWidth="2" fill="#fff" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={`${styles.shape} ${styles.dots}`} aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
        <span className={`${styles.shape} ${styles.diamond}`} aria-hidden="true" />

        <Image src={exercismFace} alt="" aria-hidden="true" className={styles.face} sizes="52px" />

        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h2 className={styles.heading}>
          {t.rich("heading", { highlight: (chunks) => <span className={styles.highlight}>{chunks}</span> })}
        </h2>
        <p className={styles.support}>{t.rich("support", { strong: (chunks) => <strong>{chunks}</strong> })}</p>

        <p className={styles.stats}>
          {STATS.map((key, i) => (
            <span key={key} className={styles.stat}>
              {i > 0 && <span className={styles.dot} aria-hidden="true" />}
              <span>
                <strong>{t(`${key}Value`)}</strong> {t(`${key}Label`)}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
