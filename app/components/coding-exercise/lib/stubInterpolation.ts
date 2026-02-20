import type { Language } from "@jiki/curriculum";
import type { ExerciseSubmissionFile, LatestExerciseSubmission } from "@/lib/api/lessons";

const PLACEHOLDER_PATTERN = /\{\{LESSON:([^}]+)\}\}/;
const PLACEHOLDER_PATTERN_GLOBAL = /\{\{LESSON:([^}]+)\}\}/g;

export function hasPlaceholders(stub: string): boolean {
  return PLACEHOLDER_PATTERN.test(stub);
}

export function extractPlaceholderSlugs(stub: string): string[] {
  const slugs = new Set<string>();
  let match: RegExpExecArray | null;
  const regex = new RegExp(PLACEHOLDER_PATTERN_GLOBAL.source, "g");
  while ((match = regex.exec(stub)) !== null) {
    slugs.add(match[1]);
  }
  return Array.from(slugs);
}

const LANGUAGE_EXTENSIONS: Record<Language, string[]> = {
  jikiscript: [".jiki"],
  javascript: [".js", ".javascript"],
  python: [".py"]
};

function findFileForLanguage(files: ExerciseSubmissionFile[], language: Language): ExerciseSubmissionFile | undefined {
  if (files.length === 1) {
    return files[0];
  }

  const extensions = LANGUAGE_EXTENSIONS[language];
  return files.find((f) => extensions.some((ext) => f.filename.endsWith(ext)));
}

function extractCode(submission: LatestExerciseSubmission | null, language: Language): string {
  if (!submission) {
    return "";
  }
  const file = findFileForLanguage(submission.files, language);
  return file?.content ?? "";
}

async function fetchSubmissionCode(lessonSlug: string, language: Language): Promise<string> {
  try {
    const { fetchLatestExerciseSubmission } = await import("@/lib/api/lessons");
    const submission = await fetchLatestExerciseSubmission(lessonSlug);
    return extractCode(submission, language);
  } catch {
    return "";
  }
}

export async function interpolateStub(stub: string, language: Language): Promise<string> {
  if (!hasPlaceholders(stub)) {
    return stub;
  }

  const slugs = extractPlaceholderSlugs(stub);

  const results = await Promise.all(
    slugs.map(async (slug) => ({
      slug,
      code: await fetchSubmissionCode(slug, language)
    }))
  );

  const codeMap = new Map<string, string>();
  for (const { slug, code } of results) {
    codeMap.set(slug, code);
  }

  return stub.replace(PLACEHOLDER_PATTERN_GLOBAL, (_match, lessonSlug: string) => codeMap.get(lessonSlug) ?? "");
}
