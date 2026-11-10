import { useState } from "react";
import { useTranslations } from "next-intl";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { usePremiumFeatures } from "@/components/premium/usePremiumFeatures";
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
  const tCommon = useTranslations("common");
  const features = usePremiumFeatures();
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
        {t.rich("headline", { highlight: (chunks) => <span className={styles.highlight}>{chunks}</span> })}
      </h2>
      <p className={styles.premiumUpsellSubtitle}>{t("subtitle")}</p>

      <div className={styles.premiumUpsellFeatures}>
        {features.map((feature) => (
          <div key={feature.key} className={styles.premiumFeature}>
            <CheckmarkCircle />
            <div>{feature.content}</div>
          </div>
        ))}
      </div>

      <div className={styles.premiumUpsellCard}>
        <div className={styles.premiumUpsellCardInfo}>
          <h3 className={styles.premiumUpsellTitle}>{t("planName")}</h3>
          <div className={styles.premiumUpsellPricing}>
            <div className={styles.premiumUpsellPrice}>
              <span className={styles.amount}>
                <PremiumPrice />
              </span>
            </div>
            <p className={styles.premiumUpsellNote}>{t("lifetimeNote")}</p>
          </div>
        </div>
        <button
          className={`ui-btn ui-btn-primary ui-btn-purple ui-btn-default ${isLoading ? "ui-btn-loading" : ""}`}
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? tCommon("processing") : t("upgrade")}
        </button>
      </div>
    </div>
  );
}
