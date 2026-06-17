import { buildLevelSections } from "@/components/dashboard/exercise-path/hooks/useLevels";
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

function createLevel(overrides: Partial<LevelWithProgress> = {}): LevelWithProgress {
  return {
    slug: "level-one",
    status: "not_started",
    lessons: [createLesson()],
    ...overrides
  };
}

describe("buildLevelSections", () => {
  describe("locking logic", () => {
    // Lock state mirrors the API status directly: the backend returns
    // completed/started lessons plus at most one not_started "frontier" lesson,
    // and anything the user hasn't unlocked is surfaced as "locked".
    it("locks a lesson with locked status", () => {
      const levels = [createLevel({ lessons: [createLesson({ status: "locked" })] })];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].locked).toBe(true);
    });

    it("unlocks a not_started (frontier) lesson", () => {
      const levels = [createLevel({ lessons: [createLesson({ status: "not_started" })] })];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].locked).toBe(false);
    });

    it("unlocks a started lesson", () => {
      const levels = [createLevel({ lessons: [createLesson({ status: "started" })] })];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].locked).toBe(false);
    });

    it("unlocks a completed lesson", () => {
      const levels = [createLevel({ lessons: [createLesson({ status: "completed" })] })];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].locked).toBe(false);
    });

    it("locks only the locked lessons within a level", () => {
      const levels = [
        createLevel({
          lessons: [
            createLesson({ slug: "lesson-one", status: "completed" }),
            createLesson({ slug: "lesson-two", status: "not_started" }),
            createLesson({ slug: "lesson-three", status: "locked" })
          ]
        })
      ];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].locked).toBe(false);
      expect(result[0].lessons[1].locked).toBe(false);
      expect(result[0].lessons[2].locked).toBe(true);
    });

    it("locks lessons in a not-yet-reached level", () => {
      const levels = [
        createLevel({ slug: "level-one", status: "started" }),
        createLevel({
          slug: "level-two",
          status: "not_started",
          lessons: [createLesson({ slug: "lesson-three", status: "locked" })]
        })
      ];
      const result = buildLevelSections(levels);
      expect(result[1].lessons[0].locked).toBe(true);
    });
  });

  describe("level section properties", () => {
    it("maps level slug to title with capitalized words", () => {
      const levels = [createLevel({ slug: "intro-to-coding" })];
      const result = buildLevelSections(levels);
      expect(result[0].levelTitle).toBe("Intro To Coding");
    });

    it("uses 1-based levelIndex", () => {
      const levels = [createLevel({ slug: "level-one" }), createLevel({ slug: "level-two" })];
      const result = buildLevelSections(levels);
      expect(result[0].levelIndex).toBe(1);
      expect(result[1].levelIndex).toBe(2);
    });

    it("counts completed lessons", () => {
      const levels = [
        createLevel({
          lessons: [
            createLesson({ slug: "l1", status: "completed" }),
            createLesson({ slug: "l2", status: "started" }),
            createLesson({ slug: "l3", status: "completed" })
          ]
        })
      ];
      const result = buildLevelSections(levels);
      expect(result[0].completedLessonsCount).toBe(2);
    });

    it("calculates xpEarned as completedLessonsCount * 10", () => {
      const levels = [
        createLevel({
          lessons: [
            createLesson({ slug: "l1", status: "completed" }),
            createLesson({ slug: "l2", status: "completed" })
          ]
        })
      ];
      const result = buildLevelSections(levels);
      expect(result[0].xpEarned).toBe(20);
    });

    it("sets isLocked based on first lesson locked state", () => {
      const levels = [
        createLevel({ slug: "level-one", status: "completed", lessons: [] }),
        createLevel({
          slug: "level-two",
          status: "not_started",
          lessons: [createLesson({ slug: "lesson-one", status: "not_started" })]
        })
      ];
      const result = buildLevelSections(levels);
      expect(result[0].isLocked).toBe(false); // no lessons -> false
      expect(result[1].isLocked).toBe(false); // previous level completed -> unlocked
    });

    it("maps ready_for_completion level status to started", () => {
      const levels = [createLevel({ status: "ready_for_completion" })];
      const result = buildLevelSections(levels);
      expect(result[0].status).toBe("started");
    });

    it("passes through other level statuses unchanged", () => {
      const levels = [createLevel({ status: "completed" })];
      const result = buildLevelSections(levels);
      expect(result[0].status).toBe("completed");
    });
  });

  describe("lesson display data", () => {
    it("sets route to /lesson/{slug}", () => {
      const levels = [createLevel({ lessons: [createLesson({ slug: "my-lesson" })] })];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].route).toBe("/lesson/my-lesson");
    });

    it("sets completed to true only for completed lessons", () => {
      const levels = [
        createLevel({
          lessons: [
            createLesson({ slug: "l1", status: "completed" }),
            createLesson({ slug: "l2", status: "started" }),
            createLesson({ slug: "l3", status: "not_started" })
          ]
        })
      ];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].completed).toBe(true);
      expect(result[0].lessons[1].completed).toBe(false);
      expect(result[0].lessons[2].completed).toBe(false);
    });

    it("uses lesson title from API data", () => {
      const levels = [createLevel({ lessons: [createLesson({ title: "Owner's Bouquets" })] })];
      const result = buildLevelSections(levels);
      expect(result[0].lessons[0].lesson.title).toBe("Owner's Bouquets");
    });
  });
});
