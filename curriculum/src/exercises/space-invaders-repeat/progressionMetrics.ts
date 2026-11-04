import { aliensShotRatio } from "../../exercise-categories/space-invaders/progression";
import type { ProgressionMetrics } from "../types";

const SCENARIO_SLUG = "repeat-shoot";

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside a failing run - how much of the alien grid
      // went down before the run ended (the hand-unrolled 25-line version
      // also lands here while the line-count check fails the scenario).
      name: "aliens_shot",
      maxScore: 1,
      points: 4,
      score: (runs) => aliensShotRatio(runs.bySlug(SCENARIO_SLUG))
    },
    {
      // The exercise's headline concept: a repeat loop makes the runtime
      // shoot count outstrip the static call count. Hand-unrolled code has
      // one static call per shot fired.
      name: "used_repeat",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const staticShoots = run.result.assertors.numFunctionCallsInCode("shoot");
        const runtimeShoots = run.result.meta.functionCallLog.filter((entry) => entry.name === "shoot").length;
        return staticShoots >= 1 && runtimeShoots >= staticShoots * 2 ? 1 : 0;
      }
    }
  ]
};
