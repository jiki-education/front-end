import { describe, expect, it } from "vitest";
import mazeExercise from "../../src/exercises/maze-solve-repeat";
import { progressionMetrics } from "../../src/exercises/maze-solve-repeat/progressionMetrics";
import solution from "../../src/exercises/maze-solve-repeat/solution.jiki?raw";
import stub from "../../src/exercises/maze-solve-repeat/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(mazeExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, mazeExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Only the first group of moves collapsed into a repeat, then the student
// stopped partway through re-entering the rest of the route.
const PARTIAL_REFACTOR_ATTEMPT = `repeat 6 times do
  move()
end
turn_right()
move()
move()`;

describe("maze-solve-repeat progression", () => {
  it("scores the full anchor, path progress, and repeat usage for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, path_progress: 4, used_repeat: 8 }
    });
  });

  it("scores full path progress but nothing else for the unrefactored stub", () => {
    // The stub already reaches the goal; the scenario fails only on its
    // line-count checks and there is no repeat loop yet.
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, path_progress: 4, used_repeat: 0 }
    });
  });

  it("scores repeat usage plus partial path progress for a half-finished refactor", () => {
    const { metrics } = runProgression(PARTIAL_REFACTOR_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_repeat).toBe(8);
    expect(metrics.path_progress).toBeGreaterThan(0);
    expect(metrics.path_progress).toBeLessThan(4);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, used_repeat: 0 }
    });
  });
});
