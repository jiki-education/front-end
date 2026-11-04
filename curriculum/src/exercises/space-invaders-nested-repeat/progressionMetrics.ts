import { aliensShotRatio } from "../../exercise-categories/space-invaders/progression";
import type { ProgressionMetrics } from "../types";

const SCENARIO_SLUG = "nested-repeat-shoot";

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside a failing run - how much of the alien grid
      // went down before the run ended (flat-loop and hand-unrolled versions
      // also land here while the line-count check fails the scenario).
      name: "aliens_shot",
      maxScore: 1,
      points: 4,
      score: (runs) => aliensShotRatio(runs.bySlug(SCENARIO_SLUG))
    },
    {
      // The exercise's headline concept: a repeat nested inside a repeat.
      // Only nesting turns one or two static shoot() calls into 6+ runtime
      // shots: a single flat loop over the five alien columns tops out at
      // five shots per static call, and unrolled code needs a static call
      // per shot.
      name: "used_nested_repeat",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const staticShoots = run.result.assertors.numFunctionCallsInCode("shoot");
        const runtimeShoots = run.result.meta.functionCallLog.filter((entry) => entry.name === "shoot").length;
        return staticShoots >= 1 && staticShoots <= 2 && runtimeShoots >= 6 ? 1 : 0;
      }
    }
  ]
};
