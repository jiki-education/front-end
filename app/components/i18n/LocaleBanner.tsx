import { LocaleBannerBar } from "@/components/i18n/LocaleBannerBar";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { LOCALE_COOKIE_NAME, PATHNAME_HEADER } from "@/lib/i18n/config";
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

  const [t, names] = await Promise.all([
    getTranslations({ locale: offer.offered, namespace: "layout.localeBanner" }),
    getTranslations({ locale: offer.offered, namespace: "common.languageNames" })
  ]);

  return (
    <LocaleBannerBar
      href={offer.href}
      offered={offer.offered}
      prefix={t("prefix", { language: names(offer.current) })}
      cta={t("cta", { language: names(offer.offered) })}
      or={t("or")}
      close={t("close")}
    />
  );
}
