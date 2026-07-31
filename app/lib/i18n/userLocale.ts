import type { User } from "@/types/auth";
import { isSupportedLocale } from "./config";
import type { Locale } from "./config";

type LocaleFields = Pick<User, "locale" | "locales" | "explicit_locale">;

/**
 * The UI locale to use for a logged-in user, in precedence order:
 *
 * 1. `explicit_locale` — a locale the user deliberately chose. It wins outright:
 *    a deliberate choice must never be overridden by what the browser is asking
 *    for, otherwise switching language would silently revert on the next load.
 * 2. `locales` — every locale the API parsed out of the browser's Accept-Language
 *    string, in the browser's preference order. We take the first served entry.
 * 3. `locale` — the persisted account preference.
 *
 * Returns undefined when none of them yields a served locale, so callers can keep
 * whatever locale they already resolved rather than being forced back to English.
 */
export function resolveUserLocale(user: LocaleFields | null | undefined): Locale | undefined {
  if (!user) {
    return undefined;
  }

  if (isSupportedLocale(user.explicit_locale)) {
    return user.explicit_locale;
  }

  // Guarded rather than trusting the type: `locales` is new on /internal/me, so an
  // API that hasn't shipped it yet must degrade to `locale`, not throw.
  const preferred = Array.isArray(user.locales) ? user.locales.find(isSupportedLocale) : undefined;
  if (preferred) {
    return preferred;
  }

  return isSupportedLocale(user.locale) ? user.locale : undefined;
}
