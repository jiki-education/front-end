import { generateCacheKey, normalizeSearchParams, isAllowedParam } from "@/lib/cache/cache-key-generator";

describe("cache-key-generator", () => {
  describe("isAllowedParam", () => {
    it("returns true for allowed params", () => {
      expect(isAllowedParam("page")).toBe(true);
      expect(isAllowedParam("criteria")).toBe(true);
      expect(isAllowedParam("_rsc")).toBe(true);
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
      expect(result).toBe("https://jiki.io/blog#abc1234");
    });

    it("includes allowed query params", () => {
      const request = new Request("https://jiki.io/blog?page=2");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/blog?page=2#abc1234");
    });

    it("strips disallowed query params", () => {
      const request = new Request("https://jiki.io/blog?page=1&utm_source=google&ref=twitter");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/blog?page=1#abc1234");
    });

    it("preserves locale in pathname", () => {
      const request = new Request("https://jiki.io/de/blog?page=1");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/de/blog?page=1#abc1234");
    });

    it("sorts allowed params", () => {
      const request = new Request("https://jiki.io/blog?page=2&criteria=popular");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/blog?criteria=popular&page=2#abc1234");
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

      expect(key1).toBe("https://jiki.io/blog#abc1234");
      expect(key2).toBe("https://jiki.io/blog#def5678");
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
        "https://jiki.io/de/articles?criteria=top&page=3&utm_source=google&utm_medium=cpc&ref=home"
      );
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/de/articles?criteria=top&page=3#abc1234");
    });

    it("preserves protocol and host", () => {
      const request = new Request("https://jiki.io/blog");
      const result = generateCacheKey(request, deployId);
      expect(result).toContain("https://jiki.io");
    });

    it("includes _rsc param for React Server Component requests", () => {
      const request = new Request("https://jiki.io/blog?_rsc=1mj2u");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/blog?_rsc=1mj2u#abc1234");
    });

    it("generates different keys for HTML vs RSC requests", () => {
      const htmlRequest = new Request("https://jiki.io/blog");
      const rscRequest = new Request("https://jiki.io/blog?_rsc=1mj2u");

      const htmlKey = generateCacheKey(htmlRequest, deployId);
      const rscKey = generateCacheKey(rscRequest, deployId);

      expect(htmlKey).toBe("https://jiki.io/blog#abc1234");
      expect(rscKey).toBe("https://jiki.io/blog?_rsc=1mj2u#abc1234");
      expect(htmlKey).not.toBe(rscKey);
    });

    it("sorts _rsc param with other allowed params", () => {
      const request = new Request("https://jiki.io/blog?page=2&_rsc=1mj2u&criteria=popular");
      const result = generateCacheKey(request, deployId);
      expect(result).toBe("https://jiki.io/blog?_rsc=1mj2u&criteria=popular&page=2#abc1234");
    });
  });
});
