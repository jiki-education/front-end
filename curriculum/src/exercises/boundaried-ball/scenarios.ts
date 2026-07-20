import type { Task, VisualScenario } from "../types";
import type BoundarieBallExercise from "./Exercise";

export const tasks = [
  {
    id: "bounce-ball" as const,
    name: "tasks.bounceBall.name",
    description: "tasks.bounceBall.description",
    hints: [],
    requiredScenarios: ["add-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "add-ball",
    name: "scenarios.addBall.name",
    description: "scenarios.addBall.description",
    taskId: "bounce-ball",

    expectations(exercise) {
      const ex = exercise as BoundarieBallExercise;
      return [
        {
          pass: ex.getState().moveBallCallCount === 376,
          errorHtml: exercise.t("checks.wrongMoveCount")
        },
        {
          pass: ex.didBallAppearAt(3, 50),
          errorHtml: exercise.t("checks.missedLeftWall")
        },
        {
          pass: ex.didBallAppearAt(97, 50),
          errorHtml: exercise.t("checks.missedRightWall")
        },
        {
          pass: ex.didBallAppearAt(50, 3),
          errorHtml: exercise.t("checks.missedTopMiddle")
        },
        {
          pass: ex.didBallAppearAt(50, 97),
          errorHtml: exercise.t("checks.missedBottomMiddle")
        }
      ];
    }
  }
];
