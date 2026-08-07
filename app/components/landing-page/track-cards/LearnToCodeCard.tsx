"use client";

import { useTranslations } from "next-intl";
import { RoughHighlight } from "../RoughHighlight";
import styles from "./LearnToCodeCard.module.css";

export function LearnToCodeCard() {
  const t = useTranslations("landing.learnToCode");

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <h3 className={styles.heading}>
          {t.rich("heading", { word: (chunks) => <span className={styles.codeWord}>{chunks}</span> })}
        </h3>

        <p className={styles.intro}>
          {t.rich("intro", {
            highlight: (chunks) => <RoughHighlight>{chunks}</RoughHighlight>
          })}
        </p>

        {/* Placeholder for the simulated exercise walkthrough, which is being built
            separately. Deliberately unstyled beyond a grey block and not translated,
            since none of it ships. */}
        <div className={styles.demoPlaceholder}>Exercise walkthrough — to come</div>
      </div>
    </div>
  );
}
