import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  // Serve _next/* assets from the persistent, CDN-fronted R2 bucket (assets.jiki.io)
  // instead of Workers Assets, which delete-on-deploy. Uploads are additive and
  // content-hashed, so chunks from older builds survive and pages loaded across a
  // deploy keep working (fixes ChunkLoadError on lazy-loaded chunks). Prod-only:
  // assetPrefix only rewrites _next/* URLs, not /public files.
  assetPrefix: process.env.NODE_ENV === "production" ? "https://assets.jiki.io" : undefined,
  // Chunks are now cross-origin; anonymous CORS mode lets Sentry capture real stack
  // traces from chunk errors instead of an opaque "Script error.".
  crossOrigin: "anonymous",
  // Disable metadata streaming for all user agents. Next 15.2+ defers metadata
  // to body for dynamic pages and only injects in <head> for known bot UAs —
  // but its default bot regex doesn't include plain "Googlebot", and Lighthouse
  // sends a real Chrome UA so neither would see metadata in <head> without this.
  htmlLimitedBots: /.*/,
  experimental: {
    reactCompiler: true,
    cssChunking: "strict"
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
      },
      {
        source: "/r/youtube",
        destination: "https://youtube.com/@jiki-coding",
        permanent: false
      },
      {
        source: "/r/forum",
        destination: "https://forum.jiki.io",
        permanent: false
      },
      {
        source: "/r/discord",
        destination: "https://discord.gg/ph6erP7P7G",
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
let config: NextConfig = withNextIntl(nextConfig);

if (process.env.NODE_ENV === "production") {
  config = withSentryConfig(config, {
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
        removeDebugLogging: true,
        // Strip Sentry's tracing/performance SDK (BrowserTracing,
        // startSpan, etc.). Big bundle win on every route (~30–40 KB
        // off the shared Sentry chunk). We're not consuming Sentry
        // tracing data — only error capture — so this is safe.
        removeTracing: true
      }
    }
  });
}

export default config;
