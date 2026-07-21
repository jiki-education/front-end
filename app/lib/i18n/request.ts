import { getRequestConfig } from "next-intl/server";
import { assetsUrl } from "@/lib/server/origin";
import { DEFAULT_TIME_ZONE, isSupportedLocale } from "./config";
import { createCatalogLoader } from "./catalogLoader";
import { resolveLocale } from "./resolveLocale";

// R2-fetched catalog loader (see lib/i18n/catalogLoader.ts): module-scope promise
// cache keyed `${locale}:${hash}`, reused across requests on a warm isolate; one
// retry on failure, then throw — NO bundled fallback, a failed load fails the
// request loudly, never silently renders English.
const loadMessages = createCatalogLoader((path) => assetsUrl(path));

export default getRequestConfig(async ({ requestLocale }) => {
  // An explicit locale (e.g. getTranslations({ locale }) for the locale banner,
  // which renders in the offered language) takes precedence; otherwise resolve
  // it from the request (URL/cookie/default).
  const requested = await requestLocale;
  const locale = isSupportedLocale(requested) ? requested : await resolveLocale();

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: DEFAULT_TIME_ZONE
  };
});
