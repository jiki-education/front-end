import type { Task, VisualScenario } from "../types";
import type MazeSolveRepeatExercise from "./Exercise";

export const tasks = [
  {
    id: "solve-maze-with-repeat" as const,
    name: "Refactor the maze solution using repeat loops",
    description: "Replace consecutive `move()` calls with repeat loops to make the code shorter.",
    hints: [],
    requiredScenarios: ["maze-repeat-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-repeat-1",
    name: "Refactor the maze solution using repeat loops",
    description: "Use repeat loops to avoid consecutive `move()` calls.",
    taskId: "solve-maze-with-repeat",

    setup(exercise) {
      const ex = exercise as MazeSolveRepeatExercise;

      ex.setupMaze(
        [
          [2, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 0, 0],
          [1, 0, 0, 0, 0, 0, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 3]
        ],
        0,
        0,
        "right"
      );
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
      // Two checks that split on *how far* over the limit the solution is, so the
      // feedback matches the likely cause. Each fires only in its own band:
      //   - 2 or more over  -> there are still runs of move() calls to collapse
      //   - exactly 1 over  -> usually a short repeat that costs more lines than it saves
      {
        pass: (result, language) => {
          const limit = language === "python" ? 18 : 22;
          return result.assertors.countLinesOfCode() <= limit + 1;
        },
        errorHtml:
          "Your solution has too many lines of code. Look for groups of consecutive move() calls and replace each group with a repeat loop."
      },
      {
        pass: (result, language) => {
          const limit = language === "python" ? 18 : 22;
          const count = result.assertors.countLinesOfCode();
          // Pass within the limit, or when 2+ over (the other check handles that)
          // — so this message only shows when the solution is exactly one line over.
          return count !== limit + 1;
        },
        errorHtml:
          "You're just one line too long! A repeat loop isn't always shorter: repeating something only two or three times can take more lines than writing the calls out, so look for a repeat that isn't actually saving you anything."
      }
    ]
  }
];
