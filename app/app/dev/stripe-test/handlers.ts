/**
 * Stripe Test Page Handlers
 * Re-exports from shared handlers library with dev-specific additions
 */

import {
  devHandlers,
  type PurchaseParams,
  type CheckoutCancelParams,
  type RefreshUserFn,
  type DeleteStripeHistoryParams
} from "@/lib/subscriptions/handlers";

// Re-export types for backward compatibility
export type { PurchaseParams, CheckoutCancelParams, RefreshUserFn, DeleteStripeHistoryParams };

// Re-export all dev handlers
export const handlePurchasePremium = devHandlers.purchase;
export const handleCheckoutCancel = devHandlers.cancel;
export const handleOpenPortal = devHandlers.openPortal;
export const handleCancelSubscription = devHandlers.cancelSubscription;
export const handleReactivateSubscription = devHandlers.reactivate;
export const handleRetryPayment = devHandlers.retryPayment;
export const handleDeleteStripeHistory = devHandlers.deleteStripeHistory;
