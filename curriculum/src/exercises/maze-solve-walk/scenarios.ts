import type { Task, VisualScenario } from "../types";
import type MazeSolveWalkExercise from "./Exercise";

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
      const ex = exercise as MazeSolveWalkExercise;

      // 7x7 maze with longer corridors for walk(N)
      // 0 = empty, 1 = blocked, 2 = start, 3 = target
      // Path: down 3, right 3, down 2, right 3 to target
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 1, 1, 1],
          [1, 1, 1, 0, 1, 1, 1],
          [1, 1, 1, 0, 0, 0, 3],
          [1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeSolveWalkExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 6,
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: ex.getGameResult() === "win",
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    }
  }
];
