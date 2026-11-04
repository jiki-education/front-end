import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { TrafficLightsExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-lights";

// The three lights the scenario checks (resolved hex colors, matching the
// exercise's hasCircleWithColorAt).
const LIGHTS: [number, number, number, string][] = [
  [50, 16, 8, "#FF0000"], // red (top)
  [50, 39, 8, "#FFFF00"], // amber (middle)
  [50, 62, 8, "#008000"] // green (bottom)
];

function trafficLightsExercise(runs: ScenarioRuns): TrafficLightsExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as TrafficLightsExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of lights correctly drawn - partial credit inside the failing
      // scenario, including when the "use the variables" code check is the only
      // thing failing (the lights are right, the style isn't).
      name: "lights_in_place",
      maxScore: LIGHTS.length,
      points: 5,
      score: (runs) => {
        const ex = trafficLightsExercise(runs);
        if (!ex) {
          return 0;
        }
        return LIGHTS.filter((light) => ex.hasCircleWithColorAt(...light)).length;
      }
    }
  ]
};
