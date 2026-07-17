import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { PenguinExercise } from "./Exercise";

const SCENARIO_SLUG = "make-penguin-symmetrical";

// The six components the student must add/fix to mirror the given left side.
// The parts the stub already draws (sky, ground, left wing, body, head, left
// face, left eye, left foot) don't measure progress and aren't counted, so a
// fresh stub scores 0.
const MIRRORED_PART_CHECKS: ((ex: PenguinExercise) => boolean)[] = [
  (ex) => ex.hasEllipseAt(72, 55, 10, 25), // right wing
  (ex) => ex.hasEllipseAt(59, 32, 11, 14), // right side of face
  (ex) => ex.hasCircleAt(58, 33, 3), // right eye
  (ex) => ex.hasCircleAt(57, 34, 1), // right iris
  (ex) => ex.hasEllipseAt(60, 93, 7, 4), // right foot
  (ex) => ex.hasTriangleAt(46, 38, 54, 38, 50, 47) // symmetrical nose
];

function penguinExercise(runs: ScenarioRuns): PenguinExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as PenguinExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of mirrored components correctly added - partial credit inside the
      // failing scenario.
      name: "mirrored_parts",
      maxScore: MIRRORED_PART_CHECKS.length,
      points: 5,
      score: (runs) => {
        const ex = penguinExercise(runs);
        if (!ex) {
          return 0;
        }
        return MIRRORED_PART_CHECKS.filter((check) => check(ex)).length;
      }
    }
  ]
};
