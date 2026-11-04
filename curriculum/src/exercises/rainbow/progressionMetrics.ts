import type { Shape } from "../../exercise-categories/draw/shapes";
import { Rectangle } from "../../exercise-categories/draw/shapes";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { RainbowExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-rainbow";
const BAR_COUNT = 100;
// Sampled around the wheel: solutions sweep hue across the bars, so partial
// sweeps light up a proportional number of samples.
const SAMPLE_HUES = [0, 60, 120, 180, 240, 300];

function rainbowExercise(runs: ScenarioRuns): RainbowExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as RainbowExercise | undefined;
}

function drawnRectangles(runs: ScenarioRuns): Rectangle[] {
  const exercise = rainbowExercise(runs);
  if (!exercise) {
    return [];
  }
  const shapes = (exercise as unknown as { shapes: Shape[] }).shapes;
  return shapes.filter((shape): shape is Rectangle => shape instanceof Rectangle);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Many runtime rectangles produced by few static calls implies a loop -
      // credited even while the colors are still wrong.
      name: "used_loop",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const manyRuntimeBars = drawnRectangles(runs).length >= 10;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("rectangle") <= 2;
        return manyRuntimeBars && fewStaticCalls ? 1 : 0;
      }
    },
    {
      // Partial progress toward "100 different colored rectangles": the count
      // of distinct fill colors, giving a gradient the binary scenario check
      // cannot (mutating the hue at all starts scoring).
      name: "distinct_colors",
      maxScore: BAR_COUNT,
      points: 5,
      score: (runs) => new Set(drawnRectangles(runs).map((rect) => rect.fillColor)).size
    },
    {
      // How much of the color wheel the rainbow spans - partial hue sweeps
      // (e.g. hue + 1 instead of hue + 3) score proportionally.
      name: "hue_span",
      maxScore: SAMPLE_HUES.length,
      points: 3,
      score: (runs) => {
        const exercise = rainbowExercise(runs);
        if (!exercise) {
          return 0;
        }
        return SAMPLE_HUES.filter((hue) => exercise.hasRectangleWithHue(hue)).length;
      }
    }
  ]
};
