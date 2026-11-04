import { aliensShotRatio } from "../../exercise-categories/space-invaders/progression";
import { averageOverRuns } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// Names is_alien_above appears under across languages.
const SENSING_CALL_NAMES = ["is_alien_above", "isAlienAbove"];

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside failing runs - the fraction of each
      // scenario's aliens shot down, averaged across all five formations.
      name: "aliens_shot",
      maxScore: 1,
      points: 4,
      score: (runs) => averageOverRuns(runs, aliensShotRatio)
    },
    {
      // The exercise's headline concept: checking is_alien_above() before
      // shooting. Five or more runtime checks in a run means the student is
      // sweeping positions and sensing each one, not hardcoding a formation.
      name: "used_conditional_check",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const checked = runs.all.some(
          (run) =>
            (run.result?.meta.functionCallLog.filter((entry) => SENSING_CALL_NAMES.includes(entry.name)).length ?? 0) >=
            5
        );
        return checked ? 1 : 0;
      }
    }
  ]
};
