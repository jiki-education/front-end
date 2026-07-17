import type { Shape } from "../../exercise-categories/draw/shapes";
import { Circle } from "../../exercise-categories/draw/shapes";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { RelationalSnowmanExercise } from "./Exercise";

const SCENARIO_SLUG = "build-relational-snowman";
const CANVAS_SIZE = 100;

function drawnCircles(runs: ScenarioRuns): Circle[] {
  const exercise = runs.bySlug(SCENARIO_SLUG)?.exercise as RelationalSnowmanExercise | undefined;
  if (!exercise) {
    return [];
  }
  const shapes = (exercise as unknown as { shapes: Shape[] }).shapes;
  return shapes.filter((shape): shape is Circle => shape instanceof Circle);
}

// Exactly three circles sharing an x centre with positive radii - the shape of
// a snowman attempt worth measuring relationships on. Returned sorted by radius
// ascending (head, body, base).
function snowmanCircles(runs: ScenarioRuns): Circle[] | undefined {
  const circles = drawnCircles(runs);
  if (circles.length !== 3) {
    return undefined;
  }
  if (circles.some((circle) => circle.radius <= 0)) {
    return undefined;
  }
  if (!circles.every((circle) => circle.cx === circles[0].cx)) {
    return undefined;
  }
  return [...circles].sort((a, b) => a.radius - b.radius);
}

// The scenario's isolated checks re-run the code with secret `size` values but
// carry no check slugs, so metrics measure the primary run. All relationships
// are checked between the drawn circles themselves, so they hold for whatever
// `size` the student ran with - measuring derivation, not memorised numbers.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Radii derived in the 2:3:4 ratio (head:body:base), whatever the size.
      name: "radii_derived",
      maxScore: 2,
      points: 4,
      score: (runs) => {
        const circles = snowmanCircles(runs);
        if (!circles) {
          return 0;
        }
        const [head, body, base] = circles;
        let correct = 0;
        if (body.radius === head.radius * 1.5) correct += 1;
        if (base.radius === head.radius * 2) correct += 1;
        return correct;
      }
    },
    {
      // The circles touch, stacked from the ground up: each y position derived
      // from the one below. The ground gap is `size` (a quarter of the base
      // radius when the radii are right).
      name: "circles_stacked",
      maxScore: 3,
      points: 5,
      score: (runs) => {
        const circles = snowmanCircles(runs);
        if (!circles) {
          return 0;
        }
        const byY = [...circles].sort((a, b) => a.cy - b.cy);
        const [top, middle, bottom] = byY;
        let correct = 0;
        if (middle.cy === top.cy + top.radius + middle.radius) correct += 1;
        if (bottom.cy === middle.cy + middle.radius + bottom.radius) correct += 1;
        if (bottom.cy + bottom.radius + bottom.radius / 4 === CANVAS_SIZE) correct += 1;
        return correct;
      }
    }
  ]
};
