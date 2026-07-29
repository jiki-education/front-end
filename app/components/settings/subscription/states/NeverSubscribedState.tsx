import SubscriptionButton from "../../ui/SubscriptionButton";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { useTranslations } from "next-intl";
import styles from "./NeverSubscribedState.module.css";

interface NeverSubscribedStateProps {
  onUpgradeToPremium: () => void;
  isLoading?: boolean;
}

export default function NeverSubscribedState({ onUpgradeToPremium, isLoading = false }: NeverSubscribedStateProps) {
  const t = useTranslations("settings.neverSubscribed");
  const tCommon = useTranslations("common");
  const tPremium = useTranslations("subscription.tiers.premium");
  const premiumName = tPremium("name");
  const premiumFeatures = [
    tPremium("features.allFreeFeatures"),
    tPremium("features.unlimitedAi"),
    tPremium("features.allExercises"),
    tPremium("features.certificates"),
    tPremium("features.adFree")
  ];

  return (
    <section className={styles.section} aria-labelledby="upgrade-plans-heading">
      <h3 id="upgrade-plans-heading" className={styles.heading}>
        {t("heading")}
      </h3>
      <p className={styles.subtitle}>{t("subtitle")}</p>

      <div className={styles.plans} role="group" aria-labelledby="upgrade-plans-heading">
        <div className={styles.planCard} role="article" aria-labelledby="premium-plan-title">
          <h4 id="premium-plan-title" className={styles.planName}>
            {premiumName}
          </h4>
          <p className={styles.price}>
            <PremiumPrice interval="monthly" />
            <span className={styles.priceUnit}>{tCommon("perMonth")}</span>
          </p>
          <ul className={styles.features} aria-label={t("featuresLabel")}>
            {premiumFeatures.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
          <SubscriptionButton
            variant="secondary"
            onClick={onUpgradeToPremium}
            loading={isLoading}
            className={styles.upgradeButton}
            ariaLabel={t("upgradeAriaLabel", { plan: premiumName })}
          >
            {t("upgrade")}
          </SubscriptionButton>
        </div>
      </div>
    </section>
  );
}
