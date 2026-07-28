/**
 * Stripe Test Subscription Status
 * Uses the advanced SubscriptionStatus component with dev-specific wrapper
 */

import type { User } from "@/types/auth";
import AdvancedSubscriptionStatus from "@/components/settings/ui/SubscriptionStatus";
import styles from "./SubscriptionStatus.module.css";

interface SubscriptionStatusProps {
  user: User;
}

export function SubscriptionStatus({ user }: SubscriptionStatusProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Subscription Status</h2>
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
        className={styles.statusOverride} // Override styling for dev page
      />

      {/* Additional dev-specific info */}
      <div className={styles.debug}>
        <h3 className={styles.debugTitle}>Debug Information</h3>
        <dl className={styles.debugList}>
          <div>
            <dt className={styles.term}>Raw Status:</dt>
            <dd className={styles.value}>{user.subscription_status}</dd>
          </div>
          <div>
            <dt className={styles.term}>In Grace Period:</dt>
            <dd className={styles.value}>{user.subscription?.in_grace_period ? "Yes" : "No"}</dd>
          </div>
          {user.subscription?.grace_period_ends_at && (
            <div>
              <dt className={styles.term}>Grace Period Ends:</dt>
              <dd className={styles.value}>{new Date(user.subscription.grace_period_ends_at).toLocaleDateString()}</dd>
            </div>
          )}
          <div>
            <dt className={styles.term}>Subscription Object:</dt>
            <dd className={styles.value}>{user.subscription ? "Present" : "Null"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
