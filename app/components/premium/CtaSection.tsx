"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { useTranslations } from "next-intl";
import styles from "./PremiumPage.module.css";

export default function CtaSection() {
  const t = useTranslations("premium.cta");
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.membership_type === "premium";

  if (isPremium) {
    return (
      <div className={styles["cta-wrapper"]}>
        <div className={styles["cta-banner"]}>
          <h2 className={styles["cta-title"]}>{t("alreadyPremiumTitle")}</h2>
          <p className={styles["cta-desc"]}>{t("alreadyPremiumDesc")}</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles["cta-wrapper"]}>
        <div className={styles["cta-banner"]}>
          <h2 className={styles["cta-title"]}>{t("upgradeTitle")}</h2>
          <p className={styles["cta-desc"]}>{t("upgradeDesc")}</p>
          <button
            className="ui-btn ui-btn-large ui-btn-white w-[260px] font-semibold"
            onClick={() => showPremiumUpgradeModal("upgrade_cta_premium_page")}
          >
            {t("upgradeButton")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["cta-wrapper"]}>
      <div className={styles["cta-banner"]}>
        <h2 className={styles["cta-title"]}>{t("freeTitle")}</h2>
        <p className={styles["cta-desc"]}>{t("freeDesc")}</p>
        <button
          className="ui-btn ui-btn-large ui-btn-white w-[260px] font-semibold"
          onClick={() => (window.location.href = "/auth/signup")}
        >
          {t("freeButton")}
        </button>
      </div>
    </div>
  );
}
