import type { Locale } from "./config";

/**
 * The display name of `locale`, written in `inLocale`.
 *
 * Uses `Intl.DisplayNames` rather than an authored `common.languageNames` catalog
 * entry, because that catalog would need an entry for every locale in every other
 * locale (a 30x30 matrix) and would silently go stale each time a locale is added.
 * ICU already ships this data, including for region-suffixed ids like `es-419`
 * ("Latin American Spanish") and `pt-BR`.
 *
 * Falls back to the locale code itself if ICU has no name for it (or is built
 * without the data), so the caller always has something renderable.
 */
export function languageName(locale: Locale | string, inLocale: Locale | string): string {
  try {
    return new Intl.DisplayNames([inLocale], { type: "language" }).of(locale) ?? locale;
  } catch {
    return locale;
  }
}
