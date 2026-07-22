// next-intl/plugin can't load under jsdom (it createRequire's an http:// URL).
// The config test only checks plain config flags, so stub the plugin to a
// pass-through that returns the config unchanged.
jest.mock("next-intl/plugin", () => ({
  __esModule: true,
  default: () => (config: unknown) => config
}));

import nextConfig from "@/next.config";

describe("Next.js Configuration", () => {
  it("should disable sourcemaps in production", () => {
    expect(nextConfig).toBeDefined();
    expect(nextConfig.productionBrowserSourceMaps).toBe(false);
  });

  it("redirects bare /articles to /help with an exact permanent rule ordered before the wildcard", async () => {
    const redirects = await nextConfig.redirects!();

    const exactIndex = redirects.findIndex((r) => r.source === "/articles");
    const wildcardIndex = redirects.findIndex((r) => r.source === "/articles/:path*");

    expect(exactIndex).toBeGreaterThanOrEqual(0);
    expect(wildcardIndex).toBeGreaterThanOrEqual(0);
    // The exact rule must win, so it has to come first: :path* does not match
    // zero segments, so a bare /articles would otherwise 308 to the literal
    // "/help/:path*" and 404.
    expect(exactIndex).toBeLessThan(wildcardIndex);

    expect(redirects[exactIndex]).toMatchObject({
      source: "/articles",
      destination: "/help",
      permanent: true
    });
  });
});
