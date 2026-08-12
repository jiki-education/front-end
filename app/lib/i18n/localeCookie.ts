import { LOCALE_COOKIE_NAME, LOCALE_PREF_COOKIE_NAME } from "./config";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Records that the user *chose* this locale, so the edge stops inferring one for
 * them (see resolveLocaleRedirect).
 *
 * Must be written before navigating, not after arriving: the redirect is decided
 * at the edge, ahead of the cache and of any React that could run on the new
 * page. Set it on the way out and the destination is honoured; set it on arrival
 * and the request that carries the user there has already been bounced back,
 * leaving them oscillating with a useless back button. `document.cookie` is
 * synchronous, so an event handler that sets it before letting the navigation
 * proceed is enough.
 */
export function setLocalePrefCookie(locale: string): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${LOCALE_PREF_COOKIE_NAME}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

// Persists the chosen locale to a cookie so SSR/edge requests (resolveLocale)
// render in the right language. Called from the client when the user changes
// their locale; the Rails preference remains the source of truth, this just
// mirrors it into a request-readable cookie. One year, lax, root path.
export function setLocaleCookie(locale: string): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}
