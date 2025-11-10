import NeverSubscribedState from "./states/NeverSubscribedState";
import ActivePremiumState from "./states/ActivePremiumState";
import ActiveMaxState from "./states/ActiveMaxState";
import CancellingScheduledState from "./states/CancellingScheduledState";
import PaymentFailedGraceState from "./states/PaymentFailedGraceState";
import PaymentFailedExpiredState from "./states/PaymentFailedExpiredState";
import PreviouslySubscribedState from "./states/PreviouslySubscribedState";
import IncompletePaymentState from "./states/IncompletePaymentState";
import IncompleteExpiredState from "./states/IncompleteExpiredState";

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

interface SubscriptionData {
  tier?: "premium" | "max";
  status?: "active" | "canceled" | "past_due" | "incomplete";
  nextBillingDate?: string;
  cancellationDate?: string;
  graceEndDate?: string;
  lastPaymentAttempt?: string;
  previousTier?: "premium" | "max";
  lastActiveDate?: string;
}

interface SubscriptionStateSwitchProps {
  subscriptionState: SubscriptionState;
  subscriptionData: SubscriptionData;
  isLoading?: boolean;
  onUpgradeToPremium: () => void;
  onUpgradeToMax: () => void;
  onDowngradeToPremium: () => void;
  onUpdatePayment: () => void;
  onCancel: () => void;
  onReactivate: () => void;
  onRetryPayment: () => void;
  onResubscribeToPremium: () => void;
  onResubscribeToMax: () => void;
  onCompletePayment: () => void;
  onTryPremiumAgain: () => void;
  onTryMaxAgain: () => void;
}

export default function SubscriptionStateSwitch({
  subscriptionState,
  subscriptionData,
  isLoading = false,
  onUpgradeToPremium,
  onUpgradeToMax,
  onDowngradeToPremium,
  onUpdatePayment,
  onCancel,
  onReactivate,
  onRetryPayment,
  onResubscribeToPremium,
  onResubscribeToMax,
  onCompletePayment,
  onTryPremiumAgain,
  onTryMaxAgain
}: SubscriptionStateSwitchProps) {
  switch (subscriptionState) {
    case "never_subscribed":
      return (
        <NeverSubscribedState
          onUpgradeToPremium={onUpgradeToPremium}
          onUpgradeToMax={onUpgradeToMax}
          isLoading={isLoading}
        />
      );

    case "active_premium":
      return (
        <ActivePremiumState
          nextBillingDate={subscriptionData.nextBillingDate}
          onUpgradeToMax={onUpgradeToMax}
          onUpdatePayment={onUpdatePayment}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      );

    case "active_max":
      return (
        <ActiveMaxState
          nextBillingDate={subscriptionData.nextBillingDate}
          onDowngradeToPremium={onDowngradeToPremium}
          onUpdatePayment={onUpdatePayment}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      );

    case "cancelling_scheduled":
      return (
        <CancellingScheduledState
          cancellationDate={subscriptionData.cancellationDate || "Unknown"}
          tier={subscriptionData.tier || "premium"}
          onReactivate={onReactivate}
          onUpdatePayment={onUpdatePayment}
          isLoading={isLoading}
        />
      );

    case "payment_failed_grace":
      return (
        <PaymentFailedGraceState
          tier={subscriptionData.tier || "premium"}
          graceEndDate={subscriptionData.graceEndDate || "Unknown"}
          lastPaymentAttempt={subscriptionData.lastPaymentAttempt}
          onUpdatePayment={onUpdatePayment}
          onRetryPayment={onRetryPayment}
          isLoading={isLoading}
        />
      );

    case "payment_failed_expired":
      return (
        <PaymentFailedExpiredState
          previousTier={subscriptionData.previousTier || "premium"}
          onResubscribeToPremium={onResubscribeToPremium}
          onResubscribeToMax={onResubscribeToMax}
          isLoading={isLoading}
        />
      );

    case "previously_subscribed":
      return (
        <PreviouslySubscribedState
          previousTier={subscriptionData.previousTier || "premium"}
          lastActiveDate={subscriptionData.lastActiveDate}
          onResubscribeToPremium={onResubscribeToPremium}
          onResubscribeToMax={onResubscribeToMax}
          isLoading={isLoading}
        />
      );

    case "incomplete_payment":
      return (
        <IncompletePaymentState
          tier={subscriptionData.tier || "premium"}
          onCompletePayment={onCompletePayment}
          isLoading={isLoading}
        />
      );

    case "incomplete_expired":
      return (
        <IncompleteExpiredState
          onTryPremiumAgain={onTryPremiumAgain}
          onTryMaxAgain={onTryMaxAgain}
          isLoading={isLoading}
        />
      );

    default:
      // Fallback to never subscribed state for unknown states
      return (
        <NeverSubscribedState
          onUpgradeToPremium={onUpgradeToPremium}
          onUpgradeToMax={onUpgradeToMax}
          isLoading={isLoading}
        />
      );
  }
}
