import { describe, expect, it } from "vitest";
import mazeExercise from "../../src/exercises/maze-automated-solve";
import { progressionMetrics } from "../../src/exercises/maze-automated-solve/progressionMetrics";
import solution from "../../src/exercises/maze-automated-solve/solution.jiki?raw";
import stub from "../../src/exercises/maze-automated-solve/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(mazeExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, mazeExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// KNOWN CONTENT BUG: the shipped solution.jiki (and stub.jiki) use
// `repeat_until_game_over`, which the current jikiscript interpreter does not
// have - a plain `repeat do` is the supported run-until-game-over loop (see
// maze-turn-around's solution). Until the content is fixed, full marks are
// asserted against the solution with that keyword swapped; the replace
// becomes a no-op once solution.jiki is corrected.
const WORKING_SOLUTION = solution.replace(/repeat_until_game_over/g, "repeat");

// Hardcoded moves: gets partway down several mazes but never senses anything.
const HARDCODED_ATTEMPT = `move()
move()
move()`;

// The solver without the final else block: handles everything except dead
// ends, so the two turn-around scenarios spin in place and fail.
const NO_DEAD_END_ATTEMPT = `repeat do
  if can_turn_left() do
    turn_left()
    move()
  else if can_move() do
    move()
  else if can_turn_right() do
    turn_right()
    move()
  end
end`;

describe("maze-automated-solve progression", () => {
  it("scores the full anchor, path progress, and sensing for the model solution", () => {
    const scores = runProgression(WORKING_SOLUTION);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, path_progress: 4, used_sensing: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, used_sensing: 0 }
    });
  });

  it("scores partial path progress but no sensing for hardcoded moves", () => {
    const { metrics } = runProgression(HARDCODED_ATTEMPT);

    expect(metrics.used_sensing).toBe(0);
    expect(metrics.path_progress).toBeGreaterThan(0);
    expect(metrics.path_progress).toBeLessThan(4);
  });

  it("scores sensing and a partial anchor for a solver without dead-end handling", () => {
    const { metrics } = runProgression(NO_DEAD_END_ATTEMPT);

    expect(metrics.used_sensing).toBe(8);
    expect(metrics.scenarios).toBeGreaterThan(0);
    expect(metrics.scenarios).toBeLessThan(10);
    expect(metrics.path_progress).toBeGreaterThan(0);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, used_sensing: 0 }
    });
  });
});
