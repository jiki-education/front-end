import { resolveGlobalErrorLocale, getGlobalErrorCopy } from "@/app/global-error";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/config";

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
  it("returns the English copy for en", () => {
    expect(getGlobalErrorCopy("en")).toEqual({
      title: "Something went wrong",
      message: "We encountered an unexpected error. Sorry about that!",
      actionLabel: "Try again"
    });
  });

  it("returns a full copy entry for hu", () => {
    const copy = getGlobalErrorCopy("hu");
    expect(copy.title).toBeTruthy();
    expect(copy.message).toBeTruthy();
    expect(copy.actionLabel).toBeTruthy();
  });

  it("falls back to the English copy for an unknown locale", () => {
    expect(getGlobalErrorCopy("de")).toEqual(getGlobalErrorCopy("en"));
  });
});
