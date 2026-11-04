import { averageOverRuns, normalizeName, stringProgress, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import { scenarios } from "./scenarios";

// The five scenarios each need a whole message encoded perfectly. These grade
// how close the message is getting, and whether the student has reached for
// the single-letter helper the exercise is built around.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside failing scenarios: how many letters of each
      // message come out right (a missing wrap or a mangled space costs only
      // the affected letters). Measured as movement away from echoing the
      // message back unchanged, so returning the input earns nothing.
      name: "message_progress",
      maxScore: 1,
      points: 6,
      score: (runs) => averageOverRuns(runs, messageProgress)
    },
    {
      // Decomposition: encode() hands the per-letter work to a helper of the
      // student's own. Only encode is required, so this is the understanding
      // signal the scenarios can't see.
      name: "uses_helper",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        return result.meta.functionCallLog.some(
          (entry) => normalizeName(entry.name) !== "encode" && result.assertors.assertFunctionDefined(entry.name)
        )
          ? 1
          : 0;
      }
    },
    {
      // The wrap past "z" is the exercise's trap, and the remainder operator
      // is how it's handled.
      name: "uses_modulo",
      maxScore: 1,
      points: 2,
      score: (runs) => (trustedResult(runs)?.assertors.assertOperatorUsed("%") === true ? 1 : 0)
    }
  ]
};

// Progress toward the expected message, measured from the input. Every
// scenario's output differs from its input, so all of them count.
function messageProgress(run: ScenarioRun): number | undefined {
  const scenario = scenarios.find((candidate) => candidate.slug === run.scenarioSlug);
  return scenario ? stringProgress(scenario.args[0], scenario.expected, run.actual) : undefined;
}
