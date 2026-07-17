import type { Shape } from "../../exercise-categories/draw/shapes";
import { Circle, Rectangle } from "../../exercise-categories/draw/shapes";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { RelationalTrafficLightsExercise } from "./Exercise";

const SCENARIO_SLUG = "build-relational-traffic-lights";

function drawnShapes(runs: ScenarioRuns): Shape[] {
  const exercise = runs.bySlug(SCENARIO_SLUG)?.exercise as RelationalTrafficLightsExercise | undefined;
  if (!exercise) {
    return [];
  }
  return (exercise as unknown as { shapes: Shape[] }).shapes;
}

// Exactly three equal-radius circles sharing an x centre - the shape of a
// traffic-light attempt worth measuring relationships on. Returned sorted by
// y ascending (red, yellow, green).
function lightCircles(runs: ScenarioRuns): Circle[] | undefined {
  const circles = drawnShapes(runs).filter((shape): shape is Circle => shape instanceof Circle);
  if (circles.length !== 3) {
    return undefined;
  }
  const [first] = circles;
  if (first.radius <= 0) {
    return undefined;
  }
  if (!circles.every((circle) => circle.radius === first.radius && circle.cx === first.cx)) {
    return undefined;
  }
  return [...circles].sort((a, b) => a.cy - b.cy);
}

// The scenario's isolated checks re-run the code with secret `radius` values
// but carry no check slugs, so metrics measure the primary run. Relationships
// are checked between the drawn shapes themselves, so they hold for whatever
// radius the student ran with - measuring derivation, not memorised numbers.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The three lights derived from center and radius: yellow at the centre,
      // red and green each two radii away.
      name: "lights_derived",
      maxScore: 3,
      points: 5,
      score: (runs) => {
        const lights = lightCircles(runs);
        if (!lights) {
          return 0;
        }
        const [red, yellow, green] = lights;
        const { cx, radius } = yellow;
        let correct = 0;
        if (yellow.cy === cx) correct += 1;
        if (red.cy === cx - radius * 2) correct += 1;
        if (green.cy === cx + radius * 2) correct += 1;
        return correct;
      }
    },
    {
      // The housing rectangle's position and size derived from the lights'
      // centre and radius. Scored as the best rectangle's count of correct
      // sides, so each fixed derivation moves the score.
      name: "housing_derived",
      maxScore: 4,
      points: 4,
      score: (runs) => {
        const lights = lightCircles(runs);
        if (!lights) {
          return 0;
        }
        const { cx, radius } = lights[1];
        const rectangles = drawnShapes(runs).filter((shape): shape is Rectangle => shape instanceof Rectangle);
        return rectangles.reduce((best, rect) => {
          let correct = 0;
          if (rect.x === cx - radius * 2) correct += 1;
          if (rect.y === cx - radius * 4) correct += 1;
          if (rect.width === radius * 4) correct += 1;
          if (rect.height === radius * 8) correct += 1;
          return Math.max(best, correct);
        }, 0);
      }
    }
  ]
};
