import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  experimental: {
    reactCompiler: true
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.exercism.org"
      }
    ]
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
  async redirects() {
    return Promise.resolve([
      {
        // Password managers use this well-known URL to deep-link users
        // to the page where they can change their password
        source: "/.well-known/change-password",
        destination: "/settings",
        permanent: false
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
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js"
      },
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  { name: "preset-default", params: { overrides: { cleanupIds: false } } },
                  { name: "prefixIds" },
                  { name: "removeUnusedNS" },
                  { name: "removeDimensions" }
                ]
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
      },
      {
        test: /\.md$/,
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
    // Exclude Next.js metadata requests (e.g. app/icon.svg favicon) so they are
    // handled by next-metadata-image-loader as raw images, not React components
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: { not: [/__next_metadata__/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                { name: "preset-default", params: { overrides: { cleanupIds: false } } },
                { name: "prefixIds" },
                { name: "removeUnusedNS" },
                { name: "removeDimensions" }
              ]
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
    useRunAfterProductionCompileHook: true,

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
