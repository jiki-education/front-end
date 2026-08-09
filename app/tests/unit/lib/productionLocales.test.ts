import { ALL_LOCALES, PRODUCTION_LOCALES, DEFAULT_LOCALE } from "@/lib/locales";
import productionLocales from "@/lib/production-locales.json";

// production-locales.json is read by two things: lib/locales.ts, and the deploy
// gate in scripts/verify-locale-completeness.js, which runs as a plain node
// script and cannot import from TypeScript. These assertions are what keep the
// JSON honest, since its type is string[] and cannot express the constraint.
describe("production locales", () => {
  it("only lists locales the codebase knows", () => {
    const unknown = productionLocales.filter((locale) => !(ALL_LOCALES as readonly string[]).includes(locale));
    expect(unknown).toEqual([]);
  });

  it("always serves the default locale", () => {
    expect(PRODUCTION_LOCALES).toContain(DEFAULT_LOCALE);
  });

  it("matches what lib/locales.ts exports, so the gate and the app cannot disagree", () => {
    expect([...PRODUCTION_LOCALES]).toEqual(productionLocales);
  });
});
