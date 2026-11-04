import { aliensShotRatio } from "../../exercise-categories/space-invaders/progression";
import { averageOverRuns } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";

// With is_alien_above() removed, the only way to shoot every alien across five
// different formations is to model the world from get_starting_aliens_in_row()
// and keep that model in sync as aliens fall. One program faces every
// formation, so hardcoding shots can't carry it far: the fraction of aliens
// shot across all five is the headline signal. The other two grade the
// scaffolding the model needs.

// The runtime call log records names per-language (snake_case in
// Jikiscript/Python, camelCase in JavaScript), so match both spellings.
const ROW_CALL_NAMES = ["get_starting_aliens_in_row", "getStartingAliensInRow"];
const MOVE_LEFT_NAMES = ["move_left", "moveLeft"];
const MOVE_RIGHT_NAMES = ["move_right", "moveRight"];
const ROW_COUNT = 3;

// Every column holds three aliens here, so finishing it needs the sweep to
// reverse at the edges.
const REVERSING_SCENARIO_SLUG = "full-rows";

function countCalls(run: ScenarioRun | undefined, names: string[]): number {
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) => names.includes(entry.name)).length;
}

// How many different rows a run asked for (bottom, middle, top).
function rowsRead(run: ScenarioRun): number {
  const rows = new Set(
    (run.result?.meta.functionCallLog ?? [])
      .filter((entry) => ROW_CALL_NAMES.includes(entry.name))
      .map((entry) => JSON.stringify(entry.args[0]))
  );
  return rows.size;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: a working model of which aliens remain. The
      // fraction of each formation's aliens shot down, averaged across all
      // five formations.
      name: "aliens_shot",
      maxScore: 1,
      points: 6,
      score: (runs) => averageOverRuns(runs, aliensShotRatio)
    },
    {
      // Sweeping back and forth, reversing at the edges: on the full-rows
      // formation the laser moved in both directions.
      name: "swept_both_ways",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const run = runs.bySlug(REVERSING_SCENARIO_SLUG);
        return countCalls(run, MOVE_LEFT_NAMES) > 0 && countCalls(run, MOVE_RIGHT_NAMES) > 0 ? 1 : 0;
      }
    },
    {
      // The first step of building the model: fetching all three starting
      // rows. The best single run counts, out of three.
      name: "read_starting_rows",
      maxScore: ROW_COUNT,
      points: 2,
      score: (runs) => Math.max(0, ...runs.all.map(rowsRead))
    }
  ]
};
