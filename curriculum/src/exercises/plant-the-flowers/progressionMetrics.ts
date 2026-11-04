import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type PlantTheFlowersExercise from "./Exercise";

const SCENARIO_SLUG = "plant-flowers";
const EXPECTED_POSITIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

function flowersExercise(runs: ScenarioRuns): PlantTheFlowersExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as PlantTheFlowersExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how many of the nine target positions have a flower,
      // scored even when the scenario fails (too few flowers or unrolled code).
      name: "flowers_planted",
      maxScore: EXPECTED_POSITIONS.length,
      points: 5,
      score: (runs) => {
        const exercise = flowersExercise(runs);
        if (!exercise) {
          return 0;
        }
        return EXPECTED_POSITIONS.filter((position) => exercise.hasFlowerAt(position)).length;
      }
    },
    {
      // Many runtime plantings produced by few static calls implies a
      // loop-with-counter, vs nine pasted plant lines.
      name: "used_loop",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        const exercise = flowersExercise(runs);
        if (!run?.result || !exercise) {
          return 0;
        }
        const manyRuntimePlants = exercise.flowers.length >= 5;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("plant") <= 2;
        return manyRuntimePlants && fewStaticCalls ? 1 : 0;
      }
    }
  ]
};
