import SubscriptionButton from "../../ui/SubscriptionButton";

interface PaymentFailedExpiredStateProps {
  previousTier: "premium" | "max";
  onResubscribeToPremium: () => void;
  onResubscribeToMax: () => void;
  isLoading?: boolean;
}

export default function PaymentFailedExpiredState({
  previousTier,
  onResubscribeToPremium,
  onResubscribeToMax,
  isLoading = false
}: PaymentFailedExpiredStateProps) {
  const tierInfo = {
    premium: {
      name: "Premium",
      price: "$3"
    },
    max: {
      name: "Max",
      price: "$9"
    }
  };

  const prevTier = tierInfo[previousTier];

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
          <h3 className="font-medium text-red-900">Subscription Suspended</h3>
        </div>

        <div className="mb-4">
          <p className="text-red-800 text-sm mb-2">
            Your {prevTier.name} subscription has been suspended due to payment failure.
          </p>
          <p className="text-red-700 text-sm">
            You now have access to Free plan features only. Resubscribe to restore your previous benefits.
          </p>
        </div>

        <div className="bg-white rounded p-3 mb-4">
          <h4 className="font-medium text-text-primary mb-2">Current Access (Free Plan)</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Basic exercises only</li>
            <li>• Limited progress tracking</li>
            <li>• No community features</li>
          </ul>
        </div>
      </div>

      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <h3 className="font-medium text-text-primary mb-3">Resubscribe to Continue Learning</h3>
        <p className="text-text-secondary text-sm mb-4">
          Choose a plan to restore your access and continue your learning journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border-secondary rounded p-4">
            <h4 className="font-medium text-text-primary mb-2">Premium</h4>
            <p className="text-2xl font-bold text-text-primary mb-1">
              $3<span className="text-sm font-normal">/month</span>
            </p>
            <ul className="text-sm text-text-secondary space-y-1 mb-4">
              <li>• Advanced exercises</li>
              <li>• Progress tracking</li>
              <li>• Community access</li>
            </ul>
            <SubscriptionButton
              variant={previousTier === "premium" ? "primary" : "secondary"}
              onClick={onResubscribeToPremium}
              loading={isLoading}
              className="w-full"
            >
              {previousTier === "premium" ? "Restore Premium" : "Resubscribe to Premium"}
            </SubscriptionButton>
          </div>

          <div className="border border-border-secondary rounded p-4">
            <h4 className="font-medium text-text-primary mb-2">Max</h4>
            <p className="text-2xl font-bold text-text-primary mb-1">
              $9<span className="text-sm font-normal">/month</span>
            </p>
            <ul className="text-sm text-text-secondary space-y-1 mb-4">
              <li>• Everything in Premium</li>
              <li>• AI-powered hints</li>
              <li>• Priority support</li>
              <li>• Exclusive content</li>
            </ul>
            <SubscriptionButton
              variant={previousTier === "max" ? "primary" : "secondary"}
              onClick={onResubscribeToMax}
              loading={isLoading}
              className="w-full"
            >
              {previousTier === "max" ? "Restore Max" : "Resubscribe to Max"}
            </SubscriptionButton>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-800">
          If you&apos;re experiencing payment issues, please contact our support team. We&apos;re here to help resolve
          any billing problems.
        </p>
      </div>
    </div>
  );
}
