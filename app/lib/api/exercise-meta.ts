import { exerciseIndexHashes } from "@/lib/generated/exercise-hashes";

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

export async function getExerciseMeta(slug: string, locale: string = "en"): Promise<ExerciseMetaEntry | null> {
  const index = await fetchExerciseIndex(locale);
  return index.find((e) => e.slug === slug) ?? null;
}

export async function getExerciseMetaBySlugs(slugs: string[], locale: string = "en"): Promise<ExerciseMetaEntry[]> {
  const index = await fetchExerciseIndex(locale);
  const slugSet = new Set(slugs);
  return index.filter((e) => slugSet.has(e.slug));
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
