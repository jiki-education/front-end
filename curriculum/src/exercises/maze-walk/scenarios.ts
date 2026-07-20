import type { Task, VisualScenario } from "../types";
import type MazeWalkExercise from "./Exercise";

export const tasks = [
  {
    id: "write-walk" as const,
    name: "tasks.writeWalk.name",
    description: "tasks.writeWalk.description",
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
    taskId: "write-walk",

    setup(exercise) {
      const ex = exercise as MazeWalkExercise;
      // Path: (0,4) down 3 → (3,4) right 2 → (3,6) down 4 → (7,6)
      ex.setupMaze(
        [
          [1, 1, 1, 1, 2, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 0, 0, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 1, 1, 3, 1, 1]
        ],
        0,
        4,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeWalkExercise;
      return [
        {
          pass: ex.characterRow === 7 && ex.characterCol === 6,
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: ex.getGameResult() === "win",
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertFunctionDefined("walk"),
        errorKey: "checks.walkNotDefined"
      }
    ]
  }
];
