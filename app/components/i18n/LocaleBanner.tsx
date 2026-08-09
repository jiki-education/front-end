import { LocaleBannerBar, LocaleBannerDismiss } from "@/components/i18n/LocaleBannerBar";
import Link from "next/link";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { LOCALE_COOKIE_NAME, PATHNAME_HEADER } from "@/lib/i18n/config";
import { languageName } from "@/lib/i18n/languageNames";
import { resolveBannerOffer } from "@/lib/i18n/localeBanner";
import { getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";

/**
 * Server-rendered "view this page in <your language>" banner.
 *
 * Reads the request server-side (so it never runs for a crawler that sends no
 * Accept-Language, and so nothing flashes on the client). The copy reads in the
 * OFFERED language, not the request locale, so it's loaded with an explicit
 * `getTranslations({ locale: offered })`. See resolveBannerOffer for the rule.
 */
export async function LocaleBanner() {
  const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);

  const pathname = headerStore.get(PATHNAME_HEADER);
  if (!pathname) {
    return null;
  }

  const offer = resolveBannerOffer({
    pathname,
    isAuthed: cookieStore.has(AUTHENTICATION_COOKIE_NAME),
    userLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: headerStore.get("accept-language")
  });

  if (!offer) {
    return null;
  }

  const t = await getTranslations({ locale: offer.offered, namespace: "layout.localeBanner" });

  return (
    <LocaleBannerBar offered={offer.offered}>
      {t.rich("message", {
        current: languageName(offer.current, offer.offered),
        offered: languageName(offer.offered, offer.offered),
        link: (chunks) => <Link href={offer.href}>{chunks}</Link>,
        dismiss: (chunks) => <LocaleBannerDismiss>{chunks}</LocaleBannerDismiss>
      })}
    </LocaleBannerBar>
  );
}
