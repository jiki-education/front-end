import {
  filterToPublishedLevels,
  hasReachedEndOfPublishedLevels
} from "@/components/dashboard/exercise-path/hooks/useLevels";
import type { LevelWithProgress, LessonWithProgress } from "@/types/levels";

function createLesson(overrides: Partial<LessonWithProgress> = {}): LessonWithProgress {
  return {
    slug: "lesson-one",
    title: "Lesson One",
    type: "exercise",
    description: "A lesson",
    status: "not_started",
    walkthrough_video_data: null,
    walkthrough_video_watched_percentage: 0,
    ...overrides
  };
}

function createLevel(slug: string, lessons: LessonWithProgress[] = []): LevelWithProgress {
  return {
    slug,
    status: "not_started",
    lessons
  };
}

describe("filterToPublishedLevels", () => {
  const levels = [createLevel("level-one"), createLevel("level-two"), createLevel("level-three")];

  it("returns all levels when no cutoff is set", () => {
    const result = filterToPublishedLevels(levels, null);
    expect(result).toHaveLength(3);
  });

  it("returns levels up to and including the cutoff level", () => {
    const result = filterToPublishedLevels(levels, "level-two");
    expect(result.map((l) => l.slug)).toEqual(["level-one", "level-two"]);
  });

  it("returns only the first level when it is the cutoff", () => {
    const result = filterToPublishedLevels(levels, "level-one");
    expect(result.map((l) => l.slug)).toEqual(["level-one"]);
  });

  it("returns all levels when the cutoff is the last level", () => {
    const result = filterToPublishedLevels(levels, "level-three");
    expect(result).toHaveLength(3);
  });

  it("returns all levels when the cutoff slug is not found", () => {
    const result = filterToPublishedLevels(levels, "unknown-level");
    expect(result).toHaveLength(3);
  });

  it("returns an empty array when given no levels", () => {
    const result = filterToPublishedLevels([], "level-one");
    expect(result).toEqual([]);
  });
});

describe("hasReachedEndOfPublishedLevels", () => {
  it("returns false when no cutoff is set", () => {
    const levels = [createLevel("level-one", [createLesson({ status: "completed" })])];
    expect(hasReachedEndOfPublishedLevels(levels, null)).toBe(false);
  });

  it("returns false when the cutoff level is not found", () => {
    const levels = [createLevel("level-one", [createLesson({ status: "completed" })])];
    expect(hasReachedEndOfPublishedLevels(levels, "unknown-level")).toBe(false);
  });

  it("returns false when the cutoff level has no lessons", () => {
    const levels = [createLevel("level-one")];
    expect(hasReachedEndOfPublishedLevels(levels, "level-one")).toBe(false);
  });

  it("returns false when some lessons in the cutoff level are not completed", () => {
    const levels = [
      createLevel("level-one", [
        createLesson({ slug: "l1", status: "completed" }),
        createLesson({ slug: "l2", status: "started" })
      ])
    ];
    expect(hasReachedEndOfPublishedLevels(levels, "level-one")).toBe(false);
  });

  it("returns true when all lessons in the cutoff level are completed", () => {
    const levels = [
      createLevel("level-one", [
        createLesson({ slug: "l1", status: "completed" }),
        createLesson({ slug: "l2", status: "completed" })
      ])
    ];
    expect(hasReachedEndOfPublishedLevels(levels, "level-one")).toBe(true);
  });

  it("only checks the cutoff level's lessons, not later levels", () => {
    const levels = [
      createLevel("level-one", [createLesson({ slug: "l1", status: "completed" })]),
      createLevel("level-two", [createLesson({ slug: "l2", status: "not_started" })])
    ];
    expect(hasReachedEndOfPublishedLevels(levels, "level-one")).toBe(true);
  });
});
