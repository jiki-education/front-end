import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { FoxyFaceExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-fox";

// The six single-triangle components the scenario checks (position + color).
const COLORED_TRIANGLES: [number, number, number, number, number, number, string][] = [
  [10, 40, 5, 60, 50, 95, "white"], // left cheek
  [90, 40, 95, 60, 50, 95, "white"], // right cheek
  [10, 40, 10, 5, 50, 40, "brown"], // left ear
  [90, 40, 90, 5, 50, 40, "brown"], // right ear
  [50, 30, 50, 95, 10, 40, "orange"], // left face
  [50, 30, 50, 95, 90, 40, "orange"] // right face
];

// The nose is one component built from two charcoal triangles, split either
// top/bottom or left/right (mirroring the scenario's accepted variants).
function noseDrawn(ex: FoxyFaceExercise): boolean {
  return (
    (ex.hasTriangleAtWithColor(40, 90, 50, 85, 60, 90, "charcoal") &&
      ex.hasTriangleAtWithColor(50, 95, 40, 90, 60, 90, "charcoal")) ||
    (ex.hasTriangleAtWithColor(40, 90, 50, 85, 50, 95, "charcoal") &&
      ex.hasTriangleAtWithColor(60, 90, 50, 85, 50, 95, "charcoal"))
  );
}

function foxExercise(runs: ScenarioRuns): FoxyFaceExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as FoxyFaceExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of fox components correctly drawn (6 triangles + the two-triangle
      // nose as one) - partial credit inside the failing scenario. The draw-order
      // (layering) expectations stay scenario-owned and are deliberately not
      // re-derived here, so a fox with every piece present but layered wrongly
      // still shows full component progress.
      name: "components_in_place",
      maxScore: COLORED_TRIANGLES.length + 1,
      points: 5,
      score: (runs) => {
        const ex = foxExercise(runs);
        if (!ex) {
          return 0;
        }
        const triangles = COLORED_TRIANGLES.filter((triangle) => ex.hasTriangleAtWithColor(...triangle)).length;
        return triangles + (noseDrawn(ex) ? 1 : 0);
      }
    }
  ]
};
