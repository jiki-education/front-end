import { alternateLanguages, buildAlternates } from "@/lib/seo/alternates";

const SITE = "https://jiki.io";

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
    expect(alts?.languages).toEqual({
      en: `${SITE}/blog/hello-world`,
      hu: `${SITE}/hu/blog/hello-world`,
      "x-default": `${SITE}/blog/hello-world`
    });
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
    expect(alts?.languages).toEqual({
      en: `${SITE}/`,
      hu: `${SITE}/hu`,
      "x-default": `${SITE}/`
    });
  });
});

describe("alternateLanguages", () => {
  it("maps every supported locale plus x-default to absolute URLs", () => {
    expect(alternateLanguages("/help/streaks")).toEqual({
      en: `${SITE}/help/streaks`,
      hu: `${SITE}/hu/help/streaks`,
      "x-default": `${SITE}/help/streaks`
    });
  });
});
