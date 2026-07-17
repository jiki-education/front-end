import { describe, expect, it } from "vitest";
import raindropsExercise from "../../src/exercises/raindrops";
import { progressionMetrics } from "../../src/exercises/raindrops/progressionMetrics";
import solutionJavascript from "../../src/exercises/raindrops/solution.javascript?raw";
import solutionJiki from "../../src/exercises/raindrops/solution.jiki?raw";
import solutionPy from "../../src/exercises/raindrops/solution.py?raw";
import stubJavascript from "../../src/exercises/raindrops/stub.javascript?raw";
import stubJiki from "../../src/exercises/raindrops/stub.jiki?raw";
import stubPy from "../../src/exercises/raindrops/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(raindropsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, raindropsExercise);
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

// Grinds out literal returns per combination instead of accumulating.
const LITERAL_RETURNS_ATTEMPT = `function raindrops(number) {
  if (number % 105 === 0) {
    return "PlingPlangPlong"
  }
  if (number % 15 === 0) {
    return "PlingPlang"
  }
  if (number % 3 === 0) {
    return "Pling"
  }
  if (number % 5 === 0) {
    return "Plang"
  }
  if (number % 7 === 0) {
    return "Plong"
  }
  return \`\${number}\`
}`;

// Accumulates correctly but never handles the no-sound fallback.
const NO_FALLBACK_ATTEMPT = `function raindrops(number) {
  let result = ""
  if (number % 3 === 0) {
    result = result + "Pling"
  }
  if (number % 5 === 0) {
    result = result + "Plang"
  }
  if (number % 7 === 0) {
    result = result + "Plong"
  }
  return result
}`;

describe("raindrops progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of ["jikiscript", "javascript"] as Language[]) {
    it(`scores the full anchor plus both metrics for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores).toEqual({
        score: 20,
        metrics: { scenarios: 10, builds_up_sounds: 8, uses_modulo: 2 }
      });
    });
  }

  it("scores both metrics for the python solution (str() is not yet allowed by the level, so the two no-sound scenarios fail)", () => {
    const scores = runProgression(SOLUTIONS.python, "python");

    // Known level gap: string-manipulation defines no python
    // allowedStdlibFunctions, so the model solution's str(number) errors and
    // number-8/number-52 fail: 9 of 11 scenarios.
    expect(scores).toEqual({
      score: 18,
      metrics: { scenarios: 8, builds_up_sounds: 8, uses_modulo: 2 }
    });
  });

  for (const language of languages) {
    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, builds_up_sounds: 0, uses_modulo: 0 }
      });
    });
  }

  it("scores no builds_up_sounds for literal returns per combination", () => {
    const scores = runProgression(LITERAL_RETURNS_ATTEMPT, "javascript");

    // 21 and 35 fail (returns "Pling"/"Plang"): 9 of 11 scenarios.
    expect(scores).toEqual({
      score: 10,
      metrics: { scenarios: 8, builds_up_sounds: 0, uses_modulo: 2 }
    });
  });

  it("scores both metrics when only the no-sound fallback is missing", () => {
    const scores = runProgression(NO_FALLBACK_ATTEMPT, "javascript");

    // The two no-sound scenarios fail: 9 of 11.
    expect(scores).toEqual({
      score: 18,
      metrics: { scenarios: 8, builds_up_sounds: 8, uses_modulo: 2 }
    });
  });
});
