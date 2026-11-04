import { describe, expect, it } from "vitest";
import digitalClockExercise from "../../src/exercises/digital-clock";
import { progressionMetrics } from "../../src/exercises/digital-clock/progressionMetrics";
import solutionJavascript from "../../src/exercises/digital-clock/solution.javascript?raw";
import solutionJiki from "../../src/exercises/digital-clock/solution.jiki?raw";
import stubJiki from "../../src/exercises/digital-clock/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(digitalClockExercise, studentCode, language);
  const runs = buildScenarioRuns(results, digitalClockExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Python is omitted: this exercise's external functions validate their
// arguments with isNumber/isString guards that don't recognise Python
// values, so the python solution fails at runtime in this harness.
const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript
};

// Gets the am/pm indicator right but never converts the hour to 12-hour time.
const NO_CONVERSION_ATTEMPT = `set hour to current_time_hour()
set minutes to current_time_minute()

set indicator to "am"
if hour >= 12 do
  change indicator to "pm"
end

display_time(hour, minutes, indicator)`;

describe("digital-clock progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 20,
        metrics: { scenarios: 10, read_the_time: 2, displayed_time: 3, meridiem_indicator: 5 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, read_the_time: 0, displayed_time: 0, meridiem_indicator: 0 }
    });
  });

  it("credits the meridiem sub-step when only the hour conversion is missing", () => {
    const { metrics } = runProgression(NO_CONVERSION_ATTEMPT);

    // The two morning scenarios, early afternoon, and noon pass; the "now"
    // scenario depends on the wall clock, so the anchor isn't asserted exactly.
    expect(metrics.scenarios).toBeGreaterThanOrEqual(6);
    expect(metrics.scenarios).toBeLessThanOrEqual(7);
    expect(metrics.read_the_time).toBe(2);
    expect(metrics.displayed_time).toBe(3);
    expect(metrics.meridiem_indicator).toBe(5);
  });
});
