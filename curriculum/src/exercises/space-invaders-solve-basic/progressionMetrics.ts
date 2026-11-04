import type { ExecutionContext } from "@jiki/interpreters";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import type SpaceInvadersSolveBasicExercise from "./Exercise";

const SCENARIO_SLUG = "shoot-the-aliens";

// Fraction of the starting aliens shot down. A miss halts the run before the
// call is logged, so every logged shoot() is a kill; the alien count comes
// from the exercise instance the scenario set up. Candidate for the
// progression stdlib once shared-file edits are possible - space-invaders
// exercises duplicate this helper for now.
function aliensShotRatio(run: ScenarioRun | undefined): number {
  const ex = run?.exercise as SpaceInvadersSolveBasicExercise | undefined;
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
      // Partial progress inside a failing run - how many of the four aliens
      // went down before the run ended.
      name: "aliens_shot",
      maxScore: 1,
      points: 5,
      score: (runs) => aliensShotRatio(runs.bySlug(SCENARIO_SLUG))
    }
  ]
};
