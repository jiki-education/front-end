import { describe, expect, it } from "vitest";
import annalynsInfiltrationExercise from "../../src/exercises/annalyns-infiltration";
import { progressionMetrics } from "../../src/exercises/annalyns-infiltration/progressionMetrics";
import solutionJavascript from "../../src/exercises/annalyns-infiltration/solution.javascript?raw";
import solutionJiki from "../../src/exercises/annalyns-infiltration/solution.jiki?raw";
import solutionPy from "../../src/exercises/annalyns-infiltration/solution.py?raw";
import stubJiki from "../../src/exercises/annalyns-infiltration/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(annalynsInfiltrationExercise, studentCode, language);
  const runs = buildScenarioRuns(results, annalynsInfiltrationExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

// Only the fast-attack rule, using just the knight check and "not".
const KNIGHT_ONLY_ATTEMPT = `if not knight_is_awake() do
  fast_attack()
end`;

describe("annalyns-infiltration progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 24,
        metrics: { scenarios: 10, checked_the_camp: 3, logic_operators: 9, took_action: 2 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, checked_the_camp: 0, logic_operators: 0, took_action: 0 }
    });
  });

  it("scores partial marks everywhere for the fast-attack-only attempt", () => {
    const scores = runProgression(KNIGHT_ONLY_ATTEMPT);

    // Passes only the all-asleep-naughty-dog camp (1 of 6); checks 1 of 4
    // informants; uses "not" (1 of 3 operators); acts in the 4 camps where
    // the knight sleeps.
    expect(scores).toEqual({
      score: 7,
      metrics: { scenarios: 2, checked_the_camp: 1, logic_operators: 3, took_action: 1 }
    });
  });
});
