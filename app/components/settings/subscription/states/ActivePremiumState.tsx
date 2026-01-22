import SubscriptionButton from "../../ui/SubscriptionButton";
import { PRICING_TIERS } from "@/lib/pricing";

interface ActivePremiumStateProps {
  nextBillingDate?: string;
  onUpdatePayment: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ActivePremiumState({
  nextBillingDate,
  onUpdatePayment,
  onCancel,
  isLoading = false
}: ActivePremiumStateProps) {
  const premiumTier = PRICING_TIERS.premium;

  return (
    <div className="space-y-4">
      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-text-primary">Current Plan Benefits</h3>
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Premium Active</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <ul className="text-sm text-text-secondary space-y-2">
            {premiumTier.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="text-sm">
            <p className="text-text-secondary mb-1">Billing Information</p>
            <p className="font-medium text-text-primary">${premiumTier.price}.00/month</p>
            {nextBillingDate && <p className="text-text-secondary">Next billing: {nextBillingDate}</p>}
          </div>
        </div>
      </div>

      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <h3 className="font-medium text-text-primary mb-3">Manage Subscription</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <SubscriptionButton variant="secondary" onClick={onUpdatePayment} loading={isLoading} className="flex-1">
            Update Payment Details
          </SubscriptionButton>
          <SubscriptionButton variant="danger" onClick={onCancel} loading={isLoading} className="flex-1">
            Cancel Subscription
          </SubscriptionButton>
        </div>
      </div>
    </div>
  );
}
