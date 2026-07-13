import { describe, expect, it } from "vitest";
import evenOrOddExercise from "../../src/exercises/even-or-odd";
import { progressionTest } from "../../src/exercises/even-or-odd/progressionTest";
import solutionJavascript from "../../src/exercises/even-or-odd/solution.javascript?raw";
import solutionJiki from "../../src/exercises/even-or-odd/solution.jiki?raw";
import solutionPy from "../../src/exercises/even-or-odd/solution.py?raw";
import stubJavascript from "../../src/exercises/even-or-odd/stub.javascript?raw";
import stubJiki from "../../src/exercises/even-or-odd/stub.jiki?raw";
import stubPy from "../../src/exercises/even-or-odd/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";

// Mirrors the app's progression evaluator scoring: run the visible scenarios,
// hand the run artifacts to each metric, clamp to 0..maxScore, and convert to
// integer points.
function runProgression(studentCode: string, language: Language): number[] {
  const results = runExerciseTests(evenOrOddExercise, studentCode, language);
  const runs = buildScenarioRuns(results);

  return progressionTest.metrics.map((metric) => {
    let raw: number;
    try {
      raw = metric.score(runs, language);
    } catch {
      raw = 0;
    }
    const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
    return Math.round((metric.points * clamped) / metric.maxScore);
  });
}

function total(scores: number[]): number {
  return scores.reduce((sum, s) => sum + s, 0);
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

describe("even-or-odd progression test", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores full marks (12) for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores).toEqual([8, 3, 1]);
      expect(total(scores)).toBe(12);
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual([0, 0, 0]);
      expect(total(scores)).toBe(0);
    });
  }

  it('scores 0 on inputs-correct for lowercase "even"/"odd" (capitalisation matters)', () => {
    const scores = runProgression(LOWERCASE_ATTEMPT, "javascript");

    expect(scores).toEqual([0, 3, 1]);
  });

  it("scores partial inputs-correct for a constant return", () => {
    const scores = runProgression(CONSTANT_ATTEMPT, "javascript");

    // The two even scenarios and zero match: 3 of 5 visible input scenarios.
    // No modulo, so no uses-modulo or concise points.
    expect(scores).toEqual([5, 0, 0]);
  });
});
