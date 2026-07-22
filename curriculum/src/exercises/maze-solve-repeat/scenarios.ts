import type { Task, VisualScenario } from "../types";
import type MazeSolveRepeatExercise from "./Exercise";

export const tasks = [
  {
    id: "solve-maze-with-repeat" as const,
    name: "tasks.solveMazeWithRepeat.name",
    description: "tasks.solveMazeWithRepeat.description",
    hints: [],
    requiredScenarios: ["maze-repeat-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-repeat-1",
    name: "scenarios.mazeRepeat1.name",
    description: "scenarios.mazeRepeat1.description",
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
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: ex.getGameResult() === "win",
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    codeChecks: [
      // Two checks that split on *how far* over the limit the solution is, so the
      // feedback matches the likely cause. Each fires only in its own band:
      //   - 2 or more over  -> there are still runs of move() calls to collapse
      //   - exactly 1 over  -> usually a short repeat that costs more lines than it saves
      //
      // NOTE (i18n): CodeCheck.pass is (result: InterpretResult, language: Language) => boolean
      // with no exercise instance in scope, so there is no translator to call `.t()` on here.
      // errorKey is resolved against the catalog instead.
      {
        pass: (result, language) => {
          const limit = language === "python" ? 18 : 22;
          return result.assertors.countLinesOfCode() <= limit + 1;
        },
        errorKey: "checks.tooManyLines"
      },
      {
        pass: (result, language) => {
          const limit = language === "python" ? 18 : 22;
          const count = result.assertors.countLinesOfCode();
          // Pass within the limit, or when 2+ over (the other check handles that)
          // — so this message only shows when the solution is exactly one line over.
          return count !== limit + 1;
        },
        errorKey: "checks.oneLineOver"
      }
    ]
  }
];
