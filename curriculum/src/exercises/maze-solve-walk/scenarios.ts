import type { Task, VisualScenario } from "../types";
import type MazeSolveWalkExercise from "./Exercise";

export const tasks = [
  {
    id: "solve-maze" as const,
    name: "Guide person to the end of the maze",
    description: "Navigate through the maze using walk(), turnLeft(), and turnRight() to reach the green target cell.",
    hints: [
      "Count the number of empty cells in each straight section",
      "Use walk(3) to move 3 steps at once instead of writing move() three times"
    ],
    requiredScenarios: ["maze-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "Guide person to the end of the maze",
    description: "Your job is to reach the goal.",
    taskId: "solve-maze",

    setup(exercise) {
      const ex = exercise as MazeSolveWalkExercise;

      // 7x7 maze with longer corridors for walk(N)
      // 0 = empty, 1 = blocked, 2 = start, 3 = target
      // Path: down 3, right 3, down 2, right 3 to target
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 3],
        [1, 1, 1, 1, 1, 1, 1]
      ]);

      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as MazeSolveWalkExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 6,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: ex.getGameResult() === "win",
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  }
];
