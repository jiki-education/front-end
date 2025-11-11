import type { User } from "@/types/auth";

interface SubscriptionStatusProps {
  user: User;
}

export function SubscriptionStatus({ user }: SubscriptionStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
      </div>

      <dl className="space-y-2">
        <div>
          <dt className="inline font-medium">Tier:</dt>
          <dd className="inline ml-2">{user.membership_type}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Status:</dt>
          <dd className="inline ml-2">
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(user.subscription_status)}`}>
              {user.subscription_status}
            </span>
          </dd>
        </div>
        <div>
          <dt className="inline font-medium">Subscription Valid Until:</dt>
          <dd className="inline ml-2">
            {user.subscription?.subscription_valid_until
              ? new Date(user.subscription.subscription_valid_until).toLocaleDateString()
              : "N/A"}
          </dd>
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
      </dl>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "cancelling":
      return "bg-orange-100 text-orange-800";
    case "canceled":
      return "bg-gray-100 text-gray-800";
    case "incomplete":
      return "bg-yellow-100 text-yellow-800";
    case "incomplete_expired":
      return "bg-red-100 text-red-800";
    case "past_due":
    case "unpaid":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
