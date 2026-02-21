import type { Task, VisualScenario } from "../types";
import type MazeSolveRepeatExercise from "./Exercise";

export const tasks = [
  {
    id: "solve-maze-with-repeat" as const,
    name: "Refactor the maze solution using repeat loops",
    description: "Replace consecutive move() calls with repeat loops to make the code shorter.",
    hints: [
      "Each group of consecutive move() calls can be wrapped in a repeat block",
      "Count the number of moves in each group to set the repeat count",
      "Turn functions stay outside the repeat blocks"
    ],
    requiredScenarios: ["maze-repeat-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-repeat-1",
    name: "Refactor the maze solution using repeat loops",
    description: "Use repeat loops to avoid consecutive move() calls.",
    taskId: "solve-maze-with-repeat",

    setup(exercise) {
      const ex = exercise as MazeSolveRepeatExercise;

      ex.setupGrid([
        [2, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 3]
      ]);

      ex.setupPosition(0, 0);
      ex.setupDirection("right");
    },

    expectations(exercise) {
      const ex = exercise as MazeSolveRepeatExercise;
      return [
        {
          pass: ex.characterRow === 6 && ex.characterCol === 6,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: ex.getGameResult() === "win",
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 18 : 22;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorHtml: "Your solution has too many lines of code. Use repeat loops to replace consecutive move() calls!"
      }
    ]
  }
];
