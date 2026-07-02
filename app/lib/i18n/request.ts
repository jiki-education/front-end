import { getRequestConfig } from "next-intl/server";
import { isSupportedLocale } from "./config";
import { resolveLocale } from "./resolveLocale";

export default getRequestConfig(async ({ requestLocale }) => {
  // An explicit locale (e.g. getTranslations({ locale }) for the locale banner,
  // which renders in the offered language) takes precedence; otherwise resolve
  // it from the request (URL/cookie/default).
  const requested = await requestLocale;
  const locale = isSupportedLocale(requested) ? requested : await resolveLocale();

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});
