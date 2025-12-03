/**
 * Worker wrapper for Cloudflare Cache API
 *
 * Wraps the OpenNext worker to add edge caching for unauthenticated public content.
 * Cache is only enabled in production with a valid deploy ID.
 */

// @ts-expect-error: Will be resolved by wrangler build
import openNextWorker from "./.open-next/worker.js";
import { generateCacheKey } from "./lib/cache/cache-key-generator";
import { isCacheableRoute, shouldCacheResponse } from "./lib/cache/cacheable-routes";

// CRITICAL: Re-export Durable Objects or deployment will fail
// @ts-expect-error: Will be resolved by wrangler build
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

const CACHE_NAME = "jiki-edge-cache";
const CACHE_TTL = 86400;

const worker = {
  async fetch(request, env, ctx) {
    // Get deploy ID and environment first
    const deployId = env.DEPLOY_ID;
    const isProduction = env.ENVIRONMENT === "production";
    const pathname = new URL(request.url).pathname;
    const authenticated = request.headers.get("Cookie")?.includes("jiki_access_token");

    // Skip cache if:
    // - Not production
    // - No deploy ID (prevents caching without versioning)
    // - User is authenticated
    // - Route is not cacheable
    // - RSC request (client-side navigation)
    //
    // Note: Static assets (_next/*, /static/*, favicon) already cached by OpenNext
    const isRscRequest = request.headers.has("rsc");
    if (!isProduction || !deployId || authenticated || !isCacheableRoute(pathname) || isRscRequest) {
      return openNextWorker.fetch(request, env, ctx);
    }

    // Only reach here if:
    // - Production environment
    // - Has deploy ID
    // - Unauthenticated user
    // - Cacheable route
    // - HTML request (not RSC)
    try {
      const cache = await caches.open(CACHE_NAME);
      const cacheKey = generateCacheKey(request, deployId);

      // Try cache first
      let response = await cache.match(cacheKey);
      if (response) {
        // Cache hit - return cached response
        const cachedResponse = new Response(response.body, response);
        cachedResponse.headers.set("X-Cache", "HIT");
        cachedResponse.headers.set("X-Deploy-ID", deployId);
        cachedResponse.headers.set("X-CACHE-KEY", cacheKey);
        return cachedResponse;
      }

      // Cache miss - call OpenNext worker
      response = await openNextWorker.fetch(request, env, ctx);

      // Cache response if it meets cacheability criteria
      if (shouldCacheResponse(response)) {
        const responseToCache = new Response(response.clone().body, response);
        // Override Cache-Control for Worker cache (1 day) while keeping response headers as-is (1 hour)
        // Because we use DEPLOY_ID as a key we can have longer caches safely.
        responseToCache.headers.set("Cache-Control", `public, max-age=${CACHE_TTL}`);
        ctx.waitUntil(cache.put(cacheKey, responseToCache));
      }

      // Add cache miss header
      const responseWithHeader = new Response(response.body, response);
      responseWithHeader.headers.set("X-Cache", "MISS");
      responseWithHeader.headers.set("X-Deploy-ID", deployId);
      responseWithHeader.headers.set("X-CACHE-KEY", cacheKey);
      return responseWithHeader;
    } catch (error) {
      // On any cache error, fall back to OpenNext worker
      console.error("Cache API error:", error);
      return openNextWorker.fetch(request, env, ctx);
    }
  }
};

export default worker;
