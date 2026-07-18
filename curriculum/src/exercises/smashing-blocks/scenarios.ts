import type { Task, VisualScenario } from "../types";
import type SmashingBlocksExercise from "./Exercise";

export const tasks = [
  {
    id: "add-and-smash-blocks" as const,
    name: "tasks.addAndSmashBlocks.name",
    description: "tasks.addAndSmashBlocks.description",
    hints: [],
    requiredScenarios: ["add-blocks"],
    bonus: false
  },
  {
    id: "different-dimensions" as const,
    name: "tasks.differentDimensions.name",
    description: "tasks.differentDimensions.description",
    hints: [],
    requiredScenarios: ["different-dimensions"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "add-blocks",
    name: "scenarios.addBlocks.name",
    description: "scenarios.addBlocks.description",
    taskId: "add-and-smash-blocks",

    expectations(exercise) {
      const ex = exercise as SmashingBlocksExercise;
      const state = ex.getState();
      return [
        {
          pass: state.numBlocks === 5,
          errorHtml: exercise.t("checks.wrongBlockCount")
        },
        {
          pass: state.numSmashedBlocks === 5,
          errorHtml: exercise.t("checks.notAllSmashed")
        },
        {
          pass: state.numBallPositions === 504,
          errorHtml: exercise.t("checks.tooManyBallMoves")
        }
      ];
    }
  },
  {
    slug: "different-dimensions",
    name: "scenarios.differentDimensions.name",
    description: "scenarios.differentDimensions.description",
    taskId: "different-dimensions",

    setup(exercise) {
      const ex = exercise as SmashingBlocksExercise;
      ex.setDefaultBallRadius(4);
      ex.setDefaultBlockHeight(10);
    },

    expectations(exercise) {
      const ex = exercise as SmashingBlocksExercise;
      const state = ex.getState();
      return [
        {
          pass: state.numBlocks === 5,
          errorHtml: exercise.t("checks.wrongBlockCount")
        },
        {
          pass: state.numSmashedBlocks === 5,
          errorHtml: exercise.t("checks.notAllSmashed")
        },
        {
          pass: state.numBallPositions === 459,
          errorHtml: exercise.t("checks.tooManyBallMoves")
        }
      ];
    }
  }
];
