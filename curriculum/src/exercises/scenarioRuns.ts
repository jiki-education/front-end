import type { ScenarioRun, ScenarioRuns } from "./types";

/**
 * Wraps the raw scenario run artifacts in the lookup interface progression
 * metrics score against. `bySlug` returns the primary (non-isolated) run for
 * a scenario; isolated-check re-runs stay accessible via `all`.
 */
export function createScenarioRuns(runs: ScenarioRun[]): ScenarioRuns {
  return {
    all: runs,
    bySlug: (slug: string) => runs.find((run) => run.scenarioSlug === slug && run.isolated !== true)
  };
}
