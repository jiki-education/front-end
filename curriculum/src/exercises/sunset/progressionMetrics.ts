import type { Shape } from "../../exercise-categories/draw/shapes";
import { Circle, Rectangle } from "../../exercise-categories/draw/shapes";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { SunsetExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-scene";
const LOOP_ITERATIONS = 100;
const CANVAS_SIZE = 100;
const COLOR_STEPS = 10;

function drawnShapes(runs: ScenarioRuns): Shape[] {
  const exercise = runs.bySlug(SCENARIO_SLUG)?.exercise as SunsetExercise | undefined;
  if (!exercise) {
    return [];
  }
  return (exercise as unknown as { shapes: Shape[] }).shapes;
}

function drawnCircles(runs: ScenarioRuns): Circle[] {
  return drawnShapes(runs).filter((shape): shape is Circle => shape instanceof Circle);
}

// The concept is mutate-inside-the-loop: the stub draws the same frame 100
// times, the solution mutates position/size/color before each draw. Each
// metric counts DISTINCT drawn states, so an unchanging property scores ~0 and
// each `change` the student wires up moves a gradient the scenario's binary
// checks cannot.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Distinct sun states (position/size): the sun actually moves and grows
      // across the loop's frames rather than being redrawn in place.
      name: "sun_states",
      maxScore: LOOP_ITERATIONS,
      points: 8,
      score: (runs) => new Set(drawnCircles(runs).map((circle) => `${circle.cx},${circle.cy},${circle.radius}`)).size
    },
    {
      // Distinct sky shades across full-canvas rectangles - partial progress
      // toward the "sky changes color" check (the sea and sand rectangles
      // don't count, so the untouched stub scores 0).
      name: "sky_shades",
      maxScore: COLOR_STEPS,
      points: 3,
      score: (runs) => {
        const skyColors = drawnShapes(runs)
          .filter(
            (shape): shape is Rectangle =>
              shape instanceof Rectangle && shape.width === CANVAS_SIZE && shape.height === CANVAS_SIZE
          )
          .map((rect) => rect.fillColor);
        return new Set(skyColors).size - (skyColors.length > 0 ? 1 : 0);
      }
    },
    {
      // Distinct sun shades - partial progress toward the "sun changes color"
      // check. The first shade is free (the stub already draws one sun color),
      // so only mutation scores.
      name: "sun_shades",
      maxScore: COLOR_STEPS,
      points: 3,
      score: (runs) => {
        const sunColors = drawnCircles(runs).map((circle) => circle.fillColor);
        return new Set(sunColors).size - (sunColors.length > 0 ? 1 : 0);
      }
    }
  ]
};
