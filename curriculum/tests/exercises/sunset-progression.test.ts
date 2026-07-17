import { describe, expect, it } from "vitest";
import sunsetExercise from "../../src/exercises/sunset";
import { progressionMetrics } from "../../src/exercises/sunset/progressionMetrics";
import solution from "../../src/exercises/sunset/solution.jiki?raw";
import stub from "../../src/exercises/sunset/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(sunsetExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, sunsetExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// The sun moves and grows, but no colors change.
const MOVING_SUN_ATTEMPT = `set sun_center_y to 10
set sun_radius to 5
repeat 100 times do
  change sun_center_y to sun_center_y + 1
  change sun_radius to sun_radius + 0.2
  rectangle(0,0,100,100, hsl(210, 70, 60))
  circle(50, sun_center_y, sun_radius, rgb(255, 237, 0))
  rectangle(0,85,100,5, "#0308ce")
  rectangle(0,90,100,10, "#C2B280")
end`;

// The colors change, but the sun is redrawn in place every frame.
const COLOR_ONLY_ATTEMPT = `set sky_h to 210
set sun_green to 237
repeat 100 times do
  change sky_h to sky_h + 0.4
  change sun_green to sun_green - 1
  rectangle(0,0,100,100, hsl(sky_h, 70, 60))
  circle(50, 10, 5, rgb(255, sun_green, 0))
  rectangle(0,85,100,5, "#0308ce")
  rectangle(0,90,100,10, "#C2B280")
end`;

describe("sunset progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 24,
      metrics: { scenarios: 10, sun_states: 8, sky_shades: 3, sun_shades: 3 }
    });
  });

  it("scores 0 for the stub (the same frame drawn 100 times)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, sun_states: 0, sky_shades: 0, sun_shades: 0 }
    });
  });

  it("scores sun_states only when the sun moves but nothing changes color", () => {
    const scores = runProgression(MOVING_SUN_ATTEMPT);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, sun_states: 8, sky_shades: 0, sun_shades: 0 }
    });
  });

  it("scores the shade metrics only when colors change but the sun stays put", () => {
    const scores = runProgression(COLOR_ONLY_ATTEMPT);

    expect(scores).toEqual({
      score: 6,
      metrics: { scenarios: 0, sun_states: 0, sky_shades: 3, sun_shades: 3 }
    });
  });
});
