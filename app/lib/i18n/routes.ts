import { DEFAULT_LOCALE, type Locale, isLocalizableBase, normalizeLocale, stripLocalePrefix } from "./config";

/**
 * Build a locale-aware URL for `path`, the exact inverse of the middleware's
 * `resolveLocaleRouting`, so the URL contract ("default locale is naked, others
 * are `/<locale>`-prefixed") lives in one place instead of being re-implemented
 * inline at every call site.
 *
 * Rules (mirroring middleware):
 * - Default locale (`en`) -> naked path (`/blog`).
 * - Non-default locale -> `/<locale>`-prefixed **only** for a localizable base
 *   (one with a `[locale]` tree). Auth-gated app routes like `/dashboard` have no
 *   `[locale]` tree, so they stay naked in every locale.
 * - Idempotent: an already-prefixed input is normalized first, so passing
 *   `/hu/blog` (or an accidental double locale) still yields a single correct prefix.
 * - Query string and hash are preserved untouched.
 *
 * The primitive takes an explicit `locale`. In React, prefer the ambient wrappers
 * — `useLocaleRoutes()` (client) / `getLocaleRoutes()` (server) — which read the
 * current locale for you; reach for this directly only in non-React code (stores,
 * plain event utils) where nothing ambient exists.
 */
export function localePath(path: string, locale: Locale | string): string {
  const activeLocale = normalizeLocale(locale);

  // Split off query/hash so only the pathname is rewritten.
  const suffixMatch = path.match(/[?#]/);
  const suffixIndex = suffixMatch?.index ?? path.length;
  const pathname = path.slice(0, suffixIndex);
  const suffix = path.slice(suffixIndex);

  // Normalize any existing locale prefix back to the naked base first (idempotency).
  const naked = stripLocalePrefix(pathname);

  if (activeLocale === DEFAULT_LOCALE) {
    return `${naked}${suffix}`;
  }

  // Home ("/") and localizable bases have a [locale] tree; everything else stays naked.
  if (naked === "/" || isLocalizableBase(naked)) {
    const base = naked === "/" ? "" : naked;
    return `/${activeLocale}${base}${suffix}`;
  }

  return `${naked}${suffix}`;
}

/**
 * Rails-style named route helpers bound to a single `locale`. Each helper is the
 * one canonical place a given path string is written, so a route move is a
 * one-line change here, and callers get autocomplete instead of stringly-typed paths.
 *
 * Consumed by the ambient wrappers (`useLocaleRoutes` / `getLocaleRoutes`); most
 * call sites use those rather than calling `makeRoutes` directly.
 */
export function makeRoutes(locale: Locale) {
  const path = (p: string) => localePath(p, locale);

  return {
    home: () => path("/"),

    // Auth (external, localized)
    authLogin: () => path("/auth/login"),
    authSignup: () => path("/auth/signup"),
    authForgotPassword: () => path("/auth/forgot-password"),
    authResetPassword: () => path("/auth/reset-password"),
    authResendConfirmation: () => path("/auth/resend-confirmation"),
    authConfirmEmail: () => path("/auth/confirm-email"),
    authCheckEmail: () => path("/auth/check-email"),

    // Public marketing/content sections (localized)
    premium: () => path("/premium"),
    roadmap: () => path("/roadmap"),
    testimonials: () => path("/testimonials"),
    blog: () => path("/blog"),
    blogPost: (slug: string) => path(`/blog/${slug}`),
    articles: () => path("/articles"),
    article: (slug: string) => path(`/articles/${slug}`),
    concepts: () => path("/concepts"),
    concept: (slug: string) => path(`/concepts/${slug}`),

    // Auth-gated app routes (no [locale] tree -> always naked; locale ignored)
    dashboard: () => path("/dashboard"),
    settings: () => path("/settings")
  };
}

export type LocaleRoutes = ReturnType<typeof makeRoutes>;
