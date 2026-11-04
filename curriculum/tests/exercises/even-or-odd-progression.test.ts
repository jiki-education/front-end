import { describe, expect, it } from "vitest";
import evenOrOddExercise from "../../src/exercises/even-or-odd";
import { progressionMetrics } from "../../src/exercises/even-or-odd/progressionMetrics";
import solutionJavascript from "../../src/exercises/even-or-odd/solution.javascript?raw";
import solutionJiki from "../../src/exercises/even-or-odd/solution.jiki?raw";
import solutionPy from "../../src/exercises/even-or-odd/solution.py?raw";
import stubJavascript from "../../src/exercises/even-or-odd/stub.javascript?raw";
import stubJiki from "../../src/exercises/even-or-odd/stub.jiki?raw";
import stubPy from "../../src/exercises/even-or-odd/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(evenOrOddExercise, studentCode, language);
  // The exercise flags its "solve in 6 lines" bonus scenario, which is
  // excluded from the anchor and from allPassed().
  const runs = buildScenarioRuns(results, evenOrOddExercise);
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

// Returns lowercase "even"/"odd" - behaviourally close but capitalisation matters.
const LOWERCASE_ATTEMPT = `function evenOrOdd(number) {
  if (number % 2 === 0) {
    return "even"
  }
  return "odd"
}`;

// Always returns "Even" - right for the even and zero scenarios, wrong for the odd ones.
const CONSTANT_ATTEMPT = `function evenOrOdd(number) {
  return "Even"
}`;

describe("even-or-odd progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor, uses_modulo, and full loc for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      // Every solution is at or under the 6-line loc target, so full points.
      expect(scores).toEqual({
        score: 16,
        metrics: { scenarios: 10, uses_modulo: 3, loc: 3 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, uses_modulo: 0, loc: 0 }
      });
    });
  }

  it('scores uses_modulo but no anchor or loc for lowercase "even"/"odd" (capitalisation matters)', () => {
    const scores = runProgression(LOWERCASE_ATTEMPT, "javascript");

    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, uses_modulo: 3, loc: 0 }
    });
  });

  it("scores a partial anchor for a constant return, with no loc points", () => {
    const scores = runProgression(CONSTANT_ATTEMPT, "javascript");

    // The two even scenarios and zero pass: 3 of 5 non-bonus scenarios.
    expect(scores).toEqual({
      score: 6,
      metrics: { scenarios: 6, uses_modulo: 0, loc: 0 }
    });
  });
});
