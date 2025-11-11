import type { MembershipTier, SubscriptionStatus } from "../subscription/types";

interface SubscriptionStatusProps {
  tier: MembershipTier;
  status?: SubscriptionStatus;
  nextBillingDate?: string;
  className?: string;
}

export default function SubscriptionStatus({
  tier,
  status = "active",
  nextBillingDate,
  className = ""
}: SubscriptionStatusProps) {
  const tierConfig = {
    standard: {
      name: "Standard Plan",
      color: "text-text-secondary",
      bgColor: "bg-gray-100",
      description: "Basic features included"
    },
    premium: {
      name: "Premium Plan",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      description: "$3/month"
    },
    max: {
      name: "Max Plan",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      description: "$9/month"
    }
  };

  const statusConfig = {
    active: {
      text: "Active",
      color: "text-green-700",
      bgColor: "bg-green-50"
    },
    canceled: {
      text: "Canceled",
      color: "text-orange-700",
      bgColor: "bg-orange-50"
    },
    payment_failed: {
      text: "Payment Failed",
      color: "text-red-700",
      bgColor: "bg-red-50"
    },
    cancelling: {
      text: "Cancelling",
      color: "text-orange-700",
      bgColor: "bg-orange-50"
    },
    incomplete: {
      text: "Incomplete",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50"
    },
    never_subscribed: {
      text: "Not Subscribed",
      color: "text-gray-700",
      bgColor: "bg-gray-50"
    }
  };

  const tierInfo = tierConfig[tier];
  const statusInfo = statusConfig[status];

  return (
    <div
      className={`p-4 bg-bg-primary rounded border border-border-secondary ${className}`}
      role="region"
      aria-label="Current subscription status"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${tierInfo.bgColor} ${tierInfo.color}`}
            role="status"
            aria-label={`Current plan: ${tierInfo.name}`}
          >
            {tierInfo.name}
          </div>
          {tier !== "standard" && (
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
              role="status"
              aria-label={`Subscription status: ${statusInfo.text}`}
            >
              {statusInfo.text}
            </div>
          )}
        </div>
      </div>

      <div className="text-text-secondary text-sm">
        <p>{tierInfo.description}</p>
        {nextBillingDate && status === "active" && (
          <p className="mt-1">
            <span className="sr-only">Billing information: </span>
            Next billing: {nextBillingDate}
          </p>
        )}
        {status === "canceled" && (
          <p className="mt-1">
            <span className="sr-only">Cancellation notice: </span>
            Service continues until period end
          </p>
        )}
        {status === "payment_failed" && (
          <p className="mt-1">
            <span className="sr-only">Payment issue: </span>
            Payment failed - please update payment method
          </p>
        )}
        {status === "cancelling" && (
          <p className="mt-1">
            <span className="sr-only">Cancellation in progress: </span>
            Cancellation scheduled - access until period end
          </p>
        )}
        {status === "incomplete" && (
          <p className="mt-1">
            <span className="sr-only">Payment setup: </span>
            Payment setup incomplete - please complete setup
          </p>
        )}
      </div>
    </div>
  );
}
