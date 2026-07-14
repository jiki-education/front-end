import type { ExecutionContext } from "@jiki/interpreters";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import type SpaceInvadersRepeatExercise from "./Exercise";

const SCENARIO_SLUG = "repeat-shoot";

// Fraction of the starting aliens shot down. A miss halts the run before the
// call is logged, so every logged shoot() is a kill; the alien count comes
// from the exercise instance the scenario set up. Candidate for the
// progression stdlib once shared-file edits are possible - space-invaders
// exercises duplicate this helper for now.
function aliensShotRatio(run: ScenarioRun | undefined): number {
  const ex = run?.exercise as SpaceInvadersRepeatExercise | undefined;
  if (!run?.result || !ex) {
    return 0;
  }
  const totalAliens = ex
    .getStartingAliens(null as unknown as ExecutionContext)
    .flat()
    .filter(Boolean).length;
  if (totalAliens === 0) {
    return 0;
  }
  const kills = run.result.meta.functionCallLog.filter((entry) => entry.name === "shoot").length;
  return Math.min(kills / totalAliens, 1);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside a failing run - how much of the alien grid
      // went down before the run ended (the hand-unrolled 25-line version
      // also lands here while the line-count check fails the scenario).
      name: "aliens_shot",
      maxScore: 1,
      points: 4,
      score: (runs) => aliensShotRatio(runs.bySlug(SCENARIO_SLUG))
    },
    {
      // The exercise's headline concept: a repeat loop makes the runtime
      // shoot count outstrip the static call count. Hand-unrolled code has
      // one static call per shot fired.
      name: "used_repeat",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const staticShoots = run.result.assertors.numFunctionCallsInCode("shoot");
        const runtimeShoots = run.result.meta.functionCallLog.filter((entry) => entry.name === "shoot").length;
        return staticShoots >= 1 && runtimeShoots >= staticShoots * 2 ? 1 : 0;
      }
    }
  ]
};
