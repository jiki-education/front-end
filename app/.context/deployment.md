# Deployment

## Target Platform

Cloudflare Workers with Next.js Edge Runtime

## Production Environment

- **Production URL**: https://jiki.io
- **Basic Authentication**:
  - Username: `jiki`
  - Password: `ave-fetching-chloe-packed`
  - Enabled only in production (`NODE_ENV=production`)
- **Edge Runtime**: Cloudflare Workers with global distribution
- **Custom Domain**: Automatic DNS management via Cloudflare
- **Caching**: R2 bucket for incremental builds with 30-minute regional cache

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

This runs: `npx opennextjs-cloudflare build && wrangler deploy`

**Required environment variables:**

- `CLOUDFLARE_API_TOKEN` - API token with Workers Routes permission
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

### GitHub Secrets

The following secrets must be configured in repository settings:

- `CLOUDFLARE_API_TOKEN` - Must have Workers Routes and Workers Scripts Write permissions
- `CLOUDFLARE_ACCOUNT_ID` - Account ID: `0a0e6f92decf825364b860e2286ceebf`

## Build Process

- Next.js application compiled with React Compiler optimization
- OpenNext Cloudflare adapter transforms for Workers compatibility
- Exercises compiled alongside Next.js application
- Markdown content processed at build time
- Static assets optimized and served from Workers Assets
- TypeScript compilation with strict mode
- Interpreters package bundled as workspace dependency
- R2 bucket stores incremental build cache

## Local Development

- **Development Server**: http://localhost:3061 (`pnpm dev`)
- **Preview with Wrangler**: `pnpm preview` (simulates Workers environment locally)
- **E2E Tests**: Run with `NODE_ENV=test` to bypass basic auth

## Infrastructure

### Cloudflare Resources (Managed via Terraform)

- **Workers Custom Domain**: `jiki.io` (configured in `terraform/cloudflare/workers.tf`)
- **R2 Bucket**: `build-cache` for incremental caching
- **DNS Records**: Auto-created AAAA records (read-only, managed by Cloudflare)

### Configuration Files

- `wrangler.jsonc` - Workers configuration with R2 binding and custom domain route
- `open-next.config.ts` - OpenNext adapter config with R2 cache settings
- `.github/workflows/deploy.yml` - CI/CD deployment workflow

## Security

- **Content Security Policy**: Nonce-based script execution in production
- **Process.env Support**: Via `nodejs_compat_populate_process_env` compatibility flag
- **Basic Auth**: Protects production site during pre-launch phase

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
  - Article routes (`/articles/*`, `/[locale]/articles/*`)
  - Concept routes (`/concepts/*`)
  - Unsubscribe pages (`/unsubscribe/*`)
- **Static Assets**: `/_next/*`, `/static/*`, `/favicon.ico` already cached by OpenNext (not handled by wrapper)

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
