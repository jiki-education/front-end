/**
 * Settings Page Subscription Handlers
 * Adapts the real Stripe API handlers from dev/stripe-test for use in settings
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

// Types for handler functions
export interface SubscribeParams {
  tier: MembershipTier;
  userEmail?: string;
  setSelectedTier: (tier: MembershipTier) => void;
  setClientSecret: (secret: string) => void;
}

export interface RefreshUserFn {
  (): Promise<void>;
}

// Subscription action handlers - copied from stripe branch handlers
export async function handleSubscribe({ tier, userEmail, setSelectedTier, setClientSecret }: SubscribeParams) {
  try {
    const returnUrl = createCheckoutReturnUrl("/settings");
    const response = await createCheckoutSession(tier, returnUrl, userEmail);
    setSelectedTier(tier);
    setClientSecret(response.client_secret);
    toast.success("Checkout session created");
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

export async function handleRetryPayment(_refreshUser: RefreshUserFn) {
  // For payment retry, we'll direct to the customer portal
  // This matches the stripe branch behavior
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
