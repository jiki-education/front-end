"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { staticAsset } from "@/lib/static-asset";
import type { PremiumUpsellCardProps } from "./PremiumUpsellCard";
import { UpsellFooter } from "./UpsellFooter";
import styles from "./UpsellCard.module.css";

// Leads with Jiki and the completion stat, then lists every benefit in one box.
export function AccelerateCard({ onUpgradeClick }: PremiumUpsellCardProps) {
  const t = useTranslations("dashboard.challengesSidebar.premiumUpsell");

  return (
    <section className={styles.card} aria-label={t("label")}>
      <Image
        className={styles.avatar}
        src={staticAsset("images/misc/jiki-flying.webp")}
        alt=""
        width={84}
        height={84}
      />
      <h2 className={styles.title}>{t.rich("accelerate.heading", { highlight })}</h2>
      <p className={styles.message}>{t.rich("completionStat", { strong })}</p>
      <p className={styles.benefits}>{t.rich("accelerate.benefits", { strong })}</p>
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
