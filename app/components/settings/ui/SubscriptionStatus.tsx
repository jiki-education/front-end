import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";
import type { SubscriptionStatus } from "../subscription/types";
import styles from "../Settings.module.css";

interface SubscriptionStatusProps {
  tier: MembershipTier;
  status: SubscriptionStatus;
  nextBillingDate: string | null;
  className?: string;
}

export default function SubscriptionStatus({
  tier,
  status,
  nextBillingDate,
  className = ""
}: SubscriptionStatusProps) {
  const tierDetails = PRICING_TIERS[tier];
  const isActiveSubscription = tier !== "standard" && status === "active";

  // Status badge configuration
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
    incomplete_expired: {
      text: "Session Expired",
      color: "text-red-700",
      bgColor: "bg-red-50"
    },
    never_subscribed: {
      text: "Not Subscribed",
      color: "text-gray-700",
      bgColor: "bg-gray-50"
    }
  };

  const statusInfo = statusConfig[status];

  // Show Current Plan section for all users
  if (isActiveSubscription) {
    // Active paid subscription
    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItem} ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3>Current Plan</h3>
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
            role="status"
            aria-label={`Subscription status: ${statusInfo.text}`}
          >
            {statusInfo.text}
          </div>
        </div>
        <p>
          You are on the <span className={styles.gradientText}>Jiki {tierDetails.name}</span> plan
          at <strong>${tierDetails.price.toFixed(2)}/month</strong>
          {nextBillingDate && (
            <>. Your next billing date is <strong>{nextBillingDate}</strong></>
          )}
          .
        </p>
      </div>
    );
  }
  
  // Free plan (not subscribed)
  if (tier === "standard" || status === "never_subscribed") {
    return (
      <div className={`${styles.settingItem} ${className}`}>
        <h3>Current Plan</h3>
        <p style={{ marginBottom: 0 }}>
          You are on the <strong>Free</strong> plan. This gives you all the content plus Jiki AI to help you out for one exercise per month.
        </p>
      </div>
    );
  }

  // Show simple status for free tier or inactive subscriptions
  return (
    <div
      className={`p-4 bg-bg-primary rounded border border-border-secondary ${className}`}
      role="region"
      aria-label="Current subscription status"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tier === "standard" ? "bg-gray-100 text-text-secondary" : 
              tier === "premium" ? "bg-blue-50 text-blue-700" : 
              "bg-purple-50 text-purple-700"
            }`}
            role="status"
            aria-label={`Current plan: ${tierDetails.name} Plan`}
          >
            {tierDetails.name} Plan
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
        <p>
          {tier === "standard" 
            ? "Basic features included" 
            : `$${tierDetails.price}/month`}
        </p>
        
        {/* Status-specific messages */}
        {status === "canceled" && (
          <p className="mt-1">Service continues until period end</p>
        )}
        {status === "payment_failed" && (
          <p className="mt-1 text-red-600">Payment failed - please update payment method</p>
        )}
        {status === "cancelling" && (
          <p className="mt-1">Cancellation scheduled - access until period end</p>
        )}
        {status === "incomplete" && (
          <p className="mt-1 text-yellow-600">Payment setup incomplete - please complete setup</p>
        )}
        {status === "incomplete_expired" && (
          <p className="mt-1 text-red-600">Previous checkout session expired - please start a new subscription</p>
        )}
      </div>
    </div>
  );
}