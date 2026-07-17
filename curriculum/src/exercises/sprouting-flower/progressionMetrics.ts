import type { Shape } from "../../exercise-categories/draw/shapes";
import { Circle, Ellipse, Rectangle } from "../../exercise-categories/draw/shapes";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { SproutingFlowerExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-sprouting-flower";
const LOOP_ITERATIONS = 60;
const CANVAS_SIZE = 100;

function drawnShapes(runs: ScenarioRuns): Shape[] {
  const exercise = runs.bySlug(SCENARIO_SLUG)?.exercise as SproutingFlowerExercise | undefined;
  if (!exercise) {
    return [];
  }
  return (exercise as unknown as { shapes: Shape[] }).shapes;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Which of the flower's parts have been drawn at all: the head circle,
      // the pistil (a second circle sharing the head's centre), the stem (the
      // only rectangle narrower than the full-width sky/ground), and a leaf
      // ellipse. Credits the step-by-step build the instructions encourage.
      name: "parts_drawn",
      maxScore: 4,
      points: 4,
      score: (runs) => {
        const shapes = drawnShapes(runs);
        const circles = shapes.filter((shape): shape is Circle => shape instanceof Circle);
        let parts = 0;
        if (circles.length > 0) parts += 1;
        const hasPistil = circles.some((a) =>
          circles.some((b) => b !== a && b.cx === a.cx && b.cy === a.cy && b.radius !== a.radius)
        );
        if (hasPistil) parts += 1;
        if (shapes.some((shape) => shape instanceof Rectangle && shape.width < CANVAS_SIZE)) parts += 1;
        if (shapes.some((shape) => shape instanceof Ellipse)) parts += 1;
        return parts;
      }
    },
    {
      // The mutate-inside-the-loop concept: distinct drawn circle states
      // (position/size). A flower redrawn identically every iteration counts
      // once and scores ~0; mutating before drawing sweeps the full gradient.
      name: "animated_flower",
      maxScore: LOOP_ITERATIONS,
      points: 8,
      score: (runs) =>
        new Set(
          drawnShapes(runs)
            .filter((shape): shape is Circle => shape instanceof Circle)
            .map((circle) => `${circle.cx},${circle.cy},${circle.radius}`)
        ).size
    }
  ]
};
