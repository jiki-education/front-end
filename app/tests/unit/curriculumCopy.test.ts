import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { challengeSlugs, exerciseLessonSlugs, videoLessonSlugs } from "@jiki/curriculum";

// Guards the curriculum copy catalog at its sources rather than its output, so
// these run without the generator having been invoked first.
//
// The catalog is keyed by slug across exercises, video lessons and challenges.
// Every slug a student can reach must resolve, or the UI renders a raw slug — the
// deliberate loud canary, which is exactly what these tests keep out of main.
//
// English is the only copy on disk here; translations are authored in the i18n
// repo and published from there, and their key parity is guarded there against
// these same files.

const CURRICULUM = path.join(__dirname, "../../../curriculum/src");
const VIDEO_LESSON_COPY = path.join(CURRICULUM, "video-lessons/messages.json");
const BADGE_COPY = path.join(CURRICULUM, "badges/messages.json");

function readJson(file: string): Record<string, Record<string, string>> {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// Exercise copy lives in instructions frontmatter.
function exerciseCopy(slug: string): { title?: string; description?: string } | null {
  const file = path.join(CURRICULUM, "exercises", slug, "instructions.md");
  if (!fs.existsSync(file)) {
    return null;
  }
  return matter(fs.readFileSync(file, "utf-8")).data;
}

describe("curriculum copy catalog sources", () => {
  describe("video lessons", () => {
    it("has an entry for every video lesson slug, and no extras", () => {
      const authored = Object.keys(readJson(VIDEO_LESSON_COPY));
      expect(authored.sort()).toEqual([...videoLessonSlugs].sort());
    });

    it("has non-empty title and description for every entry", () => {
      const catalog = readJson(VIDEO_LESSON_COPY);
      for (const [slug, entry] of Object.entries(catalog)) {
        expect(entry.title).toBeTruthy();
        expect(entry.description).toBeTruthy();
        expect(slug).toBeTruthy();
      }
    });
  });

  describe("exercises and challenges", () => {
    it("has frontmatter copy for every exercise lesson", () => {
      for (const slug of exerciseLessonSlugs) {
        const copy = exerciseCopy(slug);
        expect(copy).not.toBeNull();
        expect(copy?.title).toBeTruthy();
      }
    });

    it("has frontmatter copy for every challenge", () => {
      for (const slug of challengeSlugs) {
        const copy = exerciseCopy(slug);
        expect(copy).not.toBeNull();
        expect(copy?.title).toBeTruthy();
        // Challenge cards render the description, so an empty one is a visible gap.
        expect(copy?.description).toBeTruthy();
      }
    });
  });

  describe("slug namespace", () => {
    // The catalog is one flat slug map, so the three registries must not overlap —
    // a collision would silently give one entry to two different things.
    it("keeps exercise lessons, video lessons and challenges disjoint", () => {
      const all = [...exerciseLessonSlugs, ...videoLessonSlugs, ...challengeSlugs];
      expect(new Set(all).size).toBe(all.length);
    });
  });

  describe("badges", () => {
    it("has at least one badge", () => {
      expect(Object.keys(readJson(BADGE_COPY)).length).toBeGreaterThan(0);
    });

    it("has non-empty name, description and fun fact for every badge", () => {
      const catalog = readJson(BADGE_COPY);
      for (const entry of Object.values(catalog)) {
        expect(entry.name).toBeTruthy();
        expect(entry.description).toBeTruthy();
        expect(entry.funFact).toBeTruthy();
      }
    });
  });
});
