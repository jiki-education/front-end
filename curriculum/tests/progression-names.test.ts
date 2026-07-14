import { describe, expect, it } from "vitest";
import { exercises } from "../src/exercises";
import type { ExerciseSlug } from "../src/exercises";

// Progression metric names become JSONB keys on submissions, verbatim. They
// must be snake_case identifiers and unique within an exercise, including
// against the framework's reserved keys ("scenarios" shares the metrics
// namespace; "v" and "score" are the surrounding object's own keys).
const RESERVED_KEYS = ["v", "score", "scenarios"];
const SNAKE_CASE = /^[a-z][a-z0-9_]*$/;

describe("progression metric names", () => {
  for (const slug of Object.keys(exercises) as ExerciseSlug[]) {
    it(`${slug}: names are unique and snake_case`, async () => {
      const module = await exercises[slug]();
      const progression = module.default.progressionMetrics;
      if (!progression) {
        return;
      }

      const names = progression.metrics.map((metric) => metric.name);

      for (const name of names) {
        expect(name, `"${name}" must be snake_case`).toMatch(SNAKE_CASE);
        expect(RESERVED_KEYS, `"${name}" clashes with a reserved key`).not.toContain(name);
      }
      expect(new Set(names).size, "names must be unique within the exercise").toBe(names.length);
    });
  }
});
