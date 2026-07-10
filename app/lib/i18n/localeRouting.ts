import {
  DEFAULT_LOCALE,
  isLocalizableBase,
  isSupportedLocale,
  matchLocaleIgnoringCase,
  stripLocalePrefix
} from "./config";

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

// Old section URLs that permanently moved: any request whose (locale-stripped)
// base matches a key is 308'd to the same path under the new base, preserving
// locale prefix, sub-path, and query string.
const LEGACY_BASE_MOVES: Record<string, string> = {
  "/articles": "/help"
};

function applyLegacyBaseMove(pathname: string): string | undefined {
  const segments = pathname.split("/");
  const localePrefix = isSupportedLocale(segments[1]) ? `/${segments[1]}` : "";
  const base = localePrefix ? `/${segments.slice(2).join("/")}` : pathname;

  for (const [oldBase, newBase] of Object.entries(LEGACY_BASE_MOVES)) {
    if (base === oldBase || base.startsWith(`${oldBase}/`)) {
      return `${localePrefix}${newBase}${base.slice(oldBase.length)}`;
    }
  }
  return undefined;
}

/**
 * Decide how middleware should route a request so that a single `[locale]` tree
 * can serve both the naked (default-locale) URL and the prefixed non-default ones,
 * with no visible `/en` prefix ever surfacing. Keeps the URL<->route mapping in one
 * place instead of duplicating naked and `[locale]` page files.
 */
export function resolveLocaleRouting(pathname: string): LocaleRouting {
  const segments = pathname.split("/");
  const first = segments[1];

  // A moved section (e.g. /articles -> /help) 308s to its new home. Resolving the
  // moved path again collapses double hops (e.g. /en/articles/x goes straight to
  // /help/x, not via /en/help/x).
  const moved = applyLegacyBaseMove(pathname);
  if (moved != null) {
    const rerouted = resolveLocaleRouting(moved);
    return { action: "redirect", target: rerouted.action === "redirect" ? rerouted.target : moved };
  }

  // A miscased locale segment (/HU, /pt-br) is not a page of its own: 308 it to
  // its canonical form so mistyped inbound links neither 404 nor mint duplicate
  // URLs. Resolving the corrected path again collapses double hops (e.g. /EN/blog
  // goes straight to /blog, not via /en/blog). Bounded to known locale segments;
  // nothing else is case-normalized.
  if (first && !isSupportedLocale(first)) {
    const canonical = matchLocaleIgnoringCase(first);
    if (canonical != null) {
      const normalized = ["", canonical, ...segments.slice(2)].join("/");
      const rerouted = resolveLocaleRouting(normalized);
      return { action: "redirect", target: rerouted.action === "redirect" ? rerouted.target : normalized };
    }
  }

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
