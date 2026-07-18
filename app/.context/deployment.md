# Deployment

## Target Platform

Cloudflare Workers with Next.js Edge Runtime

## Production Environment

- **Production URL**: https://jiki.io
- **Edge Runtime**: Cloudflare Workers with global distribution
- **Custom Domain**: Automatic DNS management via Cloudflare
- **Caching**: R2 bucket for incremental builds with 30-minute regional cache

## Staging Environment

`staging.jiki.io` is a second deployment of the app Worker (`jiki-app-staging`),
used to preview unmerged branches against the real backend.

- **Same everything as prod except the deployment tier.** It is a full production
  build (`NODE_ENV=production`), talks to the **same API** (`api.jiki.io`), and
  shares the `.jiki.io` auth cookie, so a user logged in on `jiki.io` is logged in
  on staging as the same real user against real data. This is intentional.
- **The only differentiator is `ENVIRONMENT=staging`** (a Worker `var` in
  `wrangler.staging.jsonc`). This is a separate axis from `NODE_ENV` - never set
  `NODE_ENV` to anything but `production` on staging, or the auth cookie name, API
  base URL, `assetPrefix`, and CSP all change. `lib/env.ts` exposes `isStaging()`
  (fail-safe: unknown/unset `ENVIRONMENT` resolves to `production`).
- **Hidden, not sandboxed.** `robots.ts` blocks all crawling, `middleware.ts` adds
  `X-Robots-Tag: noindex` and forces `Cache-Control: no-store` (so neither browser,
  CDN, nor Worker edge cache serve staging content). The Worker edge cache is also
  off because it requires `ENVIRONMENT=production`.
- **Shared buckets.** Staging reuses the prod `assets` and `build-cache` R2 buckets.
  Safe because asset uploads are additive/content-hashed and the incremental cache
  is namespaced by build ID.
- **Deploy**: manual only via the `Deploy Staging` GitHub Action
  (`workflow_dispatch`, pick a ref) which runs `pnpm run deploy:staging`. Uses the
  same secrets as prod.
- **Infra**: a `cloudflare_workers_custom_domain` for `staging.jiki.io` -> the
  `jiki-app-staging` service (in the Terraform repo). The wildcard cert
  (`*.jiki.io`), unconditional asset CORS, and cookie-based cache bypass already
  cover staging with no further Cloudflare changes.
- **Provider allowlists**: `staging.jiki.io` must be added to the Google OAuth
  redirect URIs, the Exercism Doorkeeper callback, and the Turnstile hostnames or
  those flows fail on staging.

## Deployment Process

### Automatic Deployment (CI/CD)

GitHub Actions automatically deploys to production on every merge to `main`:

1. Install dependencies (`pnpm install`)
2. Build and deploy (`pnpm run deploy` in app directory)
3. OpenNext Cloudflare adapter transforms Next.js for Workers
4. Wrangler deploys to Cloudflare Workers
5. Custom domain routes automatically updated

### Manual Deployment

From the `app` directory:

```bash
pnpm run deploy
```

This runs (see the `deploy` / `static:upload` scripts in `package.json`):

1. `opennextjs-cloudflare build` - runs the app `build` (including the asset-hash
   generators) and transforms the output for Workers.
