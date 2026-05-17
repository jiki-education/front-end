"use client";

const STORAGE_KEY = "jiki_attribution";

export interface Attribution {
  referrer: string | null;
  landing_path: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  captured_at: string;
}

/**
 * Record first-touch attribution once per browser. The Rails API can't
 * see the user's original referrer at signup time (request.referer is our
 * own signup page by then), so we capture it client-side on first landing
 * and ship it with the signup payload.
 *
 * First touch wins — if the user lands via Twitter, browses for a day,
 * then signs up from a bookmark, we still record "Twitter".
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    // Store the pathname only — never the full URL. A user's first visit may
    // be a link with sensitive query params (OAuth `?code=`, email
    // `?confirmation_token=`, password `?reset_password_token=`, etc.), and
    // we don't want those captured or shipped with the signup payload. UTMs
    // are extracted into their own fields below so attribution is preserved.
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {
      referrer: document.referrer || null,
      landing_path: window.location.pathname,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      captured_at: new Date().toISOString()
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage can throw in private mode / when full — ignore
  }
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
