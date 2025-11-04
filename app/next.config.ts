import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true
  },
  turbopack: {
    root: path.resolve(__dirname, ".."),
    rules: {
      "*.javascript": {
        loaders: ["raw-loader"],
        as: "*.js"
      },
      "*.py": {
        loaders: ["raw-loader"],
        as: "*.js"
      },
      "*.jiki": {
        loaders: ["raw-loader"],
        as: "*.js"
      }
    }
  },
  transpilePackages: ["interpreters", "@jiki/curriculum"],
  allowedDevOrigins: ["localhost", "local.jiki.io"],
  webpack: (config) => {
    // For webpack (production builds)
    config.module.rules.push(
      {
        test: /\.javascript$/,
        type: "asset/source"
      },
      {
        test: /\.py$/,
        type: "asset/source"
      },
      {
        test: /\.jiki$/,
        type: "asset/source"
      }
    );
    return config;
  }
};

export default nextConfig;