2. `static:upload` - `aws s3 sync`s the built assets to the `assets` R2 bucket
   (served at `assets.jiki.io`). See [Static Asset Serving](#static-asset-serving).
3. `wrangler deploy` - deploys the Worker (with `DEPLOY_ID` set to the git SHA).

The upload runs **before** `wrangler deploy` so new assets are on the CDN before
the new Worker goes live; if the sync fails the deploy aborts before switching.

**Required environment variables:**

- `CLOUDFLARE_API_TOKEN` - API token with Workers Routes permission
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` - R2 S3 credentials for `static:upload`
  (the same R2 access-key pair used by the Rails API). `aws` CLI reads them via
  the `AWS_*` env in `deploy.yml`, with `AWS_REGION=auto` and
  `AWS_REQUEST_CHECKSUM_CALCULATION=when_required` (R2 rejects the SDK's default
  multi-checksum).

### GitHub Secrets

The following secrets must be configured in repository settings:

- `CLOUDFLARE_API_TOKEN` - Must have Workers Routes and Workers Scripts Write permissions
- `CLOUDFLARE_ACCOUNT_ID` - Account ID: `0a0e6f92decf825364b860e2286ceebf`
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` - R2 S3 credentials for the asset sync

## Build Process

- Next.js application compiled with React Compiler optimization
- OpenNext Cloudflare adapter transforms for Workers compatibility
- Exercises compiled alongside Next.js application
- Markdown content processed at build time
- Static assets served from the `assets` R2 bucket (`assets.jiki.io`), not Workers
  Assets - see [Static Asset Serving](#static-asset-serving)
- TypeScript compilation with strict mode
- Interpreters package bundled as workspace dependency
- R2 bucket stores incremental build cache

## Static Asset Serving

All hashed build output (`_next/*`) and CSS-referenced `/static/*` assets are served
cross-origin from the **`assets` R2 bucket** at `https://assets.jiki.io`, not from
Workers Assets. This exists to fix a `ChunkLoadError` class of bug: Workers Assets
delete old files on every deploy, so a user holding a page across a deploy 404'd on
lazy-loaded chunks. The R2 bucket is uploaded **additively** (nothing deleted), so
content-hashed assets from older builds survive and old pages keep working.

**How it fits together:**

- `next.config.ts` sets `assetPrefix: "https://assets.jiki.io"` (production only) and
  `crossOrigin: "anonymous"` (so Sentry gets real cross-origin stack traces). This
  rewrites `_next/*` URLs to the bucket. `/public` files referenced from JSX stay
  document-relative (served from Workers Assets on `jiki.io`), **except** the
  content-hashed cache trees below.
- **Content-hashed cache trees** — `static/i18n/*`, `static/exercises/*`,
  `static/concepts/*`, `static/content/*` — are generated at build time (one file per
  content fingerprint, so every path is immutable) and served from R2, never from
  Workers Assets. They're excluded from the worker bundle via `.assetsignore` and
  every fetch goes through the `assetsUrl()` helper (`lib/assets.ts` for client code,
  the async twin in `lib/server/origin.ts` for Server Components): prod → `assets.jiki.io`,
  dev → relative/origin. This is the same additive-R2 fix as `_next/*` — the runtime
  can never fall through to worker-bundled copies that a redeploy would have deleted
  mid-session. Standard leaf naming is `{kind}-{hash}.{ext}` (`index` | `content` |
  `messages`), with every dimension (locale, language, slug) a directory.
- **CSS `url("/static/...")`** refs resolve against the _stylesheet's_ origin
  (`assets.jiki.io`), so those assets must be on the bucket too. They are
  **content-hash fingerprinted** at build time: `scripts/generate-css-asset-hashes.js`
  scans app + curriculum CSS, hashes each target, emits `public/static/hashed/...`,
  and writes a manifest; the PostCSS plugin `postcss-plugins/rewrite-static-css-urls.cjs`
  rewrites the `url()`s to the hashed copies. One PostCSS pass covers both packages
  (curriculum CSS is imported by the app). Wired into `dev` and `build`; output is
  gitignored (mirrors the icon-cache pattern).
- The `static:upload` script syncs, per object Cache-Control: `_next/static`
  (immutable); `public/static` (short TTL fallback for un-hashed refs, with the fully
  hashed trees excluded); `public/static/hashed` (immutable); and each content-hashed
  cache tree — `public/static/{hashed,i18n,exercises,concepts,content}` — immutable.
  Because every file in those trees is content-hashed, immutable is safe; a missed
  CSS ref degrades to the short-TTL `public/static` copy rather than breaking.
- **Cache-Control** is set per object at upload and honoured by a Cloudflare cache
  rule on `assets.jiki.io` (`terraform/cloudflare/cache_rules.tf`). The bucket has a
  **CORS** policy allowing `GET` from `jiki.io` (required: fonts and, with
  `crossOrigin`, all chunks are fetched in CORS mode).

**Dev/prod parity:** the fingerprinting and PostCSS rewrite run in both `next dev`
(turbopack) and `next build` (webpack), so CSS references the same hashed URLs in
both; dev serves them from localhost, prod from `assets.jiki.io`.

## Local Development

- **Development Server**: http://localhost:3061 (`pnpm dev`)
- **Preview with Wrangler**: `pnpm preview` (simulates Workers environment locally)

## Infrastructure

### Cloudflare Resources (Managed via Terraform)

- **Workers Custom Domain**: `jiki.io` (configured in `terraform/cloudflare/workers.tf`)
- **R2 Buckets**: `build-cache` (incremental cache), `assets` (public, served at
  `assets.jiki.io` with CDN + CORS), `uploads` (user uploads) - see
  `terraform/cloudflare/r2.tf` and `cdn.tf`
- **DNS Records**: Auto-created AAAA records (read-only, managed by Cloudflare)

### Configuration Files

- `wrangler.jsonc` - Workers configuration with R2 binding and custom domain route
- `open-next.config.ts` - OpenNext adapter config with R2 cache settings
- `.github/workflows/deploy.yml` - CI/CD deployment workflow

## Security

- **Content Security Policy**: Nonce-based script execution in production
- **Process.env Support**: Via `nodejs_compat_populate_process_env` compatibility flag

## Site Metadata & Well-Known Files

The canonical site URL (`https://jiki.io`) is defined as `SITE_URL` in `lib/site.ts`.

- **robots.txt**: `app/robots.ts` - allows all crawling, references the sitemap
- **sitemap.xml**: `app/sitemap.ts` - static public routes plus dynamic entries for blog posts, listed articles, and concepts (English)
- **Web app manifest**: `app/manifest.ts` - served at `/manifest.webmanifest`
- **OG/Twitter image**: `public/static/images/og-image.png` (1200x630, logo on blue-500), wired up via the `openGraph`/`twitter` metadata in `app/layout.tsx`
- **Favicons**: `public/static/images/icon.svg` (primary), `public/favicon.ico` (legacy multi-size, must live at the public root), and `public/static/images/apple-icon.png` (180x180, white background), all wired up via the `icons` metadata in `app/layout.tsx`
- **security.txt**: `public/.well-known/security.txt` - contact is security@jiki.io; the `Expires` field needs annual renewal. Its URL is fixed by RFC 9116 so it cannot live under `/static/`
- **change-password**: `/.well-known/change-password` redirects to `/settings` via `next.config.ts` redirects (used by password managers)
- **Brand images**: `public/static/images/logo.png` (512x512, white circle background) and `logo-192.png` are the canonical external-facing logo, derived from `icon.svg`

## Edge Caching

Custom Worker wrapper (`worker-wrapper.js`) implements Cloudflare Cache API for edge caching of unauthenticated public content.

**How It Works**:

1. Worker wrapper intercepts requests before OpenNext worker
2. Checks if route is cacheable and user is unauthenticated
3. Returns cached response if available (cache hit)
4. On cache miss, delegates to OpenNext and caches the response

**Cache Strategy**:

- **Worker Cache API TTL**: 1 day (86400 seconds) - includes deploy ID for auto-invalidation
- **Cache-Control Headers**: 10 minutes (600 seconds) - for CDN/zone cache without deploy ID awareness
- **Cached Routes** (unauthenticated only):
  - Landing page (`/`)
  - Blog routes (`/blog`, `/blog/*`, `/[locale]/blog/*`)
  - Article routes (`/help/*`, `/[locale]/help/*`)
  - Concept routes (`/concepts/*`)
  - Unsubscribe pages (`/unsubscribe/*`)
- **Static Assets**: `/_next/*`, CSS-referenced `/static/*`, and the content-hashed
  cache trees (`/static/{i18n,exercises,concepts,content}/*`) are served from
  `assets.jiki.io` (see [Static Asset Serving](#static-asset-serving)), not the Worker;
  `/favicon.ico` and other JSX-referenced `/static/*` (images, sounds, un-hashed icons)
  are served by Workers Assets. Neither is handled by this wrapper.

**Cache Key Generation**:

- Includes pathname and locale
- Allows only `page` and `criteria` query parameters (all others stripped)
- Includes deploy ID (git SHA) for automatic invalidation on deploy

**Cache Invalidation**:

- Worker Cache: Automatic on deployment (deploy ID in cache key) + 1 day TTL
- CDN/Zone Cache: 10 minutes TTL (no deploy ID awareness)
- Production-only (cache disabled in development/preview)

**Debugging**:

- Response headers: `X-Cache: HIT` or `X-Cache: MISS`
- Cache only active when `ENVIRONMENT=production` and `DEPLOY_ID` is set
- Local development bypasses wrapper (uses Next.js dev server)

**Implementation Files**:

- `worker-wrapper.js` - Main wrapper entry point
- `lib/cache/cache-key-generator.ts` - Cache key normalization logic
- `lib/cache/cacheable-routes.ts` - Route eligibility checker
