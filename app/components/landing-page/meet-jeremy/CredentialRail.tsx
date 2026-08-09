"use client";

import { useTranslations } from "next-intl";
import styles from "./CredentialRail.module.css";

const CREDENTIALS = ["developer", "teacher", "entrepreneur"] as const;

// The CV rail beside the portrait. Each item sits on a coloured tick, so the rail runs
// the same purple/blue/green as the badges opposite it.
export function CredentialRail() {
  const t = useTranslations("landing.meetJeremy");

  return (
    <ul className={styles.rail}>
      {CREDENTIALS.map((key) => (
        <li key={key} className={styles.item}>
          <h3 className={styles.title}>{t(`${key}Title`)}</h3>
          <p className={styles.detail}>{t(`${key}Detail`)}</p>
        </li>
      ))}
    </ul>
  );
}
