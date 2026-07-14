import { describe, expect, it } from "vitest";
import helloExercise from "../../src/exercises/hello";
import { progressionMetrics } from "../../src/exercises/hello/progressionMetrics";
import solutionJavascript from "../../src/exercises/hello/solution.javascript?raw";
import solutionJiki from "../../src/exercises/hello/solution.jiki?raw";
import solutionPy from "../../src/exercises/hello/solution.py?raw";
import stubJavascript from "../../src/exercises/hello/stub.javascript?raw";
import stubJiki from "../../src/exercises/hello/stub.jiki?raw";
import stubPy from "../../src/exercises/hello/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(helloExercise, studentCode, language);
  const runs = buildScenarioRuns(results, helloExercise);
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

// Hardcodes one greeting instead of building it from the name input.
const HARDCODED_ATTEMPT = `function sayHello(name) {
  return "Hello, Aiko!"
}`;

describe("hello progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor plus both metrics for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores).toEqual({
        score: 20,
        metrics: { scenarios: 10, uses_concatenation: 8, returns_string: 2 }
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

  it("scores returns_string and a partial anchor but no concatenation for a hardcoded greeting", () => {
    const scores = runProgression(HARDCODED_ATTEMPT, "javascript");

    // Only the Aiko scenario passes: 1 of 3.
    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 3, uses_concatenation: 0, returns_string: 2 }
    });
  });
});
