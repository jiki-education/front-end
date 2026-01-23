/**
 * Shared Subscription Handlers
 * Centralized handlers for subscription actions across the app
 */

import type { MembershipTier } from "@/lib/pricing";
import {
  createCheckoutSession,
  createPortalSession,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription
} from "@/lib/api/subscriptions";
import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";
import { getApiUrl } from "@/lib/api/config";
import { showModal } from "@/lib/modal";
import toast from "react-hot-toast";

// Types for handler functions
export interface SubscribeParams {
  tier: MembershipTier;
  userEmail?: string;
  returnPath?: string; // Optional return path, defaults to current location
}

export interface CheckoutCancelParams {
  setClientSecret: (secret: string | null) => void;
  setSelectedTier: (tier: MembershipTier | null) => void;
}

export interface RefreshUserFn {
  (): Promise<void>;
}

export interface DeleteStripeHistoryParams {
  userHandle: string;
  refreshUser: RefreshUserFn;
  setDeletingStripeHistory: (deleting: boolean) => void;
}

// Core subscription handlers
export async function handleSubscribe({ tier, userEmail, returnPath }: SubscribeParams) {
  try {
    const returnUrl = createCheckoutReturnUrl(returnPath || window.location.pathname);
    const response = await createCheckoutSession(tier, returnUrl, userEmail);

    // Show the checkout modal using the global modal system
    showModal("subscription-checkout-modal", {
      clientSecret: response.client_secret,
      selectedTier: tier,
      onCancel: () => {
        // Modal cancelled - no need to do anything as modal state is managed internally
      }
    });
  } catch (error) {
    toast.error("Failed to create checkout session");
    console.error(error);
  }
}

export async function handleOpenPortal() {
  try {
    const response = await createPortalSession();
    window.location.href = response.url;
  } catch (error) {
    toast.error("Failed to open customer portal");
    console.error(error);
  }
}

export async function handleUpgradeToPremium(refreshUser: RefreshUserFn) {
  try {
    await updateSubscription("premium");
    toast.success("Successfully upgraded to Premium!");
    await refreshUser();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upgrade subscription";
    toast.error(errorMessage);
    console.error(error);
  }
}

export async function handleCancelSubscription(refreshUser: RefreshUserFn) {
  try {
    const response = await cancelSubscription();
    toast.success(
      `Subscription canceled. You'll keep access until ${new Date(response.cancels_at).toLocaleDateString()}`
    );
    await refreshUser();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to cancel subscription";
    toast.error(errorMessage);
    console.error(error);
  }
}

export async function handleReactivateSubscription(refreshUser: RefreshUserFn) {
  try {
    await reactivateSubscription();
    toast.success("Subscription reactivated!");
    await refreshUser();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to reactivate subscription";
    toast.error(errorMessage);
    console.error(error);
  }
}

export async function handleRetryPayment(_refreshUser: RefreshUserFn) {
  // For payment retry, we'll direct to the customer portal
  try {
    await handleOpenPortal();
    // Note: We don't call refreshUser here since user will be redirected
    // The page will refresh when they return from the portal
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to open payment portal";
    toast.error(errorMessage);
    console.error(error);
  }
}

// Dev-only handlers (keep these separate)
export function handleCheckoutCancel({ setClientSecret, setSelectedTier }: CheckoutCancelParams) {
  setClientSecret(null);
  setSelectedTier(null);
  toast("Checkout canceled");
}

export async function handleDeleteStripeHistory({
  userHandle,
  refreshUser,
  setDeletingStripeHistory
}: DeleteStripeHistoryParams) {
  if (!userHandle) {
    toast.error("User handle not available");
    return;
  }

  setDeletingStripeHistory(true);
  try {
    const response = await fetch(getApiUrl(`/dev/users/${userHandle}/clear_stripe_history`), {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Stripe history: ${response.statusText}`);
    }

    toast.success("Stripe history deleted");
    await refreshUser();
  } catch (error) {
    toast.error("Failed to delete Stripe history");
    console.error(error);
  } finally {
    setDeletingStripeHistory(false);
  }
}

// Convenience functions for specific contexts
export const settingsHandlers = {
  subscribe: (params: Omit<SubscribeParams, "returnPath">) => handleSubscribe({ ...params, returnPath: "/settings" }),
  openPortal: handleOpenPortal,
  upgradeToPremium: handleUpgradeToPremium,
  cancel: handleCancelSubscription,
  reactivate: handleReactivateSubscription,
  retryPayment: handleRetryPayment
};

export const devHandlers = {
  subscribe: handleSubscribe,
  cancel: handleCheckoutCancel,
  openPortal: handleOpenPortal,
  upgradeToPremium: handleUpgradeToPremium,
  cancelSubscription: handleCancelSubscription,
  reactivate: handleReactivateSubscription,
  retryPayment: handleRetryPayment,
  deleteStripeHistory: handleDeleteStripeHistory
};
