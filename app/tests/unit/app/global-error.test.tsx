import { resolveGlobalErrorLocale } from "@/app/global-error";
import { getGlobalErrorCopy } from "@/lib/i18n/globalErrorCopy";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/config";
import messages from "@/messages.json";

// jsdom exposes a mutable location.pathname and document.cookie; the resolver reads
// both directly (it has no next/headers to mock), so we drive it via those globals.
function setPathname(pathname: string) {
  window.history.replaceState({}, "", pathname);
}

function clearCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}

describe("resolveGlobalErrorLocale", () => {
  beforeEach(() => {
    setPathname("/");
    clearCookies();
  });

  it("uses the URL locale segment when present, ignoring the cookie", () => {
    setPathname("/hu/blog");
    document.cookie = `${LOCALE_COOKIE_NAME}=en`;
    expect(resolveGlobalErrorLocale()).toBe("hu");
  });

  it("falls back to the NEXT_LOCALE cookie when the URL has no locale segment", () => {
    setPathname("/dashboard");
    document.cookie = `${LOCALE_COOKIE_NAME}=hu`;
    expect(resolveGlobalErrorLocale()).toBe("hu");
  });

  it("returns the default locale when neither URL nor cookie carry a supported locale", () => {
    setPathname("/dashboard");
    expect(resolveGlobalErrorLocale()).toBe("en");
  });

  it("ignores an unsupported URL locale segment and falls through to the default", () => {
    setPathname("/de/blog");
    expect(resolveGlobalErrorLocale()).toBe("en");
  });

  it("ignores an unsupported NEXT_LOCALE cookie value", () => {
    setPathname("/dashboard");
    document.cookie = `${LOCALE_COOKIE_NAME}=de`;
    expect(resolveGlobalErrorLocale()).toBe("en");
  });
});

describe("getGlobalErrorCopy", () => {
  /**
   * The copy is authored in the app UI catalogs (English here, every other locale
   * in the i18n repo) and inlined into lib/i18n/generated/global-error-copy.ts by
   * `pnpm global-error-copy:generate`. So the English assertion is against
   * messages.json rather than a literal: a copy change should be one edit, in the
   * catalog, not two.
   */
  it("returns the English copy from the catalog for en", () => {
    expect(getGlobalErrorCopy("en")).toEqual(messages.globalError);
  });

  it("returns a full copy entry for hu", () => {
    const copy = getGlobalErrorCopy("hu");
    expect(copy.title).toBeTruthy();
    expect(copy.message).toBeTruthy();
    expect(copy.actionLabel).toBeTruthy();
  });

  it("is not the English copy for hu (the inlining really carries translations)", () => {
    expect(getGlobalErrorCopy("hu")).not.toEqual(getGlobalErrorCopy("en"));
  });

  /**
   * Falling back rather than throwing is the point: this page renders after the
   * app has already crashed, so an untranslated locale must degrade to English
   * copy and never to a second crash. `pnpm locale:check` is what stops a
   * production locale relying on it silently.
   */
  it("falls back to the English copy for a locale with no entry", () => {
    expect(getGlobalErrorCopy("de")).toEqual(getGlobalErrorCopy("en"));
  });
});
