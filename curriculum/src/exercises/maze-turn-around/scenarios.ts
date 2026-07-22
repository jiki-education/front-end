import type { CodeCheck, Task, VisualScenario } from "../types";
import type MazeTurnAroundExercise from "./Exercise";

export const tasks = [
  {
    id: "turn-around" as const,
    name: "tasks.turnAround.name",
    description: "tasks.turnAround.description",
    hints: [],
    requiredScenarios: ["maze-1", "maze-2"],
    bonus: false
  },
  {
    id: "bonus-short-solution" as const,
    name: "tasks.bonusShortSolution.name",
    description: "tasks.bonusShortSolution.description",
    hints: [],
    requiredScenarios: ["maze-3"],
    bonus: true
  }
] as const satisfies readonly Task[];

// Every scenario in this exercise is about the turnAround() function, so each one
// verifies that it is both defined and actually called (not inlined as two turnLeft()s).
const turnAroundCodeChecks: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertFunctionDefined("turn_around"),
    errorKey: "checks.turnAroundNotDefined"
  },
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("turn_around"),
    errorKey: "checks.turnAroundNotCalled"
  }
];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "scenarios.maze1.name",
    description: "scenarios.maze1.description",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as MazeTurnAroundExercise;
      ex.setupMaze(
        [
          [1, 2, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [1, 3, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        1,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeTurnAroundExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 1,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    codeChecks: turnAroundCodeChecks
  },
  {
    slug: "maze-2",
    name: "scenarios.maze2.name",
    description: "scenarios.maze2.description",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as MazeTurnAroundExercise;
      ex.setupMaze(
        [
          [1, 2, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 1, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 0, 1],
          [1, 1, 1, 1, 1, 3, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        1,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeTurnAroundExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 5,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    codeChecks: turnAroundCodeChecks
  },
  {
    slug: "maze-3",
    name: "scenarios.maze3.name",
    description: "scenarios.maze3.description",
    taskId: "bonus-short-solution",

    setup(exercise) {
      const ex = exercise as MazeTurnAroundExercise;
      ex.setupMaze(
        [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 0, 1, 1],
          [1, 2, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 0, 1],
          [1, 1, 1, 1, 1, 3, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ],
        2,
        1,
        "right"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeTurnAroundExercise;
      return [
        {
          pass: ex.characterRow === 4 && ex.characterCol === 5,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    codeChecks: [
      ...turnAroundCodeChecks,
      {
        // The carried-forward solver is 15 lines; adding turnAround() and calling
        // it in the else block gives 17.
        pass: (result) => result.assertors.assertMaxLinesOfCode(17),
        errorKey: "checks.maxLines"
      }
    ]
  }
];
