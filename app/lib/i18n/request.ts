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
    messages: (await import(`@/messages/${locale}.json`)).default,
    // Fix the time zone so next-intl formats dates identically on the server
    // (UTC on the Cloudflare Worker) and the client (the visitor's zone),
    // avoiding hydration mismatches and the ENVIRONMENT_FALLBACK warning. Site
    // dates are mostly date-only blog/article dates, so a fixed zone is correct;
    // a per-user zone can come later from /me.
    timeZone: "UTC"
  };
});
