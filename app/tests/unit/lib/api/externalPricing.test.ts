import type { fetchExternalPricing as FetchExternalPricing } from "@/lib/api/externalPricing";

jest.mock("@/lib/api/config", () => ({
  getApiUrl: (path: string) => `https://api.example.test${path}`
}));

const PRICING = {
  premium_prices: { currency: "gbp", monthly: 799, annual: 7900, country_code: "GB" }
};

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: () => Promise.resolve(body) } as unknown as Response;
}

describe("fetchExternalPricing", () => {
  let fetchExternalPricing: typeof FetchExternalPricing;
  let mockFetch: jest.Mock;

  beforeEach(async () => {
    // Reset the module so its in-flight cache is fresh for every test.
    jest.resetModules();
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    ({ fetchExternalPricing } = await import("@/lib/api/externalPricing"));
  });

  it("returns the parsed pricing response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(PRICING));

    const result = await fetchExternalPricing();

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.test/external/pricing");
    expect(result).toEqual(PRICING);
  });

  it("shares a single request between concurrent callers", async () => {
    mockFetch.mockResolvedValue(jsonResponse(PRICING));

    const [a, b] = await Promise.all([fetchExternalPricing(), fetchExternalPricing()]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it("throws with the status when the response is not ok", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 503));

    await expect(fetchExternalPricing()).rejects.toThrow("Failed to fetch external pricing (503)");
  });

  it("does not cache a failed request, so a later call retries", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(fetchExternalPricing()).rejects.toThrow("Failed to fetch");

    mockFetch.mockResolvedValueOnce(jsonResponse(PRICING));
    await expect(fetchExternalPricing()).resolves.toEqual(PRICING);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
