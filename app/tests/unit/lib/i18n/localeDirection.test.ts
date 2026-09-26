/**
 * `getLocaleDirection` drives the `dir` attribute on `<html>` (server via layout,
 * client via ClientLocaleProvider on a locale swap). Adding a locale to
 * RTL_LOCALES is all it takes for the page to flip to "rtl".
 */
import { ALL_LOCALES, getLocaleDirection, RTL_LOCALES } from "@/lib/locales";

const EXPECTED_RTL = ["ar", "fa"];

describe("getLocaleDirection", () => {
  it("returns rtl for every right-to-left locale", () => {
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

  it("only lists locales the app knows about as RTL", () => {
    for (const locale of RTL_LOCALES) {
      expect(ALL_LOCALES).toContain(locale);
    }
  });
});
