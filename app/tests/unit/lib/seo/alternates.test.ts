import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { alternateLanguages, buildAlternates, hreflangLocale } from "@/lib/seo/alternates";

const SITE = "https://jiki.io";

// The hreflang map the site's URL rule implies for a locale-less path: default
// locale naked, every other locale `/<locale>`-prefixed, plus x-default pointing
// at the default-locale URL. Derived from SUPPORTED_LOCALES so adding a locale
// doesn't need this file edited, while still asserting the rule itself.
function expectedLanguages(localelessPath: string): Record<string, string> {
  const naked = `${SITE}${localelessPath}`;
  const prefixed = (locale: string) =>
    localelessPath === "/" ? `${SITE}/${locale}` : `${SITE}/${locale}${localelessPath}`;

  const languages: Record<string, string> = { "x-default": naked };
  for (const locale of SUPPORTED_LOCALES) {
    languages[hreflangLocale(locale)] = locale === "en" ? naked : prefixed(locale);
  }
  return languages;
}

describe("buildAlternates", () => {
  it("emits a self-referential canonical for the naked-en variant", () => {
    const alts = buildAlternates("/blog/hello-world", "en");
    expect(alts?.canonical).toBe(`${SITE}/blog/hello-world`);
  });

  it("emits a self-referential canonical for the /hu variant (never hu -> en)", () => {
    const alts = buildAlternates("/blog/hello-world", "hu");
    expect(alts?.canonical).toBe(`${SITE}/hu/blog/hello-world`);
  });

  it("builds absolute, reciprocal language URLs with x-default pointing at en", () => {
    const alts = buildAlternates("/blog/hello-world", "hu");
    expect(alts?.languages).toEqual(expectedLanguages("/blog/hello-world"));
    expect(alts?.languages?.en).toBe(`${SITE}/blog/hello-world`);
    expect(alts?.languages?.hu).toBe(`${SITE}/hu/blog/hello-world`);
    expect(alts?.languages?.["x-default"]).toBe(`${SITE}/blog/hello-world`);
  });

  it("returns the same languages map regardless of the current locale (only canonical differs)", () => {
    const en = buildAlternates("/premium", "en");
    const hu = buildAlternates("/premium", "hu");
    expect(en?.languages).toEqual(hu?.languages);
    expect(en?.canonical).not.toBe(hu?.canonical);
  });

  it("handles the root path", () => {
    const alts = buildAlternates("/", "en");
    expect(alts?.canonical).toBe(`${SITE}/`);
    expect(alts?.languages).toEqual(expectedLanguages("/"));
    expect(alts?.languages?.en).toBe(`${SITE}/`);
    expect(alts?.languages?.hu).toBe(`${SITE}/hu`);
  });
});

describe("alternateLanguages", () => {
  it("maps every supported locale plus x-default to absolute URLs", () => {
    expect(alternateLanguages("/help/streaks")).toEqual(expectedLanguages("/help/streaks"));
    expect(Object.keys(alternateLanguages("/help/streaks")).sort()).toEqual(
      [...SUPPORTED_LOCALES.map(hreflangLocale), "x-default"].sort()
    );
  });
});
