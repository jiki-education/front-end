import { useLocale } from "next-intl";
import { normalizeLocale } from "./config";
import { type LocaleRoutes, makeRoutes } from "./routes";

/**
 * Locale-aware route helpers bound to the ambient UI locale via next-intl's sync
 * `useLocale()`. Call sites get `routes.authLogin()`, `routes.blogPost(slug)`, etc.
 * with no `locale` argument to thread through props.
 *
 * Like `useLocale()`/`useTranslations()`, this works in **both** client components
 * and synchronously-rendered server components — pair it with `useTranslations()`.
 *
 * SYNC/ASYNC SWITCH: this is the sync counterpart of `getLocaleRoutes()` (async).
 * Same API, same routes. If a consumer becomes an async server component (and thus
 * uses `getTranslations()` instead of `useTranslations()`), switch to
 * `getLocaleRoutes()` — and vice versa when it goes back to sync rendering.
 */
export function useLocaleRoutes(): LocaleRoutes {
  return makeRoutes(normalizeLocale(useLocale()));
}
