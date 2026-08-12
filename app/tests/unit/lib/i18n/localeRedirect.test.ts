import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { LOCALE_PREF_COOKIE_NAME } from "@/lib/i18n/config";
import { redirectToCorrectLocale, resolveLocaleRedirect } from "@/lib/i18n/localeRedirect";

describe("resolveLocaleRedirect", () => {
  // The full decision table. Every combination of (path locale, preference
  // cookie, Accept-Language) is enumerated rather than sampled, because the
  // interesting behaviour lives in the combinations rather than in any one input
  // — and because the rows that must NOT redirect are the ones that break
  // crawling and deep links when they regress.
  const HU_FIRST = "hu,en-US;q=0.9,en;q=0.8";
  const EN_FIRST = "en-GB,en;q=0.9";
  const UNSUPPORTED = "de-DE,de;q=0.9";

  it.each`
    pathname | localePref | acceptLanguage | expected | why
    ${"/"}   | ${null}    | ${HU_FIRST}    | ${"/hu"} | ${"naked URL, no choice made, Hungarian browser"}
    ${"/"}   | ${null}    | ${EN_FIRST}    | ${null}  | ${"already the right language"}
    ${"/"}   | ${null}    | ${null}        | ${null}  | ${"crawler: no Accept-Language"}
    ${"/"}   | ${null}    | ${UNSUPPORTED} | ${null}  | ${"no supported language to move to"}
    ${"/"}   | ${"en"}    | ${HU_FIRST}    | ${null}  | ${"chose English, browser overruled"}
    ${"/"}   | ${"en"}    | ${EN_FIRST}    | ${null}  | ${"chose English, already there"}
    ${"/"}   | ${"en"}    | ${null}        | ${null}  | ${"chose English, already there"}
    ${"/"}   | ${"hu"}    | ${HU_FIRST}    | ${"/hu"} | ${"chose Hungarian"}
    ${"/"}   | ${"hu"}    | ${EN_FIRST}    | ${"/hu"} | ${"chose Hungarian, English browser overruled"}
    ${"/"}   | ${"hu"}    | ${null}        | ${"/hu"} | ${"chose Hungarian, no header needed"}
    ${"/hu"} | ${null}    | ${HU_FIRST}    | ${null}  | ${"already the right language"}
    ${"/hu"} | ${null}    | ${EN_FIRST}    | ${null}  | ${"explicit URL beats a browser guess"}
    ${"/hu"} | ${null}    | ${null}        | ${null}  | ${"crawler must be able to index /hu"}
    ${"/hu"} | ${"en"}    | ${HU_FIRST}    | ${"/"}   | ${"chose English, follows a Hungarian link"}
    ${"/hu"} | ${"en"}    | ${EN_FIRST}    | ${"/"}   | ${"chose English"}
    ${"/hu"} | ${"en"}    | ${null}        | ${"/"}   | ${"chose English"}
    ${"/hu"} | ${"hu"}    | ${EN_FIRST}    | ${null}  | ${"chose Hungarian, already there"}
  `(
    "$pathname (pref=$localePref, AL=$acceptLanguage) -> $expected: $why",
    ({ pathname, localePref, acceptLanguage, expected }) => {
      expect(resolveLocaleRedirect({ pathname, localePref, acceptLanguage })).toBe(expected);
    }
  );

  it("carries the rest of the path across", () => {
    expect(resolveLocaleRedirect({ pathname: "/blog/my-post", localePref: null, acceptLanguage: HU_FIRST })).toBe(
      "/hu/blog/my-post"
    );
    expect(resolveLocaleRedirect({ pathname: "/hu/blog/my-post", localePref: "en", acceptLanguage: null })).toBe(
      "/blog/my-post"
    );
  });

  it("leaves paths with no [locale] tree alone", () => {
    // Auth-gated app routes are served naked in every locale, so there is no
    // other URL to send anyone to.
    expect(resolveLocaleRedirect({ pathname: "/dashboard", localePref: "hu", acceptLanguage: HU_FIRST })).toBeNull();
    expect(resolveLocaleRedirect({ pathname: "/settings", localePref: null, acceptLanguage: HU_FIRST })).toBeNull();
  });

  it("leaves stateful flows alone mid-flight", () => {
    // /auth and friends are localizable but carry OAuth/token state through the
    // URL; bouncing someone mid-signup to change the page's language is a poor
    // trade.
    expect(resolveLocaleRedirect({ pathname: "/auth/login", localePref: "hu", acceptLanguage: HU_FIRST })).toBeNull();
    expect(resolveLocaleRedirect({ pathname: "/unsubscribe", localePref: "hu", acceptLanguage: null })).toBeNull();
  });

  it("ignores a preference cookie naming a locale we don't serve", () => {
    expect(resolveLocaleRedirect({ pathname: "/", localePref: "zz", acceptLanguage: HU_FIRST })).toBe("/hu");
  });

  it("honours Accept-Language quality ordering", () => {
    // en is listed first but ranked lower, so hu wins.
    expect(resolveLocaleRedirect({ pathname: "/", localePref: null, acceptLanguage: "en;q=0.5,hu;q=0.9" })).toBe("/hu");
  });
});

describe("redirectToCorrectLocale", () => {
  const request = (url: string, headers: Record<string, string> = {}) => new Request(url, { headers });

  it("302s to the target, preserving the query string", () => {
    const response = redirectToCorrectLocale(request("https://jiki.io/blog?page=2", { "accept-language": "hu" }));

    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe("https://jiki.io/hu/blog?page=2");
  });

  it("never lets the redirect itself be cached", () => {
    // Which locale a URL serves is a property of the visitor, not the URL, so a
    // shared cache holding this answer would pin one language onto everyone.
    const response = redirectToCorrectLocale(request("https://jiki.io/", { "accept-language": "hu" }));

    expect(response?.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response?.headers.get("Vary")).toBe("Accept-Language, Cookie");
  });

  it("reads the preference out of the cookie header", () => {
    const response = redirectToCorrectLocale(
      request("https://jiki.io/", { "accept-language": "en", cookie: `${LOCALE_PREF_COOKIE_NAME}=hu` })
    );

    expect(response?.headers.get("Location")).toBe("https://jiki.io/hu");
  });

  it("leaves logged-in users to their account preference", () => {
    const response = redirectToCorrectLocale(
      request("https://jiki.io/", { "accept-language": "hu", cookie: `${AUTHENTICATION_COOKIE_NAME}=42` })
    );

    expect(response).toBeNull();
  });

  it("leaves RSC payload requests alone", () => {
    // Redirecting one of these breaks a client-side navigation rather than
    // moving the user.
    const response = redirectToCorrectLocale(request("https://jiki.io/", { "accept-language": "hu", rsc: "1" }));

    expect(response).toBeNull();
  });

  it("leaves non-navigations alone", () => {
    const response = redirectToCorrectLocale(
      new Request("https://jiki.io/", { method: "POST", headers: { "accept-language": "hu" } })
    );

    expect(response).toBeNull();
  });

  it("returns null when nothing needs to move", () => {
    expect(redirectToCorrectLocale(request("https://jiki.io/", { "accept-language": "en" }))).toBeNull();
    expect(redirectToCorrectLocale(request("https://jiki.io/static/logo.svg", { "accept-language": "hu" }))).toBeNull();
  });
});
