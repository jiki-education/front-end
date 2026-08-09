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
          {t(`${key}Title`)}
          <em>{t(`${key}Detail`)}</em>
        </li>
      ))}
    </ul>
  );
}
