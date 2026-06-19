import type { Task, VisualScenario } from "../types";
import type GolfRollingBallLoopExercise from "./Exercise";

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
      const ex = exercise as GolfRollingBallLoopExercise;
      ex.setupBallPosition(28, 75);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallLoopExercise;
      const requiredPositions = [29, 40, 60, 88];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 88,
          errorHtml: `The ball rolled to ${ex.ballX}, which isn't 60 from where it started.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time, starting from 29.`
        }
      ];
    },

    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 2 : 3;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorHtml: "Your solution has too many lines of code. Try using a loop to make it shorter."
      }
    ]
  }
];
