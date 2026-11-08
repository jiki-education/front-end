import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { StructuredHouseExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-the-house";

// Expected geometry at the stub's default anchors (houseWidth 60, houseHeight
// 40), mirroring the scenario's detailed isolated check plus the sky and grass
// the build starts with (which no scenario expectation covers). Fractional
// values are pre-rounded to 5 decimal places, matching the interpreter's
// arithmetic rounding. If the student changes the anchors while iterating the
// counts under-credit, but a solved exercise always scores full via allPassed.
const PART_CHECKS: ((ex: StructuredHouseExercise) => boolean)[] = [
  (ex) => ex.hasRectangleAt(0, 0, 100, 100), // sky
  (ex) => ex.hasRectangleAt(0, 85, 100, 15), // grass
  (ex) => ex.hasRectangleAt(20, 50, 60, 40), // frame
  (ex) => ex.hasTriangleAt(14, 50, 50, 30, 86, 50), // roof
  (ex) => ex.hasRectangleAt(28.57143, 55, 12, 13.33333), // left window
  (ex) => ex.hasRectangleAt(59.42857, 55, 12, 13.33333), // right window
  (ex) => ex.hasRectangleAt(44, 70, 12, 20), // door
  (ex) => ex.hasCircleAt(53.6, 80, 1.2) // door knob
];

function houseExercise(runs: ScenarioRuns): StructuredHouseExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as StructuredHouseExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of house parts correctly built at the default anchors - partial
      // credit inside the failing scenario. Responsiveness (derived-not-hardcoded)
      // stays owned by the scenario's isolated checks.
      name: "parts_in_place",
      maxScore: PART_CHECKS.length,
      points: 5,
      score: (runs) => {
        if (runs.allPassed()) {
          return PART_CHECKS.length;
        }
        const ex = houseExercise(runs);
        if (!ex) {
          return 0;
        }
        return PART_CHECKS.filter((check) => check(ex)).length;
      }
    }
  ]
};
