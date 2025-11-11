/**
 * Stripe Test Page Handlers
 * Handler functions for subscription actions
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
import toast from "react-hot-toast";

// Types
export interface SubscribeParams {
  tier: MembershipTier;
  userEmail?: string;
  setSelectedTier: (tier: MembershipTier) => void;
  setClientSecret: (secret: string) => void;
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

// Handlers
export async function handleSubscribe({ tier, userEmail, setSelectedTier, setClientSecret }: SubscribeParams) {
  try {
    const returnUrl = createCheckoutReturnUrl(window.location.pathname);
    const response = await createCheckoutSession(tier, returnUrl, userEmail);
    setSelectedTier(tier);
    setClientSecret(response.client_secret);
    toast.success("Checkout session created");
  } catch (error) {
    toast.error("Failed to create checkout session");
    console.error(error);
  }
}

export function handleCheckoutCancel({ setClientSecret, setSelectedTier }: CheckoutCancelParams) {
  setClientSecret(null);
  setSelectedTier(null);
  toast("Checkout canceled");
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

export async function handleUpgradeToMax(refreshUser: RefreshUserFn) {
  try {
    await updateSubscription("max");
    toast.success("Successfully upgraded to Max!");
    await refreshUser();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upgrade subscription";
    toast.error(errorMessage);
    console.error(error);
  }
}

export async function handleDowngradeToPremium(refreshUser: RefreshUserFn) {
  try {
    await updateSubscription("premium");
    toast.success("Successfully downgraded to Premium!");
    await refreshUser();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to downgrade subscription";
    toast.error(errorMessage);
    console.error(error);
  }
}

export async function handleCancelSubscription(refreshUser: RefreshUserFn) {
  try {
    const response = await cancelSubscription();
    toast.success(
      `Subscription canceled. You'll keep access until ${new Date(response.access_until).toLocaleDateString()}`
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
    const response = await fetch(`http://localhost:3060/dev/users/${userHandle}/clear_stripe_history`, {
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
