import { describe, expect, it } from "vitest";
import twoFerExercise from "../../src/exercises/two-fer";
import { progressionMetrics } from "../../src/exercises/two-fer/progressionMetrics";
import solutionJavascript from "../../src/exercises/two-fer/solution.javascript?raw";
import solutionJiki from "../../src/exercises/two-fer/solution.jiki?raw";
import solutionPy from "../../src/exercises/two-fer/solution.py?raw";
import stubJavascript from "../../src/exercises/two-fer/stub.javascript?raw";
import stubJiki from "../../src/exercises/two-fer/stub.jiki?raw";
import stubPy from "../../src/exercises/two-fer/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(twoFerExercise, studentCode, language);
  const runs = buildScenarioRuns(results, twoFerExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Record<Language, string> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

const STUBS: Record<Language, string> = {
  jikiscript: stubJiki,
  javascript: stubJavascript,
  python: stubPy
};

// Concatenates correctly but never handles the empty-name default.
const NO_DEFAULT_ATTEMPT = `function twoFer(name) {
  return "One for " + name + ", one for me."
}`;

describe("two-fer progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor plus both metrics for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores).toEqual({
        score: 16,
        metrics: { scenarios: 10, uses_concatenation: 4, returns_string: 2 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, uses_concatenation: 0, returns_string: 0 }
      });
    });
  }

  it("scores both metrics and a partial anchor when the default case is missing", () => {
    const scores = runProgression(NO_DEFAULT_ATTEMPT, "javascript");

    // Alice and Tom pass, the no-name default fails: 2 of 3.
    expect(scores).toEqual({
      score: 13,
      metrics: { scenarios: 7, uses_concatenation: 4, returns_string: 2 }
    });
  });
});
