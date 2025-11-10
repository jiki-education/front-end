import SubscriptionButton from "../../ui/SubscriptionButton";

interface PaymentFailedGraceStateProps {
  tier: "premium" | "max";
  graceEndDate: string;
  lastPaymentAttempt?: string;
  onUpdatePayment: () => void;
  onRetryPayment: () => void;
  isLoading?: boolean;
}

export default function PaymentFailedGraceState({
  tier,
  graceEndDate,
  lastPaymentAttempt,
  onUpdatePayment,
  onRetryPayment,
  isLoading = false
}: PaymentFailedGraceStateProps) {
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

  const currentTier = tierInfo[tier];

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
          <h3 className="font-medium text-red-900">Payment Failed - Grace Period</h3>
        </div>

        <div className="mb-4">
          <p className="text-red-800 text-sm mb-2">
            Your payment for {currentTier.name} ({currentTier.price}/month) could not be processed.
          </p>
          {lastPaymentAttempt && <p className="text-red-700 text-sm mb-2">Last attempt: {lastPaymentAttempt}</p>}
          <p className="text-red-700 text-sm font-medium">
            Your subscription will be suspended on <strong>{graceEndDate}</strong> unless payment is resolved.
          </p>
        </div>

        <div className="bg-white rounded p-3 mb-4">
          <h4 className="font-medium text-text-primary mb-2">You still have access until {graceEndDate}</h4>
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
          <SubscriptionButton variant="primary" onClick={onUpdatePayment} loading={isLoading} className="flex-1">
            Update Payment Method
          </SubscriptionButton>
          <SubscriptionButton variant="secondary" onClick={onRetryPayment} loading={isLoading} className="flex-1">
            Try Payment Again
          </SubscriptionButton>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <h3 className="font-medium text-yellow-900 mb-2">Common Payment Issues</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Expired credit card</li>
          <li>• Insufficient funds</li>
          <li>• Card blocked by bank</li>
          <li>• Billing address mismatch</li>
        </ul>
        <p className="text-sm text-yellow-700 mt-2">
          Contact your bank if the issue persists after updating payment details.
        </p>
      </div>
    </div>
  );
}
