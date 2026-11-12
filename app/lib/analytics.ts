"use client";

import { getApiUrl } from "@/lib/api/config";

/**
 * Trigger values for `premium_modal_shown`. The type constrains call
 * sites to a fixed vocabulary — inconsistent values fragment the funnel
 * data permanently, so any new trigger must be added here first.
 */
export type ModalTrigger =
  | "nav_upgrade_button"
  | "premium_page_upgrade_button"
  | "dashboard_sidebar_accelerate"
  | "dashboard_sidebar_testimonials"
  | "dashboard_sidebar_never_get_stuck"
  | "challenges_page_locked_challenge"
  | "guide_page_unlock_button"
  | "guide_card_locked_guide"
  | "exercise_chat_send_message"
  | "exercise_chat_limit_reached"
  | "exercise_chat_locked_footer"
  | "exercise_completion_ask_jiki_upsell";

/**
 * Trigger values for the checkout funnel (`checkout_started`, `checkout_loaded`,
 * `checkout_load_error`, `checkout_submitted`, `checkout_failed`, `checkout_closed`).
 * A checkout opened from a Premium modal
 * reuses that modal's trigger so the two funnels join up. The extra values cover
 * the places that open checkout without a modal first.
 */
export type CheckoutTrigger = ModalTrigger | "settings_upgrade_button" | "checkout_retry";

/**
 * Feature values for `premium_feature_blocked` — fired when a locked
 * surface renders (passive view, no click required).
 */
export type BlockedFeature = "challenges_page" | "assistant_tab";

/**
 * Fire-and-forget event tracking. Analytics failures must never break
 * the app, so errors are swallowed silently. `keepalive: true` ensures
 * the request completes even if the user navigates away (important for
 * "click upgrade" events that often precede a route change).
 *
 * Don't await this at call sites — it returns void by design.
 */
export function trackEvent(event: string, properties: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  try {
    void fetch(getApiUrl("/internal/events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
      credentials: "include",
      keepalive: true
    }).catch(() => {});
  } catch {
    // swallow synchronous fetch construction errors (e.g. malformed URL)
  }
}

/**
 * The base properties for a checkout funnel event. An absent trigger is left
 * out, because PostHog shows a null value as a literal "null".
 */
export function checkoutEventProperties(trigger: CheckoutTrigger | undefined): Record<string, unknown> {
  return trigger ? { trigger } : {};
}
