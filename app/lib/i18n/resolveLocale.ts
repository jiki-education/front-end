import { cookies, headers } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  URL_LOCALE_HEADER,
  isSupportedLocale,
  normalizeLocale,
  type Locale
} from "./config";

// Resolves the active UI locale for the current request. Precedence:
//
//   1. Explicit URL locale segment (e.g. /hu/blog), surfaced by middleware as the
//      x-url-locale header. Wins for everyone, so public/cacheable pages are
//      deterministic per URL.
//   2. Otherwise, if the auth-presence cookie exists (a possibly-logged-in user),
//      the NEXT_LOCALE cookie. This is the optimistic seed; the client corrects it
//      from /internal/me. See ClientLocaleProvider and .context/i18n.md.
//   3. Otherwise (anon, naked URL) the default locale. The NEXT_LOCALE cookie is
//      intentionally ignored here so anon cacheable pages stay deterministic.
export async function resolveLocale(): Promise<Locale> {
  const headerStore = await headers();
  const urlLocale = headerStore.get(URL_LOCALE_HEADER);
  if (isSupportedLocale(urlLocale)) {
    return urlLocale;
  }

  const cookieStore = await cookies();
  if (cookieStore.has(AUTHENTICATION_COOKIE_NAME)) {
    return normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  }

  return DEFAULT_LOCALE;
}
