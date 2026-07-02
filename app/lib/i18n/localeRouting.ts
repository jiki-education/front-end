import { DEFAULT_LOCALE, PUBLIC_PAGES, PUBLIC_SECTIONS, isSupportedLocale, stripLocalePrefix } from "./config";

/**
 * Flows that are reachable logged-out and localized like the public pages, but are
 * never edge-cached: auth carries OAuth/CSRF state, and delete-account/unsubscribe
 * carry per-user tokens the cache key would strip (a shared entry would leak across
 * users). Hence they drive routing but not `isCacheableRoute`.
 */
const UNCACHED_FLOWS = ["/auth", "/delete-account", "/unsubscribe"] as const;

/**
 * Path bases (with any locale segment stripped) that have a `[locale]` route tree
 * and participate in locale prefixing. Add a base here only once the corresponding
 * `app/(hybrid)/[locale]/<base>` (or `(external)/[locale]/<base>`) route exists.
 */
const LOCALIZABLE_BASES = [...PUBLIC_SECTIONS, ...PUBLIC_PAGES, ...UNCACHED_FLOWS] as const;

function isLocalizableBase(basePath: string): boolean {
  return LOCALIZABLE_BASES.some((base) => basePath === base || basePath.startsWith(`${base}/`));
}

/**
 * - `rewrite`: serve `target` internally while keeping the visible URL naked (the
 *   default locale is served from the single `[locale]` tree).
 * - `redirect`: send the browser to `target` — the canonical naked URL for an
 *   explicitly default-locale-prefixed request (e.g. /en/blog -> /blog).
 * - `none`: leave routing untouched (non-default locales, and everything that
 *   isn't a localizable path).
 */
export type LocaleRouting =
  | { action: "rewrite"; target: string }
  | { action: "redirect"; target: string }
  | { action: "none" };

/**
 * Decide how middleware should route a request so that a single `[locale]` tree
 * can serve both the naked (default-locale) URL and the prefixed non-default ones,
 * with no visible `/en` prefix ever surfacing. Keeps the URL<->route mapping in one
 * place instead of duplicating naked and `[locale]` page files.
 */
export function resolveLocaleRouting(pathname: string): LocaleRouting {
  const segments = pathname.split("/");
  const first = segments[1];

  if (isSupportedLocale(first)) {
    const base = stripLocalePrefix(pathname);
    // Explicit default-locale prefix has a naked canonical form: send them there.
    // base === "/" is the apex home (e.g. /en -> /).
    if (first === DEFAULT_LOCALE && (base === "/" || isLocalizableBase(base))) {
      return { action: "redirect", target: base };
    }
    // A supported non-default locale (e.g. /hu, /hu/blog) already matches [locale].
    return { action: "none" };
  }

  // Apex: the naked home (/) is served from the default-locale branch (/en).
  if (pathname === "/") {
    return { action: "rewrite", target: `/${DEFAULT_LOCALE}` };
  }

  // Naked localizable path: serve it from the default-locale branch internally.
  if (isLocalizableBase(pathname)) {
    return { action: "rewrite", target: `/${DEFAULT_LOCALE}${pathname}` };
  }

  return { action: "none" };
}
