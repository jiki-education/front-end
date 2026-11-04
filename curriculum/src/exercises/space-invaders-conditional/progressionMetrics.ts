import type { ExecutionContext } from "@jiki/interpreters";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import type SpaceInvadersConditionalExercise from "./Exercise";

// Names is_alien_above appears under across languages.
const SENSING_CALL_NAMES = ["is_alien_above", "isAlienAbove"];

// Fraction of the starting aliens shot down. A miss halts the run before the
// call is logged, so every logged shoot() is a kill; the alien count comes
// from the exercise instance the scenario set up. Candidate for the
// progression stdlib once shared-file edits are possible - space-invaders
// exercises duplicate this helper for now.
function aliensShotRatio(run: ScenarioRun | undefined): number {
  const ex = run?.exercise as SpaceInvadersConditionalExercise | undefined;
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
      // Partial progress inside failing runs - the fraction of each
      // scenario's aliens shot down, averaged across all five formations.
      name: "aliens_shot",
      maxScore: 1,
      points: 4,
      score: (runs) => {
        const primary = runs.all.filter((run) => run.isolated !== true && run.bonus !== true);
        if (primary.length === 0) {
          return 0;
        }
        return primary.reduce((sum, run) => sum + aliensShotRatio(run), 0) / primary.length;
      }
    },
    {
      // The exercise's headline concept: checking is_alien_above() before
      // shooting. Five or more runtime checks in a run means the student is
      // sweeping positions and sensing each one, not hardcoding a formation.
      name: "used_conditional_check",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const checked = runs.all.some(
          (run) =>
            (run.result?.meta.functionCallLog.filter((entry) => SENSING_CALL_NAMES.includes(entry.name)).length ?? 0) >=
            5
        );
        return checked ? 1 : 0;
      }
    }
  ]
};
