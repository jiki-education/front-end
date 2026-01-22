import { lazy, Suspense } from "react";
import type { SubscriptionState, SubscriptionData, SubscriptionActions } from "./types";

// Lazy load subscription state components
const NeverSubscribedState = lazy(() => import("./states/NeverSubscribedState"));
const ActivePremiumState = lazy(() => import("./states/ActivePremiumState"));
const CancellingScheduledState = lazy(() => import("./states/CancellingScheduledState"));
const PaymentFailedGraceState = lazy(() => import("./states/PaymentFailedGraceState"));
const PaymentFailedExpiredState = lazy(() => import("./states/PaymentFailedExpiredState"));
const PreviouslySubscribedState = lazy(() => import("./states/PreviouslySubscribedState"));
const IncompletePaymentState = lazy(() => import("./states/IncompletePaymentState"));
const IncompleteExpiredState = lazy(() => import("./states/IncompleteExpiredState"));

// Loading fallback component
function SubscriptionStateLoader() {
  return (
    <div className="bg-bg-primary p-4 rounded border border-border-secondary">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}

interface SubscriptionStateSwitchProps {
  subscriptionState: SubscriptionState;
  subscriptionData: SubscriptionData;
  isLoading?: boolean;
  onUpgradeToPremium: SubscriptionActions["onUpgradeToPremium"];
  onUpdatePayment: SubscriptionActions["onUpdatePayment"];
  onCancel: SubscriptionActions["onCancel"];
  onReactivate: SubscriptionActions["onReactivate"];
  onRetryPayment: SubscriptionActions["onRetryPayment"];
  onResubscribeToPremium: SubscriptionActions["onResubscribeToPremium"];
  onCompletePayment: SubscriptionActions["onCompletePayment"];
  onTryPremiumAgain: SubscriptionActions["onTryPremiumAgain"];
}

export default function SubscriptionStateSwitch({
  subscriptionState,
  subscriptionData,
  isLoading = false,
  onUpgradeToPremium,
  onUpdatePayment,
  onCancel,
  onReactivate,
  onRetryPayment,
  onResubscribeToPremium,
  onCompletePayment,
  onTryPremiumAgain
}: SubscriptionStateSwitchProps) {
  const renderSubscriptionState = () => {
    switch (subscriptionState) {
      case "never_subscribed":
        return <NeverSubscribedState onUpgradeToPremium={onUpgradeToPremium} isLoading={isLoading} />;

      case "active_premium":
        return (
          <ActivePremiumState
            nextBillingDate={subscriptionData.nextBillingDate}
            onUpdatePayment={onUpdatePayment}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        );

      case "cancelling_scheduled":
        return (
          <CancellingScheduledState
            cancellationDate={subscriptionData.cancellationDate || "Unknown"}
            tier={subscriptionData.tier && subscriptionData.tier !== "standard" ? subscriptionData.tier : "premium"}
            onReactivate={onReactivate}
            onUpdatePayment={onUpdatePayment}
            isLoading={isLoading}
          />
        );

      case "payment_failed_grace":
        return (
          <PaymentFailedGraceState
            tier={subscriptionData.tier && subscriptionData.tier !== "standard" ? subscriptionData.tier : "premium"}
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
            isLoading={isLoading}
          />
        );

      case "previously_subscribed":
        return (
          <PreviouslySubscribedState
            previousTier={subscriptionData.previousTier || "premium"}
            lastActiveDate={subscriptionData.lastActiveDate}
            onResubscribeToPremium={onResubscribeToPremium}
            isLoading={isLoading}
          />
        );

      case "incomplete_payment":
        return (
          <IncompletePaymentState
            tier={subscriptionData.tier && subscriptionData.tier !== "standard" ? subscriptionData.tier : "premium"}
            onCompletePayment={onCompletePayment}
            isLoading={isLoading}
          />
        );

      case "incomplete_expired":
        return <IncompleteExpiredState onTryPremiumAgain={onTryPremiumAgain} isLoading={isLoading} />;

      default:
        return <NeverSubscribedState onUpgradeToPremium={onUpgradeToPremium} isLoading={isLoading} />;
    }
  };

  return <Suspense fallback={<SubscriptionStateLoader />}>{renderSubscriptionState()}</Suspense>;
}
