import { averageOverRuns, stringProgress } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import { scenarios } from "./scenarios";

// encode and decode are independent, so each gets its own gradient: a student
// who has one working and is stuck on the other shows up as exactly that. The
// scenarios only pass a perfect string, so these measure how close each
// function's output is getting (a final run not flushed, a count of 1 written
// in front of a single, a two-digit count read as two runs).
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      name: "encode_progress",
      maxScore: 1,
      points: 4,
      score: (runs) => averageOverRuns(runs, progressFor("encode"))
    },
    {
      name: "decode_progress",
      maxScore: 1,
      points: 4,
      score: (runs) => averageOverRuns(runs, progressFor("decode"))
    }
  ]
};

// Progress toward the expected output of one function, measured from the
// input. Scenarios whose output equals their input (the empty string, a run of
// singles) are skipped, because returning the input unchanged passes them with
// no work.
function progressFor(functionName: string): (run: ScenarioRun) => number | undefined {
  return (run) => {
    const scenario = scenarios.find((candidate) => candidate.slug === run.scenarioSlug);
    if (scenario?.functionName !== functionName) {
      return undefined;
    }
    return stringProgress(scenario.args[0], scenario.expected, run.actual);
  };
}
