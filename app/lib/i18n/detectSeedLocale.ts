import { DEFAULT_LOCALE, normalizeLocale, type Locale } from "./config";

// The locale to seed a new account with at signup. We only send an *explicit*
// signal: the locale the user is demonstrably browsing in (a non-default
// resolved locale, i.e. they're on a locale-prefixed page). When there's no
// explicit locale we return undefined and send nothing, letting the backend fall
// back to the request's Accept-Language header (the same data navigator.languages
// would give, but read once, server-side) and then the default. This avoids
// duplicating header sniffing on the client and never overrides the locale a
// user was actually using with an implicit browser guess.
export function detectSeedLocale(activeLocale: string): Locale | undefined {
  const resolved = normalizeLocale(activeLocale);
  return resolved === DEFAULT_LOCALE ? undefined : resolved;
}
