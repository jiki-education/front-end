import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "./config";

// Resolves the active UI locale for the current request. We run next-intl in
// "without i18n routing" mode, so the locale comes from the NEXT_LOCALE cookie
// (set when the user picks a locale, mirroring their Rails-stored preference),
// falling back to the default locale. URL-based locale routing is intentionally
// not wired here yet — see .context/i18n.md.
export async function resolveLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE_NAME)?.value);
}
