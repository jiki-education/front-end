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
});
