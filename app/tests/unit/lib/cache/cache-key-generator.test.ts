import { generateCacheKey, normalizeSearchParams, isAllowedParam } from "@/lib/cache/cache-key-generator";

describe("cache-key-generator", () => {
  describe("isAllowedParam", () => {
    it("returns true for allowed params", () => {
      expect(isAllowedParam("page")).toBe(true);
      expect(isAllowedParam("criteria")).toBe(true);
    });

    it("returns true for allowed params regardless of case", () => {
      expect(isAllowedParam("PAGE")).toBe(true);
      expect(isAllowedParam("Criteria")).toBe(true);
    });

    it("returns false for disallowed params", () => {
      expect(isAllowedParam("utm_source")).toBe(false);
      expect(isAllowedParam("utm_medium")).toBe(false);
      expect(isAllowedParam("utm_campaign")).toBe(false);
      expect(isAllowedParam("ref")).toBe(false);
      expect(isAllowedParam("fbclid")).toBe(false);
      expect(isAllowedParam("gclid")).toBe(false);
      expect(isAllowedParam("foo")).toBe(false);
    });
  });

  describe("normalizeSearchParams", () => {
    it("includes only allowed params", () => {
      const params = new URLSearchParams({
        page: "1",
        utm_source: "google",
        criteria: "popular"
      });

      const result = normalizeSearchParams(params);
      expect(result).toBe("?criteria=popular&page=1");
    });

    it("sorts params alphabetically", () => {
      const params = new URLSearchParams({
        page: "2",
        criteria: "recent"
      });

      const result = normalizeSearchParams(params);
      expect(result).toBe("?criteria=recent&page=2");
    });

    it("returns empty string when no allowed params", () => {
      const params = new URLSearchParams({
        utm_source: "twitter",
        ref: "home"
      });

      const result = normalizeSearchParams(params);
      expect(result).toBe("");
    });

    it("handles empty params", () => {
      const params = new URLSearchParams();
      const result = normalizeSearchParams(params);
      expect(result).toBe("");
    });

    it("URL-encodes param values", () => {
      const params = new URLSearchParams({
        page: "1",
        criteria: "hello world"
      });

      const result = normalizeSearchParams(params);
      expect(result).toBe("?criteria=hello%20world&page=1");
    });

    it("handles multiple values correctly", () => {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("page", "2");

      const result = normalizeSearchParams(params);
      // URLSearchParams.forEach only gives the first value
      expect(result).toContain("page");
    });
  });

  describe("generateCacheKey", () => {
    const deployId = "abc1234";

    it("generates cache key with pathname and deploy ID", () => {
      const request = new Request("https://jiki.io/blog");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/blog#abc1234@none");
    });

    it("includes allowed query params", () => {
      const request = new Request("https://jiki.io/blog?page=2");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/blog?page=2#abc1234@none");
    });

    it("strips disallowed query params", () => {
      const request = new Request("https://jiki.io/blog?page=1&utm_source=google&ref=twitter");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/blog?page=1#abc1234@none");
    });

    it("preserves locale in pathname", () => {
      const request = new Request("https://jiki.io/de/blog?page=1");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/de/blog?page=1#abc1234@none");
    });

    it("sorts allowed params", () => {
      const request = new Request("https://jiki.io/blog?page=2&criteria=popular");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/blog?criteria=popular&page=2#abc1234@none");
    });

    it("buckets by the offered banner language from Accept-Language", () => {
      const en = new Request("https://jiki.io/blog", { headers: { "accept-language": "en-US,en;q=0.9" } });
      const hu = new Request("https://jiki.io/blog", { headers: { "accept-language": "hu-HU,hu;q=0.9,en;q=0.8" } });

      expect(generateCacheKey(en, deployId)).toBe("/blog#abc1234@en");
      expect(generateCacheKey(hu, deployId)).toBe("/blog#abc1234@hu");
    });

    it("separates crawler (no Accept-Language) from browser buckets on the same path", () => {
      const crawler = new Request("https://jiki.io/hu/blog");
      const enBrowser = new Request("https://jiki.io/hu/blog", { headers: { "accept-language": "en-US" } });

      // Crawler gets a banner-free page, an English browser gets the "view in
      // English" banner: distinct HTML, so they must be distinct cache entries.
      expect(generateCacheKey(crawler, deployId)).toBe("/hu/blog#abc1234@none");
      expect(generateCacheKey(enBrowser, deployId)).toBe("/hu/blog#abc1234@en");
    });

    it("buckets unsupported languages into the default locale", () => {
      const fr = new Request("https://jiki.io/blog", { headers: { "accept-language": "fr-FR,fr;q=0.9" } });
      expect(generateCacheKey(fr, deployId)).toBe("/blog#abc1234@en");
    });

    it("generates same key regardless of disallowed param order", () => {
      const request1 = new Request("https://jiki.io/blog?page=1&utm_source=a&ref=b");
      const request2 = new Request("https://jiki.io/blog?ref=b&page=1&utm_source=a");

      const result1 = generateCacheKey(request1, deployId);
      const result2 = generateCacheKey(request2, deployId);

      expect(result1).toBe(result2);
    });

    it("generates different keys for different deploy IDs", () => {
      const request = new Request("https://jiki.io/blog");
      const key1 = generateCacheKey(request, "abc1234");
      const key2 = generateCacheKey(request, "def5678");

      expect(key1).toBe("/blog#abc1234@none");
      expect(key2).toBe("/blog#def5678@none");
      expect(key1).not.toBe(key2);
    });

    it("generates different keys for different pages", () => {
      const request1 = new Request("https://jiki.io/blog?page=1");
      const request2 = new Request("https://jiki.io/blog?page=2");

      const key1 = generateCacheKey(request1, deployId);
      const key2 = generateCacheKey(request2, deployId);

      expect(key1).not.toBe(key2);
    });

    it("handles complex URLs with multiple param types", () => {
      const request = new Request(
        "https://jiki.io/de/help?criteria=top&page=3&utm_source=google&utm_medium=cpc&ref=home"
      );
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/de/help?criteria=top&page=3#abc1234@none");
    });

    it("strips _rsc param from cache key", () => {
      const request = new Request("https://jiki.io/blog?_rsc=1mj2u&page=2");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("/blog?page=2#abc1234@none");
    });
  });
});
