import { exerciseCodeIndexHashes, exerciseIndexHashes } from "@/lib/generated/exercise-hashes";
import { exerciseMessageHashes } from "@/lib/generated/exercise-message-hashes";
import { interpreterMessageHashes } from "@/lib/generated/interpreter-message-hashes";
import { assetsUrl } from "@/lib/assets";
import {
  exerciseIndexPath,
  exerciseIndexPointerPath,
  exerciseProsePath,
  exerciseCodeIndexPath,
  exerciseCodePath,
  exerciseMessagesPath,
  exerciseMessagesPointerPath,
  interpreterMessagesPath,
  interpreterMessagesPointerPath
} from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import { tagLocale, type Messages } from "@jiki/interpreters";

/**
 * One exercise's entry in a locale's PROSE index.
 *
 * It carries no code hashes, and that absence is the design. This index is the
 * artifact the i18n repo publishes for every non-English locale, and the i18n
 * repo holds no code, so anything in here it could not compute would be a fact
 * one publisher had to obtain from the other on every publish. Code hashes live
 * in a separate per-language index the front-end owns outright.
 */
export interface ExerciseMetaEntry {
  slug: string;
  title: string;
  description: string;
  proseHash: string;
}

/** A language's code index: slug -> the hash of that exercise's code artifact. */
export type ExerciseCodeIndex = Record<string, string>;

export interface ExerciseContent {
  title: string;
  description: string;
  instructions: string;
  stub: string;
  solution: string;
  /** Hash of the prose artifact the instructions came from. */
  proseHash: string;
  /** Hash of the code artifact the stub and solution came from. */
  codeHash: string;
}

// English's prose index hash is compiled in; every other locale's is read at
// runtime from its pointer, so translated instructions published by the i18n
// repo go live without a front-end rebuild. See lib/i18n/catalogPointer.ts.
const resolveIndexHash = createHashResolver({
  label: "exercise prose index",
  compiledHashes: () => exerciseIndexHashes,
  pointerPath: exerciseIndexPointerPath,
  resolveUrl: assetsUrl
});

// Module-level caches. Both are keyed by the resolved HASH as well as the
// locale/language, so a republished index is picked up as a new key rather than
// pinned for the isolate's lifetime.
const indexCache = new Map<string, Promise<ExerciseMetaEntry[]>>();
const codeIndexCache = new Map<string, Promise<ExerciseCodeIndex>>();

async function fetchExerciseIndex(locale: string): Promise<ExerciseMetaEntry[]> {
  let hash: string;
  try {
    hash = await resolveIndexHash(locale);
  } catch {
    return [];
  }

  const key = `${locale}:${hash}`;
  const cached = indexCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const promise = fetch(assetsUrl(exerciseIndexPath(locale, hash))).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch exercise index for locale "${locale}"`);
    }
    return res.json() as Promise<ExerciseMetaEntry[]>;
  });
  indexCache.set(key, promise);
  return promise;
}

/**
 * Fetch a programming language's code index.
 *
 * No pointer and no runtime resolution: code ships with the front-end deploy, so
 * its hash is compiled in and is correct by construction.
 */
async function fetchCodeIndex(language: string): Promise<ExerciseCodeIndex> {
  // The manifest's index signature claims every key is present; a language with
  // no exercises at all is genuinely absent at runtime.
  const hash = (exerciseCodeIndexHashes as Record<string, string | undefined>)[language];
  if (!hash) {
    return {};
  }

  const key = `${language}:${hash}`;
  const cached = codeIndexCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const promise = fetch(assetsUrl(exerciseCodeIndexPath(language, hash))).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch exercise code index for language "${language}"`);
    }
    return res.json() as Promise<ExerciseCodeIndex>;
  });
  codeIndexCache.set(key, promise);
  return promise;
}

export async function getExerciseMetaBySlugs(slugs: string[], locale: string): Promise<ExerciseMetaEntry[]> {
  const index = await fetchExerciseIndex(locale);
  const slugSet = new Set(slugs);
  return index.filter((e) => slugSet.has(e.slug));
}

// Module-level cache for interpreter message dicts, keyed by `${language}:${locale}`.
const interpreterMessagesCache = new Map<string, Promise<Messages>>();

/**
 * Fetch an interpreter's message dict for one language + locale. The result is
 * injected into the interpreter run context as `EvaluationContext.localeMessages`,
 * so the interpreter resolves its diagnostics in the active locale.
 *
 * Returns `{}` when no dict exists for the (language, locale) pair. Interpreters
 * that don't yet localize (Python/JikiScript) ignore the dict entirely; a localized
 * interpreter (JavaScript) given an unsupported locale then surfaces the raw keys —
 * the intended loud canary, never a silent English fallback.
 *
 * The dict is stamped with the locale it belongs to (`tagLocale`) before it is
 * handed on. i18next resolves plural and ordinal variants through
 * `Intl.PluralRules`, which needs the real locale, so a dict that does not name
 * its language cannot render "1st/2nd/3rd" (or its equivalent) correctly. This is
 * the boundary where the locale is still known, so it is where it gets attached;
 * see `interpreters/src/shared/i18n.ts`. The on-disk catalogs never carry it.
 */
