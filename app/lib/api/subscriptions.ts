/**
 * Subscriptions API
 * Management of legacy Stripe subscriptions. New members buy Premium once
 * instead (see `premiumPurchases.ts`), so nothing here starts a subscription.
 */

import { api } from "./client";
import type {
  PortalSessionResponse,
  CancelSubscriptionResponse,
  ReactivateSubscriptionResponse
} from "@/types/subscription";

/**
 * Create a Stripe Customer Portal session for subscription management
 * @returns Portal session with redirect URL
 */
export async function createPortalSession(): Promise<PortalSessionResponse> {
  const response = await api.post<PortalSessionResponse>("/internal/subscriptions/portal_session");
  return response.data;
}

/**
 * Cancel subscription (schedules cancellation at period end)
 * @returns Cancellation status and access end date
 */
export async function cancelSubscription(): Promise<CancelSubscriptionResponse> {
  const response = await api.delete<CancelSubscriptionResponse>("/internal/subscriptions/cancel");
  return response.data;
}

/**
 * Reactivate a cancelled subscription (resumes subscription)
 * @returns Reactivated subscription status
 */
export async function reactivateSubscription(): Promise<ReactivateSubscriptionResponse> {
  const response = await api.post<ReactivateSubscriptionResponse>("/internal/subscriptions/reactivate");
  return response.data;
}
