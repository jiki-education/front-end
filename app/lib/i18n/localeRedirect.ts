import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { readCookie } from "@/lib/cookies";
import {
  DEFAULT_LOCALE,
  LOCALE_PREF_COOKIE_NAME,
  PUBLIC_PAGES,
  PUBLIC_SECTIONS,
  isSupportedLocale,
  stripLocalePrefix,
  type Locale
} from "./config";
import { firstSupportedLanguage } from "./localeBanner";
import { localePath } from "./routes";

export interface LocaleRedirectInput {
  /** Request pathname, without query or hash (e.g. "/hu/blog"). */
  pathname: string;
  /** Value of the locale-preference cookie, or null when the user hasn't chosen. */
  localePref: string | null;
  /** Raw Accept-Language header, or null if absent (crawlers send none). */
  acceptLanguage: string | null;
}

/**
 * Decide whether a request should be sent to a different locale's URL, and to
 * which. Returns the target pathname, or null to serve the request as-is.
 *
 * Precedence is explicit choice > explicit URL > browser guess:
 *
 * 1. The preference cookie wins outright. It only exists once the visitor used
 *    the switcher or the banner, so it is the one signal that is unambiguously
 *    theirs, and it must survive following a link into another language.
 * 2. Otherwise a locale already in the path wins. A URL someone deliberately
 *    followed is a stronger signal than their browser configuration, so
 *    /hu/blog stays Hungarian for an English-configured browser. This is also
 *    what keeps every non-default URL independently shareable and crawlable.
 * 3. Otherwise the first supported Accept-Language language, which is the only
 *    case that actually moves anyone: a naked URL, no stated preference.
 *
 * No supported language anywhere means no redirect. That single clause covers
 * unsupported languages and, critically, clients that send no Accept-Language
 * at all — Googlebot among them. Were those to resolve to English, /hu would
 * bounce to / on every crawl and Hungarian would never be indexed.
 */
export function resolveLocaleRedirect({ pathname, localePref, acceptLanguage }: LocaleRedirectInput): string | null {
  if (!isRedirectablePath(pathname)) {
    return null;
  }

  const segment = pathname.split("/")[1];
  const pathLocale = isSupportedLocale(segment) ? segment : null;
  const current: Locale = pathLocale ?? DEFAULT_LOCALE;

  const preferred = isSupportedLocale(localePref) ? localePref : null;
  const detected = acceptLanguage == null ? undefined : firstSupportedLanguage(acceptLanguage);
  const effective = preferred ?? pathLocale ?? detected;

  if (effective == null || effective === current) {
    return null;
  }

  return localePath(pathname, effective);
}

/**
 * The edge-entry form: read the decision straight off a `Request` and return the
 * redirect response, or null to carry on into the app.
 *
 * Called before the edge cache lookup (see worker-wrapper.js) so that a request
 * which ought to move never consults, or populates, the cache entry belonging to
 * the language it is moving away from. Doing it after the lookup would let a
 * cache hit skip the decision entirely, since a hit never reaches middleware.
 */
export function redirectToCorrectLocale(request: Request): Response | null {
  // Only navigations. A redirected RSC payload request would break client-side
  // navigation rather than move the user, and a redirected mutation is a bug.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }
  if (request.headers.has("rsc")) {
    return null;
  }

  const cookieHeader = request.headers.get("Cookie");

  // Logged-in users have a stored account locale that ClientLocaleProvider
  // applies; a header guess must not pre-empt it with a redirect.
  if (readCookie(cookieHeader, AUTHENTICATION_COOKIE_NAME) != null) {
    return null;
  }

  const url = new URL(request.url);
  const target = resolveLocaleRedirect({
    pathname: url.pathname,
    localePref: readCookie(cookieHeader, LOCALE_PREF_COOKIE_NAME),
    acceptLanguage: request.headers.get("accept-language")
  });

  if (target == null) {
    return null;
  }

  const location = new URL(url.toString());
  location.pathname = target;

  return new Response(null, {
    status: 302,
    headers: {
      Location: location.toString(),
      // 302, and uncacheable: which locale a URL serves is a property of the
      // visitor, not of the URL. A cached redirect would pin one language's
      // answer onto everyone who follows, and a 301 would pin it in browsers
      // permanently. (The /en/x -> /x 308 elsewhere is a different thing: that
      // one really is a fixed property of the URL.)
      "Cache-Control": "private, no-store",
      Vary: "Accept-Language, Cookie"
    }
  });
}

/**
 * Paths that participate in this redirect: the apex and the public localizable
 * sections and pages, in naked or prefixed form.
 *
 * Deliberately narrower than LOCALIZABLE_BASES, which also covers UNCACHED_FLOWS
 * (/auth, /unsubscribe, /delete-account). Those carry OAuth and per-user token
 * state through the URL, and bouncing them mid-flow risks breaking the flow for
 * no benefit — someone in a signup flow has bigger concerns than the language of
 * the page. Auth-gated app routes have no [locale] tree at all and are excluded
 * by construction.
 */
function isRedirectablePath(pathname: string): boolean {
  const base = stripLocalePrefix(pathname);

  if (base === "/") {
    return true;
  }
  if (PUBLIC_SECTIONS.some((section) => base === section || base.startsWith(`${section}/`))) {
    return true;
  }
  return (PUBLIC_PAGES as readonly string[]).includes(base);
}
