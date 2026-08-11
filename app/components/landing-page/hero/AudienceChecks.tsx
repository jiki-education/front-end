"use client";

import { useTranslations } from "next-intl";
import CheckCircleIcon from "../icons/check-circle.svg";
import styles from "./AudienceChecks.module.css";

// The three audiences the course is for. Each is a genuine list item rather than a
// run of spans, so the group reads as a list to assistive tech and each claim stands
// on its own line.
const AUDIENCE_KEYS = ["audienceBeginners", "audienceJuniors", "audienceEntrepreneurs"] as const;

export function AudienceChecks() {
  const t = useTranslations("landing.hero");

  return (
    <ul className={styles.checks}>
      {AUDIENCE_KEYS.map((key) => (
        <li key={key} className={styles.check}>
          <CheckCircleIcon className={styles.icon} aria-hidden="true" focusable="false" />
          {/* The whole claim is one span: the audience name and its qualifying clause are
              a single flex child, so the row's gap only ever applies between icon and text. */}
          <span className={styles.text}>
            {t.rich(key, {
              name: (chunks) => <strong className={styles.name}>{chunks}</strong>
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}
