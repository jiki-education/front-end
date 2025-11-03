import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true
  },
  turbopack: {
    root: path.resolve(__dirname, "..")
  },
  transpilePackages: ["interpreters", "@jiki/curriculum"],
  allowedDevOrigins: ["localhost", "local.jiki.io"]
};

export default nextConfig;
