import { DEFAULT_LOCALE } from "@/lib/locales";
import { GLOBAL_ERROR_COPY, type GlobalErrorCopy } from "./generated/global-error-copy";

export type { GlobalErrorCopy };

/**
 * The crash page's copy, for one locale.
 *
 * The strings are authored in the app UI catalogs like every other string —
 * English in `messages.json` under `globalError`, every other locale in the i18n
 * repo — and inlined into `generated/global-error-copy.ts` at generation time by
 * `pnpm global-error-copy:generate`. This module is the only thing that reads
 * that generated map.
 *
 * Why inlined rather than fetched: `app/global-error.tsx` renders when the app
 * has already failed, possibly because catalog loading is what failed, so it
 * cannot await anything. Every OTHER locale-varying string in the app resolves
 * from R2 at runtime; this one page is the documented exception, and
 * `tests/unit/lib/i18n/bundled.test.ts` holds it to being the only one.
 *
 * A locale with no entry falls back to English rather than throwing: on a page
 * whose entire job is to render after everything else broke, English copy is a
 * far better outcome than a second crash. `pnpm locale:check` is what makes sure
 * a production locale never quietly relies on that fallback.
 */
export function getGlobalErrorCopy(locale: string): GlobalErrorCopy {
  return GLOBAL_ERROR_COPY[locale] ?? GLOBAL_ERROR_COPY[DEFAULT_LOCALE];
}
