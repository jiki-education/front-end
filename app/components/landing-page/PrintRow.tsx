"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import joinLoop from "./assets/join-loop-dashed.webp";
import styles from "./PrintRow.module.css";
import { useInView } from "./hooks/useInView";

// `pixel` marks the pixel-art clips, which keep their colours; the rest take the print wash.
const PRINTS = [
  { key: "spaceInvaders", file: "space-invaders-74644.mp4", pixel: true },
  { key: "breakout", file: "breakout-bcaa3.mp4", pixel: true },
  { key: "maze", file: "maze-59a6d.mp4", pixel: false }
] as const;

const OUTCOMES = ["free", "projects", "unstuck"] as const;

export function PrintRow() {
  const t = useTranslations("landing.printRow");
  const routes = useLocaleRoutes();
  const { ref, inView } = useInView<HTMLUListElement>(0.6);

  return (
    <section className={styles.section}>
      {/* The looping doodle and its handwritten aside, pointing in at the prints. */}
      <div className={styles.join} aria-hidden="true">
        <Image src={joinLoop} alt="" className={styles.joinPath} />
        <svg className={styles.joinHead} viewBox="0 0 24 20">
          <path d="M23 10 L3 18 L7.5 10 L3 2 Z" fill="currentColor" />
        </svg>
        <span className={styles.joinNote}>{t("joinNote")}</span>
      </div>

      <div className={styles.inner}>
        <ul className={styles.prints}>
          {PRINTS.map(({ key, file, pixel }) => (
            <li key={key} className={styles.print}>
              <video
                className={pixel ? styles.pixel : undefined}
                aria-label={t(key)}
                src={`/static/images/landing-page/${file}`}
                autoPlay
                loop
                muted
                playsInline
              />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>

        <h2 className={styles.heading}>{t("heading")}</h2>
        <p className={styles.body}>{t("body")}</p>

        <ul className={`${styles.list} ${inView ? styles.shown : ""}`} ref={ref}>
          {OUTCOMES.map((key, i) => (
            <li key={key} className={styles.row} style={{ "--i": i } as CSSProperties}>
              <span className={styles.tick}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {t(key)}
            </li>
          ))}
        </ul>

        <div>
          <Link href={routes.authSignup()} className={`ui-btn ui-btn-large ui-btn-primary ${styles.btn}`}>
            {t("cta")}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
