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
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallLoopExercise;
      return [
        {
          pass: ex.ballX === 88,
          errorHtml: `The ball rolled to ${ex.ballX}, which isn't 60 from where it started.`
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
