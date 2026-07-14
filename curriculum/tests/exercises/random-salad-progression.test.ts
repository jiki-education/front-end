import { describe, expect, it } from "vitest";
import randomSaladExercise from "../../src/exercises/random-salad";
import { progressionMetrics } from "../../src/exercises/random-salad/progressionMetrics";
import solutionJavascript from "../../src/exercises/random-salad/solution.javascript?raw";
import solutionJiki from "../../src/exercises/random-salad/solution.jiki?raw";
import stubJiki from "../../src/exercises/random-salad/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// The scenario uses randomSeed, so the metrics follow the actual returned
// values through the call log rather than expecting fixed numbers.
function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(randomSaladExercise, studentCode, language);
  const runs = buildScenarioRuns(results, randomSaladExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Only the leaves are random; the other ingredients are literals.
const LEAVES_ONLY = `let leaves = Math.randomInt(40, 100)
makeSalad(leaves, 10, 15, 5)`;

describe("random-salad progression", () => {
  it("scores the full anchor plus full metric marks for the javascript solution", () => {
    const scores = runProgression(solutionJavascript, "javascript");

    expect(scores).toEqual({
      score: 21,
      metrics: { scenarios: 10, random_ingredients: 8, salad_made: 3 }
    });
  });

  it("scores full metric marks for the jikiscript solution even though the scenario's codeChecks only recognise Math.randomInt", () => {
    // Known scenario gap: the codeChecks match the log name "Math.randomInt",
    // but jikiscript logs "random_number", so the jikiscript solution cannot
    // pass the scenario. The metrics use a language-agnostic name match.
    const scores = runProgression(solutionJiki, "jikiscript");

    expect(scores).toEqual({
      score: 11,
      metrics: { scenarios: 0, random_ingredients: 8, salad_made: 3 }
    });
  });

  it("scores only salad-made for the stub (it serves a fixed salad)", () => {
    const scores = runProgression(stubJiki, "jikiscript");

    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, random_ingredients: 0, salad_made: 3 }
    });
  });

  it("scores one chain link plus salad-made when only the leaves are random", () => {
    const scores = runProgression(LEAVES_ONLY, "javascript");

    // 1 of 4 chained random ingredients => round(8 * 1/4) = 2.
    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 0, random_ingredients: 2, salad_made: 3 }
    });
  });
});
