"use client";

import { useTranslations } from "next-intl";
import type { PremiumUpsellCardProps } from "./PremiumUpsellCard";
import { UpsellFooter } from "./UpsellFooter";
import styles from "./UpsellCard.module.css";
import ownStyles from "./NeverGetStuckCard.module.css";

// Left-aligned, leading with unlimited Ask Jiki, with the completion stat in its own row.
export function NeverGetStuckCard({ onUpgradeClick }: PremiumUpsellCardProps) {
  const t = useTranslations("dashboard.challengesSidebar.premiumUpsell");

  return (
    <section className={`${styles.card} ${ownStyles.card}`} aria-label={t("label")}>
      <h2 className={styles.title}>{t.rich("neverGetStuck.heading", { highlight })}</h2>
      <p className={styles.message}>{t("neverGetStuck.text")}</p>
      <div className={ownStyles.statRow}>
        <span className={`${ownStyles.statNumber} ${styles.highlight}`}>{t("neverGetStuck.statNumber")}</span>
        <span className={ownStyles.statText}>{t.rich("completionStat", { strong })}</span>
      </div>
      <p className={styles.benefits}>{t.rich("neverGetStuck.plus", { strong })}</p>
      <UpsellFooter onUpgradeClick={onUpgradeClick} />
    </section>
  );
}

function highlight(chunks: React.ReactNode) {
  return <span className={styles.highlight}>{chunks}</span>;
}

function strong(chunks: React.ReactNode) {
  return <strong>{chunks}</strong>;
}
