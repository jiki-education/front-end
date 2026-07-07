import type { Task, VisualScenario } from "../types";
import type MazeWalkExercise from "./Exercise";

export const tasks = [
  {
    id: "write-walk" as const,
    name: "Write a walk function",
    description:
      "Define a function called walk that takes a number of steps as its input and moves forward that many times.",
    hints: [],
    requiredScenarios: ["maze-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "Navigate the maze",
    description: "Walk 3, turn left, walk 2, turn right, walk 4 to reach the target.",
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
        pass: (result) => result.assertors.assertFunctionDefined("walk"),
        errorHtml:
          "You should define a <code>walk</code> function that takes a number of steps and moves forward that many times."
      }
    ]
  }
];
