"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";
import jeremyPortrait from "./assets/jeremy-portrait.webp";
import styles from "./MeetJeremy.module.css";
import { CredentialRail } from "./meet-jeremy/CredentialRail";
import { CredentialBadges } from "./meet-jeremy/CredentialBadges";
import { PullQuote } from "./meet-jeremy/PullQuote";
import { RoughHighlight } from "./RoughHighlight";

// Gaps between the marker sweeps, in seconds, in document order: the three qualities
// come quickly one after another, a long beat before the turn to "you", then an even
// tread through the rest. Written as gaps and summed, so re-timing one phrase does not
// mean re-adding every number after it.
const SWEEP_GAPS = [0, 0.7, 0.7, 2, 1.5, 1.5];
const SWEEP_DELAYS = SWEEP_GAPS.map((_, i) => SWEEP_GAPS.slice(0, i + 1).reduce((a, b) => a + b, 0));

export function MeetJeremy() {
  const t = useTranslations("landing.meetJeremy");

  // Render-scoped, so it resets every render and the sweeps stay in document order
  // across both paragraphs. t.rich calls this in reading order.
  let order = 0;
  const highlight = (chunks: ReactNode) => <RoughHighlight delay={SWEEP_DELAYS[order++] ?? 0}>{chunks}</RoughHighlight>;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.portraitColumn}>
            {/* A square crop inside two concentric purple bands. */}
            <div className={styles.portrait}>
              <Image src={jeremyPortrait} alt={t("portraitAlt")} sizes="220px" />
            </div>
            <CredentialRail />
          </div>

          <div>
            {/* The section's heading, carrying its own type rather than the h2 default, so
                the outline gets an entry without inventing copy for screen readers only. */}
            <h2 className={styles.intro}>
              {t.rich("intro", { strong: (chunks) => <strong className={styles.noWrap}>{chunks}</strong> })}
            </h2>

            <CredentialBadges />

            <p className={styles.body}>{t.rich("story", { strong: highlight })}</p>
            <p className={styles.body}>{t.rich("why", { strong: highlight })}</p>

            <span className={styles.signature}>{t("signature")}</span>
          </div>
        </div>

        <PullQuote />
      </div>
    </section>
  );
}
