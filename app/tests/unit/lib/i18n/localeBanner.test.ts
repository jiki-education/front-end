import {
  firstSupportedLanguage,
  localeCacheBucket,
  resolveBannerOffer,
  swapLocaleInPath
} from "@/lib/i18n/localeBanner";

describe("resolveBannerOffer", () => {
  describe("anonymous", () => {
    const anon = { isAuthed: false as const };

    it("skips entirely when there is no Accept-Language header (crawlers like Googlebot)", () => {
      expect(resolveBannerOffer({ ...anon, pathname: "/hu/blog/x", acceptLanguage: null })).toBeNull();
    });

    it("offers the preferred language on a page in another locale", () => {
      expect(resolveBannerOffer({ ...anon, pathname: "/blog/x", acceptLanguage: "hu" })).toEqual({
        offered: "hu",
        current: "en",
        href: "/hu/blog/x"
      });
    });

    it("shows nothing when already on the preferred locale", () => {
      expect(resolveBannerOffer({ ...anon, pathname: "/hu/blog/x", acceptLanguage: "hu" })).toBeNull();
    });

    it("falls back to English on a non-English page when none of their languages are supported", () => {
      expect(resolveBannerOffer({ ...anon, pathname: "/hu/blog/x", acceptLanguage: "de,fr;q=0.9" })).toEqual({
        offered: "en",
        current: "hu",
        href: "/blog/x"
      });
    });

    it("shows nothing on an English page when their languages are unsupported", () => {
      expect(resolveBannerOffer({ ...anon, pathname: "/blog/x", acceptLanguage: "de" })).toBeNull();
    });
  });

  describe("logged in", () => {
    it("offers the user's locale on a page in another locale", () => {
      expect(
        resolveBannerOffer({ pathname: "/blog/x", isAuthed: true, userLocale: "hu", acceptLanguage: null })
      ).toEqual({ offered: "hu", current: "en", href: "/hu/blog/x" });
    });

    it("shows nothing when the user is already on their locale", () => {
      expect(
        resolveBannerOffer({ pathname: "/hu/blog/x", isAuthed: true, userLocale: "hu", acceptLanguage: "en" })
      ).toBeNull();
    });

    it("treats a missing user locale as the default (no cookie yet)", () => {
      expect(
        resolveBannerOffer({ pathname: "/blog/x", isAuthed: true, userLocale: undefined, acceptLanguage: null })
      ).toBeNull();
    });
  });
});

describe("firstSupportedLanguage", () => {
  it("honours q-value ordering and skips unsupported tags", () => {
    expect(firstSupportedLanguage("de;q=0.9,hu;q=0.8")).toBe("hu");
  });

  it("matches a base language (pt-BR -> unsupported, hu-HU -> hu)", () => {
    expect(firstSupportedLanguage("hu-HU,en;q=0.9")).toBe("hu");
  });

  it("normalizes tag casing (Accept-Language isn't case-stable)", () => {
    expect(firstSupportedLanguage("HU")).toBe("hu");
    expect(firstSupportedLanguage("hu-hu")).toBe("hu");
  });

  it("returns undefined when nothing is supported", () => {
    expect(firstSupportedLanguage("de,fr,pt-BR")).toBeUndefined();
  });
});

describe("localeCacheBucket", () => {
  it("returns 'none' when there is no Accept-Language (crawler)", () => {
    expect(localeCacheBucket(null)).toBe("none");
  });

  it("returns the first supported language", () => {
    expect(localeCacheBucket("hu-HU,hu;q=0.9,en;q=0.8")).toBe("hu");
    expect(localeCacheBucket("en-US,en;q=0.9")).toBe("en");
  });

  it("falls back to the default locale when nothing is supported", () => {
    expect(localeCacheBucket("fr-FR,fr;q=0.9")).toBe("en");
  });
});

describe("swapLocaleInPath", () => {
  it("adds a non-default locale prefix", () => {
    expect(swapLocaleInPath("/blog/x", "hu")).toBe("/hu/blog/x");
  });

  it("strips the prefix for the default locale", () => {
    expect(swapLocaleInPath("/hu/blog/x", "en")).toBe("/blog/x");
  });

  it("handles the root path", () => {
    expect(swapLocaleInPath("/hu", "en")).toBe("/");
    expect(swapLocaleInPath("/", "hu")).toBe("/hu");
  });
});
