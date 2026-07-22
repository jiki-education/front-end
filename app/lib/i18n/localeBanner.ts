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
 * The cache-key discriminator for an anonymous request: the language the banner
 * would offer ("en"/"hu"), or "none" when there's no Accept-Language (crawler).
 *
 * The anonymous banner depends only on (path locale, this value), and the path
 * is already in the cache key, so appending this gives each banner variant its
 * own cache entry (no cross-language poisoning). Must stay in lock-step with the
 * anonymous branch of resolveBannerOffer.
 */
export function localeCacheBucket(acceptLanguage: string | null): string {
  if (acceptLanguage == null) {
    return "none";
  }
  return firstSupportedLanguage(acceptLanguage) ?? DEFAULT_LOCALE;
}

/**
 * First supported locale in an Accept-Language header, honouring its ordering.
 * Each tag is fully resolved (an exact case-normalized match, else its
 * region-collapsed content variant / base language) before moving on, so a later
 * exact match never leapfrogs an earlier tag that already collapses to something
 * supported.
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
    const resolved = resolveTag(tag);
    if (resolved != null) {
      return resolved;
    }
  }
  return undefined;
}

/**
 * Some languages ship more than one content variant, and which one a browser
 * gets depends on the region in its tag. Maps each such language to:
 * - `bare`: the variant for a region-less tag (e.g. "pt" -> pt-BR)
 * - `regions`: explicit region -> variant overrides
 * - `fallback`: the variant for any region not listed above
 *
 * Chromium sends "es-419" directly, but Firefox and Safari send country codes
 * ("es-CL", "es-AR"), so every non-ES region must collapse to the Latin American
 * variant. A language absent here simply collapses to its base language.
 *
 * Mirrors the API's User::DetermineLocale LANGUAGE_VARIANTS — keep them in sync.
 */
const LANGUAGE_VARIANTS: Record<
  string,
  { bare: string; regions: Record<string, string>; fallback: string } | undefined
> = {
  pt: { bare: "pt-BR", regions: { BR: "pt-BR" }, fallback: "pt-PT" },
  es: { bare: "es-419", regions: { ES: "es-ES" }, fallback: "es-419" }
};

/** Resolve one Accept-Language tag to a supported locale, or undefined. */
function resolveTag(tag: string): Locale | undefined {
  const parsed = parseTag(tag);
  if (parsed == null) {
    return undefined;
  }
  if (isSupportedLocale(parsed.canonical)) {
    return parsed.canonical;
  }
  const collapsed = collapseTag(parsed.language, parsed.region);
  if (isSupportedLocale(collapsed)) {
    return collapsed;
  }
  return undefined;
}

/** The content variant (or bare base language) a language+region collapses to. */
function collapseTag(language: string, region: string | undefined): string {
  const variants = LANGUAGE_VARIANTS[language];
  if (variants == null) {
    return language;
  }
  if (region == null) {
    return variants.bare;
  }
  return variants.regions[region] ?? variants.fallback;
}

/**
 * Split a tag into language/region/canonical, normalizing case since
 * Accept-Language isn't case-stable ("pt-br", "ES"): language lowercased, region
 * uppercased. Region is the first 2-alpha or 3-digit subtag, so script subtags
 * (the "Latn" in "es-Latn-MX") are skipped. Undefined for a language-less tag.
 */
function parseTag(tag: string): { language: string; region: string | undefined; canonical: string } | undefined {
  const parts = tag.split("-");
  const language = parts[0]?.toLowerCase();
  if (!language) {
    return undefined;
  }
  const region = parts
    .slice(1)
    .find((part) => /^([A-Za-z]{2}|\d{3})$/.test(part))
    ?.toUpperCase();
  const canonical = region != null ? `${language}-${region}` : language;
  return { language, region, canonical };
}
