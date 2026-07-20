/**
 * Shared Subscription Handlers
 * Centralized handlers for subscription actions across the app
 */

import type { BillingInterval } from "@/lib/pricing";
import {
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  reactivateSubscription
} from "@/lib/api/subscriptions";
import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";
import { getApiUrl } from "@/lib/api/config";
import { hideModal } from "@/lib/modal";
import { showSubscriptionCheckout } from "@/lib/modal/app";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "@/lib/toast";

// Types for handler functions
export interface SubscribeParams {
  interval: BillingInterval;
  userEmail?: string;
  returnPath?: string; // Optional return path, defaults to current location
  priorError?: string | null; // A previous attempt's failure, shown in the checkout error banner
}

export interface CheckoutCancelParams {
  setClientSecret: (secret: string | null) => void;
  setSelectedTier: (tier: string | null) => void;
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
export async function handleSubscribe({ interval, userEmail, returnPath, priorError }: SubscribeParams) {
  try {
    const returnUrl = createCheckoutReturnUrl(returnPath || window.location.pathname);
    const response = await createCheckoutSession(interval, returnUrl, userEmail);

    // Hide any currently open modal before showing checkout
    hideModal();

    // Show the checkout modal using the global modal system
    showSubscriptionCheckout({
      clientSecret: response.client_secret,
      selectedTier: "premium",
      priorError,
      onCancel: () => {
        // Modal cancelled - no need to do anything as modal state is managed internally
      }
    });
  } catch (error) {
    toastError("subscription.checkoutSessionFailed");
    console.error(error);
    throw error; // Re-throw so caller can handle loading state
  }
}

export async function handleOpenPortal() {
  try {
    const response = await createPortalSession();
    window.location.href = response.url;
  } catch (error) {
    toastError("subscription.portalFailed");
    console.error(error);
  }
}

export async function handleCancelSubscription(refreshUser: RefreshUserFn) {
  try {
    const response = await cancelSubscription();
    toastSuccess("subscription.canceled", { date: new Date(response.cancels_at).toLocaleDateString() });
    await refreshUser();
  } catch (error) {
    // Show the server message when present (dynamic); else a translated fallback.
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toastError("subscription.cancelFailed");
    }
    console.error(error);
  }
}

export async function handleReactivateSubscription(refreshUser: RefreshUserFn) {
  try {
    await reactivateSubscription();
    toastSuccess("subscription.reactivated");
    await refreshUser();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toastError("subscription.reactivateFailed");
    }
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
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toastError("subscription.paymentPortalFailed");
    }
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
  cancel: handleCancelSubscription,
  reactivate: handleReactivateSubscription,
  retryPayment: handleRetryPayment
};

export const devHandlers = {
  subscribe: handleSubscribe,
  cancel: handleCheckoutCancel,
  openPortal: handleOpenPortal,
  cancelSubscription: handleCancelSubscription,
  reactivate: handleReactivateSubscription,
  retryPayment: handleRetryPayment,
  deleteStripeHistory: handleDeleteStripeHistory
};
