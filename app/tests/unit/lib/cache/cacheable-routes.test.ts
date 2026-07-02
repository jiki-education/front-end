import { isCacheableRoute, shouldCacheResponse } from "@/lib/cache/cacheable-routes";

describe("cacheable-routes", () => {
  describe("isCacheableRoute", () => {
    describe("external URLs (cacheable)", () => {
      it("returns true for landing page (naked apex and locale homes)", () => {
        expect(isCacheableRoute("/")).toBe(true);
        expect(isCacheableRoute("/hu")).toBe(true);
        expect(isCacheableRoute("/de")).toBe(true);
      });

      it("returns true for blog routes", () => {
        expect(isCacheableRoute("/blog")).toBe(true);
        expect(isCacheableRoute("/blog/my-post")).toBe(true);
      });

      it("returns true for localized blog routes", () => {
        expect(isCacheableRoute("/de/blog")).toBe(true);
        expect(isCacheableRoute("/es/blog/post-title")).toBe(true);
      });

      it("returns true for articles routes", () => {
        expect(isCacheableRoute("/articles")).toBe(true);
        expect(isCacheableRoute("/articles/my-article")).toBe(true);
      });

      it("returns true for localized articles routes", () => {
        expect(isCacheableRoute("/de/articles")).toBe(true);
        expect(isCacheableRoute("/fr/articles/article-title")).toBe(true);
      });

      it("returns true for concepts routes", () => {
        expect(isCacheableRoute("/concepts")).toBe(true);
        expect(isCacheableRoute("/concepts/my-concept")).toBe(true);
      });

      it("returns true for localized concepts routes", () => {
        expect(isCacheableRoute("/hu/concepts")).toBe(true);
        expect(isCacheableRoute("/de/concepts/my-concept")).toBe(true);
      });

      it("returns true for single-page marketing routes (naked and localized)", () => {
        expect(isCacheableRoute("/premium")).toBe(true);
        expect(isCacheableRoute("/roadmap")).toBe(true);
        expect(isCacheableRoute("/testimonials")).toBe(true);
        expect(isCacheableRoute("/hu/premium")).toBe(true);
        expect(isCacheableRoute("/de/roadmap")).toBe(true);
        expect(isCacheableRoute("/hu/testimonials")).toBe(true);
      });

      it("does not treat marketing sub-paths as the cacheable single page", () => {
        expect(isCacheableRoute("/premium/checkout")).toBe(false);
        expect(isCacheableRoute("/hu/roadmap/2026")).toBe(false);
      });
    });

    describe("non-external URLs (not cacheable)", () => {
      it("returns false for token-specific unsubscribe pages, even when locale-prefixed", () => {
        // Locale routing prefixes /unsubscribe, but it must stay uncacheable: the
        // caching predicate is intentionally separate from localizable-path routing.
        expect(isCacheableRoute("/unsubscribe/token123")).toBe(false);
        expect(isCacheableRoute("/hu/unsubscribe/token123")).toBe(false);
      });

      it("returns false for the delete-account flow", () => {
        expect(isCacheableRoute("/delete-account/confirm")).toBe(false);
        expect(isCacheableRoute("/hu/delete-account/confirm")).toBe(false);
      });

      it("returns false for dashboard", () => {
        expect(isCacheableRoute("/dashboard")).toBe(false);
      });

      it("returns false for lesson routes", () => {
        expect(isCacheableRoute("/lesson/my-lesson")).toBe(false);
      });

      it("returns false for static assets", () => {
        expect(isCacheableRoute("/_next/static/chunk.js")).toBe(false);
        expect(isCacheableRoute("/static/images/logo.png")).toBe(false);
        expect(isCacheableRoute("/favicon.ico")).toBe(false);
      });

      it("returns false for API routes", () => {
        expect(isCacheableRoute("/api/users")).toBe(false);
      });

      it("returns false for dev routes", () => {
        expect(isCacheableRoute("/dev/test")).toBe(false);
      });
    });
  });

  describe("shouldCacheResponse", () => {
    describe("cacheable responses", () => {
      it("returns true for successful response with public cache control", () => {
        const response = new Response("content", {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(true);
      });

      it("returns true for 201 status", () => {
        const response = new Response("content", {
          status: 201,
          headers: {
            "Cache-Control": "public, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(true);
      });

      it("returns true for Cache-Control with s-maxage", () => {
        const response = new Response("content", {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=7200"
          }
        });

        expect(shouldCacheResponse(response)).toBe(true);
      });
    });

    describe("non-cacheable responses", () => {
      it("returns false for error status (400+)", () => {
        const response = new Response("error", {
          status: 404,
          headers: {
            "Cache-Control": "public, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns false for server error (500+)", () => {
        const response = new Response("error", {
          status: 500,
          headers: {
            "Cache-Control": "public, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns false for redirect status", () => {
        const response = new Response("", {
          status: 301,
          headers: {
            "Cache-Control": "public, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns false when Cache-Control is missing", () => {
        const response = new Response("content", {
          status: 200,
          headers: {}
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns false when Cache-Control is not public", () => {
        const response = new Response("content", {
          status: 200,
          headers: {
            "Cache-Control": "private, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns false when Cache-Control is no-cache", () => {
        const response = new Response("content", {
          status: 200,
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns false for already cached response (X-Cache: HIT)", () => {
        const response = new Response("content", {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=3600",
            "X-Cache": "HIT"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });

      it("returns true for cache miss (X-Cache: MISS)", () => {
        const response = new Response("content", {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=3600",
            "X-Cache": "MISS"
          }
        });

        expect(shouldCacheResponse(response)).toBe(true);
      });

      it("returns false for 1xx status", () => {
        const response = new Response("", {
          status: 100,
          headers: {
            "Cache-Control": "public, max-age=3600"
          }
        });

        expect(shouldCacheResponse(response)).toBe(false);
      });
    });
  });
});
