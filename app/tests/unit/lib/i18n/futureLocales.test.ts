/**
 * The es/pt content locales (es-ES, es-419, pt-PT, pt-BR) aren't served yet —
 * lib/locales.ts still ships en/hu — but the locale machinery (routing, hreflang,
 * Accept-Language negotiation) must already be correct for them so going live is
 * just adding the locale + its catalog. These tests run that machinery against
 * the future set by mocking the locale config.
 *
 * The negotiation cases mirror the API's User::DetermineLocale acceptance oracle
 * (jiki-education/api test/commands/user/determine_locale_test.rb) — keep them in
 * sync.
 */
jest.mock("@/lib/locales", () => {
  const ALL_LOCALES = ["en", "hu", "es-ES", "es-419", "pt-PT", "pt-BR"] as const;
  return { ALL_LOCALES, DEFAULT_LOCALE: "en", SUPPORTED_LOCALES: ALL_LOCALES };
});

import { resolveLocaleRouting } from "@/lib/i18n/localeRouting";
import { firstSupportedLanguage, localeCacheBucket, resolveBannerOffer } from "@/lib/i18n/localeBanner";
import { alternateLanguages, hreflangLocale } from "@/lib/seo/alternates";

const SITE = "https://jiki.io";

describe("routing for region-suffixed locales", () => {
  it("passes canonical-cased locale paths through to [locale]", () => {
    expect(resolveLocaleRouting("/es-419/blog")).toEqual({ action: "none" });
    expect(resolveLocaleRouting("/es-ES/blog/my-post")).toEqual({ action: "none" });
    expect(resolveLocaleRouting("/pt-BR")).toEqual({ action: "none" });
    expect(resolveLocaleRouting("/pt-PT/premium")).toEqual({ action: "none" });
  });

  it("308s miscased locale segments to the canonical BCP-47 casing", () => {
    expect(resolveLocaleRouting("/es-es/blog")).toEqual({ action: "redirect", target: "/es-ES/blog" });
    expect(resolveLocaleRouting("/ES-419/blog")).toEqual({ action: "redirect", target: "/es-419/blog" });
    expect(resolveLocaleRouting("/pt-br/blog/my-post")).toEqual({ action: "redirect", target: "/pt-BR/blog/my-post" });
    expect(resolveLocaleRouting("/Pt-Br")).toEqual({ action: "redirect", target: "/pt-BR" });
  });

  it("leaves unknown region variants alone (not a supported locale in any casing)", () => {
    expect(resolveLocaleRouting("/es-mx/blog")).toEqual({ action: "none" });
    expect(resolveLocaleRouting("/es/blog")).toEqual({ action: "none" });
  });
});

describe("hreflang emission", () => {
  it("collapses es-419 to generic es (Google rejects UN M.49 region codes)", () => {
    expect(hreflangLocale("es-419" as never)).toBe("es");
  });

  it("passes ISO-valid ids through untouched", () => {
    expect(hreflangLocale("es-ES" as never)).toBe("es-ES");
    expect(hreflangLocale("pt-PT" as never)).toBe("pt-PT");
    expect(hreflangLocale("pt-BR" as never)).toBe("pt-BR");
    expect(hreflangLocale("en")).toBe("en");
  });

  it("keys the alternates map by hreflang value while URLs keep the internal id", () => {
    expect(alternateLanguages("/blog/hello")).toEqual({
      "x-default": `${SITE}/blog/hello`,
      en: `${SITE}/blog/hello`,
      hu: `${SITE}/hu/blog/hello`,
      "es-ES": `${SITE}/es-ES/blog/hello`,
      es: `${SITE}/es-419/blog/hello`,
      "pt-PT": `${SITE}/pt-PT/blog/hello`,
      "pt-BR": `${SITE}/pt-BR/blog/hello`
    });
  });

  it("never emits es-419 as an hreflang key", () => {
    expect(Object.keys(alternateLanguages("/premium"))).not.toContain("es-419");
  });
});

describe("Accept-Language negotiation (API acceptance oracle)", () => {
  it.each([
    ["pt-BR", "pt-BR"], // exact
    ["pt-PT", "pt-PT"], // exact
    ["pt", "pt-BR"], // bare pt -> Brazilian (CLDR)
    ["pt-MZ", "pt-PT"], // unlisted pt region -> European fallback
    ["es-ES, en", "es-ES"], // Spain -> Peninsular (exact match)
    ["es", "es-419"], // bare es -> Latin American (larger audience)
    ["es-MX, es-419, en", "es-419"], // es-MX collapses straight to es-419
    ["es-AR, en", "es-419"], // Latin American region
    ["es-CL, en", "es-419"], // Firefox/Safari send country codes, not es-419
    ["es-PE, en", "es-419"], // ditto
    ["es-419", "es-419"], // exact (Chromium sends this directly)
    ["es-ES, es-MX", "es-ES"], // first tag resolves exactly and wins
    ["es-es", "es-ES"], // case-normalized before matching
    ["ES-419", "es-419"], // ditto
    ["es-Latn-MX", "es-419"], // script subtag skipped, region still found
    ["it-IT, hu, en", "hu"], // it unsupported, next preference
    ["es-CL;q=0.9, es-ES;q=0.8", "es-419"] // q-ordering respected before resolving
  ])("%s -> %s", (header, expected) => {
    expect(firstSupportedLanguage(header)).toBe(expected);
  });

  it("returns undefined when nothing matches (caller applies the default)", () => {
    expect(firstSupportedLanguage("xx-YY")).toBeUndefined();
  });
});

describe("banner offer and cache bucket for variant locales", () => {
  it("offers es-419 (with its URL) to a LatAm country-code browser on an English page", () => {
    expect(resolveBannerOffer({ pathname: "/blog/x", isAuthed: false, acceptLanguage: "es-CL,es;q=0.9" })).toEqual({
      offered: "es-419",
      current: "en",
      href: "/es-419/blog/x"
    });
  });

  it("buckets the anonymous cache by the resolved variant", () => {
    expect(localeCacheBucket("es-CL,en;q=0.8")).toBe("es-419");
    expect(localeCacheBucket("pt")).toBe("pt-BR");
  });
});
