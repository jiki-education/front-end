import { aliensShotRatio } from "../../exercise-categories/space-invaders/progression";
import type { ProgressionMetrics } from "../types";

const SCENARIO_SLUG = "shoot-the-aliens";

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside a failing run - how many of the four aliens
      // went down before the run ended.
      name: "aliens_shot",
      maxScore: 1,
      points: 5,
      score: (runs) => aliensShotRatio(runs.bySlug(SCENARIO_SLUG))
    }
  ]
};
