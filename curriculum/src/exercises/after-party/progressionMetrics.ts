import type { IOValue, ProgressionMetrics, ScenarioRun, ScenarioRuns } from "../types";
import { scenarios } from "./scenarios";

// The scenarios grade every matching rule (the first-name boundary, Cher,
// Cheryl, two Brads), so these grade the steps underneath them: returning a
// plus-ones count at all, and then returning the count that sits at the SAME
// position as a matching name. The classic parallel-arrays slip (plusOnes[0],
// or any fixed index) returns a number that belongs to somebody else, and no
// scenario says so directly.

// A run's inputs, read from the scenario it ran. Only the arguments are used
// here, never the expected values.
function argsFor(run: ScenarioRun): IOValue[] {
  return scenarios.find((scenario) => scenario.slug === run.scenarioSlug)?.args ?? [];
}

// A name matches loosely when it begins with the person's first name. This
// deliberately ignores the word boundary, so a student who has the parallel
// lookup right but still lets "Brad" match "Bradley Cooper" earns this metric
// in full and loses only the similar-name scenario.
function looselyMatches(name: IOValue, person: IOValue): boolean {
  return typeof name === "string" && typeof person === "string" && person !== "" && name.startsWith(person);
}

// True when the run returned the plus-ones count of a guest whose name
// loosely matches the person at the door.
function returnedMatchingPlusOnes(run: ScenarioRun): boolean {
  const [names, plusOnes, person] = argsFor(run);
  if (!Array.isArray(names) || !Array.isArray(plusOnes)) {
    return false;
  }
  return names.some((name, i) => looselyMatches(name, person) && plusOnes[i] === run.actual);
}

function numericRuns(runs: ScenarioRuns): ScenarioRun[] {
  return runs.all.filter((run) => run.isolated !== true && typeof run.actual === "number");
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: of the runs that returned a number, the
      // fraction where that number came from the plusOnes entry at the same
      // index as a matching name. A fixed index scores (close to) 0.
      name: "reads_matching_plus_ones",
      maxScore: 1,
      points: 6,
      score: (runs) => {
        const numeric = numericRuns(runs);
        if (numeric.length === 0) {
          return 0;
        }
        return numeric.filter(returnedMatchingPlusOnes).length / numeric.length;
      }
    },
    {
      // The stepping stone: the function hands back a plus-ones count (a
      // number) for somebody, even the wrong somebody.
      name: "returns_number",
      maxScore: 1,
      points: 2,
      score: (runs) => (numericRuns(runs).length > 0 ? 1 : 0)
    }
  ]
};
