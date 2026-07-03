import { getLocale } from "next-intl/server";
import { normalizeLocale } from "./config";
import { type LocaleRoutes, makeRoutes } from "./routes";

/**
 * Server-side locale-aware route helpers, bound to the ambient request locale via
 * `getLocale()`. Await once per component: `const routes = await getLocaleRoutes()`,
 * then `routes.authLogin()`, `routes.blogPost(slug)`, etc.
 *
 * Pair it with `getTranslations()`; only async server components need this form.
 *
 * SYNC/ASYNC SWITCH: this is the async counterpart of `useLocaleRoutes()` (the sync
 * hook used by client and sync server components). Same API, same routes. If a
 * consumer stops being an async server component (and thus uses `useTranslations()`
 * instead of `getTranslations()`), switch to `useLocaleRoutes()` — and vice versa.
 */
export async function getLocaleRoutes(): Promise<LocaleRoutes> {
  return makeRoutes(normalizeLocale(await getLocale()));
}
