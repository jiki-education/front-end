import { describe, expect, it } from "vitest";
import spaceInvadersExercise from "../../src/exercises/space-invaders-solve-basic";
import { progressionMetrics } from "../../src/exercises/space-invaders-solve-basic/progressionMetrics";
import solution from "../../src/exercises/space-invaders-solve-basic/solution.jiki?raw";
import stub from "../../src/exercises/space-invaders-solve-basic/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(spaceInvadersExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, spaceInvadersExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Shoots the first of the four aliens, then stops.
const FIRST_ALIEN_ATTEMPT = `move()
shoot()`;

// Shoots the first two aliens, then misses - the run halts on the wasted shot.
const MISS_ATTEMPT = `move()
shoot()
move()
move()
shoot()
move()
shoot()`;

describe("space-invaders-solve-basic progression", () => {
  it("scores the full 10-point anchor plus all aliens shot for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 15,
      metrics: { scenarios: 10, aliens_shot: 5 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0 }
    });
  });

  it("scores a quarter of the alien points for shooting one of four aliens", () => {
    const scores = runProgression(FIRST_ALIEN_ATTEMPT);

    expect(scores).toEqual({
      score: 1,
      metrics: { scenarios: 0, aliens_shot: 1 }
    });
  });

  it("counts only the aliens hit before a miss halts the run", () => {
    const scores = runProgression(MISS_ATTEMPT);

    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, aliens_shot: 3 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0 }
    });
  });
});
