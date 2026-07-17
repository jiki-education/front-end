import type { ProgressionMetrics, ScenarioRun } from "../types";
import type DndRollExercise from "./Exercise";

// The rolls are random each run, so everything here is structural: how far
// through the roll/announce/strike sequence the student got, and whether
// strike() was fed the stored rolls rather than typed-in literals.
const SCENARIO_SLUG = "random-rolls";
const REQUIRED_ROLLS = 3;

function runtimeCallCount(run: ScenarioRun | undefined, funcName: string): number {
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) => entry.name === funcName).length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: struck with values computed from the rolls
      // (variables / expressions), not literals.
      name: "strike_uses_rolls",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        const ex = run?.exercise as DndRollExercise | undefined;
        if (!run?.result || ex?.struck !== true) {
          return 0;
        }
        return run.result.assertors.assertSomeArgumentsAreVariablesForFunction("strike", [true, true]) ? 1 : 0;
      }
    },
    {
      // Partial progress: how many of the three dice were rolled.
      name: "dice_rolled",
      maxScore: REQUIRED_ROLLS,
      points: 3,
      score: (runs) => runtimeCallCount(runs.bySlug(SCENARIO_SLUG), "roll")
    },
    {
      // Partial progress: how many announcements were made.
      name: "announced",
      maxScore: REQUIRED_ROLLS,
      points: 3,
      score: (runs) => {
        const ex = runs.bySlug(SCENARIO_SLUG)?.exercise as DndRollExercise | undefined;
        return ex?.announcements.length ?? 0;
      }
    }
  ]
};
