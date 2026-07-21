/**
 * Unit tests for the R2-fetched UI catalog loader shared by lib/i18n/request.ts
 * (SSR) and ClientLocaleProvider (client-side locale swaps): promise cache keyed
 * `${locale}:${hash}`, one retry on failure, eviction of rejected fetches so a
 * later call retries, and NO bundled fallback.
 */

import { createCatalogLoader } from "@/lib/i18n/catalogLoader";

jest.mock("@/lib/generated/messages-hashes", () => ({
  messageHashes: { en: "aaaaaaaaaaaa", hu: "bbbbbbbbbbbb" }
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const CATALOG = { common: { close: "Close" } };

function okResponse(body: Record<string, unknown> = CATALOG) {
  return { ok: true, json: () => Promise.resolve(body) };
}

function errorResponse(status = 500) {
  return { ok: false, status, json: () => Promise.reject(new Error("no body")) };
}

describe("createCatalogLoader", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("fetches the hashed catalog path via the resolver", async () => {
    const resolveUrl = jest.fn((path: string) => `https://assets.example${path}`);
    const load = createCatalogLoader(resolveUrl);
    mockFetch.mockResolvedValueOnce(okResponse());

    await expect(load("en")).resolves.toEqual(CATALOG);

    expect(resolveUrl).toHaveBeenCalledWith("/static/i18n/app/en/messages-aaaaaaaaaaaa.json");
    expect(mockFetch).toHaveBeenCalledWith("https://assets.example/static/i18n/app/en/messages-aaaaaaaaaaaa.json");
  });

  it("supports an async URL resolver (the server-side assetsUrl)", async () => {
    const load = createCatalogLoader((path) => Promise.resolve(`https://origin.example${path}`));
    mockFetch.mockResolvedValueOnce(okResponse());

    await expect(load("hu")).resolves.toEqual(CATALOG);
    expect(mockFetch).toHaveBeenCalledWith("https://origin.example/static/i18n/app/hu/messages-bbbbbbbbbbbb.json");
  });

  it("caches a successful load — a second call performs no second fetch", async () => {
    const load = createCatalogLoader((path) => path);
    mockFetch.mockResolvedValue(okResponse());

    const first = await load("en");
    const second = await load("en");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it("dedupes concurrent calls onto one in-flight fetch", async () => {
    const load = createCatalogLoader((path) => path);
    mockFetch.mockResolvedValue(okResponse());

    const [first, second] = await Promise.all([load("en"), load("en")]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it("caches per locale", async () => {
    const load = createCatalogLoader((path) => path);
    mockFetch.mockResolvedValue(okResponse());

    await load("en");
    await load("hu");

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("retries once: first fetch fails, retry succeeds", async () => {
    const load = createCatalogLoader((path) => path);
    mockFetch.mockRejectedValueOnce(new Error("network down")).mockResolvedValueOnce(okResponse());

    await expect(load("en")).resolves.toEqual(CATALOG);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("retries once on a non-ok response too", async () => {
    const load = createCatalogLoader((path) => path);
    mockFetch.mockResolvedValueOnce(errorResponse(503)).mockResolvedValueOnce(okResponse());

    await expect(load("en")).resolves.toEqual(CATALOG);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("rejects after both attempts fail and evicts, so a later call fetches fresh and can succeed", async () => {
    const load = createCatalogLoader((path) => path);
    mockFetch
      .mockResolvedValueOnce(errorResponse(500))
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(okResponse());

    await expect(load("en")).rejects.toThrow('Failed to fetch UI message catalog for locale "en"');
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // The rejected promise was evicted, so this is a fresh fetch, not the cached failure.
    await expect(load("en")).resolves.toEqual(CATALOG);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("rejects without fetching for a locale with no manifest hash", async () => {
    const load = createCatalogLoader((path) => path);

    await expect(load("xx")).rejects.toThrow('No UI message catalog hash for locale "xx"');
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
