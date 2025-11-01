import type { Task, VisualScenario } from "../types";
import type MazeSolveBasicExercise from "./Exercise";

export const tasks: Task[] = [
  {
    id: "solve-maze",
    name: "Guide person to the end of the maze",
    description: "Navigate through the maze to reach the green target",
    hints: ["Plan your path", "Use turn functions to change direction"],
    requiredScenarios: ["maze-1", "maze-2"], // All must pass
    bonus: false
  }
];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "Guide person to the end of the maze",
    description: "Your job is to reach the goal.",
    taskId: "solve-maze",

    setup(exercise) {
      const ex = exercise as MazeSolveBasicExercise;

      // Setup the 7x7 maze
      // 0 = empty, 1 = blocked, 2 = start, 3 = target
      ex.setupGrid([
        [2, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1],
        [0, 0, 1, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 3]
      ]);

      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as MazeSolveBasicExercise;
      return [
        {
          type: "visual" as const,
          pass: ex.characterRow === 6 && ex.characterCol === 6,
          actual: `[${ex.characterRow}, ${ex.characterCol}]`,
          expected: "[6, 6]",
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          type: "visual" as const,
          pass: ex.getGameResult() === "win",
          actual: ex.getGameResult() ?? "playing",
          expected: "win",
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "maze-2",
    name: "Guide person to the end of the maze",
    description: "Your job is to reach the goal.",
    taskId: "solve-maze",

    setup(exercise) {
      const ex = exercise as MazeSolveBasicExercise;

      // Setup the 7x7 maze
      // 0 = empty, 1 = blocked, 2 = start, 3 = target
      ex.setupGrid([
        [2, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1],
        [0, 0, 1, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 3]
      ]);

      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as MazeSolveBasicExercise;
      return [
        {
          type: "visual" as const,
          pass: ex.characterRow === 6 && ex.characterCol === 6,
          actual: `[${ex.characterRow}, ${ex.characterCol}]`,
          expected: "[6, 6]",
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          type: "visual" as const,
          pass: ex.getGameResult() === "win",
          actual: ex.getGameResult() ?? "playing",
          expected: "win",
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  }
];
