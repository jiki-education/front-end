import SubscriptionButton from "../../ui/SubscriptionButton";
import { PRICING_TIERS } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { useTranslations } from "next-intl";

interface NeverSubscribedStateProps {
  onUpgradeToPremium: () => void;
  isLoading?: boolean;
}

export default function NeverSubscribedState({ onUpgradeToPremium, isLoading = false }: NeverSubscribedStateProps) {
  const t = useTranslations("settings.neverSubscribed");
  const premiumTier = PRICING_TIERS.premium;

  return (
    <section
      className="bg-bg-primary p-4 rounded border border-border-secondary"
      aria-labelledby="upgrade-plans-heading"
    >
      <h3 id="upgrade-plans-heading" className="font-medium text-text-primary mb-12">
        {t("heading")}
      </h3>
      <p className="text-text-secondary text-sm mb-4">{t("subtitle")}</p>

      <div className="grid grid-cols-1 gap-4" role="group" aria-labelledby="upgrade-plans-heading">
        <div className="border border-border-secondary rounded p-4" role="article" aria-labelledby="premium-plan-title">
          <h4 id="premium-plan-title" className="font-medium text-text-primary mb-2">
            {premiumTier.name}
          </h4>
          <p className="text-2xl font-bold text-text-primary mb-4">
            <PremiumPrice interval="monthly" />
            <span className="text-sm font-normal">{t("perMonth")}</span>
          </p>
          <ul className="text-sm text-text-secondary space-y-4 mb-4" aria-label={t("featuresLabel")}>
            {premiumTier.features.map((feature: string, index: number) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
          <SubscriptionButton
            variant="secondary"
            onClick={onUpgradeToPremium}
            loading={isLoading}
            className="w-full"
            ariaLabel={t("upgradeAriaLabel", { plan: premiumTier.name })}
          >
            {t("upgrade")}
          </SubscriptionButton>
        </div>
      </div>
    </section>
  );
}
