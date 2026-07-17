import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type GolfScenariosExercise from "./Exercise";

// The fraction of shot lengths handled is the scenarios baseline's job.
// These metrics see what it can't: whether the shot length was actually
// fetched, and partial ball progress inside the longest failing scenario.
const LONGEST_SHOT_SLUG = "very-long-shot";
const TEE_X = 28;
const LONGEST_SHOT_TARGET_X = 88;
const LONGEST_SHOT_STEPS = LONGEST_SHOT_TARGET_X - TEE_X;

function normalize(name: string): string {
  return name.replace(/[._]/g, "").toLowerCase();
}

// The runtime function-call log is per-language (get_shot_length vs
// getShotLength), so compare normalized names.
function calledInAnyRun(runs: ScenarioRuns, funcName: string): boolean {
  const target = normalize(funcName);
  return runs.all.some((run) =>
    (run.result?.meta.functionCallLog ?? []).some((entry) => normalize(entry.name) === target)
  );
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: asked for the shot length instead of hardcoding it.
      name: "used_shot_length",
      maxScore: 1,
      points: 8,
      score: (runs) => (calledInAnyRun(runs, "get_shot_length") ? 1 : 0)
    },
    {
      // Progress toward the 60-step target; overshoot is penalised symmetrically.
      name: "distance",
      maxScore: LONGEST_SHOT_STEPS,
      points: 4,
      score: (runs) => {
        const ex = runs.bySlug(LONGEST_SHOT_SLUG)?.exercise as GolfScenariosExercise | undefined;
        if (!ex) {
          return 0;
        }
        return Math.max(0, LONGEST_SHOT_STEPS - Math.abs(LONGEST_SHOT_TARGET_X - ex.ballX));
      }
    }
  ]
};
