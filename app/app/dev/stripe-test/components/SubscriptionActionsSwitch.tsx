import type { User } from "@/types/auth";
import {
  NeverSubscribedActions,
  IncompletePaymentActions,
  ActivePremiumActions,
  CancellingScheduledActions,
  PaymentFailedGracePeriodActions,
  PaymentFailedGraceExpiredActions,
  PreviouslySubscribedActions,
  IncompleteExpiredActions
} from "../actions";

type SubscriptionState =
  | "never_subscribed"
  | "incomplete_payment"
  | "active_premium"
  | "cancelling_scheduled"
  | "payment_failed_grace"
  | "payment_failed_expired"
  | "previously_subscribed"
  | "incomplete_expired";

interface SubscriptionActionsSwitchProps {
  user: User;
  refreshUser: () => Promise<void>;
}

export function SubscriptionActionsSwitch({ user, refreshUser }: SubscriptionActionsSwitchProps) {
  const state = getSubscriptionState(user);

  switch (state) {
    case "never_subscribed":
      return <NeverSubscribedActions userEmail={user.email} />;
    case "incomplete_payment":
      return <IncompletePaymentActions />;
    case "active_premium":
      return <ActivePremiumActions refreshUser={refreshUser} />;
    case "cancelling_scheduled":
      return <CancellingScheduledActions refreshUser={refreshUser} />;
    case "payment_failed_grace":
      return <PaymentFailedGracePeriodActions refreshUser={refreshUser} />;
    case "payment_failed_expired":
      return <PaymentFailedGraceExpiredActions userEmail={user.email} />;
    case "previously_subscribed":
      return <PreviouslySubscribedActions userEmail={user.email} />;
    case "incomplete_expired":
      return <IncompleteExpiredActions userEmail={user.email} />;
    default:
      return <NeverSubscribedActions userEmail={user.email} />;
  }
}

function getSubscriptionState(user: User): SubscriptionState {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- API uses snake_case
  const { subscription_status, membership_type } = user;

  // Active subscriptions
  if (subscription_status === "active") {
    if (membership_type === "premium") {
      return "active_premium";
    }
  }

  // Cancelling (scheduled for end of period)
  if (subscription_status === "cancelling") {
    return "cancelling_scheduled";
  }

  // Payment failed with grace period
  if (user.subscription?.in_grace_period) {
    return "payment_failed_grace";
  }

  // Payment failed, grace period expired
  if (subscription_status === "payment_failed") {
    return "payment_failed_expired";
  }

  // Previously subscribed (canceled)
  if (subscription_status === "canceled") {
    return "previously_subscribed";
  }

  // Default fallback (includes incomplete, incomplete_expired, etc.)
  return "never_subscribed";
}
