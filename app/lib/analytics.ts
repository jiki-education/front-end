"use client";

import { getApiUrl } from "@/lib/api/config";

/**
 * Trigger values for `premium_modal_shown`. The type constrains call
 * sites to a fixed vocabulary — inconsistent values fragment the funnel
 * data permanently, so any new trigger must be added here first.
 */
export type ModalTrigger =
  | "locked_challenge"
  | "locked_guide"
  | "locked_episode"
  | "locked_episode_video"
  | "assistant_send_message"
  | "assistant_tab_opened"
  | "assistant_limit_reached"
  | "upgrade_cta_nav"
  | "upgrade_cta_challenges_sidebar"
  | "upgrade_cta_premium_page";

/**
 * Feature values for `premium_feature_blocked` — fired when a locked
 * surface renders (passive view, no click required).
 */
export type BlockedFeature = "challenges_page" | "assistant_tab" | "build_page_all_locked";

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
