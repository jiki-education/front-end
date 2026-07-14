import { describe, expect, it } from "vitest";
import relationalSnowmanExercise from "../../src/exercises/relational-snowman";
import { progressionMetrics } from "../../src/exercises/relational-snowman/progressionMetrics";
import solution from "../../src/exercises/relational-snowman/solution.javascript?raw";
import stub from "../../src/exercises/relational-snowman/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// JavaScript throughout: the scenario's isolated checks inject secretConstants,
// which the curriculum test runner only honors for the JavaScript interpreter.
function runProgression(studentCode: string) {
  const results = runExerciseTests(relationalSnowmanExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, relationalSnowmanExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// Radii derived correctly from size, but the y positions hardcoded: the base
// happens to sit on the ground, so one of the three stacking relations holds.
const MISPLACED_ATTEMPT = `let snowmanX = 50
let size = 4
let headRadius = size * 2
let bodyRadius = size * 3
let baseRadius = size * 4
let headY = 20
let bodyY = 50
let baseY = 80
circle(snowmanX, headY, headRadius, "white")
circle(snowmanX, bodyY, bodyRadius, "white")
circle(snowmanX, baseY, baseRadius, "white")`;

describe("relational-snowman progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 19,
      metrics: { scenarios: 10, radii_derived: 4, circles_stacked: 5 }
    });
  });

  it("scores 0 for the stub (zero-radius circles carry no relationships)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, radii_derived: 0, circles_stacked: 0 }
    });
  });

  it("scores radii_derived and partial stacking for derived radii with hardcoded y positions", () => {
    const scores = runProgression(MISPLACED_ATTEMPT);

    // Stacking: not touching, not touching, base on the ground => 1 of 3.
    expect(scores).toEqual({
      score: 6,
      metrics: { scenarios: 0, radii_derived: 4, circles_stacked: 2 }
    });
  });
});
