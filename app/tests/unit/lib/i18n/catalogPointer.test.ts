/**
 * Unit tests for runtime hash resolution (lib/i18n/catalogPointer.ts): English
 * resolves from the compiled manifest with no network access at all, every other
 * locale resolves from its mutable pointer, concurrent resolutions share one
 * fetch without the result being cached, and every malformed or missing pointer
 * throws rather than degrading to English.
 */

import { createHashResolver } from "@/lib/i18n/catalogPointer";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const COMPILED = { en: "aaaaaaaaaaaa", hu: "cccccccccccc" };
const POINTER_HASH = "bbbbbbbbbbbb";

function build(resolveUrl: (path: string) => string | Promise<string> = (path) => path) {
  return createHashResolver({
    label: "UI message catalog",
    compiledHashes: () => COMPILED,
    pointerPath: (locale) => `/static/i18n/app/${locale}/current.json`,
    resolveUrl
  });
}

function okResponse(body: unknown) {
  return { ok: true, json: () => Promise.resolve(body) };
}

describe("createHashResolver", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("resolves the default locale from the compiled manifest without any fetch", async () => {
    await expect(build()("en")).resolves.toBe("aaaaaaaaaaaa");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects when the default locale has no compiled hash", async () => {
    const resolve = createHashResolver({
      label: "UI message catalog",
      compiledHashes: () => ({}),
      pointerPath: (locale) => `/static/i18n/app/${locale}/current.json`,
      resolveUrl: (path) => path
    });

    await expect(resolve("en")).rejects.toThrow('No compiled UI message catalog hash for the default locale "en"');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("resolves a non-default locale from its pointer, ignoring the compiled hash", async () => {
    mockFetch.mockResolvedValue(okResponse({ hash: POINTER_HASH }));

    await expect(build()("hu")).resolves.toBe(POINTER_HASH);
    expect(mockFetch).toHaveBeenCalledWith("/static/i18n/app/hu/current.json");
  });

  it("resolves the pointer URL through an async resolver", async () => {
    mockFetch.mockResolvedValue(okResponse({ hash: POINTER_HASH }));

    await expect(build((path) => Promise.resolve(`https://assets.example${path}`))("hu")).resolves.toBe(POINTER_HASH);
    expect(mockFetch).toHaveBeenCalledWith("https://assets.example/static/i18n/app/hu/current.json");
  });

  it("shares one in-flight pointer fetch across concurrent resolutions", async () => {
    mockFetch.mockResolvedValue(okResponse({ hash: POINTER_HASH }));
    const resolve = build();

    await Promise.all([resolve("hu"), resolve("hu"), resolve("hu")]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("does not cache the resolved hash, so a republished pointer is picked up", async () => {
    const resolve = build();
    mockFetch.mockResolvedValueOnce(okResponse({ hash: POINTER_HASH }));
    await expect(resolve("hu")).resolves.toBe(POINTER_HASH);

    mockFetch.mockResolvedValueOnce(okResponse({ hash: "dddddddddddd" }));
    await expect(resolve("hu")).resolves.toBe("dddddddddddd");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("rejects on a missing pointer", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    await expect(build()("hu")).rejects.toThrow(
      'No UI message catalog pointer for locale "hu" (/static/i18n/app/hu/current.json): HTTP 404'
    );
  });

  it("rejects on a network failure and retries on the next call", async () => {
    const resolve = build();
    mockFetch.mockRejectedValueOnce(new Error("network down"));

    await expect(resolve("hu")).rejects.toThrow('Failed to fetch the UI message catalog pointer for locale "hu"');

    mockFetch.mockResolvedValueOnce(okResponse({ hash: POINTER_HASH }));
    await expect(resolve("hu")).resolves.toBe(POINTER_HASH);
  });

  it("rejects on a pointer body that is not JSON", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.reject(new Error("unexpected <")) });

    await expect(build()("hu")).rejects.toThrow('Malformed UI message catalog pointer for locale "hu"');
  });

  it.each([[{}], [{ hash: null }], [{ hash: 42 }], [{ hash: "" }], [{ hash: "not-a-hash" }], [null]])(
    "rejects a pointer with no usable hash (%p)",
    async (body) => {
      mockFetch.mockResolvedValue(okResponse(body));

      await expect(build()("hu")).rejects.toThrow(
        'Malformed UI message catalog pointer for locale "hu" (/static/i18n/app/hu/current.json): no usable "hash" field'
      );
    }
  );
});
