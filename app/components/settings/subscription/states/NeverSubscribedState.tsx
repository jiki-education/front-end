import SubscriptionButton from "../../ui/SubscriptionButton";
import { PRICING_TIERS } from "@/lib/pricing";

interface NeverSubscribedStateProps {
  onUpgradeToPremium: () => void;
  onUpgradeToMax: () => void;
  isLoading?: boolean;
}

export default function NeverSubscribedState({
  onUpgradeToPremium,
  onUpgradeToMax,
  isLoading = false
}: NeverSubscribedStateProps) {
  const premiumTier = PRICING_TIERS.premium;
  const maxTier = PRICING_TIERS.max;

  return (
    <section
      className="bg-bg-primary p-4 rounded border border-border-secondary"
      aria-labelledby="upgrade-plans-heading"
    >
      <h3 id="upgrade-plans-heading" className="font-medium text-text-primary mb-3">
        Upgrade Your Plan
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        Unlock advanced features and enhanced learning experiences with our premium plans.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="group" aria-labelledby="upgrade-plans-heading">
        <div className="border border-border-secondary rounded p-4" role="article" aria-labelledby="premium-plan-title">
          <h4 id="premium-plan-title" className="font-medium text-text-primary mb-2">
            {premiumTier.name}
          </h4>
          <p
            className="text-2xl font-bold text-text-primary mb-1"
            aria-label={`Price: $${premiumTier.price} per month`}
          >
            ${premiumTier.price}
            <span className="text-sm font-normal">/month</span>
          </p>
          <ul className="text-sm text-text-secondary space-y-1 mb-4" aria-label="Premium plan features">
            {premiumTier.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
          <SubscriptionButton
            variant="secondary"
            onClick={onUpgradeToPremium}
            loading={isLoading}
            className="w-full"
            ariaLabel={`Upgrade to ${premiumTier.name} plan for $${premiumTier.price} per month`}
          >
            Upgrade to Premium
          </SubscriptionButton>
        </div>

        <div
          className="border border-border-secondary rounded p-4 relative"
          role="article"
          aria-labelledby="max-plan-title"
        >
          <div className="absolute -top-2 left-4" aria-hidden="true">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Most Popular</span>
          </div>
          <div className="sr-only">This is our most popular plan</div>
          <h4 id="max-plan-title" className="font-medium text-text-primary mb-2">
            {maxTier.name}
          </h4>
          <p className="text-2xl font-bold text-text-primary mb-1" aria-label={`Price: $${maxTier.price} per month`}>
            ${maxTier.price}
            <span className="text-sm font-normal">/month</span>
          </p>
          <ul className="text-sm text-text-secondary space-y-1 mb-4" aria-label="Max plan features">
            {maxTier.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
          <SubscriptionButton
            variant="primary"
            onClick={onUpgradeToMax}
            loading={isLoading}
            className="w-full"
            ariaLabel={`Upgrade to ${maxTier.name} plan for $${maxTier.price} per month - Most Popular`}
          >
            Upgrade to Max
          </SubscriptionButton>
        </div>
      </div>
    </section>
  );
}
