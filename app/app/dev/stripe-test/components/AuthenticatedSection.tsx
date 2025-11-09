"use client";

import { useState } from "react";
import { stripePromise } from "@/lib/stripe";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { getPricingTier } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import * as handlers from "../handlers";
import { CheckoutForm } from "./CheckoutForm";
import { SubscriptionActionsSwitch } from "./SubscriptionActionsSwitch";

interface AuthenticatedSectionProps {
  user: User;
  refreshUser: () => Promise<void>;
}

export function AuthenticatedSection({ user, refreshUser }: AuthenticatedSectionProps) {
  const [showGracePeriodTest, setShowGracePeriodTest] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [deletingStripeHistory, setDeletingStripeHistory] = useState(false);

  const currentTier = user.membership_type;

  return (
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
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierBadgeColor(currentTier)}`}>
                {getPricingTier(currentTier).name}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Delete Stripe History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reset Stripe Data</h2>
        <p className="text-sm text-gray-600 mb-4">
          Clear all Stripe subscription history for the current user. This will reset the user back to the free tier.
        </p>
        <button
          onClick={() =>
            handlers.handleDeleteStripeHistory({
              userHandle: user.handle,
              refreshUser,
              setDeletingStripeHistory
            })
          }
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
        </div>

        <dl className="space-y-2">
          <div>
            <dt className="inline font-medium">Tier:</dt>
            <dd className="inline ml-2">{user.membership_type}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Status:</dt>
            <dd className="inline ml-2">
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(user.subscription_status)}`}>
                {user.subscription_status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="inline font-medium">Subscription Valid Until:</dt>
            <dd className="inline ml-2">
              {user.subscription?.subscription_valid_until
                ? new Date(user.subscription.subscription_valid_until).toLocaleDateString()
                : "N/A"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium">In Grace Period:</dt>
            <dd className="inline ml-2">{user.subscription?.in_grace_period ? "Yes" : "No"}</dd>
          </div>
          {user.subscription?.grace_period_ends_at && (
            <div>
              <dt className="inline font-medium">Grace Period Ends:</dt>
              <dd className="inline ml-2">{new Date(user.subscription.grace_period_ends_at).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
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
                    Your payment failed. You have 7 days remaining to update your payment method before losing access to
                    premium features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Current Tier: {getPricingTier(currentTier).name}</h2>
        <SubscriptionActionsSwitch
          user={user}
          refreshUser={refreshUser}
          setSelectedTier={setSelectedTier}
          setClientSecret={setClientSecret}
        />
      </div>

      {/* Payment Form with Checkout SDK */}
      {clientSecret && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Checkout - {selectedTier && getPricingTier(selectedTier).name}</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Test card:</strong> 4242 4242 4242 4242, any future expiry, any CVC
            </p>
          </div>
          <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              tier={selectedTier!}
              onCancel={() => handlers.handleCheckoutCancel({ setClientSecret, setSelectedTier })}
            />
          </CheckoutProvider>
        </div>
      )}

      {/* Customer Portal */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
        <p className="text-sm text-gray-600 mb-4">
          Open the Stripe Customer Portal to manage your subscription, update payment methods, view invoices, and cancel
          subscriptions.
        </p>
        <button
          onClick={handlers.handleOpenPortal}
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
        </ul>
      </div>
    </>
  );
}

// Helper functions
function getTierBadgeColor(tier: MembershipTier): string {
  switch (tier) {
    case "standard":
      return "bg-gray-100 text-gray-800";
    case "premium":
      return "bg-blue-100 text-blue-800";
    case "max":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "cancelling":
      return "bg-orange-100 text-orange-800";
    case "canceled":
      return "bg-gray-100 text-gray-800";
    case "incomplete":
      return "bg-yellow-100 text-yellow-800";
    case "incomplete_expired":
      return "bg-red-100 text-red-800";
    case "past_due":
    case "unpaid":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
