import { DEFAULT_LOCALE, isSupportedLocale, normalizeLocale, type Locale } from "./config";

export interface BannerInput {
  /** Current request path (e.g. "/hu/blog/x"), used to derive current locale + build the target href. */
  pathname: string;
  /** True when an auth-presence cookie exists (a possibly-logged-in user). */
  isAuthed: boolean;
  /** The logged-in user's locale (NEXT_LOCALE cookie mirror); used only when isAuthed. */
  userLocale?: string;
  /** The raw Accept-Language header, or null if absent (crawlers like Googlebot send none). */
  acceptLanguage: string | null;
}

export interface BannerOffer {
  offered: Locale;
  current: Locale;
  href: string;
}

/**
 * Decides whether to show the "view this page in <language>" banner, and in which
 * language. Returns null to show nothing.
 *
 * - current  = the locale in the URL path (naked path => default).
 * - offered  = the user's locale (logged in) or the first supported browser
 *   language (logged out); English if none are supported.
 * - Logged-out with NO Accept-Language header => null. This is deliberate: it
 *   skips crawlers (Googlebot sends no Accept-Language), keeping their view and
 *   the cached HTML banner-free.
 * - Show only when offered differs from the page's current locale.
 */
export function resolveBannerOffer(input: BannerInput): BannerOffer | null {
  const current = localeFromPath(input.pathname);

  let offered: Locale;
  if (input.isAuthed) {
    offered = normalizeLocale(input.userLocale);
  } else {
    // Anonymous: no Accept-Language means a crawler / non-browser — never show.
    if (input.acceptLanguage == null) {
      return null;
    }
    offered = firstSupportedLanguage(input.acceptLanguage) ?? DEFAULT_LOCALE;
  }

  if (offered === current) {
    return null;
  }

  return { offered, current, href: swapLocaleInPath(input.pathname, offered) };
}

/** The locale encoded in the URL path (first segment), or the default for a naked path. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isSupportedLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** Rewrite the path to the same page in `locale` (default locale => naked path). */
export function swapLocaleInPath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isSupportedLocale(segments[0])) {
    segments.shift();
  }
  const base = segments.length ? `/${segments.join("/")}` : "";
  return locale === DEFAULT_LOCALE ? base || "/" : `/${locale}${base}`;
}

/**
 * First supported locale in an Accept-Language header, honouring its ordering.
 * Tries an exact match then the base language (e.g. "pt-BR" -> "pt").
 */
export function firstSupportedLanguage(acceptLanguage: string): Locale | undefined {
  const tags = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1]) : 1;
      return { tag: tag.trim(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((entry) => entry.tag && entry.tag !== "*")
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of tags) {
    if (isSupportedLocale(tag)) {
      return tag;
    }
    const base = tag.split("-")[0];
    if (isSupportedLocale(base)) {
      return base;
    }
  }
  return undefined;
}
