import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  experimental: {
    reactCompiler: true
  },
  async headers() {
    return Promise.resolve([
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups"
          }
        ]
      }
    ]);
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
      },
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [{ name: "preset-default" }, { name: "removeUnusedNS" }, { name: "removeDimensions" }]
              }
            }
          }
        ],
        as: "*.js"
      }
    }
  },
  transpilePackages: ["interpreters", "@jiki/curriculum"],
  allowedDevOrigins: ["localhost", "local.jiki.io"],
  webpack: (config) => {
    // Enable symlink resolution
    config.resolve.symlinks = true;

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

    // SVGR configuration for importing SVGs as React components
    // Disable the default SVG handling
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.(".svg"));
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [{ name: "preset-default" }, { name: "removeUnusedNS" }, { name: "removeDimensions" }]
            }
          }
        }
      ]
    });

    return config;
  }
};

// Only use Sentry build wrapper in production to avoid build overhead in dev/test
let config: NextConfig = nextConfig;

if (process.env.NODE_ENV === "production") {
  config = withSentryConfig(nextConfig, {
    org: "thalamus-ai",
    project: "jiki-front-end",
    silent: !process.env.CI,
    widenClientFileUpload: true,

    // Disable server-side auto-instrumentation for Cloudflare Workers compatibility
    // These prevent Node.js-only packages (require-in-the-middle) from being bundled
    autoInstrumentServerFunctions: false,
    autoInstrumentMiddleware: false,
    autoInstrumentAppDirectory: false,

    webpack: {
      automaticVercelMonitors: false,
      treeshake: {
        removeDebugLogging: true
      }
    }
  });
}

export default config;
