/**
 * Settings Page Premium Handlers
 * Re-exports from shared handlers library configured for settings context
 */

import { settingsHandlers, type RefreshUserFn } from "@/lib/subscriptions/handlers";

export type { RefreshUserFn };

export const handlePurchasePremium = settingsHandlers.purchase;
export const handleOpenPortal = settingsHandlers.openPortal;
export const handleCancelSubscription = settingsHandlers.cancel;
export const handleReactivateSubscription = settingsHandlers.reactivate;
export const handleRetryPayment = settingsHandlers.retryPayment;
