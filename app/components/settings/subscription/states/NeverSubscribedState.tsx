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
    <div className="bg-bg-primary p-4 rounded border border-border-secondary">
      <h3 className="font-medium text-text-primary mb-3">Upgrade Your Plan</h3>
      <p className="text-text-secondary text-sm mb-4">
        Unlock advanced features and enhanced learning experiences with our premium plans.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-border-secondary rounded p-4">
          <h4 className="font-medium text-text-primary mb-2">{premiumTier.name}</h4>
          <p className="text-2xl font-bold text-text-primary mb-1">
            ${premiumTier.price}
            <span className="text-sm font-normal">/month</span>
          </p>
          <ul className="text-sm text-text-secondary space-y-1 mb-4">
            {premiumTier.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
          <SubscriptionButton variant="secondary" onClick={onUpgradeToPremium} loading={isLoading} className="w-full">
            Upgrade to Premium
          </SubscriptionButton>
        </div>

        <div className="border border-border-secondary rounded p-4 relative">
          <div className="absolute -top-2 left-4">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Most Popular</span>
          </div>
          <h4 className="font-medium text-text-primary mb-2">{maxTier.name}</h4>
          <p className="text-2xl font-bold text-text-primary mb-1">
            ${maxTier.price}
            <span className="text-sm font-normal">/month</span>
          </p>
          <ul className="text-sm text-text-secondary space-y-1 mb-4">
            {maxTier.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
          <SubscriptionButton variant="primary" onClick={onUpgradeToMax} loading={isLoading} className="w-full">
            Upgrade to Max
          </SubscriptionButton>
        </div>
      </div>
    </div>
  );
}
