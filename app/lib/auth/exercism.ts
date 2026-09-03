/**
 * Exercism OAuth flow helpers.
 *
 * Exercism uses an OAuth 2.0 authorization code flow with PKCE:
 * 1. beginExercismAuth() generates a state + code verifier, stashes them in
 *    sessionStorage, and redirects the browser to Exercism's authorize page.
 * 2. Exercism redirects back to /auth/exercism/callback?code=...&state=...
 * 3. consumeExercismCallback() validates the state (CSRF protection) and
 *    returns the code verifier needed for the token exchange on the API.
 */

import { isSupportedLocale } from "@/lib/i18n/config";
import { detectSeedLocale } from "@/lib/i18n/detectSeedLocale";
import type { Locale } from "@/lib/locales";
import { generateCodeVerifier, generateCodeChallenge } from "./pkce";

const STATE_KEY = "exercism_oauth_state";
const VERIFIER_KEY = "exercism_oauth_verifier";

// The locale the user started the flow in, stashed for the same reason as the
// state and verifier: it can't survive the trip any other way. The redirect_uri
// is naked (Exercism holds one registered URI, not one per locale), so the
// callback page's own locale is re-derived from Accept-Language and would report
// the device's language rather than the one being read - which is precisely the
// signal we came here for. Read once on callback and sent to the API as the
// new account's locale.
const LOCALE_KEY = "exercism_oauth_locale";

const DEFAULT_EXERCISM_URL = "https://exercism.org";

export type ExercismCallbackResult =
  | { status: "ok"; code: string; codeVerifier: string; seedLocale?: Locale }
  | { status: "error"; message: string };

/**
 * Whether "Use Exercism" auth is configured for this environment.
 */
export function isExercismAuthEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID);
}

/**
 * Starts the Exercism OAuth flow by redirecting to Exercism's authorize page.
 *
 * `activeLocale` is the locale the user is browsing in, carried across the
 * round trip so a signup can be recorded against it. See LOCALE_KEY.
 */
export function beginExercismAuth(activeLocale?: string): void {
  window.location.href = buildExercismAuthorizeUrl(activeLocale);
}

/**
 * Generates and stashes the PKCE verifier + state, and returns the Exercism
 * authorize URL to redirect the user to.
 */
export function buildExercismAuthorizeUrl(activeLocale?: string): string {
  const clientId = process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID;
  if (!clientId) {
    throw new Error("Exercism OAuth is not configured");
  }

  const codeVerifier = generateCodeVerifier();
  const state = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  sessionStorage.setItem(VERIFIER_KEY, codeVerifier);
  sessionStorage.setItem(STATE_KEY, state);

  const seedLocale = activeLocale == null ? undefined : detectSeedLocale(activeLocale);
  if (seedLocale) {
    sessionStorage.setItem(LOCALE_KEY, seedLocale);
  } else {
    sessionStorage.removeItem(LOCALE_KEY);
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: exercismRedirectUri(),
    scope: "profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });

  return `${exercismBaseUrl()}/oauth/authorize?${params.toString()}`;
}

/**
 * Validates the OAuth callback params and returns the code + verifier for the
 * token exchange. Clears the stashed state/verifier so they can't be reused.
 */
export function consumeExercismCallback(code: string | null, state: string | null): ExercismCallbackResult {
  const storedState = sessionStorage.getItem(STATE_KEY);
  const storedVerifier = sessionStorage.getItem(VERIFIER_KEY);
  const storedLocale = sessionStorage.getItem(LOCALE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(LOCALE_KEY);

  if (!code) {
    return { status: "error", message: "Exercism did not return an authorization code" };
  }
  if (!state || !storedState || state !== storedState) {
    return { status: "error", message: "Invalid authentication state. Please try again." };
  }
  if (!storedVerifier) {
    return { status: "error", message: "Missing authentication details. Please try again." };
  }

  // A stashed locale that is no longer one we serve is dropped rather than
  // sent, matching how the API treats an unsupported value: no signal, so the
  // account falls back to the Accept-Language derivation.
  const seedLocale = isSupportedLocale(storedLocale) ? storedLocale : undefined;

  return { status: "ok", code, codeVerifier: storedVerifier, seedLocale };
}

function exercismBaseUrl(): string {
  return process.env.NEXT_PUBLIC_EXERCISM_URL || DEFAULT_EXERCISM_URL;
}

function exercismRedirectUri(): string {
  return `${window.location.origin}/auth/exercism/callback`;
}
