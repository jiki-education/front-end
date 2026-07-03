import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { LOCALE_COOKIE_NAME, URL_LOCALE_HEADER } from "@/lib/i18n/config";

const mockHeaderGet = jest.fn();
const mockCookieHas = jest.fn();
const mockCookieGet = jest.fn();

jest.mock("next/headers", () => ({
  headers: () => Promise.resolve({ get: mockHeaderGet }),
  cookies: () => Promise.resolve({ has: mockCookieHas, get: mockCookieGet })
}));

import { resolveLocale } from "@/lib/i18n/resolveLocale";

function setup({
  urlLocale,
  hasAuthCookie,
  localeCookie
}: {
  urlLocale?: string | null;
  hasAuthCookie?: boolean;
  localeCookie?: string;
}) {
  mockHeaderGet.mockImplementation((name: string) => (name === URL_LOCALE_HEADER ? (urlLocale ?? null) : null));
  mockCookieHas.mockImplementation((name: string) =>
    name === AUTHENTICATION_COOKIE_NAME ? Boolean(hasAuthCookie) : false
  );
  mockCookieGet.mockImplementation((name: string) =>
    name === LOCALE_COOKIE_NAME && localeCookie ? { value: localeCookie } : undefined
  );
}

describe("resolveLocale", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the URL locale header when present, ignoring the cookie", async () => {
    setup({ urlLocale: "hu", hasAuthCookie: true, localeCookie: "en" });
    await expect(resolveLocale()).resolves.toBe("hu");
  });

  it("falls back to the NEXT_LOCALE cookie for a gated (auth-cookie) user", async () => {
    setup({ urlLocale: null, hasAuthCookie: true, localeCookie: "hu" });
    await expect(resolveLocale()).resolves.toBe("hu");
  });

  it("returns the default when a gated user's cookie is missing/unsupported", async () => {
    setup({ urlLocale: null, hasAuthCookie: true, localeCookie: undefined });
    await expect(resolveLocale()).resolves.toBe("en");
  });

  it("ignores the NEXT_LOCALE cookie for anon users (cache determinism)", async () => {
    setup({ urlLocale: null, hasAuthCookie: false, localeCookie: "hu" });
    await expect(resolveLocale()).resolves.toBe("en");
  });

  it("ignores an unsupported URL locale header and falls through", async () => {
    setup({ urlLocale: "de", hasAuthCookie: false, localeCookie: "hu" });
    await expect(resolveLocale()).resolves.toBe("en");
  });
});
