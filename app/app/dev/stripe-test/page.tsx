"use client";

/**
 * Stripe Test Page
 * Development-only page for testing Stripe subscription flows
 */

import { useState, useEffect } from "react";
import { stripePromise } from "@/lib/stripe";
import { CheckoutProvider, useCheckout, PaymentElement, BillingAddressElement } from "@stripe/react-stripe-js/checkout";
import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  updateSubscription
} from "@/lib/api/subscriptions";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";
import { useAuthStore } from "@/stores/authStore";
import type { Subscription } from "@/types/subscription";
import { getPricingTier } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";
import toast from "react-hot-toast";

export default function StripeTestPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, login } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showGracePeriodTest, setShowGracePeriodTest] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [deletingStripeHistory, setDeletingStripeHistory] = useState(false);

  // Load subscription status on mount
  useEffect(() => {
    if (user) {
      void loadSubscriptionStatus();
    }
  }, [user]);

  // Check for success parameter from payment redirect
  useEffect(() => {
    // Only process if user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    const sessionId = extractAndClearSessionId();

    if (sessionId) {
      // Verify the checkout session and sync subscription
      async function verifyAndRefresh(id: string) {
        toast.loading("Verifying payment...");
        const result = await verifyPaymentSession(id);
        toast.dismiss();

        if (result.success) {
          toast.success("Payment verified! Refreshing subscription status...");
          await loadSubscriptionStatus();
        } else {
          toast.error(`Failed to verify payment: ${result.error}`);
        }
      }

      void verifyAndRefresh(sessionId);
    }
  }, [isAuthenticated, user]);

  const handleLogin = async () => {
    try {
      await login({
        email: "ihid@jiki.io",
        password: "password"
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Use subscription tier if available (most up-to-date), otherwise fall back to user's membership_type
  const currentTier = subscription?.tier || user?.membership_type;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Stripe Subscription Test</h1>

        <AuthSection
          isAuthenticated={isAuthenticated}
          user={user}
          isAuthLoading={isAuthLoading}
          authError={authError}
          onLogin={handleLogin}
        />

        {isAuthenticated && user && (
          <>
            {/* User Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current User</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="inline font-medium">Handle:</dt>
                  <dd className="inline ml-2">{user.handle}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Email:</dt>
                  <dd className="inline ml-2">{user.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Membership Tier:</dt>
                  <dd className="inline ml-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierBadgeColor(currentTier || "standard")}`}
                    >
                      {getPricingTier(currentTier || "standard").name}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Delete Stripe History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Reset Stripe Data</h2>
              <p className="text-sm text-gray-600 mb-4">
                Clear all Stripe subscription history for the current user. This will reset the user back to the free
                tier.
              </p>
              <button
                onClick={handleDeleteStripeHistory}
                disabled={deletingStripeHistory || !user.handle}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingStripeHistory ? "Deleting..." : "DELETE STRIPE HISTORY"}
              </button>
            </div>

            {/* Subscription Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Subscription Status</h2>
                <button
                  onClick={loadSubscriptionStatus}
                  disabled={loadingStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingStatus ? "Loading..." : "Refresh"}
                </button>
              </div>

              {subscription ? (
                <dl className="space-y-2">
                  <div>
                    <dt className="inline font-medium">Tier:</dt>
                    <dd className="inline ml-2">{subscription.tier}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Status:</dt>
                    <dd className="inline ml-2">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Current Period End:</dt>
                    <dd className="inline ml-2">{new Date(subscription.current_period_end).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Payment Failed:</dt>
                    <dd className="inline ml-2">{subscription.payment_failed ? "Yes" : "No"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">In Grace Period:</dt>
                    <dd className="inline ml-2">{subscription.in_grace_period ? "Yes" : "No"}</dd>
                  </div>
                  {subscription.grace_period_ends_at && (
                    <div>
                      <dt className="inline font-medium">Grace Period Ends:</dt>
                      <dd className="inline ml-2">
                        {new Date(subscription.grace_period_ends_at).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-gray-600">Click refresh to load subscription status</p>
              )}
            </div>

            {/* Grace Period Banner Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Grace Period Banner Test</h2>
              <button
                onClick={() => setShowGracePeriodTest(!showGracePeriodTest)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {showGracePeriodTest ? "Hide" : "Show"} Test Banner
              </button>

              {showGracePeriodTest && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Payment Failed - Action Required</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Your payment failed. You have 7 days remaining to update your payment method before losing
                          access to premium features.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Current Tier: {currentTier && getPricingTier(currentTier).name}
              </h2>

              {(() => {
                const state = getSubscriptionState(currentTier, subscription);
                switch (state) {
                  case "never_subscribed":
                    return <NeverSubscribedActions onUpgrade={handleUpgrade} />;
                  case "incomplete_payment":
                    return <IncompletePaymentActions />;
                  case "active_premium":
                    return <ActivePremiumActions onUpgradeToMax={handleUpgradeToMax} onOpenPortal={handleOpenPortal} />;
                  case "active_max":
                    return (
                      <ActiveMaxActions
                        onDowngradeToPremium={handleDowngradeToPremium}
                        onOpenPortal={handleOpenPortal}
                      />
                    );
                  case "cancelling_scheduled":
                    return <CancellingScheduledActions onOpenPortal={handleOpenPortal} />;
                  case "payment_failed_grace":
                    return <PaymentFailedGracePeriodActions onOpenPortal={handleOpenPortal} />;
                  case "payment_failed_expired":
                    return (
                      <PaymentFailedGraceExpiredActions onUpgrade={handleUpgrade} onOpenPortal={handleOpenPortal} />
                    );
                  case "previously_subscribed":
                    return <PreviouslySubscribedActions onUpgrade={handleUpgrade} />;
                  case "incomplete_expired":
                    return <IncompleteExpiredActions onUpgrade={handleUpgrade} />;
                  default:
                    return <NeverSubscribedActions onUpgrade={handleUpgrade} />;
                }
              })()}
            </div>

            {/* Payment Form with Checkout SDK */}
            {clientSecret && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Checkout - {selectedTier && getPricingTier(selectedTier).name}
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Test card:</strong> 4242 4242 4242 4242, any future expiry, any CVC
                  </p>
                </div>
                <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm tier={selectedTier!} onCancel={handleCheckoutCancel} />
                </CheckoutProvider>
              </div>
            )}

            {/* Customer Portal */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
              <p className="text-sm text-gray-600 mb-4">
                Open the Stripe Customer Portal to manage your subscription, update payment methods, view invoices, and
                cancel subscriptions.
              </p>
              <button
                onClick={handleOpenPortal}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Open Customer Portal
              </button>
            </div>

            {/* Testing Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Testing Notes</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • Use test card <code>4242 4242 4242 4242</code> for successful payments
                </li>
                <li>
                  • Use test card <code>4000 0000 0000 0341</code> to simulate declined payments
                </li>
                <li>• Any future expiry date and any 3-digit CVC will work</li>
                <li>• Downgrade functionality uses Customer Portal</li>
                <li>• Grace period is triggered by failed payment renewals</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );

  async function loadSubscriptionStatus() {
    setLoadingStatus(true);
    try {
      const response = await getSubscriptionStatus();
      setSubscription(response.subscription);
    } catch (error) {
      toast.error("Failed to load subscription status");
      console.error(error);
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handleUpgrade(tier: MembershipTier) {
    try {
      const returnUrl = createCheckoutReturnUrl(window.location.pathname);
      const response = await createCheckoutSession(tier, returnUrl);
      setSelectedTier(tier);
      setClientSecret(response.client_secret);
      toast.success("Checkout session created");
    } catch (error) {
      toast.error("Failed to create checkout session");
      console.error(error);
    }
  }

  function handleCheckoutCancel() {
    setClientSecret(null);
    setSelectedTier(null);
    toast("Checkout canceled");
  }

  async function handleOpenPortal() {
    try {
      const response = await createPortalSession();
      window.location.href = response.url;
    } catch (error) {
      toast.error("Failed to open customer portal");
      console.error(error);
    }
  }

  async function handleUpgradeToMax() {
    try {
      const response = await updateSubscription("max");
      setSubscription((prev) => (prev ? { ...prev, tier: response.tier } : null));
      toast.success("Successfully upgraded to Max!");
      await loadSubscriptionStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upgrade subscription";
      toast.error(errorMessage);
      console.error(error);
    }
  }

  async function handleDowngradeToPremium() {
    try {
      const response = await updateSubscription("premium");
      setSubscription((prev) => (prev ? { ...prev, tier: response.tier } : null));
      toast.success("Successfully downgraded to Premium!");
      await loadSubscriptionStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to downgrade subscription";
      toast.error(errorMessage);
      console.error(error);
    }
  }

  async function handleDeleteStripeHistory() {
    if (!user?.handle) {
      toast.error("User handle not available");
      return;
    }

    setDeletingStripeHistory(true);
    try {
      const response = await fetch(`http://localhost:3060/dev/users/${user.handle}/clear_stripe_history`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Failed to delete Stripe history: ${response.statusText}`);
      }

      toast.success("Stripe history deleted");
      await loadSubscriptionStatus();
    } catch (error) {
      toast.error("Failed to delete Stripe history");
      console.error(error);
    } finally {
      setDeletingStripeHistory(false);
    }
  }
}

// Subscription state type
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

// Helper to determine subscription state
function getSubscriptionState(
  currentTier: MembershipTier | undefined,
  subscription: Subscription | null
): SubscriptionState {
  // Never had a subscription
  if (!subscription && currentTier === "standard") {
    return "never_subscribed";
  }

  if (subscription) {
    // Incomplete states
    if (subscription.status === "incomplete_expired") {
      return "incomplete_expired";
    }
    if (subscription.status === "incomplete") {
      return "incomplete_payment";
    }

    // Active subscriptions
    if (subscription.status === "active") {
      // Check if cancelling
      if (subscription.cancel_at_period_end) {
        return "cancelling_scheduled";
      }
      // Check tier
      if (subscription.tier === "premium") {
        return "active_premium";
      }
      if (subscription.tier === "max") {
        return "active_max";
      }
    }

    // Payment failed states
    if (subscription.payment_failed) {
      if (subscription.in_grace_period) {
        return "payment_failed_grace";
      }
      return "payment_failed_expired";
    }

    // Previously subscribed (canceled, expired, etc.)
    if (subscription.status === "canceled" || subscription.status === "past_due") {
      return "previously_subscribed";
    }
  }

  // Fallback: previously subscribed if on standard but has no active subscription
  if (currentTier === "standard") {
    return "previously_subscribed";
  }

  // Default fallback
  return "never_subscribed";
}

// Subscription Action Components
function NeverSubscribedActions({ onUpgrade }: { onUpgrade: (tier: MembershipTier) => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Start Your Subscription</h3>
        <p className="text-sm text-gray-600">Choose a plan to unlock premium features</p>
      </div>

      <button
        onClick={() => onUpgrade("premium")}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Subscribe to Premium - $3/month
      </button>

      <button
        onClick={() => onUpgrade("max")}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Subscribe to Max - $10/month
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">No active subscription</p>
      </div>
    </div>
  );
}

function IncompletePaymentActions() {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-yellow-700">Payment In Progress</h3>
        <p className="text-sm text-gray-600">Your checkout session is awaiting payment confirmation</p>
      </div>

      <button
        disabled
        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded opacity-50 cursor-not-allowed"
        title="Not implemented yet"
      >
        Complete Payment
      </button>

      <button
        disabled
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded opacity-50 cursor-not-allowed"
        title="Not implemented yet"
      >
        Cancel Checkout
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Checkout initiated but not completed</p>
      </div>
    </div>
  );
}

function ActivePremiumActions({
  onUpgradeToMax,
  onOpenPortal
}: {
  onUpgradeToMax: () => void;
  onOpenPortal: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-700">Active Premium</h3>
        <p className="text-sm text-gray-600">Full access to premium features</p>
      </div>

      <button
        onClick={onUpgradeToMax}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Upgrade to Max - $10/month
      </button>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
      >
        Manage Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Tier change happens immediately via API. Use Customer Portal to cancel or update payment method.
        </p>
      </div>
    </div>
  );
}

function ActiveMaxActions({
  onDowngradeToPremium,
  onOpenPortal
}: {
  onDowngradeToPremium: () => void;
  onOpenPortal: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-700">Active Max</h3>
        <p className="text-sm text-gray-600">Highest tier with full access</p>
      </div>

      <button
        onClick={onDowngradeToPremium}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Downgrade to Premium - $3/month
      </button>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
      >
        Manage Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Tier change happens immediately via API. Use Customer Portal to cancel or update payment method.
        </p>
      </div>
    </div>
  );
}

function CancellingScheduledActions({ onOpenPortal }: { onOpenPortal: () => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-orange-700">Cancellation Scheduled</h3>
        <p className="text-sm text-gray-600">Your subscription will end at the current period end</p>
      </div>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
      >
        Resume Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Access continues until period end. Use Customer Portal to resume.</p>
      </div>
    </div>
  );
}

function PaymentFailedGracePeriodActions({ onOpenPortal }: { onOpenPortal: () => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-700">Payment Failed - Grace Period</h3>
        <p className="text-sm text-gray-600">Update your payment method within 7 days to maintain access</p>
      </div>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
      >
        Update Payment Method
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">You still have access during the grace period</p>
      </div>
    </div>
  );
}

function PaymentFailedGraceExpiredActions({
  onOpenPortal,
  onUpgrade
}: {
  onOpenPortal: () => void;
  onUpgrade: (tier: MembershipTier) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-700">Payment Failed - Access Revoked</h3>
        <p className="text-sm text-gray-600">Grace period expired. Update payment or start new subscription</p>
      </div>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
      >
        Update Payment Method
      </button>

      <button
        onClick={() => onUpgrade("premium")}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Start New Premium Subscription
      </button>

      <button
        onClick={() => onUpgrade("max")}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Start New Max Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Downgraded to standard tier</p>
      </div>
    </div>
  );
}

function PreviouslySubscribedActions({ onUpgrade }: { onUpgrade: (tier: MembershipTier) => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Re-Subscribe</h3>
        <p className="text-sm text-gray-600">Your previous subscription has ended. Subscribe again to regain access</p>
      </div>

      <button
        onClick={() => onUpgrade("premium")}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Re-subscribe to Premium - $3/month
      </button>

      <button
        onClick={() => onUpgrade("max")}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Re-subscribe to Max - $10/month
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Previously subscribed, no active subscription</p>
      </div>
    </div>
  );
}

function IncompleteExpiredActions({ onUpgrade }: { onUpgrade: (tier: MembershipTier) => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Checkout Expired</h3>
        <p className="text-sm text-gray-600">Your previous checkout session expired. Start a new checkout</p>
      </div>

      <button
        onClick={() => onUpgrade("premium")}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Start Fresh Checkout - Premium
      </button>

      <button
        onClick={() => onUpgrade("max")}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Start Fresh Checkout - Max
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Checkout session abandoned or expired</p>
      </div>
    </div>
  );
}

// Sub-components
function AuthSection({
  isAuthenticated,
  user,
  isAuthLoading,
  authError,
  onLogin
}: {
  isAuthenticated: boolean;
  user: { email: string } | null;
  isAuthLoading: boolean;
  authError: string | null;
  onLogin: () => void;
}) {
  if (isAuthenticated && user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">
          <strong>✅ Logged in as:</strong> {user.email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-3 text-yellow-900">Authentication Required</h2>
      <p className="text-yellow-800 mb-4">You need to be logged in to test Stripe subscription flows.</p>
      {authError && (
        <p className="text-red-600 mb-4">
          <strong>Error:</strong> {authError}
        </p>
      )}
      <button
        onClick={onLogin}
        disabled={isAuthLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAuthLoading ? "Logging in..." : "Login as ihid@jiki.io"}
      </button>
    </div>
  );
}

// CheckoutForm component with Checkout SDK
function CheckoutForm({ tier, onCancel }: { tier: MembershipTier; onCancel: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkoutState = useCheckout();
  const pricingTier = getPricingTier(tier);

  if (checkoutState.type === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">Error: {checkoutState.error.message}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (checkoutState.type !== "success") {
      return;
    }

    const { checkout } = checkoutState;
    setIsLoading(true);

    // Confirm the payment
    const confirmResult = await checkout.confirm();

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (confirmResult.type === "error") {
      setMessage(confirmResult.error.message);
      setIsLoading(false);
    } else {
      // Payment succeeded - redirect will happen automatically
      // Note: The redirect to return_url happens automatically by Stripe
      // The page will reload with the session_id in the URL
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{pricingTier.name} Plan</p>
            <p className="text-sm text-gray-600">{pricingTier.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${pricingTier.price}</p>
            <p className="text-sm text-gray-600">per month</p>
          </div>
        </div>
      </div>

      {/* Billing Address Element */}
      <div>
        <h4 className="text-sm font-medium mb-2">Billing Address</h4>
        <BillingAddressElement />
      </div>

      {/* Payment Element */}
      <div>
        <h4 className="text-sm font-medium mb-2">Payment</h4>
        <PaymentElement id="payment-element" />
      </div>

      {/* Error/Success Messages */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p id="payment-message" className="text-sm text-red-800">
            {message}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          id="submit"
          disabled={isLoading || checkoutState.type === "loading"}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading || checkoutState.type === "loading" ? (
            <div className="spinner inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          ) : (
            `Pay $${pricingTier.price} now`
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-3 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Additional Info */}
      <p className="text-xs text-gray-500 text-center">
        By subscribing, you agree to our terms and authorize recurring monthly charges.
      </p>
    </form>
  );
}

// Helper functions
function getTierBadgeColor(tier: MembershipTier): string {
  const colors = {
    standard: "bg-gray-100 text-gray-800",
    premium: "bg-blue-100 text-blue-800",
    max: "bg-purple-100 text-purple-800"
  };
  return colors[tier];
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    past_due: "bg-yellow-100 text-yellow-800",
    incomplete: "bg-gray-100 text-gray-800",
    trialing: "bg-blue-100 text-blue-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
