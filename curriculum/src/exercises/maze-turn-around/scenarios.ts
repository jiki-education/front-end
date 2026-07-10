import type { CodeCheck, Task, VisualScenario } from "../types";
import type MazeTurnAroundExercise from "./Exercise";

export const tasks = [
  {
    id: "turn-around" as const,
    name: "Turn around at dead ends",
    description:
      "Define a turnAround() function at the top of your code that calls turnLeft() twice, then use it in the final else block. Your solver should escape the dead ends in all three mazes.",
    hints: [],
    requiredScenarios: ["maze-1", "maze-2"],
    bonus: false
  },
  {
    id: "bonus-short-solution" as const,
    name: "Bonus: keep it short",
    description: "Solve a maze with two dead ends, keeping your whole program to 17 lines of code or fewer.",
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
    errorHtml: "You need to define a <code>turnAround</code> function at the top of your code."
  },
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("turn_around"),
    errorHtml:
      "You've defined <code>turnAround</code>, but you need to actually call it in your final <code>else</code> block."
  }
];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "A single dead end",
    description: "A straight corridor with one dead-end spur that forces a turn-around",
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
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    },

    codeChecks: turnAroundCodeChecks
  },
  {
    slug: "maze-2",
    name: "A dead end and a turn",
    description: "A winding path with a dead-end spur before turning to the exit",
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
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    },

    codeChecks: turnAroundCodeChecks
  },
  {
    slug: "maze-3",
    name: "Keep it short",
    description: "Try and ensure your whole final program is 17 lines of code.",
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
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    },

    codeChecks: [
      ...turnAroundCodeChecks,
      {
        // The carried-forward solver is 15 lines; adding turnAround() and calling
        // it in the else block gives 17.
        pass: (result) => result.assertors.assertMaxLinesOfCode(17),
        errorHtml: "Your program should be no more than 17 lines of code."
      }
    ]
  }
];
