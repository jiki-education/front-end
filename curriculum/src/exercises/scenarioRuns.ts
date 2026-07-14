import type { ScenarioRun, ScenarioRuns } from "./types";

/**
 * Wraps the raw scenario run artifacts in the lookup interface progression
 * metrics score against.
 *
 * `bySlug(scenarioSlug)` returns the scenario's primary (non-isolated) run.
 * `bySlug(scenarioSlug, checkSlug)` returns the isolated-check run with that
 * slug (give the check a `slug` in the scenario's `isolatedChecks` when a
 * metric needs to target it). All runs, named or not, stay in `all`.
 */
export function createScenarioRuns(runs: ScenarioRun[]): ScenarioRuns {
  return {
    all: runs,
    bySlug: (scenarioSlug: string, checkSlug?: string) =>
      runs.find((run) =>
        checkSlug === undefined
          ? run.scenarioSlug === scenarioSlug && run.isolated !== true
          : run.scenarioSlug === scenarioSlug && run.isolated === true && run.checkSlug === checkSlug
      )
  };
}
