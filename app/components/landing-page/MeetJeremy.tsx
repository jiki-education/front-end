"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import jeremyPortrait from "./assets/jeremy-portrait.webp";
import styles from "./MeetJeremy.module.css";
import { CredentialRail } from "./meet-jeremy/CredentialRail";
import { CredentialBadges } from "./meet-jeremy/CredentialBadges";
import { PullQuote } from "./meet-jeremy/PullQuote";

export function MeetJeremy() {
  const t = useTranslations("landing.meetJeremy");

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

            <p className={styles.body}>{t("story")}</p>
            <p className={styles.body}>{t("why")}</p>

            <span className={styles.signature}>{t("signature")}</span>
          </div>
        </div>

        <PullQuote />
      </div>
    </section>
  );
}
