/**
 * `getLocaleDirection` drives the `dir` attribute on `<html>` (server via layout,
 * client via ClientLocaleProvider on a locale swap).
 *
 * STAGING PREVIEW ONLY (branch translatathon-2-serve-all-locales). On main the
 * app is LTR-only and this file asserts `RTL_LOCALES.size === 0`. This branch
 * serves all 33 translated locales, four of which are RTL, so the assertions
 * flip: they now check that those four report "rtl" and that nothing else does.
 * Both versions test the same thing, which is that RTL_LOCALES is what decides.
 */
import { ALL_LOCALES, getLocaleDirection, RTL_LOCALES } from "@/lib/locales";

const EXPECTED_RTL = ["ar", "fa", "he", "ur"];

describe("getLocaleDirection", () => {
  it("returns rtl for exactly the right-to-left locales", () => {
    expect([...RTL_LOCALES].sort()).toEqual(EXPECTED_RTL);
    for (const locale of EXPECTED_RTL) {
      expect(getLocaleDirection(locale)).toBe("rtl");
    }
  });

  it("returns ltr for every other known locale", () => {
    for (const locale of ALL_LOCALES) {
      if (EXPECTED_RTL.includes(locale)) continue;
      expect(getLocaleDirection(locale)).toBe("ltr");
    }
  });

  it("returns ltr for en specifically", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
  });

  it("returns ltr for an unknown/unsupported string", () => {
    expect(getLocaleDirection("xx-YY")).toBe("ltr");
  });

  it("every RTL locale is one the app knows about", () => {
    for (const locale of RTL_LOCALES) {
      expect(ALL_LOCALES).toContain(locale);
    }
  });
});
