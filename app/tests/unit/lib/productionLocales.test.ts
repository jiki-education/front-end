import { ALL_LOCALES, PRODUCTION_LOCALES, DEFAULT_LOCALE } from "@/lib/locales";
import { LANGUAGES } from "@/lib/i18n/language-registry";
import productionLocales from "@/lib/production-locales.json";

/**
 * The locale sets are all derived from the roster in lib/i18n/language-registry.ts,
 * so most of what this used to assert is now unrepresentable. What remains is the
 * one thing derivation cannot enforce: `production-locales.json` is GENERATED
 * output that is committed, because the deploy gate
 * (scripts/verify-locale-completeness.js) runs as a plain node script and cannot
 * import TypeScript. A committed generated file can be stale.
 *
 * `pnpm locale:check` is the primary guard and says so in one message alongside
 * every other locale problem; this is the same claim asserted from inside the
 * test suite, where it also documents the relationship.
 */
describe("production locales", () => {
  it("is exactly the roster's production rung", () => {
    const fromRoster = LANGUAGES.filter((language) => language.status === "production").map(
      (language) => language.code
    );
    expect([...PRODUCTION_LOCALES]).toEqual(fromRoster);
  });

  it("is a subset of the locales the codebase knows", () => {
    const unknown = PRODUCTION_LOCALES.filter((locale) => !ALL_LOCALES.includes(locale));
    expect(unknown).toEqual([]);
  });

  it("always serves the default locale", () => {
    expect(PRODUCTION_LOCALES).toContain(DEFAULT_LOCALE);
  });

  it("matches the generated JSON the deploy gate reads, so the two cannot disagree", () => {
    expect(productionLocales).toEqual([...PRODUCTION_LOCALES]);
  });
});
