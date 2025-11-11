/**
 * Stripe Test Page Handlers
 * Re-exports from shared handlers library with dev-specific additions
 */

import {
  devHandlers,
  type SubscribeParams,
  type CheckoutCancelParams,
  type RefreshUserFn,
  type DeleteStripeHistoryParams
} from "@/lib/subscriptions/handlers";

// Re-export types for backward compatibility
export type { SubscribeParams, CheckoutCancelParams, RefreshUserFn, DeleteStripeHistoryParams };

// Re-export all dev handlers
export const handleSubscribe = devHandlers.subscribe;
export const handleCheckoutCancel = devHandlers.cancel;
export const handleOpenPortal = devHandlers.openPortal;
export const handleUpgradeToMax = devHandlers.upgradeToMax;
export const handleUpgradeToPremium = devHandlers.upgradeToPremium;
export const handleDowngradeToPremium = devHandlers.downgradeToPremium;
export const handleCancelSubscription = devHandlers.cancelSubscription;
export const handleReactivateSubscription = devHandlers.reactivate;
export const handleRetryPayment = devHandlers.retryPayment;
export const handleDeleteStripeHistory = devHandlers.deleteStripeHistory;
