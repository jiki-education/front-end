import { useState } from "react";
import { useTranslations } from "next-intl";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import { PremiumPrice, PremiumDailyPrice } from "@/components/common/PremiumPrice";
import styles from "./PremiumUpsell.module.css";

interface PremiumUpsellProps {
  onUpgrade: () => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export default function PremiumUpsell({
  onUpgrade,
  isLoading: externalLoading = false,
  className = ""
}: PremiumUpsellProps) {
  const t = useTranslations("settings.premiumUpsell");
  const features = [
    { title: t("unlimitedAiTitle"), description: t("unlimitedAiDescription") },
    { title: t("unlimitedContentTitle"), description: t("unlimitedContentDescription") },
    { title: t("certificatesTitle"), description: t("certificatesDescription") },
    { title: t("adFreeTitle"), description: t("adFreeDescription") }
  ];
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handleUpgrade = async () => {
    setInternalLoading(true);
    try {
      await onUpgrade();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className={`${styles.premiumUpsell} ${className}`}>
      <h2 className={styles.premiumUpsellHeadline}>
        {t("headlinePrefix")}
        <span className={styles.highlight}>{t("headlineHighlight")}</span>
        {t("headlineSuffix")}
      </h2>
      <p className={styles.premiumUpsellSubtitle}>{t("subtitle")}</p>

      <div className={styles.premiumUpsellFeatures}>
        {features.map((feature, index) => (
          <div key={index} className={styles.premiumFeature}>
            <CheckmarkCircle />
            <div>
              <strong>{feature.title}:</strong> {feature.description}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.premiumUpsellCard}>
        <div className={styles.premiumUpsellCardInfo}>
          <h3 className={styles.premiumUpsellTitle}>{t("planName")}</h3>
          <div className={styles.premiumUpsellPricing}>
            <div className={styles.premiumUpsellPrice}>
              <span className={styles.amount}>
                <PremiumPrice interval="monthly" />
              </span>
              <span className={styles.period}>{t("perMonth")}</span>
            </div>
            <p className={styles.premiumUpsellNote}>
              {t("dailyNotePrefix")}
              <PremiumDailyPrice interval="monthly" />
              {t("dailyNoteSuffix")}
            </p>
          </div>
        </div>
        <button
          className={`ui-btn ui-btn-primary ui-btn-purple ui-btn-default ${isLoading ? "ui-btn-loading" : ""}`}
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? t("processing") : t("upgrade")}
        </button>
      </div>
    </div>
  );
}
