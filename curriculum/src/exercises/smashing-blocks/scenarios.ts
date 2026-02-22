import type { Task, VisualScenario } from "../types";
import type SmashingBlocksExercise from "./Exercise";

export const tasks = [
  {
    id: "add-and-smash-blocks" as const,
    name: "Add and smash 5 blocks",
    description:
      "Create 5 blocks at the top of the game area, then bounce the ball to smash them all. Stop the ball once all blocks are smashed.",
    hints: [
      "Create blocks in a loop with `for (let x = 1; x <= 5; x++) { ... }`",
      "Each block's left position is `8 + ((x - 1) * 17)`",
      "Check if the ball's top edge hits the block's bottom edge",
      "Use `continue` to skip blocks that are already smashed",
      "Write a function to check if all blocks have been smashed"
    ],
    requiredScenarios: ["add-blocks"],
    bonus: false
  },
  {
    id: "different-dimensions" as const,
    name: "Different dimensions",
    description:
      "In the full breakout game, the ball's radius and block height can change. Check your code works with different dimensions.",
    hints: [
      "Use `ball.radius` instead of hardcoding the ball size",
      "Use `block.height` instead of hardcoding the block height"
    ],
    requiredScenarios: ["different-dimensions"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "add-blocks",
    name: "Add and smash 5 blocks",
    description: "Add 5 blocks to the game area, then smash them!",
    taskId: "add-and-smash-blocks",

    expectations(exercise) {
      const ex = exercise as SmashingBlocksExercise;
      const state = ex.getState();
      return [
        {
          pass: state.numBlocks === 5,
          errorHtml: "You didn't create exactly 5 blocks."
        },
        {
          pass: state.numSmashedBlocks === 5,
          errorHtml: "You didn't smash all the blocks."
        },
        {
          pass: state.numBallPositions === 504,
          errorHtml: "You moved the ball more times than you needed to!"
        }
      ];
    }
  },
  {
    slug: "different-dimensions",
    name: "Different dimensions",
    description: "Check your code still works if the dimensions change!",
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
          errorHtml: "You didn't create exactly 5 blocks."
        },
        {
          pass: state.numSmashedBlocks === 5,
          errorHtml: "You didn't smash all the blocks."
        },
        {
          pass: state.numBallPositions === 459,
          errorHtml: "You moved the ball more times than you needed to!"
        }
      ];
    }
  }
];
