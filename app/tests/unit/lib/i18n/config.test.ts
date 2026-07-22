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
    expect(stripLocalePrefix("/de/blog")).toBe("/de/blog");
    expect(stripLocalePrefix("/xx")).toBe("/xx");
    // Region subtags only strip once supported; pt-BR isn't yet, so it's left as-is.
    expect(stripLocalePrefix("/pt-BR/blog")).toBe("/pt-BR/blog");
  });
});
