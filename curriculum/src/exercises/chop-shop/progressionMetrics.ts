import { helperCallsIn, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";

// The answer is a single boolean, and always answering true already passes
// four of the six scenarios, so the scenarios baseline barely moves while a
// student builds the real logic. These metrics watch that logic take shape:
// a helper that turns a haircut name into minutes, every cut in the queue
// being timed, and the times coming from a completed [name, minutes] table.

// The busiest scenario: six queued cuts plus the newcomer's cut to time.
const BUSIEST_SCENARIO_SLUG = "busy-day-but-time";
const CUTS_TO_TIME = 7;

// The full table is one outer array literal plus one [name, minutes] pair per
// style (six styles). The JavaScript stub ships with only three pairs.
const FULL_TABLE_ARRAY_LITERALS = 7;

// Calls to one of the student's own helpers that took a haircut name and gave
// back a number of minutes.
function timeLookups(run: ScenarioRun | undefined): number {
  return helperCallsIn(run, "canFitIn").filter(
    (entry) => entry.args.some((arg) => typeof arg === "string") && typeof entry.return === "number"
  ).length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // A helper turns a haircut name into its minutes (anchor step 1 in the
      // llm-metadata). The values themselves are the scenarios' job.
      name: "has_time_lookup",
      maxScore: 1,
      points: 3,
      score: (runs) => (runs.all.some((run) => timeLookups(run) > 0) ? 1 : 0)
    },
    {
      // Partial progress: how many of the busiest scenario's seven cuts were
      // timed. Looping the queue gets six, timing the newcomer gets the last.
      name: "times_every_cut",
      maxScore: CUTS_TO_TIME,
      points: 3,
      score: (runs) => timeLookups(runs.bySlug(BUSIEST_SCENARIO_SLUG))
    },
    {
      // The headline concept: the lookup reads from a completed nested
      // [name, minutes] table rather than a chain of ifs. Gated on a working
      // lookup so an unused (or stub-only) table earns nothing.
      name: "uses_cuts_table",
      maxScore: 1,
      points: 4,
      score: (runs) => {
        if (!runs.all.some((run) => timeLookups(run) > 0)) {
          return 0;
        }
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        return result.assertors.countArrayLiterals() >= FULL_TABLE_ARRAY_LITERALS ? 1 : 0;
      }
    }
  ]
};
