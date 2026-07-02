import { detectSeedLocale } from "@/lib/i18n/detectSeedLocale";

describe("detectSeedLocale", () => {
  it("returns a non-default resolved locale (an explicit, demonstrated signal)", () => {
    expect(detectSeedLocale("hu")).toBe("hu");
  });

  it("returns undefined for the default locale, so signup omits it and the backend uses Accept-Language", () => {
    expect(detectSeedLocale("en")).toBeUndefined();
  });

  it("returns undefined for an unsupported locale (normalizes to default -> omit)", () => {
    expect(detectSeedLocale("de")).toBeUndefined();
    expect(detectSeedLocale("")).toBeUndefined();
    expect(detectSeedLocale("not-a-locale")).toBeUndefined();
  });
});
