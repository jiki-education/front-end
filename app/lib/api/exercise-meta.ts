import { exerciseIndexHashes } from "@/lib/generated/exercise-hashes";
import { interpreterCatalogHashes } from "@/lib/generated/interpreter-catalog-hashes";
import type { Messages } from "@jiki/interpreters";

export interface ExerciseMetaEntry {
  slug: string;
  title: string;
  description: string;
  contentHashes: Record<string, string>;
}

export interface ExerciseContent {
  title: string;
  description: string;
  instructions: string;
  stub: string;
  solution: string;
  contentHash: string;
}

// Module-level cache for the exercise index
let cachedPromise: Promise<ExerciseMetaEntry[]> | null = null;
let cachedLocale: string | null = null;

async function fetchExerciseIndex(locale: string = "en"): Promise<ExerciseMetaEntry[]> {
  if (cachedPromise && cachedLocale === locale) {
    return cachedPromise;
  }

  const hash = exerciseIndexHashes[locale];
  if (!hash) {
    return [];
  }

  cachedLocale = locale;
  cachedPromise = fetch(`/static/exercises/${locale}-${hash}.json`).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch exercise index for locale "${locale}"`);
    }
    return res.json();
  });

  return cachedPromise;
}

export async function getExerciseMetaBySlugs(slugs: string[], locale: string = "en"): Promise<ExerciseMetaEntry[]> {
  const index = await fetchExerciseIndex(locale);
  const slugSet = new Set(slugs);
  return index.filter((e) => slugSet.has(e.slug));
}

// Module-level cache for interpreter catalogs, keyed by `${language}:${locale}`.
const interpreterCatalogCache = new Map<string, Promise<Messages>>();

/**
 * Fetch an interpreter's message catalog for one language + locale. The result is
 * injected into the interpreter run context as `EvaluationContext.localeMessages`,
 * so the interpreter resolves its diagnostics in the active locale.
 *
 * Returns `{}` when no catalog exists for the (language, locale) pair. Interpreters
 * that don't yet localize (Python/JikiScript) ignore the dict entirely; a localized
 * interpreter (JavaScript) given an unsupported locale then surfaces the raw keys —
 * the intended loud canary, never a silent English fallback.
 */
export async function fetchInterpreterCatalog(language: string, locale: string): Promise<Messages> {
  const key = `${language}:${locale}`;
  const cached = interpreterCatalogCache.get(key);
  if (cached) {
    return cached;
  }

  // The manifest's index signature claims every key is present, but a language or
  // locale with no exported catalog is genuinely absent at runtime.
  const languageHashes = interpreterCatalogHashes[language] as Record<string, string> | undefined;
  const hash = languageHashes?.[locale];
  if (!hash) {
    const empty = Promise.resolve<Messages>({});
    interpreterCatalogCache.set(key, empty);
    return empty;
  }

  const promise = fetch(`/static/interpreter-catalogs/${language}-${locale}-${hash}.json`).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch interpreter catalog for "${language}" locale "${locale}"`);
    }
    return res.json() as Promise<Messages>;
  });
  interpreterCatalogCache.set(key, promise);
  return promise;
}

/**
 * Fetch the curriculum-owned message dict for an exercise in the active UI locale.
 *
 * These catalogs are decoupled from the instruction/content locale: the dict is
 * injected into the exercise instance (via `setMessages`) so runtime logic-error
 * strings render in the student's locale, independent of whether translated
 * instructions exist. On any miss (no catalog for this exercise/locale) this
 * resolves to `{}` — no en-fallback — so untranslated keys surface as the key,
 * which is intended.
 */
// Module-level singleton cache: the persistent app fetches each exercise's
// per-locale message pack once and hands the same reference to every consumer
// (so the translator memoization downstream reuses one i18next instance).
const messagesCache = new Map<string, Promise<Record<string, unknown>>>();

export function fetchExerciseMessages(slug: string, locale: string): Promise<Record<string, unknown>> {
  const key = `${slug}:${locale}`;
  const cached = messagesCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const promise = (async () => {
    try {
      const res = await fetch(`/static/exercises/${slug}/i18n-${locale}.json`);
      if (!res.ok) {
        return {};
      }
      return (await res.json()) as Record<string, unknown>;
    } catch {
      return {};
    }
  })();
  messagesCache.set(key, promise);
  return promise;
}

export async function fetchExerciseContent(slug: string, locale: string, language: string): Promise<ExerciseContent> {
  const index = await fetchExerciseIndex(locale);
  const entry = index.find((e) => e.slug === slug);
  if (!entry) {
    throw new Error(`Exercise "${slug}" not found in index for locale "${locale}"`);
  }

  const contentHash = entry.contentHashes[language];
  if (!contentHash) {
    throw new Error(`No content hash for exercise "${slug}" language "${language}" locale "${locale}"`);
  }

  const res = await fetch(`/static/exercises/${slug}/${locale}-${language}-${contentHash}.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch content for exercise "${slug}" (${locale}/${language})`);
  }

  const data = await res.json();
  return {
    ...data,
    title: entry.title,
    description: entry.description,
    contentHash
  };
}
