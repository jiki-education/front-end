"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import styles from "./LockedFooter.module.css";

type LockedFooterVariant = "free-limit-reached" | "premium-blocked";

interface LockedFooterProps {
  variant: LockedFooterVariant;
}

// The footer shown beneath a locked conversation:
// - free-limit-reached: non-premium user who has used their free conversation
// - premium-blocked: premium user who hit fair use limits
export function LockedFooter({ variant }: LockedFooterProps) {
  const t = useTranslations("codingExercise.lockedFooter");
  const routes = useLocaleRoutes();
  const handleUpgradeClick = () => {
    showPremiumUpgradeModal("assistant_limit_reached");
  };

  return (
    <div className={styles.footer}>
      <div className={styles.footerBox}>
        {variant === "free-limit-reached" ? (
          <p className={styles.footerText}>
            {t.rich("freeLimitText", {
              upgrade: (chunks) => (
                <button onClick={handleUpgradeClick} className={styles.upgradeLink}>
                  {chunks}
                </button>
              )
            })}
          </p>
        ) : (
          <>
            <p className={styles.footerText}>{t("premiumBlockedText")}</p>
            <p className={styles.footerLink}>
              <Link
                href={routes.article("fair-usage-jiki-ai-policy")}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLinkGray}
              >
                {t("learnMoreFairUse")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
