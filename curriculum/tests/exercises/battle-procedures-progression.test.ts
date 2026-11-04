import { describe, expect, it } from "vitest";
import battleProceduresExercise from "../../src/exercises/battle-procedures";
import { progressionMetrics } from "../../src/exercises/battle-procedures/progressionMetrics";
import solution from "../../src/exercises/battle-procedures/solution.javascript?raw";
import stub from "../../src/exercises/battle-procedures/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(battleProceduresExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, battleProceduresExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

const DEFINED_NOT_CALLED_ATTEMPT = `function shootIfAlienAbove() {
  if (isAlienAbove()) {
    shoot()
  }
}`;

const DEFINED_AND_CALLED_ATTEMPT = `${DEFINED_NOT_CALLED_ATTEMPT}

shootIfAlienAbove()`;

describe("battle-procedures progression", () => {
  it("scores the full anchor plus the full procedure marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 18,
      metrics: { scenarios: 10, extracted_procedure: 8 }
    });
  });

  it("scores 0 for the stub (the carried-forward game loop with no procedure)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, extracted_procedure: 0 }
    });
  });

  it("scores half the procedure marks when it is defined but never called", () => {
    const scores = runProgression(DEFINED_NOT_CALLED_ATTEMPT);

    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, extracted_procedure: 4 }
    });
  });

  it("scores full procedure marks once it is called, even without winning", () => {
    const scores = runProgression(DEFINED_AND_CALLED_ATTEMPT);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, extracted_procedure: 8 }
    });
  });
});
