"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import styles from "./MeetJeremy.module.css";
import { CredentialRail } from "./meet-jeremy/CredentialRail";
import { CredentialBadges } from "./meet-jeremy/CredentialBadges";
import { PullQuote } from "./meet-jeremy/PullQuote";

const PORTRAIT = "/static/content/images/avatars/ihid-99edf390ba63.webp";

export function MeetJeremy() {
  const t = useTranslations("landing.meetJeremy");

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.portraitColumn}>
            {/* A square crop laid on a purple block shifted behind it, like a sticker on
                coloured card. */}
            <div className={styles.portrait}>
              <Image src={PORTRAIT} alt={t("portraitAlt")} width={176} height={176} sizes="176px" />
            </div>
            <CredentialRail />
          </div>

          <div>
            <p className={styles.intro}>
              {t.rich("intro", { strong: (chunks) => <strong className={styles.noWrap}>{chunks}</strong> })}
            </p>

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
