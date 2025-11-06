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
  verifyCheckoutSession
} from "@/lib/api/subscriptions";
import { useAuthStore } from "@/stores/authStore";
import type { Subscription } from "@/types/subscription";
import { getAllTiers, getPricingTier } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";
import toast from "react-hot-toast";

export default function StripeTestPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, login } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showGracePeriodTest, setShowGracePeriodTest] = useState(false);

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

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      // Verify the checkout session and sync subscription
      async function verifyCheckoutAndRefresh(id: string) {
        try {
          toast.loading("Verifying payment...");
          await verifyCheckoutSession(id);
          toast.dismiss();
          toast.success("Payment verified! Refreshing subscription status...");
          // Reload subscription status
          await loadSubscriptionStatus();
        } catch (error) {
          toast.dismiss();
          toast.error("Failed to verify payment. Please refresh the page.");
          console.error("Failed to verify checkout:", error);
        }
      }

      void verifyCheckoutAndRefresh(sessionId);
      // Clear the session_id from URL
      window.history.replaceState({}, "", window.location.pathname);
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

  const tiers = getAllTiers();
  const currentTier = user?.membership_type;

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

            {/* Tier Selection & Upgrade */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Test Subscription Flows</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedTier === tier.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    } ${currentTier === tier.id ? "ring-2 ring-green-500" : ""}`}
                    onClick={() => handleTierSelect(tier.id)}
                  >
                    {currentTier === tier.id && (
                      <div className="text-xs font-semibold text-green-600 mb-2">CURRENT TIER</div>
                    )}
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                    <div className="text-2xl font-bold my-2">{tier.price === 0 ? "Free" : `$${tier.price}/mo`}</div>
                    <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                    <ul className="text-sm space-y-1">
                      {tier.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {selectedTier && selectedTier !== currentTier && currentTier && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-3">
                    {getTierIndex(selectedTier) > getTierIndex(currentTier)
                      ? `Upgrade from ${getPricingTier(currentTier).name} to ${getPricingTier(selectedTier).name}`
                      : `Downgrade from ${getPricingTier(currentTier).name} to ${getPricingTier(selectedTier).name}`}
                  </p>
                  <button
                    onClick={handleStartCheckout}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Start Checkout for {getPricingTier(selectedTier).name}
                  </button>
                </div>
              )}
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

  function handleTierSelect(tier: MembershipTier) {
    setSelectedTier(tier);
    setClientSecret(null); // Reset checkout
  }

  async function handleStartCheckout() {
    if (!selectedTier) {
      return;
    }

    if (selectedTier === "standard") {
      toast.error("Cannot create checkout for free tier");
      return;
    }

    try {
      // Use current page URL as return URL so we come back here after payment
      // Include {CHECKOUT_SESSION_ID} placeholder which Stripe will replace with actual session ID
      const returnUrl = `${window.location.origin}${window.location.pathname}?session_id={CHECKOUT_SESSION_ID}`;
      const response = await createCheckoutSession(selectedTier, returnUrl);
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

function getTierIndex(tier: MembershipTier): number {
  const order: MembershipTier[] = ["standard", "premium", "max"];
  return order.indexOf(tier);
}
