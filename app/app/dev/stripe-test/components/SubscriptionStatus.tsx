/**
 * Stripe Test Subscription Status
 * Uses the advanced SubscriptionStatus component with dev-specific wrapper
 */

import type { User } from "@/types/auth";
import AdvancedSubscriptionStatus from "@/components/settings/ui/SubscriptionStatus";

interface SubscriptionStatusProps {
  user: User;
}

export function SubscriptionStatus({ user }: SubscriptionStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
      </div>

      {/* Use the advanced subscription status component */}
      <AdvancedSubscriptionStatus
        tier={user.membership_type}
        status={user.subscription_status}
        nextBillingDate={
          user.subscription?.subscription_valid_until
            ? new Date(user.subscription.subscription_valid_until).toLocaleDateString()
            : null
        }
        className="!bg-transparent !border-0 !p-0" // Override styling for dev page
      />

      {/* Additional dev-specific info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="font-medium mb-2">Debug Information</h3>
        <dl className="space-y-1 text-sm">
          <div>
            <dt className="inline font-medium">Raw Status:</dt>
            <dd className="inline ml-2">{user.subscription_status}</dd>
          </div>
          <div>
            <dt className="inline font-medium">In Grace Period:</dt>
            <dd className="inline ml-2">{user.subscription?.in_grace_period ? "Yes" : "No"}</dd>
          </div>
          {user.subscription?.grace_period_ends_at && (
            <div>
              <dt className="inline font-medium">Grace Period Ends:</dt>
              <dd className="inline ml-2">{new Date(user.subscription.grace_period_ends_at).toLocaleDateString()}</dd>
            </div>
          )}
          <div>
            <dt className="inline font-medium">Subscription Object:</dt>
            <dd className="inline ml-2">{user.subscription ? "Present" : "Null"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
