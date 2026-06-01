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

import { generateCodeVerifier, generateCodeChallenge } from "./pkce";

const STATE_KEY = "exercism_oauth_state";
const VERIFIER_KEY = "exercism_oauth_verifier";

const DEFAULT_EXERCISM_URL = "https://exercism.org";

export type ExercismCallbackResult =
  | { status: "ok"; code: string; codeVerifier: string }
  | { status: "error"; message: string };

/**
 * Whether "Use Exercism" auth is configured for this environment.
 */
export function isExercismAuthEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID);
}

/**
 * Starts the Exercism OAuth flow by redirecting to Exercism's authorize page.
 */
export function beginExercismAuth(): void {
  window.location.href = buildExercismAuthorizeUrl();
}

/**
 * Generates and stashes the PKCE verifier + state, and returns the Exercism
 * authorize URL to redirect the user to.
 */
export function buildExercismAuthorizeUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID;
  if (!clientId) {
    throw new Error("Exercism OAuth is not configured");
  }

  const codeVerifier = generateCodeVerifier();
  const state = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  sessionStorage.setItem(VERIFIER_KEY, codeVerifier);
  sessionStorage.setItem(STATE_KEY, state);

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
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);

  if (!code) {
    return { status: "error", message: "Exercism did not return an authorization code" };
  }
  if (!state || !storedState || state !== storedState) {
    return { status: "error", message: "Invalid authentication state. Please try again." };
  }
  if (!storedVerifier) {
    return { status: "error", message: "Missing authentication details. Please try again." };
  }

  return { status: "ok", code, codeVerifier: storedVerifier };
}

function exercismBaseUrl(): string {
  return process.env.NEXT_PUBLIC_EXERCISM_URL || DEFAULT_EXERCISM_URL;
}

function exercismRedirectUri(): string {
  return `${window.location.origin}/auth/exercism/callback`;
}
