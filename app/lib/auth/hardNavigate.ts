/**
 * Leave the current page for `url` with a full document load, never a
 * client-side navigation.
 *
 * Auth pages are server-rendered for an anonymous visitor: no cookie, so the
 * logged-out initializer is in the tree and the locale came from the URL, not
 * the account. A login changes both of those facts, and a client-side push
 * would carry that stale shell into the app (the root layout persists across
 * pushes), leaving the client to patch auth state and locale in place. A full
 * load rebuilds the shell from the cookies the login just set, so the next page
 * is rendered for the right visitor in the right language by construction.
 *
 * A function rather than an inline `window.location` write so tests can mock
 * it: jsdom neither implements navigation nor lets `location` be stubbed.
 */
export function hardNavigate(url: string): void {
  window.location.assign(url);
}
