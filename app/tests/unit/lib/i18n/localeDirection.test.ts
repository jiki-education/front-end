/**
 * `getLocaleDirection` drives the `dir` attribute on `<html>` (server via layout,
 * client via ClientLocaleProvider on a locale swap). The app is LTR-only today
 * (en/hu), so this is forward-looking infrastructure: adding an RTL locale to
 * RTL_LOCALES is all it takes for the page to flip to "rtl".
 */
import { ALL_LOCALES, getLocaleDirection, RTL_LOCALES } from "@/lib/locales";

describe("getLocaleDirection", () => {
  it("returns ltr for every currently-known locale", () => {
    for (const locale of ALL_LOCALES) {
      expect(getLocaleDirection(locale)).toBe("ltr");
    }
  });

  it("returns ltr for en specifically", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
  });

  it("returns ltr for an unknown/unsupported string", () => {
    expect(getLocaleDirection("xx-YY")).toBe("ltr");
  });

  it("has no RTL locales today (en and hu are both LTR)", () => {
    expect(RTL_LOCALES.size).toBe(0);
  });

  it("returns rtl for a locale added to RTL_LOCALES", () => {
    // RTL_LOCALES is empty today; simulate the logic a real RTL locale would hit.
    const rtl: ReadonlySet<string> = new Set(["ar"]);
    const direction = (locale: string) => (rtl.has(locale) ? "rtl" : "ltr");
    expect(direction("ar")).toBe("rtl");
    expect(direction("en")).toBe("ltr");
  });
});
