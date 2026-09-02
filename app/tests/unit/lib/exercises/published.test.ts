import { exerciseLessonSlugs, levels } from "@jiki/curriculum";
import { LAST_PUBLISHED_LEVEL_SLUG } from "@/lib/constants/course";
import { exerciseLevels } from "@/lib/generated/exercise-levels";
import { publishedExerciseSlugs } from "@/lib/exercises/published";

describe("publishedExerciseSlugs", () => {
  it("stops at the cutoff level and includes it", () => {
    const slugs = publishedExerciseSlugs("conditionals");
    const levelIds: string[] = levels.map((level) => level.id);
    const allowed = new Set(levelIds.slice(0, levelIds.indexOf("conditionals") + 1));

    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(allowed).toContain(exerciseLevels[slug]);
    }
    expect(slugs.some((slug) => exerciseLevels[slug] === "conditionals")).toBe(true);
  });

  it("publishes every lesson exercise when there is no cutoff", () => {
    const slugs = publishedExerciseSlugs(null);
    const mapped = exerciseLessonSlugs.filter((slug) => exerciseLevels[slug] !== undefined);
    expect(slugs).toEqual([...mapped]);
  });

  it("publishes nothing when the cutoff names a level the registry does not have", () => {
    // A typo in LAST_PUBLISHED_LEVEL_SLUG must not fall through to publishing
    // unreleased curriculum.
    expect(publishedExerciseSlugs("not-a-level")).toEqual([]);
  });

  it("excludes challenges, which are premium-gated", () => {
    const lessons = new Set<string>(exerciseLessonSlugs);
    for (const slug of publishedExerciseSlugs()) {
      expect(lessons.has(slug)).toBe(true);
    }
  });

  it("keeps the real cutoff resolvable, so the sitemap is never silently empty", () => {
    expect(publishedExerciseSlugs().length).toBeGreaterThan(0);
    if (LAST_PUBLISHED_LEVEL_SLUG !== null) {
      expect(levels.map((level): string => level.id)).toContain(LAST_PUBLISHED_LEVEL_SLUG);
    }
  });

  it("maps every lesson exercise to a level", () => {
    // A lesson slug with no levelId is dropped from the sitemap, so this guards
    // against an exercise quietly going unlisted.
    const unmapped = exerciseLessonSlugs.filter((slug) => exerciseLevels[slug] === undefined);
    expect(unmapped).toEqual([]);
  });
});
