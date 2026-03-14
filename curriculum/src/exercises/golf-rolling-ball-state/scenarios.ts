import type { Task, VisualScenario } from "../types";
import type GolfRollingBallStateExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-ball" as const,
    name: "Roll the ball into the hole",
    description: "Roll the ball into the hole.",
    hints: [],
    requiredScenarios: ["roll-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "roll-ball",
    name: "Roll the ball into the hole",
    description: "Roll the ball into the hole.",
    taskId: "roll-ball",

    setup(exercise) {
      const ex = exercise as GolfRollingBallStateExercise;
      ex.setupBallPosition(28, 75);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallStateExercise;
      const requiredPositions = [29, 30, 40, 50, 60, 70, 80, 85, 86, 87];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));

      return [
        {
          pass: ex.ballX === 88,
          errorHtml: `The ball didn't reach the hole. It's at position ${ex.ballX}, but needs to be at position 88.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position individually, not jump directly to the end.`
        }
      ];
    }
  }
];
