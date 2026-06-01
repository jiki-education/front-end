/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0 flows.
 * See RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636
 *
 * Uses a pure-JS SHA-256 (js-sha256) rather than crypto.subtle because the
 * Web Crypto API is unavailable in non-secure contexts, such as
 * http://local.jiki.io in local development.
 */

import { sha256 } from "js-sha256";

/**
 * Generates a cryptographically random code verifier (43 chars, base64url).
 */
export function generateCodeVerifier(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(Array.from(bytes));
}

/**
 * Derives the S256 code challenge from a code verifier.
 */
export function generateCodeChallenge(verifier: string): string {
  return base64UrlEncode(sha256.array(verifier));
}

function base64UrlEncode(bytes: number[]): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
