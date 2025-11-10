import SubscriptionButton from "../../ui/SubscriptionButton";

interface PreviouslySubscribedStateProps {
  previousTier: "premium" | "max";
  lastActiveDate?: string;
  onResubscribeToPremium: () => void;
  onResubscribeToMax: () => void;
  isLoading?: boolean;
}

export default function PreviouslySubscribedState({
  previousTier,
  lastActiveDate,
  onResubscribeToPremium,
  onResubscribeToMax,
  isLoading = false
}: PreviouslySubscribedStateProps) {
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
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
          <h3 className="font-medium text-blue-900">Welcome Back!</h3>
        </div>

        <div className="mb-4">
          <p className="text-blue-800 text-sm mb-2">You previously had a {prevTier.name} subscription.</p>
          {lastActiveDate && <p className="text-blue-700 text-sm mb-2">Last active: {lastActiveDate}</p>}
          <p className="text-blue-700 text-sm">Resubscribe to continue your learning journey with premium features.</p>
        </div>

        <div className="bg-white rounded p-3 mb-4">
          <h4 className="font-medium text-text-primary mb-2">What You&apos;re Missing</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            {previousTier === "premium" ? (
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
      </div>

      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <h3 className="font-medium text-text-primary mb-3">Choose Your Plan</h3>
        <p className="text-text-secondary text-sm mb-4">Resubscribe to your previous plan or try a different tier.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border-secondary rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-text-primary">Premium</h4>
              {previousTier === "premium" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Previous Plan</span>
              )}
            </div>
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
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-text-primary">Max</h4>
              {previousTier === "max" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Previous Plan</span>
              )}
            </div>
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
              {previousTier === "max" ? "Restore Max" : "Upgrade to Max"}
            </SubscriptionButton>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-4">
        <h3 className="font-medium text-green-900 mb-2">Instant Access</h3>
        <p className="text-sm text-green-800">
          Your subscription will be activated immediately after payment, and you&apos;ll regain access to all premium
          features right away.
        </p>
      </div>
    </div>
  );
}
