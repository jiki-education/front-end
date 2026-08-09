import { stripLocalePrefix } from "@/lib/i18n/config";

describe("stripLocalePrefix", () => {
  it("strips a supported locale prefix down to the naked base", () => {
    expect(stripLocalePrefix("/hu/blog")).toBe("/blog");
    expect(stripLocalePrefix("/hu/blog/my-post")).toBe("/blog/my-post");
  });

  it("maps a bare supported locale to the apex", () => {
    expect(stripLocalePrefix("/hu")).toBe("/");
  });

  it("leaves naked paths untouched", () => {
    expect(stripLocalePrefix("/")).toBe("/");
    expect(stripLocalePrefix("/blog")).toBe("/blog");
    expect(stripLocalePrefix("/dashboard")).toBe("/dashboard");
  });

  it("does not strip an unsupported segment (it isn't a locale)", () => {
    expect(stripLocalePrefix("/zz/blog")).toBe("/zz/blog");
    expect(stripLocalePrefix("/xx")).toBe("/xx");
  });

  it("strips a region-subtag locale", () => {
    // Guards the hyphenated case: stripping keys off SUPPORTED_LOCALES rather
    // than a two-letter regex, so pt-BR is stripped exactly like a bare code.
    expect(stripLocalePrefix("/pt-BR/blog")).toBe("/blog");
  });
});
