/**
 * Settings Page Subscription Handlers
 * Re-exports from shared handlers library configured for settings context
 */

import {
  settingsHandlers,
  type RefreshUserFn,
  type SubscribeParams as SharedSubscribeParams
} from "@/lib/subscriptions/handlers";

// Re-export types for backward compatibility
export type { RefreshUserFn };
export type SubscribeParams = Omit<SharedSubscribeParams, "returnPath">;

// Re-export handlers with settings-specific configuration
export const handleSubscribe = settingsHandlers.subscribe;
export const handleOpenPortal = settingsHandlers.openPortal;
export const handleUpgradeToPremium = settingsHandlers.upgradeToPremium;
export const handleCancelSubscription = settingsHandlers.cancel;
export const handleReactivateSubscription = settingsHandlers.reactivate;
export const handleRetryPayment = settingsHandlers.retryPayment;
