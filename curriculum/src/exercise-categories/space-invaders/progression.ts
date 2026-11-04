import type { ExecutionContext } from "@jiki/interpreters";
import type { ScenarioRun } from "../../exercises/types";
import type SpaceInvadersExercise from "./SpaceInvadersExercise";

// Progression helpers shared by the space-invaders exercises.

// The fraction of a run's starting aliens that were shot down. A miss halts
// the run before the call is logged, so every logged shoot() is a kill. The
// alien count comes from the exercise instance the scenario set up.
export function aliensShotRatio(run: ScenarioRun | undefined): number {
  const ex = run?.exercise as SpaceInvadersExercise | undefined;
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
