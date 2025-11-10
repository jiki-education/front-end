import NeverSubscribedState from "./states/NeverSubscribedState";
import ActivePremiumState from "./states/ActivePremiumState";
import ActiveMaxState from "./states/ActiveMaxState";
import CancellingScheduledState from "./states/CancellingScheduledState";
import PaymentFailedGraceState from "./states/PaymentFailedGraceState";
import PaymentFailedExpiredState from "./states/PaymentFailedExpiredState";
import PreviouslySubscribedState from "./states/PreviouslySubscribedState";
import IncompletePaymentState from "./states/IncompletePaymentState";
import IncompleteExpiredState from "./states/IncompleteExpiredState";
import type { SubscriptionState, SubscriptionData, SubscriptionActions } from "./types";

interface SubscriptionStateSwitchProps {
  subscriptionState: SubscriptionState;
  subscriptionData: SubscriptionData;
  isLoading?: boolean;
  onUpgradeToPremium: SubscriptionActions["onUpgradeToPremium"];
  onUpgradeToMax: SubscriptionActions["onUpgradeToMax"];
  onDowngradeToPremium: SubscriptionActions["onDowngradeToPremium"];
  onUpdatePayment: SubscriptionActions["onUpdatePayment"];
  onCancel: SubscriptionActions["onCancel"];
  onReactivate: SubscriptionActions["onReactivate"];
  onRetryPayment: SubscriptionActions["onRetryPayment"];
  onResubscribeToPremium: SubscriptionActions["onResubscribeToPremium"];
  onResubscribeToMax: SubscriptionActions["onResubscribeToMax"];
  onCompletePayment: SubscriptionActions["onCompletePayment"];
  onTryPremiumAgain: SubscriptionActions["onTryPremiumAgain"];
  onTryMaxAgain: SubscriptionActions["onTryMaxAgain"];
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
          tier={subscriptionData.tier && subscriptionData.tier !== "free" ? subscriptionData.tier : "premium"}
          onReactivate={onReactivate}
          onUpdatePayment={onUpdatePayment}
          isLoading={isLoading}
        />
      );

    case "payment_failed_grace":
      return (
        <PaymentFailedGraceState
          tier={subscriptionData.tier && subscriptionData.tier !== "free" ? subscriptionData.tier : "premium"}
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
          tier={subscriptionData.tier && subscriptionData.tier !== "free" ? subscriptionData.tier : "premium"}
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
