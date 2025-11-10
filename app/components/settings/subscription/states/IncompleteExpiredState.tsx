import SubscriptionButton from "../../ui/SubscriptionButton";

interface IncompleteExpiredStateProps {
  onTryPremiumAgain: () => void;
  onTryMaxAgain: () => void;
  isLoading?: boolean;
}

export default function IncompleteExpiredState({
  onTryPremiumAgain,
  onTryMaxAgain,
  isLoading = false
}: IncompleteExpiredStateProps) {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
          <h3 className="font-medium text-red-900">Payment Setup Expired</h3>
        </div>

        <div className="mb-4">
          <p className="text-red-800 text-sm mb-2">Your previous payment setup attempt has expired.</p>
          <p className="text-red-700 text-sm">Start fresh with a new subscription to access premium features.</p>
        </div>
      </div>

      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <h3 className="font-medium text-text-primary mb-3">Try Again</h3>
        <p className="text-text-secondary text-sm mb-4">
          Choose your preferred plan to start the subscription process with a fresh payment setup.
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
            <SubscriptionButton variant="secondary" onClick={onTryPremiumAgain} loading={isLoading} className="w-full">
              Try Again with Premium
            </SubscriptionButton>
          </div>

          <div className="border border-border-secondary rounded p-4 relative">
            <div className="absolute -top-2 left-4">
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Most Popular</span>
            </div>
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
            <SubscriptionButton variant="primary" onClick={onTryMaxAgain} loading={isLoading} className="w-full">
              Try Again with Max
            </SubscriptionButton>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-800 mb-2">
          If you&apos;re experiencing issues with payment setup, our support team can help:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Check your payment method details</li>
          <li>• Verify billing address information</li>
          <li>• Contact your bank if needed</li>
          <li>• Reach out to our support team</li>
        </ul>
      </div>
    </div>
  );
}
