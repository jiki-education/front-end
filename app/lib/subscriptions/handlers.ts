/**
 * Shared Premium Handlers
 * Centralized handlers for buying Premium and for managing legacy
 * subscriptions across the app
 */

import { createPortalSession, cancelSubscription, reactivateSubscription } from "@/lib/api/subscriptions";
import { createPurchaseCheckoutSession } from "@/lib/api/premiumPurchases";
import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";
import { getApiUrl } from "@/lib/api/config";
import { getApiErrorType } from "@/lib/api/client";
import { toastApiError } from "@/lib/api/apiErrors";
import { hideModal } from "@/lib/modal";
import { showPremiumCheckout, type CheckoutBackdrop } from "@/lib/modal/app";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "@/lib/toast";

// Types for handler functions
export interface PurchaseParams {
  returnPath?: string; // Optional return path, defaults to current location
  priorError?: string | null; // A previous attempt's failure, shown in the checkout error banner
  onCancel?: () => void; // Called after the checkout modal is dismissed, e.g. to reopen the modal it replaced
  backdrop?: CheckoutBackdrop; // The backdrop of the modal checkout replaces, so it doesn't change underneath
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

// Buying Premium (a one-off lifetime purchase)
export async function handlePurchasePremium({ returnPath, priorError, onCancel, backdrop }: PurchaseParams = {}) {
  try {
    const returnUrl = createCheckoutReturnUrl(returnPath || window.location.pathname);
    const response = await createPurchaseCheckoutSession(returnUrl);

    // Hide any currently open modal before showing checkout
    hideModal();

    // Show the checkout modal using the global modal system
    showPremiumCheckout({
      clientSecret: response.client_secret,
      selectedTier: "premium",
      priorError,
      onCancel,
      backdrop
    });
  } catch (error) {
    // `already_premium` and `purchase_pending` have their own copy. Anything
    // else gets the generic checkout failure.
    if (isKnownPurchaseRejection(error)) {
      toastApiError(error, "subscriptions");
    } else {
      toastError("subscription.checkoutSessionFailed");
    }
    console.error(error);
    throw error; // Re-throw so caller can handle loading state
  }
}

// Legacy subscription management

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
    // Prefer copy for the specific type the API sent; else a generic fallback.
    if (getApiErrorType(error)) {
      toastApiError(error, "subscriptions");
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
    if (getApiErrorType(error)) {
      toastApiError(error, "subscriptions");
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
    if (getApiErrorType(error)) {
      toastApiError(error, "subscriptions");
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
  purchase: (params: Omit<PurchaseParams, "returnPath"> = {}) =>
    handlePurchasePremium({ ...params, returnPath: "/settings" }),
  openPortal: handleOpenPortal,
  cancel: handleCancelSubscription,
  reactivate: handleReactivateSubscription,
  retryPayment: handleRetryPayment
};

export const devHandlers = {
  purchase: handlePurchasePremium,
  cancel: handleCheckoutCancel,
  openPortal: handleOpenPortal,
  cancelSubscription: handleCancelSubscription,
  reactivate: handleReactivateSubscription,
  retryPayment: handleRetryPayment,
  deleteStripeHistory: handleDeleteStripeHistory
};

function isKnownPurchaseRejection(error: unknown): boolean {
  const type = getApiErrorType(error);
  return type === "already_premium" || type === "purchase_pending";
}
