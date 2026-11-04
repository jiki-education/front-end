import { trustedResult, unwrap } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// The exercise is about composing three helpers into whatAmI. The scenarios
// only see whatAmI's final label, and the helpers check is all-or-nothing on
// one scenario, so these grade the helpers one at a time.
const HELPERS: Partial<Record<string, RegExp>> = {
  is_alpha: /^[A-Za-z]+$/,
  is_numeric: /^[0-9]+$/,
  is_alphanumeric: /^[A-Za-z0-9]+$/
};

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Each helper is worth half when defined and the rest once something
      // other than itself calls it.
      name: "helpers_composed",
      maxScore: Object.keys(HELPERS).length,
      points: 4,
      score: (runs) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        return Object.keys(HELPERS).reduce((total, helper) => {
          if (!result.assertors.assertFunctionDefined(helper)) {
            return total;
          }
          return total + (result.assertors.assertFunctionCalledOutsideOwnDefinition(helper) ? 1 : 0.5);
        }, 0);
      }
    },
    {
      // The share of helper calls made during the runs that answered
      // correctly, read from the call log. A helper can be right while
      // whatAmI still gets the order of its checks wrong.
      name: "helpers_correct",
      maxScore: 1,
      points: 4,
      score: (runs) => {
        let calls = 0;
        let correct = 0;
        for (const run of runs.all) {
          if (!run.result) {
            continue;
          }
          for (const entry of run.result.meta.functionCallLog) {
            const pattern = HELPERS[snakeCase(entry.name)];
            const arg = unwrap(entry.args[0]);
            const returned = unwrap(entry.return);
            if (pattern === undefined || typeof arg !== "string" || arg === "") {
              continue;
            }
            calls++;
            if (returned === pattern.test(arg)) {
              correct++;
            }
          }
        }
        return calls === 0 ? 0 : correct / calls;
      }
    }
  ]
};

// Log names follow the language's convention (isAlpha in JavaScript).
function snakeCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}
