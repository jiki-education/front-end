import { describe, expect, it } from "vitest";
import mazeExercise from "../../src/exercises/maze-turn-around";
import { progressionMetrics } from "../../src/exercises/maze-turn-around/progressionMetrics";
import solution from "../../src/exercises/maze-turn-around/solution.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(mazeExercise, studentCode, "jikiscript");
  // The exercise flags its "keep it short" bonus scenario, which is excluded
  // from the anchor and from allPassed().
  const runs = buildScenarioRuns(results, mazeExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// The previous lesson's solver: escapes the dead ends by inlining two
// turn_left() calls, so the mazes are solved but the turn_around() code
// checks fail.
const INLINED_TURNS_ATTEMPT = `repeat do
  if can_turn_left() do
    turn_left()
    move()
  else if can_move() do
    move()
  else if can_turn_right() do
    turn_right()
    move()
  else do
    turn_left()
    turn_left()
    move()
  end
end`;

describe("maze-turn-around progression", () => {
  it("scores the full anchor, path progress, and loc for the model solution", () => {
    const scores = runProgression(solution);

    // The 17-line solution is exactly at the bonus loc target.
    expect(scores).toEqual({
      score: 17,
      metrics: { scenarios: 10, path_progress: 4, loc: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    // The raw stub is a {{LESSON:...}} placeholder, which never parses.
    const scores = runProgression("{{LESSON:maze-automated-solve}}");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, loc: 0 }
    });
  });

  it("scores full path progress but no anchor or loc when turn_around() is inlined", () => {
    const scores = runProgression(INLINED_TURNS_ATTEMPT);

    // Both mazes are solved, but every scenario fails its turn_around()
    // code checks - and loc stays 0 until the exercise is actually solved.
    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, path_progress: 4, loc: 0 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, loc: 0 }
    });
  });
});
