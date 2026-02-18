import type { Task, VisualScenario } from "../types";
import type MazeWalkExercise from "./Exercise";
import { getSourceCode } from "../../utils/code-checks";

export const tasks = [
  {
    id: "write-walk" as const,
    name: "Write a walk function",
    description:
      "Define a function called walk that takes a number of steps as its input and moves forward that many times.",
    hints: [
      "Use repeat with the steps input to move multiple times",
      "The function body just needs a repeat loop that calls move()"
    ],
    requiredScenarios: ["maze-1", "maze-2"],
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
      // Path: (0,0) down 3 → (3,0) right 2 → (3,2) down 4 → (7,2)
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 1, 1],
        [1, 1, 3, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as MazeWalkExercise;
      return [
        {
          pass: ex.characterRow === 7 && ex.characterCol === 2,
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
          const sourceCode = getSourceCode(result);
          if (!sourceCode) return true;
          if (language === "javascript") {
            return sourceCode.includes("function walk");
          } else if (language === "python") {
            return sourceCode.includes("def walk");
          }
          return sourceCode.includes("function walk");
        },
        errorHtml:
          "You should define a <code>walk</code> function that takes a number of steps and moves forward that many times."
      }
    ]
  },
  {
    slug: "maze-2",
    name: "Navigate a different maze",
    description: "The same code should work on a different maze layout.",
    taskId: "write-walk",

    setup(exercise) {
      const ex = exercise as MazeWalkExercise;
      // Path: (0,4) down 3 → (3,4) right 2 → (3,6) down 4 → (7,6)
      ex.setupGrid([
        [1, 1, 1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 3, 1, 1]
      ]);
      ex.setupPosition(0, 4);
      ex.setupDirection("down");
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
    }
  }
];
