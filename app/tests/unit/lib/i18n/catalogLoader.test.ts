/**
 * Unit tests for the R2-fetched UI catalog loader shared by lib/i18n/request.ts
 * (SSR) and ClientLocaleProvider (client-side locale swaps): promise cache keyed
 * `${locale}:${hash}`, one retry on failure, eviction of rejected fetches so a
 * later call retries, and NO bundled fallback.
 *
 * English resolves its hash from the compiled manifest and must never touch the
 * network for a pointer; every other locale resolves it at runtime from
 * `/static/i18n/app/<locale>/current.json`. Hash resolution itself is covered in
 * catalogPointer.test.ts; here it is exercised only through the loader.
 */

import { createCatalogLoader } from "@/lib/i18n/catalogLoader";

jest.mock("@/lib/generated/messages-hashes", () => ({
  messageHashes: { en: "aaaaaaaaaaaa", hu: "cccccccccccc" }
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const CATALOG = { common: { close: "Close" } };
const HU_HASH = "bbbbbbbbbbbb";

function okResponse(body: Record<string, unknown> = CATALOG) {
  return { ok: true, json: () => Promise.resolve(body) };
}

function errorResponse(status = 500) {
  return { ok: false, status, json: () => Promise.reject(new Error("no body")) };
}

/** Serve pointers from a mutable table and hand every other URL to `catalog`. */
function serve(pointers: Record<string, string>, catalog: () => unknown) {
  mockFetch.mockImplementation((url: string) => {
    const match = /\/static\/i18n\/app\/([^/]+)\/current\.json$/.exec(url);
    if (match) {
      const hash = pointers[match[1]];
      return Promise.resolve(hash ? okResponse({ hash }) : errorResponse(404));
    }
    return Promise.resolve(catalog());
  });
}

/** Fetches of catalogs only, ignoring pointer traffic. */
function catalogFetches() {
  return mockFetch.mock.calls.map(([url]: [string]) => url).filter((url) => !url.endsWith("/current.json"));
}

describe("createCatalogLoader", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("fetches the hashed catalog path via the resolver, using the compiled hash for English", async () => {
    const resolveUrl = jest.fn((path: string) => `https://assets.example${path}`);
    const load = createCatalogLoader(resolveUrl);
    mockFetch.mockResolvedValueOnce(okResponse());

    await expect(load("en")).resolves.toEqual(CATALOG);

    expect(resolveUrl).toHaveBeenCalledWith("/static/i18n/app/en/messages-aaaaaaaaaaaa.json");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("https://assets.example/static/i18n/app/en/messages-aaaaaaaaaaaa.json");
  });

  it("resolves a non-English hash from the pointer, NOT from the compiled manifest", async () => {
    const load = createCatalogLoader((path) => `https://assets.example${path}`);
    serve({ hu: HU_HASH }, okResponse);

    await expect(load("hu")).resolves.toEqual(CATALOG);

    // The manifest says "cccccccccccc" for hu; the pointer says otherwise and wins.
    expect(catalogFetches()).toEqual([`https://assets.example/static/i18n/app/hu/messages-${HU_HASH}.json`]);
  });

  it("supports an async URL resolver (the server-side assetsUrl)", async () => {
    const load = createCatalogLoader((path) => Promise.resolve(`https://origin.example${path}`));
    serve({ hu: HU_HASH }, okResponse);

    await expect(load("hu")).resolves.toEqual(CATALOG);
    expect(catalogFetches()).toEqual([`https://origin.example/static/i18n/app/hu/messages-${HU_HASH}.json`]);
  });

  it("caches a successful load — a second call performs no second catalog fetch", async () => {
    const load = createCatalogLoader((path) => path);
    serve({ hu: HU_HASH }, okResponse);

    const first = await load("hu");
    const second = await load("hu");

    expect(catalogFetches()).toHaveLength(1);
    expect(second).toBe(first);
  });

  it("dedupes concurrent calls onto one in-flight fetch", async () => {
    const load = createCatalogLoader((path) => path);
    serve({ hu: HU_HASH }, okResponse);

    const [first, second] = await Promise.all([load("hu"), load("hu")]);

    // One pointer fetch (deduped) and one catalog fetch.
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(catalogFetches()).toHaveLength(1);
    expect(second).toBe(first);
  });

  it("caches per locale", async () => {
    const load = createCatalogLoader((path) => path);
    serve({ hu: HU_HASH }, okResponse);

    await load("en");
    await load("hu");

    expect(catalogFetches()).toHaveLength(2);
  });

  it("picks up a republished pointer without a rebuild", async () => {
    const load = createCatalogLoader((path) => path);
    const pointers = { hu: HU_HASH };
    serve(pointers, () => okResponse({ greeting: pointers.hu }));

    await expect(load("hu")).resolves.toEqual({ greeting: HU_HASH });

    // i18n publishes a new artifact and rewrites the pointer in place.
    pointers.hu = "dddddddddddd";
    await expect(load("hu")).resolves.toEqual({ greeting: "dddddddddddd" });
    expect(catalogFetches()).toEqual([
      `/static/i18n/app/hu/messages-${HU_HASH}.json`,
      "/static/i18n/app/hu/messages-dddddddddddd.json"
    ]);
  });

  it("retries once: first catalog fetch fails, retry succeeds", async () => {
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

  it("rejects loudly when a locale has no pointer, and never falls back to English", async () => {
    const load = createCatalogLoader((path) => path);
    serve({}, okResponse);

    await expect(load("hu")).rejects.toThrow('No UI message catalog pointer for locale "hu"');
    expect(catalogFetches()).toHaveLength(0);
  });

  it("rejects when a stale pointer names an artifact that no longer exists", async () => {
    const load = createCatalogLoader((path) => path);
    serve({ hu: "eeeeeeeeeeee" }, () => errorResponse(404));

    await expect(load("hu")).rejects.toThrow('Failed to fetch UI message catalog for locale "hu"');
    // Two catalog attempts (the one retry), both 404.
    expect(catalogFetches()).toHaveLength(2);
  });

  it("treats an unknown locale as any other non-default locale: pointer first, then fail", async () => {
    const load = createCatalogLoader((path) => path);
    serve({}, okResponse);

    await expect(load("xx")).rejects.toThrow('No UI message catalog pointer for locale "xx"');
    expect(catalogFetches()).toHaveLength(0);
  });
});
