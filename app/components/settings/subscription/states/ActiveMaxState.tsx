import SubscriptionButton from "../../ui/SubscriptionButton";

interface ActiveMaxStateProps {
  nextBillingDate?: string;
  onDowngradeToPremium: () => void;
  onUpdatePayment: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ActiveMaxState({
  nextBillingDate,
  onDowngradeToPremium,
  onUpdatePayment,
  onCancel,
  isLoading = false
}: ActiveMaxStateProps) {
  return (
    <div className="space-y-4">
      <div className="bg-bg-primary p-4 rounded border border-border-secondary">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-text-primary">Current Plan Benefits</h3>
          <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">Max Active</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <ul className="text-sm text-text-secondary space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              All Premium features
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              AI-powered hints
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Priority support
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Exclusive content
            </li>
          </ul>

          <div className="text-sm">
            <p className="text-text-secondary mb-1">Billing Information</p>
            <p className="font-medium text-text-primary">$9.00/month</p>
            {nextBillingDate && <p className="text-text-secondary">Next billing: {nextBillingDate}</p>}
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded p-4">
        <h3 className="font-medium text-orange-900 mb-2">Consider Downgrading?</h3>
        <p className="text-orange-700 text-sm mb-3">
          If you&apos;re not using all Max features, you can downgrade to Premium and save $6/month while keeping core
          benefits.
        </p>
        <SubscriptionButton
          variant="secondary"
          onClick={onDowngradeToPremium}
          loading={isLoading}
          className="w-full sm:w-auto"
        >
          Downgrade to Premium
        </SubscriptionButton>
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
