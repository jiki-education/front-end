"use client";

import { useTranslations } from "next-intl";
import { RoughHighlight } from "../RoughHighlight";
import { LtcVideo } from "./ltc-video/LtcVideo";
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
      </div>

      {/* Outside .inner: the app plus its two callout rails needs more width than the measure
          the body copy is set at. */}
      <LtcVideo />
    </div>
  );
}
