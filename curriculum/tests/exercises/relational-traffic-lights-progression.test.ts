import { describe, expect, it } from "vitest";
import relationalTrafficLightsExercise from "../../src/exercises/relational-traffic-lights";
import { progressionMetrics } from "../../src/exercises/relational-traffic-lights/progressionMetrics";
import solution from "../../src/exercises/relational-traffic-lights/solution.javascript?raw";
import stub from "../../src/exercises/relational-traffic-lights/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// JavaScript throughout: the scenario's isolated checks inject secretConstants,
// which the curriculum test runner only honors for the JavaScript interpreter.
function runProgression(studentCode: string) {
  const results = runExerciseTests(relationalTrafficLightsExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, relationalTrafficLightsExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// Lights fully derived; the housing anchored correctly but sized wrongly
// (half the width and height it should have).
const PARTIAL_HOUSING_ATTEMPT = `let center = 50
let radius = 10
let yellowY = center
let redY = center - radius * 2
let greenY = center + radius * 2
let housingX = center - radius * 2
let housingY = center - radius * 4
let housingWidth = radius * 2
let housingHeight = radius * 4
rectangle(housingX, housingY, housingWidth, housingHeight, "charcoal")
circle(center, redY, radius, "red")
circle(center, yellowY, radius, "amber")
circle(center, greenY, radius, "green")`;

describe("relational-traffic-lights progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 19,
      metrics: { scenarios: 10, lights_derived: 5, housing_derived: 4 }
    });
  });

  it("scores 0 for the stub (the zero-sized housing halts the run)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, lights_derived: 0, housing_derived: 0 }
    });
  });

  it("scores full lights and partial housing for derived lights with a half-sized housing", () => {
    const scores = runProgression(PARTIAL_HOUSING_ATTEMPT);

    // Housing: x and y derived correctly, width and height wrong => 2 of 4.
    expect(scores).toEqual({
      score: 7,
      metrics: { scenarios: 0, lights_derived: 5, housing_derived: 2 }
    });
  });
});
