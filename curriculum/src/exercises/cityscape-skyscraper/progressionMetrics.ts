import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type CityScapeSkyscraperExercise from "./Exercise";

// All checks read the smallest scenario: 6 floors => ground + 5 upper + roof = 7 rows.
const SCENARIO_SLUG = "floors-6";
const NUM_FLOORS = 6;
const TOTAL_ROWS = NUM_FLOORS + 1;

function normalize(name: string): string {
  return name.replace(/[._]/g, "").toLowerCase();
}

// The runtime function-call log is per-language (num_floors vs numFloors), so
// compare normalized names.
function calledInAnyRun(runs: ScenarioRuns, funcName: string): boolean {
  const target = normalize(funcName);
  return runs.all.some((run) =>
    (run.result?.meta.functionCallLog ?? []).some((entry) => normalize(entry.name) === target)
  );
}

// How many of the skyscraper's rows are fully and correctly built:
// ground floor (y=2), each upper floor (y=3..7), and the roof (y=8).
function correctRows(ex: CityScapeSkyscraperExercise): number {
  let rows = 0;

  const ground =
    ex.hasCellAt(17, 2, "wall") &&
    ex.hasCellAt(18, 2, "glass") &&
    ex.hasCellAt(19, 2, "entrance") &&
    ex.hasCellAt(20, 2, "glass") &&
    ex.hasCellAt(21, 2, "wall");
  if (ground) rows++;

  for (let y = 3; y <= NUM_FLOORS + 1; y++) {
    const upper =
      ex.hasCellAt(17, y, "wall") &&
      ex.hasCellAt(18, y, "glass") &&
      ex.hasCellAt(19, y, "glass") &&
      ex.hasCellAt(20, y, "glass") &&
      ex.hasCellAt(21, y, "wall");
    if (upper) rows++;
  }

  const roofY = NUM_FLOORS + 2;
  const roof = [17, 18, 19, 20, 21].every((x) => ex.hasCellAt(x, roofY, "wall"));
  if (roof) rows++;

  return rows;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: asked the building for its floor count instead of
      // hardcoding it (scenarios only see the resulting pass/fail per size).
      name: "used_num_floors",
      maxScore: 1,
      points: 8,
      score: (runs) => (calledInAnyRun(runs, "num_floors") ? 1 : 0)
    },
    {
      // Partial progress inside a failing scenario: rows of the 6-floor
      // skyscraper that are fully correct (ground, uppers, roof).
      name: "built_rows",
      maxScore: TOTAL_ROWS,
      points: 4,
      score: (runs) => {
        const ex = runs.bySlug(SCENARIO_SLUG)?.exercise as CityScapeSkyscraperExercise | undefined;
        if (!ex) {
          return 0;
        }
        return correctRows(ex);
      }
    }
  ]
};
