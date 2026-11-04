import type { Shape } from "../../exercise-categories/draw/shapes";
import { Circle } from "../../exercise-categories/draw/shapes";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { RelationalSunExercise } from "./Exercise";

const SCENARIO_SLUG = "position-sun";
const CANVAS_SIZE = 100;

function sunExercise(runs: ScenarioRuns): RelationalSunExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as RelationalSunExercise | undefined;
}

function drawnCircles(runs: ScenarioRuns): Circle[] {
  const exercise = sunExercise(runs);
  if (!exercise) {
    return [];
  }
  const shapes = (exercise as unknown as { shapes: Shape[] }).shapes;
  return shapes.filter((shape): shape is Circle => shape instanceof Circle);
}

// The scenario's isolated checks re-run the code with secret gap/radius values,
// but those runs carry no check slugs, so metrics measure the primary run: the
// sun drawn with the student's own values. The correct derivation
// (sunX = 100 - gap - radius, sunY = gap + radius) has a value-independent
// signature: sunX + sunY = canvasSize, with a positive gap above the circle.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The sun sits where the geometry says it should for SOME positive gap:
      // partial credit for a correct picture even when the scaling checks fail.
      name: "sun_positioned",
      maxScore: 1,
      points: 8,
      score: (runs) =>
        drawnCircles(runs).some(
          (circle) => circle.radius > 0 && circle.cy - circle.radius > 0 && circle.cx + circle.cy === CANVAS_SIZE
        )
          ? 1
          : 0
    },
    {
      // Understanding-vs-grinding: the circle call is fed variables, not
      // hardcoded numbers. Gated on having drawn something so the empty stub
      // doesn't pass vacuously.
      name: "used_variables",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        const exercise = sunExercise(runs);
        if (!run?.result || !exercise || exercise.numElements() === 0) {
          return 0;
        }
        return run.result.assertors.assertAllArgumentsAreVariables() ? 1 : 0;
      }
    }
  ]
};
