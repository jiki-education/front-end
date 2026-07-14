import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { CloudRainSunExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-scene";

// Every shape the scenario checks: the sun, the four cloud puffs (circles),
// the cloud body (rectangle), and the five rain drops (ellipses).
const CIRCLES: [number, number, number][] = [
  [75, 30, 15], // sun
  [25, 50, 10], // left cloud puff
  [40, 40, 15], // left-center cloud puff
  [55, 40, 20], // right-center cloud puff
  [75, 50, 10] // right cloud puff
];
const CLOUD_BODY: [number, number, number, number] = [25, 50, 50, 10];
const RAIN_DROPS: [number, number, number, number][] = [
  [30, 70, 3, 5],
  [50, 70, 3, 5],
  [70, 70, 3, 5],
  [40, 80, 3, 5],
  [60, 80, 3, 5]
];

const TOTAL_SHAPES = CIRCLES.length + 1 + RAIN_DROPS.length;

function weatherExercise(runs: ScenarioRuns): CloudRainSunExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as CloudRainSunExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of scene shapes correctly drawn - partial credit inside the failing
      // scenario. The stub's given cloud body counts as 1, so a fresh stub rounds to 0.
      name: "shapes_in_place",
      maxScore: TOTAL_SHAPES,
      points: 5,
      score: (runs) => {
        const ex = weatherExercise(runs);
        if (!ex) {
          return 0;
        }
        const circles = CIRCLES.filter((circle) => ex.hasCircleAt(...circle)).length;
        const cloudBody = ex.hasRectangleAt(...CLOUD_BODY) ? 1 : 0;
        const rainDrops = RAIN_DROPS.filter((drop) => ex.hasEllipseAt(...drop)).length;
        return circles + cloudBody + rainDrops;
      }
    }
  ]
};
