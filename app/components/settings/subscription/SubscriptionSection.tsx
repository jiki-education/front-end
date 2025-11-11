import { useState, lazy, Suspense } from "react";
import { showConfirmation } from "@/lib/modal";
import type { MembershipTier } from "@/lib/pricing";
import toast from "react-hot-toast";
import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import SubscriptionStateSwitch from "./SubscriptionStateSwitch";
import { getSubscriptionState } from "./utils";
import * as handlers from "./handlers";
import type { User, SubscriptionData } from "./types";

// Lazy load CheckoutModal since it's only shown when needed
const CheckoutModal = lazy(() => import("./CheckoutModal"));

interface SubscriptionSectionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  selectedTier: MembershipTier | null;
  setSelectedTier: (tier: MembershipTier | null) => void;
  clientSecret: string | null;
  setClientSecret: (secret: string | null) => void;
  className?: string;
}

export default function SubscriptionSection({
  user,
  refreshUser,
  selectedTier,
  setSelectedTier,
  clientSecret,
  setClientSecret,
  className = ""
}: SubscriptionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  // If no user, show loading state
  if (!user) {
    return (
      <SettingsCard
        title="Subscription"
        description="Manage your subscription plan and billing details"
        className={className}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-link-primary"></div>
          <span className="ml-3 text-text-secondary">Loading subscription data...</span>
        </div>
      </SettingsCard>
    );
  }

  // Get real subscription state from user data
  const subscriptionState = getSubscriptionState(user);
  const currentTier = user.membership_type;
  const subscriptionStatus = user.subscription_status;

  // Create subscription data from real user data
  const subscriptionData: SubscriptionData = {
    tier: user.membership_type,
    status: user.subscription_status,
    // Note: These additional fields would come from the API in a real implementation
    // For now, we'll use basic data from the user object
    nextBillingDate: user.subscription?.subscription_valid_until,
    graceEndDate: user.subscription?.grace_period_ends_at || undefined,
    previousTier: undefined // This would need to come from API
  };

  // Helper function to handle async operations with loading state
  const handleAsyncOperation = async (operation: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await operation();
    } catch (error) {
      console.error("Operation failed:", error);
      // Error handling is done in individual handlers
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers for all subscription actions using real Stripe integration
  const handleUpgradeToPremium = () =>
    handleAsyncOperation(async () => {
      if (user.membership_type === "standard") {
        // New subscription - use checkout flow
        await handlers.handleSubscribe({
          tier: "premium",
          userEmail: user.email,
          setSelectedTier,
          setClientSecret
        });
      } else if (user.membership_type === "premium") {
        // Already on premium - this shouldn't happen if UI is correct
        toast.error("Already on Premium tier");
      } else {
        // Max tier users trying to "upgrade" to premium is invalid
        toast.error("Cannot downgrade from Max to Premium tier");
      }
    });

  const handleUpgradeToMax = () =>
    handleAsyncOperation(async () => {
      if (user.membership_type === "standard") {
        // New subscription - use checkout flow
        await handlers.handleSubscribe({
          tier: "max",
          userEmail: user.email,
          setSelectedTier,
          setClientSecret
        });
      } else {
        // Existing subscription - upgrade
        await handlers.handleUpgradeToMax(refreshUser);
      }
    });

  const handleDowngradeToPremium = () => {
    showConfirmation({
      title: "Downgrade to Premium",
      message:
        "You'll lose access to Max-exclusive features like AI-powered hints and priority support, but keep all Premium features. Changes take effect at your next billing cycle.",
      variant: "default",
      onConfirm: () => {
        void handleAsyncOperation(async () => {
          await handlers.handleDowngradeToPremium(refreshUser);
        });
      },
      onCancel: () => {
        // User cancelled the action
      }
    });
  };

  const handleUpdatePayment = () =>
    handleAsyncOperation(async () => {
      await handlers.handleOpenPortal();
    });

  const handleCancel = () => {
    showConfirmation({
      title: "Cancel Subscription",
      message:
        "Are you sure you want to cancel your subscription? You'll continue to have access until your current billing period ends, but you won't be charged again.",
      variant: "danger",
      onConfirm: () => {
        void handleAsyncOperation(async () => {
          await handlers.handleCancelSubscription(refreshUser);
        });
      },
      onCancel: () => {
        // User cancelled the action - no toast needed
      }
    });
  };

  const handleReactivate = () =>
    handleAsyncOperation(async () => {
      await handlers.handleReactivateSubscription(refreshUser);
    });

  const handleRetryPayment = () =>
    handleAsyncOperation(async () => {
      await handlers.handleRetryPayment(refreshUser);
    });

  const handleResubscribeToPremium = () =>
    handleAsyncOperation(async () => {
      await handlers.handleSubscribe({
        tier: "premium",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  const handleResubscribeToMax = () =>
    handleAsyncOperation(async () => {
      await handlers.handleSubscribe({
        tier: "max",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  const handleCompletePayment = () =>
    handleAsyncOperation(async () => {
      // For incomplete payment, direct to portal to complete setup
      await handlers.handleOpenPortal();
    });

  const handleTryPremiumAgain = () =>
    handleAsyncOperation(async () => {
      await handlers.handleSubscribe({
        tier: "premium",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  const handleTryMaxAgain = () =>
    handleAsyncOperation(async () => {
      await handlers.handleSubscribe({
        tier: "max",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  // Checkout flow handlers
  const handleCheckoutSuccess = async () => {
    setClientSecret(null);
    setSelectedTier(null);
    // Refresh user data to get updated subscription status
    try {
      await refreshUser();
      toast.success("Subscription activated successfully!");
    } catch (error) {
      toast.error("Subscription activated but failed to refresh user data. Please refresh the page.");
      console.error("Failed to refresh user after checkout:", error);
    }
  };

  const handleCheckoutCancel = () => {
    setClientSecret(null);
    setSelectedTier(null);
  };

  return (
    <>
      <SettingsCard
        title="Subscription"
        description="Manage your subscription plan and billing details"
        className={className}
      >
        <SubscriptionStatus tier={currentTier} status={subscriptionStatus} />

        <SubscriptionStateSwitch
          subscriptionState={subscriptionState}
          subscriptionData={subscriptionData}
          isLoading={isLoading}
          onUpgradeToPremium={handleUpgradeToPremium}
          onUpgradeToMax={handleUpgradeToMax}
          onDowngradeToPremium={handleDowngradeToPremium}
          onUpdatePayment={handleUpdatePayment}
          onCancel={handleCancel}
          onReactivate={handleReactivate}
          onRetryPayment={handleRetryPayment}
          onResubscribeToPremium={handleResubscribeToPremium}
          onResubscribeToMax={handleResubscribeToMax}
          onCompletePayment={handleCompletePayment}
          onTryPremiumAgain={handleTryPremiumAgain}
          onTryMaxAgain={handleTryMaxAgain}
        />
      </SettingsCard>

      {/* Checkout Modal */}
      {clientSecret && selectedTier && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-center">Loading checkout...</p>
              </div>
            </div>
          }
        >
          <CheckoutModal
            clientSecret={clientSecret}
            selectedTier={selectedTier}
            onSuccess={handleCheckoutSuccess}
            onCancel={handleCheckoutCancel}
            returnUrl={`${window.location.origin}/settings?success=true`}
          />
        </Suspense>
      )}
    </>
  );
}
