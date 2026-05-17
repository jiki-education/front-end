"use client";

import { getApiUrl } from "@/lib/api/config";

/**
 * Trigger values for `premium_modal_shown`.
 * Single source of truth — never hardcode these strings at call sites,
 * inconsistent values fragment the funnel data permanently.
 */
export const MODAL_TRIGGERS = {
  LOCKED_PROJECT: "locked_project",
  LOCKED_EPISODE: "locked_episode",
  LOCKED_EPISODE_VIDEO: "locked_episode_video",
  ASSISTANT_SEND_MESSAGE: "assistant_send_message",
  ASSISTANT_TAB_OPENED: "assistant_tab_opened",
  ASSISTANT_LIMIT_REACHED: "assistant_limit_reached",
  UPGRADE_CTA_NAV: "upgrade_cta_nav",
  UPGRADE_CTA_PROJECTS_SIDEBAR: "upgrade_cta_projects_sidebar",
  UPGRADE_CTA_PREMIUM_PAGE: "upgrade_cta_premium_page"
} as const;

export type ModalTrigger = (typeof MODAL_TRIGGERS)[keyof typeof MODAL_TRIGGERS];

/**
 * Feature values for `premium_feature_blocked` — fired when a locked
 * surface renders (passive view, no click required).
 */
export const BLOCKED_FEATURES = {
  PROJECTS_PAGE: "projects_page",
  ASSISTANT_TAB: "assistant_tab",
  BUILD_PAGE_ALL_LOCKED: "build_page_all_locked"
} as const;

export type BlockedFeature = (typeof BLOCKED_FEATURES)[keyof typeof BLOCKED_FEATURES];

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
