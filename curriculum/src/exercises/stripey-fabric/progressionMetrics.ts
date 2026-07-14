import type { ProgressionMetrics, ScenarioRuns } from "../types";

const SCENARIO_SLUG = "weave-the-fabric";
const TOTAL_STRIPES = 20;

// rectangle is spelled identically in all three languages.
function rectangleCalls(runs: ScenarioRuns) {
  return runs.bySlug(SCENARIO_SLUG)?.result?.meta.functionCallLog.filter((entry) => entry.name === "rectangle") ?? [];
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: picking colours with modulo. Scores the moment %
      // appears, even while the stripe rules are still wrong.
      name: "used_modulo",
      maxScore: 1,
      points: 8,
      score: (runs) => (runs.anyResult()?.assertors.assertOperatorUsed("%") === true ? 1 : 0)
    },
    {
      // Partial progress inside the single all-or-nothing scenario: how many
      // stripes got drawn at all (the codeCheck already forbids pasting, so
      // this counts loop iterations reaching the rectangle call).
      name: "stripes_drawn",
      maxScore: TOTAL_STRIPES,
      points: 3,
      score: (runs) => Math.min(rectangleCalls(runs).length, TOTAL_STRIPES)
    },
    {
      // The four-way colour branching, seen through the colours actually
      // used: one colour per branch of the if/else-if chain.
      name: "distinct_colors",
      maxScore: 4,
      points: 4,
      score: (runs) => {
        const colors = new Set(rectangleCalls(runs).map((entry) => String(entry.args[4])));
        return Math.min(colors.size, 4);
      }
    }
  ]
};
