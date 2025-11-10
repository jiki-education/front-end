import SubscriptionButton from "../../ui/SubscriptionButton";

interface IncompletePaymentStateProps {
  tier: "premium" | "max";
  onCompletePayment: () => void;
  isLoading?: boolean;
}

export default function IncompletePaymentState({
  tier,
  onCompletePayment,
  isLoading = false
}: IncompletePaymentStateProps) {
  const tierInfo = {
    premium: {
      name: "Premium",
      price: "$3",
      features: ["Advanced exercises", "Progress tracking", "Community access"]
    },
    max: {
      name: "Max",
      price: "$9",
      features: ["All Premium features", "AI-powered hints", "Priority support", "Exclusive content"]
    }
  };

  const currentTier = tierInfo[tier];

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
          <h3 className="font-medium text-yellow-900">Payment Setup Incomplete</h3>
        </div>

        <div className="mb-4">
          <p className="text-yellow-800 text-sm mb-2">
            Your {currentTier.name} subscription is pending payment completion.
          </p>
          <p className="text-yellow-700 text-sm">
            Complete your payment setup to activate your subscription and access all features.
          </p>
        </div>

        <div className="bg-white rounded p-3 mb-4">
          <h4 className="font-medium text-text-primary mb-2">
            {currentTier.name} Plan - {currentTier.price}/month
          </h4>
          <ul className="text-sm text-text-secondary space-y-1">
            {currentTier.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>

        <SubscriptionButton
          variant="primary"
          onClick={onCompletePayment}
          loading={isLoading}
          className="w-full sm:w-auto"
        >
          Complete Payment Setup
        </SubscriptionButton>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-medium text-blue-900 mb-2">What&apos;s Next?</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Complete your payment information</li>
          <li>2. Your subscription will be activated immediately</li>
          <li>3. Start accessing {currentTier.name} features</li>
        </ol>
      </div>

      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <h3 className="font-medium text-text-primary mb-2">Current Access (Free Plan)</h3>
        <p className="text-text-secondary text-sm mb-2">Until payment is completed, you have access to:</p>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Basic exercises only</li>
          <li>• Limited progress tracking</li>
          <li>• No premium features</li>
        </ul>
      </div>
    </div>
  );
}
