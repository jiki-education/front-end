import { describe, expect, it } from "vitest";
import sproutingFlowerExercise from "../../src/exercises/sprouting-flower";
import { progressionMetrics } from "../../src/exercises/sprouting-flower/progressionMetrics";
import solution from "../../src/exercises/sprouting-flower/solution.jiki?raw";
import stub from "../../src/exercises/sprouting-flower/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(sproutingFlowerExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, sproutingFlowerExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Every part drawn, but fully grown from the first frame - nothing animates.
const STATIC_FLOWER_ATTEMPT = `repeat 60 times do
  rectangle(0, 0, 100, 90, "skyblue")
  rectangle(0, 90, 100, 10, "green")
  rectangle(47, 30, 6, 60, "green")
  circle(50, 30, 24, "pink")
  circle(50, 30, 6, "yellow")
  ellipse(35, 60, 12, 4.8, "green")
  ellipse(65, 60, 12, 4.8, "green")
end`;

// Only the head, but properly animated with mutate-before-draw.
const HEAD_ONLY_ATTEMPT = `set flower_center_y to 90
set flower_radius to 0
repeat 60 times do
  change flower_center_y to flower_center_y - 1
  change flower_radius to flower_radius + 0.4
  rectangle(0, 0, 100, 90, "skyblue")
  rectangle(0, 90, 100, 10, "green")
  circle(50, flower_center_y, flower_radius, "pink")
end`;

describe("sprouting-flower progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, parts_drawn: 4, animated_flower: 8 }
    });
  });

  it("scores 0 for the stub (only the sky and ground)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, parts_drawn: 0, animated_flower: 0 }
    });
  });

  it("scores parts_drawn but NOT animated_flower for a static fully-grown flower", () => {
    const scores = runProgression(STATIC_FLOWER_ATTEMPT);

    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, parts_drawn: 4, animated_flower: 0 }
    });
  });

  it("scores animated_flower plus one part for an animated head with nothing else", () => {
    const scores = runProgression(HEAD_ONLY_ATTEMPT);

    expect(scores).toEqual({
      score: 9,
      metrics: { scenarios: 0, parts_drawn: 1, animated_flower: 8 }
    });
  });
});
