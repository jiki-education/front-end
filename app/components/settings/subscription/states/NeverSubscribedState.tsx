import SubscriptionButton from "../../ui/SubscriptionButton";
import { PRICING_TIERS } from "@/lib/pricing";

interface NeverSubscribedStateProps {
  onUpgradeToPremium: () => void;
  isLoading?: boolean;
}

export default function NeverSubscribedState({ onUpgradeToPremium, isLoading = false }: NeverSubscribedStateProps) {
  const premiumTier = PRICING_TIERS.premium;

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

      <div className="grid grid-cols-1 gap-4" role="group" aria-labelledby="upgrade-plans-heading">
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
            {premiumTier.features.map((feature: string, index: number) => (
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
      </div>
    </section>
  );
}
