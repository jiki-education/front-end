import { LOCALE_COOKIE_NAME } from "./config";

// Persists the chosen locale to a cookie so SSR/edge requests (resolveLocale)
// render in the right language. Called from the client when the user changes
// their locale; the Rails preference remains the source of truth, this just
// mirrors it into a request-readable cookie. One year, lax, root path.
export function setLocaleCookie(locale: string): void {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; samesite=lax`;
}
