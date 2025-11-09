import type { MembershipTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import * as handlers from "../handlers";
import {
  NeverSubscribedActions,
  IncompletePaymentActions,
  ActivePremiumActions,
  ActiveMaxActions,
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
  | "active_max"
  | "cancelling_scheduled"
  | "payment_failed_grace"
  | "payment_failed_expired"
  | "previously_subscribed"
  | "incomplete_expired";

interface SubscriptionActionsSwitchProps {
  user: User;
  refreshUser: () => Promise<void>;
  setSelectedTier: (tier: MembershipTier) => void;
  setClientSecret: (secret: string) => void;
}

export function SubscriptionActionsSwitch({
  user,
  refreshUser,
  setSelectedTier,
  setClientSecret
}: SubscriptionActionsSwitchProps) {
  const state = getSubscriptionState(user);

  switch (state) {
    case "never_subscribed":
      return (
        <NeverSubscribedActions
          onSubscribe={(tier) =>
            handlers.handleSubscribe({ tier, userEmail: user.email, setSelectedTier, setClientSecret })
          }
        />
      );
    case "incomplete_payment":
      return <IncompletePaymentActions />;
    case "active_premium":
      return (
        <ActivePremiumActions
          onUpgradeToMax={() => handlers.handleUpgradeToMax(refreshUser)}
          onCancel={() => handlers.handleCancelSubscription(refreshUser)}
          onOpenPortal={handlers.handleOpenPortal}
        />
      );
    case "active_max":
      return (
        <ActiveMaxActions
          onDowngradeToPremium={() => handlers.handleDowngradeToPremium(refreshUser)}
          onCancel={() => handlers.handleCancelSubscription(refreshUser)}
          onOpenPortal={handlers.handleOpenPortal}
        />
      );
    case "cancelling_scheduled":
      return <CancellingScheduledActions onReactivate={() => handlers.handleReactivateSubscription(refreshUser)} />;
    case "payment_failed_grace":
      return (
        <PaymentFailedGracePeriodActions
          onCancel={() => handlers.handleCancelSubscription(refreshUser)}
          onOpenPortal={handlers.handleOpenPortal}
        />
      );
    case "payment_failed_expired":
      return (
        <PaymentFailedGraceExpiredActions
          onSubscribe={(tier) =>
            handlers.handleSubscribe({ tier, userEmail: user.email, setSelectedTier, setClientSecret })
          }
          onOpenPortal={handlers.handleOpenPortal}
        />
      );
    case "previously_subscribed":
      return (
        <PreviouslySubscribedActions
          onSubscribe={(tier) =>
            handlers.handleSubscribe({ tier, userEmail: user.email, setSelectedTier, setClientSecret })
          }
        />
      );
    case "incomplete_expired":
      return (
        <IncompleteExpiredActions
          onSubscribe={(tier) =>
            handlers.handleSubscribe({ tier, userEmail: user.email, setSelectedTier, setClientSecret })
          }
        />
      );
    default:
      return (
        <NeverSubscribedActions
          onSubscribe={(tier) =>
            handlers.handleSubscribe({ tier, userEmail: user.email, setSelectedTier, setClientSecret })
          }
        />
      );
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
    if (membership_type === "max") {
      return "active_max";
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
