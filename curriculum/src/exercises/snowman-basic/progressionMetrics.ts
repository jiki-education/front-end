import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { SnowmanBasicExercise } from "./Exercise";

const SCENARIO_SLUG = "build-snowman";

// The three snowman circles the scenario checks.
const CIRCLES: [number, number, number][] = [
  [50, 70, 20], // base
  [50, 40, 15], // body
  [50, 20, 10] // head
];

function snowmanExercise(runs: ScenarioRuns): SnowmanBasicExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as SnowmanBasicExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of snowman circles correctly drawn - partial credit inside the failing scenario.
      name: "circles_in_place",
      maxScore: CIRCLES.length,
      points: 5,
      score: (runs) => {
        const ex = snowmanExercise(runs);
        if (!ex) {
          return 0;
        }
        return CIRCLES.filter((circle) => ex.hasCircleAt(...circle)).length;
      }
    }
  ]
};
