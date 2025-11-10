import SubscriptionButton from "../../ui/SubscriptionButton";

interface CancellingScheduledStateProps {
  cancellationDate: string;
  tier: "premium" | "max";
  onReactivate: () => void;
  onUpdatePayment: () => void;
  isLoading?: boolean;
}

export default function CancellingScheduledState({
  cancellationDate,
  tier,
  onReactivate,
  onUpdatePayment,
  isLoading = false
}: CancellingScheduledStateProps) {
  const tierInfo = {
    premium: {
      name: "Premium",
      price: "$3",
      color: "blue"
    },
    max: {
      name: "Max",
      price: "$9",
      color: "purple"
    }
  };

  const currentTier = tierInfo[tier];

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
          <h3 className="font-medium text-orange-900">Subscription Scheduled for Cancellation</h3>
        </div>

        <div className="mb-4">
          <p className="text-orange-800 text-sm mb-2">
            Your {currentTier.name} subscription will be cancelled on <strong>{cancellationDate}</strong>.
          </p>
          <p className="text-orange-700 text-sm">
            You&apos;ll continue to have access to all {currentTier.name} features until then.
          </p>
        </div>

        <div className="bg-white rounded p-3 mb-4">
          <h4 className="font-medium text-text-primary mb-2">Current Benefits Until {cancellationDate}</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            {tier === "premium" ? (
              <>
                <li>• Advanced exercises</li>
                <li>• Progress tracking</li>
                <li>• Community access</li>
              </>
            ) : (
              <>
                <li>• All Premium features</li>
                <li>• AI-powered hints</li>
                <li>• Priority support</li>
                <li>• Exclusive content</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SubscriptionButton variant="primary" onClick={onReactivate} loading={isLoading} className="flex-1">
            Reactivate Subscription
          </SubscriptionButton>
          <SubscriptionButton variant="secondary" onClick={onUpdatePayment} loading={isLoading} className="flex-1">
            Update Payment Details
          </SubscriptionButton>
        </div>
      </div>

      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <h3 className="font-medium text-text-primary mb-2">What happens after cancellation?</h3>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• You&apos;ll be moved to the Free plan</li>
          <li>• Access to basic exercises only</li>
          <li>• No billing charges after {cancellationDate}</li>
          <li>• You can resubscribe anytime</li>
        </ul>
      </div>
    </div>
  );
}