// Scoped by interpreter LANGUAGE: English from the compiled manifest, every
// other locale from that language's pointer.
const resolveInterpreterHash = createHashResolver({
  label: "interpreter catalog",
  compiledHashes: (language) => (language ? interpreterMessageHashes[language] : undefined),
  pointerPath: (locale, language) => interpreterMessagesPointerPath(language as string, locale),
  resolveUrl: assetsUrl
});

export async function fetchInterpreterMessages(language: string, locale: string): Promise<Messages> {
  let hash: string;
  try {
    hash = await resolveInterpreterHash(locale, language);
  } catch {
    return {};
  }

  const key = `${language}:${locale}:${hash}`;
  const cached = interpreterMessagesCache.get(key);
  if (cached) {
    return cached;
  }

  const promise = fetch(assetsUrl(interpreterMessagesPath(language, locale, hash))).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch interpreter messages for "${language}" locale "${locale}"`);
    }
    return res.json().then((messages: Messages) => tagLocale(locale, messages));
  });
  interpreterMessagesCache.set(key, promise);
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

// Scoped by exercise SLUG: English from the compiled manifest, every other
// locale from that exercise's pointer.
const resolveExerciseMessagesHash = createHashResolver({
  label: "exercise catalog",
  compiledHashes: (slug) => (slug ? exerciseMessageHashes[slug] : undefined),
  pointerPath: (locale, slug) => exerciseMessagesPointerPath(slug as string, locale),
  resolveUrl: assetsUrl
});

export async function fetchExerciseMessages(slug: string, locale: string): Promise<Record<string, unknown>> {
  let hash: string;
  try {
    hash = await resolveExerciseMessagesHash(locale, slug);
  } catch {
    return {};
  }

  const key = `${slug}:${locale}:${hash}`;
  const cached = messagesCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const promise = (async () => {
    try {
      const res = await fetch(assetsUrl(exerciseMessagesPath(slug, locale, hash)));
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

/**
 * Fetch everything the exercise page needs to render one exercise: its title,
 * description and instructions in the active locale, plus its stub and solution
 * in the active programming language.
 *
 * ## What this costs on the wire
 *
 * Splitting one artifact into two splits one fetch into two, and this is the
 * page a student waits on, so the cost is paid deliberately rather than
 * accidentally. Both index fetches run concurrently, and both content fetches
 * run concurrently, so the split adds ZERO round trips of depth: the request
 * chain is still index-then-content, two levels deep, exactly as before. What it
 * adds is one extra request per level, on an already-open HTTP/2 connection to
 * the same origin.
 *
 * The indexes are session-cached, so in practice the steady-state cost of the
 * split is one additional immutable, edge-cached content fetch per exercise. In
 * exchange, code is now fetched once per language instead of once per (locale,
 * language), so a student switching UI locale re-fetches prose alone.
 */
export async function fetchExerciseContent(slug: string, locale: string, language: string): Promise<ExerciseContent> {
  const [index, codeIndex] = await Promise.all([fetchExerciseIndex(locale), fetchCodeIndex(language)]);

  const entry = index.find((e) => e.slug === slug);
  if (!entry) {
    throw new Error(`Exercise "${slug}" not found in the prose index for locale "${locale}"`);
  }

  const codeHash = codeIndex[slug] as string | undefined;
  if (!codeHash) {
    throw new Error(`No code for exercise "${slug}" in language "${language}"`);
  }

  const [prose, code] = await Promise.all([
    fetchJson<{ instructions: string }>(
      exerciseProsePath(slug, locale, entry.proseHash),
      `prose for exercise "${slug}" (${locale})`
    ),
    fetchJson<{ stub: string; solution: string }>(
      exerciseCodePath(slug, language, codeHash),
      `code for exercise "${slug}" (${language})`
    )
  ]);

  return {
    title: entry.title,
    description: entry.description,
    instructions: prose.instructions,
    stub: code.stub,
    solution: code.solution,
    proseHash: entry.proseHash,
    codeHash
  };
}

async function fetchJson<T>(path: string, label: string): Promise<T> {
  const res = await fetch(assetsUrl(path));
  if (!res.ok) {
    throw new Error(`Failed to fetch ${label}`);
  }
  return (await res.json()) as T;
}
