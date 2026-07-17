import { describe, expect, it } from "vitest";
import golfShotCheckerExercise from "../../src/exercises/golf-shot-checker";
import { progressionMetrics } from "../../src/exercises/golf-shot-checker/progressionMetrics";
import solutionJavascript from "../../src/exercises/golf-shot-checker/solution.javascript?raw";
import solutionJiki from "../../src/exercises/golf-shot-checker/solution.jiki?raw";
import stubJiki from "../../src/exercises/golf-shot-checker/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(golfShotCheckerExercise, studentCode, language);
  const runs = buildScenarioRuns(results, golfShotCheckerExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Python is omitted: this exercise's external functions validate their
// arguments with isNumber/isString guards that don't recognise Python
// values, so the python solution fails at runtime in this harness.
const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript
};

// Rolls the ball the right distance with a loop, but no hole check yet.
const ROLL_ONLY_ATTEMPT = `set shot_length to get_shot_length()
set x to 28

repeat shot_length times do
  change x to x + 1
  move_to(x, 75)
end`;

describe("golf-shot-checker progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 24,
        metrics: { scenarios: 10, read_shot_length: 2, used_loop: 8, combined_condition: 4 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, read_shot_length: 0, used_loop: 0, combined_condition: 0 }
    });
  });

  it("credits the loop and the read, but not the hole check, for rolling only", () => {
    const scores = runProgression(ROLL_ONLY_ATTEMPT);

    // The four miss scenarios pass (the ball stays on the grass); the two
    // sink scenarios fail (4 of 6).
    expect(scores).toEqual({
      score: 17,
      metrics: { scenarios: 7, read_shot_length: 2, used_loop: 8, combined_condition: 0 }
    });
  });
});
