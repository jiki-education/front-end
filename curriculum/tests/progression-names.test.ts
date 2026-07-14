import { describe, expect, it } from "vitest";
import { exercises } from "../src/exercises";
import type { ExerciseSlug } from "../src/exercises";

// Progression metric/gauge names become JSONB keys on submissions, verbatim.
// They must be snake_case identifiers and unique within an exercise across
// metrics, gauges, and the framework's reserved keys.
const RESERVED_KEYS = ["v", "scenarios"];
const SNAKE_CASE = /^[a-z][a-z0-9_]*$/;

describe("progression metric and gauge names", () => {
  for (const slug of Object.keys(exercises) as ExerciseSlug[]) {
    it(`${slug}: names are unique and snake_case`, async () => {
      const module = await exercises[slug]();
      const progression = module.default.progression;
      if (!progression) {
        return;
      }

      const names = [
        ...progression.metrics.map((metric) => metric.name),
        ...(progression.gauges ?? []).map((gauge) => gauge.name)
      ];

      for (const name of names) {
        expect(name, `"${name}" must be snake_case`).toMatch(SNAKE_CASE);
        expect(RESERVED_KEYS, `"${name}" clashes with a reserved key`).not.toContain(name);
      }
      expect(new Set(names).size, "names must be unique within the exercise").toBe(names.length);
    });
  }
});
