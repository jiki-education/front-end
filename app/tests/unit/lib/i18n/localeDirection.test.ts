/**
 * `getLocaleDirection` drives the `dir` attribute on `<html>` (server via layout,
 * client via ClientLocaleProvider on a locale swap). Membership of RTL_LOCALES is
 * the only thing that flips a locale's direction.
 */
import { ALL_LOCALES, getLocaleDirection, RTL_LOCALES } from "@/lib/locales";

const EXPECTED_RTL = ["ar", "fa", "he", "ur"];

describe("getLocaleDirection", () => {
  it("returns rtl for every RTL locale", () => {
    for (const locale of EXPECTED_RTL) {
      expect(getLocaleDirection(locale)).toBe("rtl");
    }
  });

  it("returns ltr for every other known locale", () => {
    for (const locale of ALL_LOCALES) {
      if (EXPECTED_RTL.includes(locale)) {
        continue;
      }
      expect(getLocaleDirection(locale)).toBe("ltr");
    }
  });

  it("returns ltr for en specifically", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
  });

  it("returns ltr for an unknown/unsupported string", () => {
    expect(getLocaleDirection("xx-YY")).toBe("ltr");
  });

  it("RTL_LOCALES holds exactly the right-to-left locales", () => {
    expect([...RTL_LOCALES].sort()).toEqual([...EXPECTED_RTL].sort());
  });
});
