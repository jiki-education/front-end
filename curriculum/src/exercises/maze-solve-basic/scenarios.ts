import type { Task, VisualScenario } from "../types";
import type MazeSolveBasicExercise from "./Exercise";

export const tasks = [
  {
    id: "solve-maze" as const,
    name: "tasks.solveMaze.name",
    description: "tasks.solveMaze.description",
    hints: [],
    requiredScenarios: ["maze-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "scenarios.maze1.name",
    description: "scenarios.maze1.description",
    taskId: "solve-maze",

    setup(exercise) {
      const ex = exercise as MazeSolveBasicExercise;

      // Setup the 7x7 maze
      // 0 = empty, 1 = blocked, 2 = start, 3 = target
      ex.setupMaze(
        [
          [2, 1, 0, 0, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 1],
          [0, 0, 0, 1, 0, 0, 0],
          [0, 1, 1, 1, 0, 1, 1],
          [0, 0, 1, 0, 0, 1, 0],
          [1, 1, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 3]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeSolveBasicExercise;
      return [
        {
          pass: ex.characterRow === 6 && ex.characterCol === 6,
          errorHtml: ex.t("checks.didNotReachEnd")
        },
        {
          pass: ex.getGameResult() === "win",
          errorHtml: ex.t("checks.didNotReachEnd")
        }
      ];
    }
  }
];
