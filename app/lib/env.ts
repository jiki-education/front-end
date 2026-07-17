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
