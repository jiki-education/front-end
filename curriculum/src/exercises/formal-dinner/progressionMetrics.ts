import { locMetric } from "../progressionStdlib";
import type { IOValue, ProgressionMetrics, ScenarioRun, ScenarioRuns } from "../types";
import { scenarios } from "./scenarios";

// The scenarios grade every matching rule (lookalike surnames, multi-word
// surnames, Mark vs Lloyd Webber), so these grade the steps underneath them:
// returning a table at all, and then returning the table that sits at the SAME
// position as the matching guest. Reading a fixed index (tables[0]) or losing
// the index in a plain for-of is the most common dead end here, and no
// scenario says so directly.

// A run's inputs, read from the scenario it ran. Only the arguments are used
// here, never the expected values.
function argsFor(run: ScenarioRun): IOValue[] {
  return scenarios.find((scenario) => scenario.slug === run.scenarioSlug)?.args ?? [];
}

function lastWord(value: IOValue): string | undefined {
  return typeof value === "string" ? value.split(" ").pop() : undefined;
}

// A name matches loosely when its last word is the arriving guest's last
// word. This deliberately ignores lookalikes and multi-word surnames, so a
// student who has the parallel lookup right but a too-loose match earns this
// metric in full and loses only the scenarios that grade the match.
function looselyMatches(name: IOValue, guest: IOValue): boolean {
  const surname = lastWord(guest);
  return surname !== undefined && surname !== "" && lastWord(name) === surname;
}

// The runs that returned one of their own table names (as opposed to
// "No table found", undefined, or anything else).
function tableRuns(runs: ScenarioRuns): ScenarioRun[] {
  return runs.all.filter((run) => {
    if (run.isolated === true) {
      return false;
    }
    const tables = argsFor(run)[1];
    return Array.isArray(tables) && typeof run.actual === "string" && tables.includes(run.actual);
  });
}

// True when the returned table sits at the same index as a loosely matching
// guest.
function returnedMatchingTable(run: ScenarioRun): boolean {
  const [names, tables, guest] = argsFor(run);
  if (!Array.isArray(names) || !Array.isArray(tables)) {
    return false;
  }
  return names.some((name, i) => looselyMatches(name, guest) && tables[i] === run.actual);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: of the runs that returned a table, the fraction
      // where it was the table at the same index as the matching guest. A
      // fixed index scores only when the guest happens to sit there.
      name: "reads_matching_table",
      maxScore: 1,
      points: 6,
      score: (runs) => {
        const returned = tableRuns(runs);
        if (returned.length === 0) {
          return 0;
        }
        return returned.filter(returnedMatchingTable).length / returned.length;
      }
    },
    {
      // The stepping stone: the function hands back a table from the seating
      // plan for somebody, even the wrong somebody.
      name: "returns_table",
      maxScore: 1,
      points: 2,
      score: (runs) => (tableRuns(runs).length > 0 ? 1 : 0)
    },
    // Matches the exercise's solve-tightly bonus budget, which differs per
    // language (it matches each language's canonical solution).
    locMetric({ target: { javascript: 9, jikiscript: 45, python: 6 }, points: 3 })
  ]
};
