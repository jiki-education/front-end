/**
 * Deployment-tier helpers.
 *
 * This is a SEPARATE axis from `NODE_ENV`. `NODE_ENV` describes the build mode
 * (development vs production) and is relied on across the app for the auth cookie
 * name, the API base URL, `assetPrefix`, and the CSP - so a production build must
 * always keep `NODE_ENV=production`, including on staging.
 *
 * `ENVIRONMENT` (a Worker `var`, promoted to `process.env` via
 * `nodejs_compat_populate_process_env`) is what distinguishes deployment tiers:
 * `production` vs `staging`. Staging is a full production build that talks to the
 * real API and shares the `.jiki.io` cookie, so the only things that differ are
 * indexing and caching - both keyed off `isStaging()`.
 *
 * Fail-safe: an unset/unknown value resolves to `production`, so the staging-only
 * behaviour (noindex, no-store) can never accidentally fire on production.
 */
export type DeployEnv = "production" | "staging";

export const DEPLOY_ENV: DeployEnv = process.env.ENVIRONMENT === "staging" ? "staging" : "production";

export function isStaging(): boolean {
  return DEPLOY_ENV === "staging";
}

/**
 * The same tier, decided at BUILD time rather than at request time.
 *
 * Two mechanisms for one question looks redundant and is not. `ENVIRONMENT` is a
 * Worker var, so it exists only in the edge runtime; it can never reach the
 * client bundle, because the bundle is bytes on disk long before any Worker var
 * is bound. That is fine for the things it already drives (indexing, caching),
 * which are server decisions.
 *
 * It is NOT fine for the supported-locale set. That is read on the client too
 * (the locale switcher, hreflang, the layout), so it has to be statically known
 * at build time. It can be, because staging and production do not share a build:
 * `deploy` and `deploy:staging` each run their own, so a `NEXT_PUBLIC_` variable
 * is inlined into both halves of the bundle by the build that set it.
 *
 * Fail-safe in the same direction as `DEPLOY_ENV`: anything unset or unknown is
 * production, so the permissive staging behaviour cannot fire by accident.
 */
export const BUILD_DEPLOY_ENV: DeployEnv = process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging" ? "staging" : "production";
