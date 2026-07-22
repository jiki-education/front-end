import type { Task, VisualScenario } from "../types";
import type GolfRollingBallStateExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-ball" as const,
    name: "tasks.rollBall.name",
    description: "tasks.rollBall.description",
    hints: [],
    requiredScenarios: ["roll-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "roll-ball",
    name: "scenarios.rollBall.name",
    description: "scenarios.rollBall.description",
    taskId: "roll-ball",

    setup(exercise) {
      const ex = exercise as GolfRollingBallStateExercise;
      ex.setupBallPosition(28, 75);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-state/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallStateExercise;
      const requiredPositions = [29, 30, 40, 50, 60, 70, 80, 85, 86, 87];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));

      return [
        {
          pass: ex.ballX === 88,
          errorHtml: ex.t("checks.ballNotAtEnd", { ballX: ex.ballX })
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        }
      ];
    }
  }
];
