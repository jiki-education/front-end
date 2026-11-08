import { describe, expect, it } from "vitest";
import relationalSunExercise from "../../src/exercises/relational-sun";
import { progressionMetrics } from "../../src/exercises/relational-sun/progressionMetrics";
import solution from "../../src/exercises/relational-sun/solution.javascript?raw";
import stub from "../../src/exercises/relational-sun/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// JavaScript throughout: the scenario's isolated checks inject secretConstants,
// which the curriculum test runner only honors for the JavaScript interpreter.
function runProgression(studentCode: string) {
  const results = runExerciseTests(relationalSunExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, relationalSunExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// Correct at the default gap/radius but hardcoded, so the scaling checks fail.
const HARDCODED_ATTEMPT = `let canvasSize = 100
let color = "yellow"
let gap = 10
let radius = 15
circle(75, 25, 15, color)`;

// Variables throughout, but sunX derived wrongly (gap + radius, not mirrored).
const WRONG_DERIVATION_ATTEMPT = `let canvasSize = 100
let color = "yellow"
let gap = 10
let radius = 15
let sunX = gap + radius
let sunY = gap + radius
circle(sunX, sunY, radius, color)`;

describe("relational-sun progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 21,
      metrics: { scenarios: 10, sun_positioned: 8, used_variables: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, sun_positioned: 0, used_variables: 0 }
    });
  });

  it("scores sun_positioned but NOT used_variables for a hardcoded-but-correct circle", () => {
    const scores = runProgression(HARDCODED_ATTEMPT);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, sun_positioned: 8, used_variables: 0 }
    });
  });

  it("scores used_variables but NOT sun_positioned for a wrong derivation", () => {
    const scores = runProgression(WRONG_DERIVATION_ATTEMPT);

    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, sun_positioned: 0, used_variables: 3 }
    });
  });
});
