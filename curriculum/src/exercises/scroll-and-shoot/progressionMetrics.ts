import type { ProgressionMetrics, ScenarioRun } from "../types";

// The runtime call log records names per-language (snake_case in
// Jikiscript/Python, camelCase in JavaScript), so match both spellings.
function countCalls(run: ScenarioRun | undefined, names: string[]): number {
  if (!run?.result) {
    return 0;
  }
  return run.result.meta.functionCallLog.filter((entry) => names.includes(entry.name)).length;
}

// Aliens in the three-rows wave (respawning off, so one shot = one alien).
const THREE_ROWS_ALIENS = 14;

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside the three-rows wave: each successful shot
      // downs one alien, so runtime shoot() calls track how far the sweep got.
      name: "aliens_shot",
      maxScore: THREE_ROWS_ALIENS,
      points: 4,
      score: (runs) => Math.min(countCalls(runs.bySlug("three-rows"), ["shoot"]), THREE_ROWS_ALIENS)
    },
    {
      // The headline state machine: bouncing between the edges. On the
      // respawning final wave the laser must have moved in BOTH directions.
      name: "swept_both_ways",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug("full-rows");
        return countCalls(run, ["move_left", "moveLeft"]) > 0 && countCalls(run, ["move_right", "moveRight"]) > 0
          ? 1
          : 0;
      }
    }
  ]
};
