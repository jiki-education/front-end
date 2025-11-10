import nextConfig from "@/next.config";

describe("Next.js Configuration", () => {
  it("should disable sourcemaps in production", () => {
    expect(nextConfig).toBeDefined();
    expect(nextConfig.productionBrowserSourceMaps).toBe(false);
  });
});
