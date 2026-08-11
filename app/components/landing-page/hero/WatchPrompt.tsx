"use client";

import { useTranslations } from "next-intl";
import styles from "./WatchPrompt.module.css";

// The handwritten aside pointing at the video. The spiral arrow that used to lead the
// eye down to it lives on the video itself (see HeroVideo), so this is text only.
export function WatchPrompt() {
  const t = useTranslations("landing.hero");

  return (
    <p className={styles.prompt}>
      {t.rich("watchPrompt", {
        strong: (chunks) => <span className={styles.highlight}>{chunks}</span>
      })}
    </p>
  );
}
