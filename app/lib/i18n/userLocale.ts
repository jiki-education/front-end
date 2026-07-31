import type { User } from "@/types/auth";
import { isSupportedLocale } from "./config";
import type { Locale } from "./config";

/**
 * The UI locale to use for a logged-in user.
 *
 * /internal/me returns two locale fields: `locale` (the persisted account
 * preference) and `locales` (every locale the API parsed out of the browser's
 * Accept-Language string, in the browser's preference order). We take the FIRST
 * entry of `locales`, falling back to `locale` when the list is absent, empty, or
 * leads with something this build doesn't serve.
 *
 * Returns undefined when neither field yields a served locale, so callers can keep
 * whatever locale they already resolved rather than being forced back to English.
 */
export function resolveUserLocale(user: Pick<User, "locale" | "locales"> | null | undefined): Locale | undefined {
  if (!user) {
    return undefined;
  }

  // Guarded rather than trusting the type: `locales` is new on /internal/me, so an
  // API that hasn't shipped it yet must degrade to `locale`, not throw.
  const preferred = Array.isArray(user.locales) ? user.locales.find(isSupportedLocale) : undefined;
  if (preferred) {
    return preferred;
  }

  return isSupportedLocale(user.locale) ? user.locale : undefined;
}
