import { resolveUserLocale } from "@/lib/i18n/userLocale";
import type { User } from "@/types/auth";

type LocaleFields = Pick<User, "locale" | "locales" | "explicit_locale">;

function user(locale: string, locales: string[], explicit: string | null = null): LocaleFields {
  return { locale, locales, explicit_locale: explicit };
}

// `en` and `hu` are the served locales here (SUPPORTED_LOCALES resolves to the
// full set outside a production build). `xx`/`zz` stand in for anything this
// build does not serve.
describe("resolveUserLocale", () => {
  it("lets an explicit choice beat both the browser list and the account preference", () => {
    expect(resolveUserLocale(user("en", ["xx", "en"], "hu"))).toBe("hu");
  });

  it("ignores an explicit choice this build doesn't serve", () => {
    expect(resolveUserLocale(user("en", ["hu"], "xx"))).toBe("hu");
  });

  it("falls through to the browser list when no explicit choice was made", () => {
    expect(resolveUserLocale(user("en", ["hu"], null))).toBe("hu");
  });

  it("prefers the first browser locale over the persisted account preference", () => {
    expect(resolveUserLocale(user("en", ["hu", "en"]))).toBe("hu");
  });

  it("falls back to the account preference when the browser list is empty", () => {
    expect(resolveUserLocale(user("hu", []))).toBe("hu");
  });

  it("skips leading browser locales this build doesn't serve", () => {
    expect(resolveUserLocale(user("en", ["xx", "zz", "hu"]))).toBe("hu");
  });

  it("falls back to the account preference when no browser locale is served", () => {
    expect(resolveUserLocale(user("hu", ["xx", "zz"]))).toBe("hu");
  });

  it("returns undefined when neither field yields a served locale", () => {
    // Callers keep whatever locale they already resolved rather than being
    // forced back to English.
    expect(resolveUserLocale(user("xx", ["zz"]))).toBeUndefined();
  });

  it("returns undefined for an anonymous user", () => {
    expect(resolveUserLocale(null)).toBeUndefined();
    expect(resolveUserLocale(undefined)).toBeUndefined();
  });

  it("degrades to the account preference when the API hasn't shipped `locales` yet", () => {
    const legacy = { locale: "hu" } as LocaleFields;
    expect(resolveUserLocale(legacy)).toBe("hu");
  });
});
